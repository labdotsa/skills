import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export async function createContentFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "lab-skills-content-"));
  await mkdir(path.join(root, "skills", "example", "references"), { recursive: true });
  await mkdir(path.join(root, "recipes", "example"), { recursive: true });
  await writeFile(path.join(root, "LICENSE"), "Fixture license\n");
  await writeFile(path.join(root, "skills", "example", "references", "guide.md"), "# Guide\n");
  await writeFile(
    path.join(root, "skills", "example", "SKILL.md"),
    `---
name: example
description: >-
  Example folded
  description.
metadata:
  author: labdotsa
  category: testing
license: MIT
compatibility: Requires a test runner.
allowed-tools: Read Write
x-fixture: preserved
---

# Example

Read the [guide](references/guide.md).
`,
  );
  await writeFile(
    path.join(root, "recipes", "example", "RECIPE.md"),
    `---
name: example
description: Example recipe.
metadata:
  author: labdotsa
  category: testing
  status: draft
  detail-url: ./recipe.html
  outcome: example
  conversation-layers:
    - foundation
  skills:
    - name: example
      source: labdotsa/skills
      url: https://www.skills.sh/labdotsa/skills/example
    - name: external
      source: example/skills
      url: https://example.com/skills/external
    - name: imagegen
      source: openai/codex
      availability: built-in
---

# Example Recipe

## Conversation - Foundation

### Step - Begin

Use the example.
`,
  );
  return root;
}
