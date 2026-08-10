#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
skills_dir="$repo_root/skills"
failed=0

fail() {
  echo "error: $*" >&2
  failed=1
}

while IFS= read -r -d '' skill_dir; do
  skill_name="$(basename "$skill_dir")"
  skill_file="$skill_dir/SKILL.md"

  if [[ ! -f "$skill_file" ]]; then
    fail "skills/$skill_name must contain SKILL.md"
    continue
  fi

  if [[ ! "$skill_name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    fail "skills/$skill_name must use lowercase letters, numbers, and single hyphens"
  fi

  declared_name="$(awk -F ': *' '/^name:/{print $2; exit}' "$skill_file")"
  description="$(awk -F ': *' '/^description:/{sub(/^description:[[:space:]]*/, ""); print; exit}' "$skill_file")"

  if [[ -z "$declared_name" ]]; then
    fail "skills/$skill_name/SKILL.md is missing frontmatter name"
  elif [[ "$declared_name" != "$skill_name" ]]; then
    fail "skills/$skill_name/SKILL.md declares name '$declared_name'"
  fi

  if [[ -z "$description" ]]; then
    fail "skills/$skill_name/SKILL.md is missing a one-line description"
  fi
done < <(find "$skills_dir" -mindepth 1 -maxdepth 1 -type d -print0)

while IFS= read -r nested_skill; do
  fail "stable skills must be flat; found ${nested_skill#"$repo_root/"}"
done < <(find "$skills_dir" -mindepth 3 -type f -name SKILL.md -print)

for lifecycle_dir in incubator deprecated; do
  while IFS= read -r installable_file; do
    fail "$lifecycle_dir must not contain SKILL.md: ${installable_file#"$repo_root/"}"
  done < <(find "$repo_root/$lifecycle_dir" -type f -name SKILL.md -print)
done

if [[ "$failed" -ne 0 ]]; then
  exit 1
fi

echo "Skill structure is valid."
