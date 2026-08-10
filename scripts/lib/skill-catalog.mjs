import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

function cleanScalar(value) {
  return value.replace(/^(["'])(.*)\1$/, "$2").trim();
}

export function parseFrontmatter(source) {
  const lines = source.split(/\r?\n/);
  if (lines[0] !== "---") return {};

  const values = { metadata: {} };
  let section = null;

  for (let index = 1; index < lines.length && lines[index] !== "---"; index += 1) {
    const topLevelMatch = lines[index].match(/^([a-zA-Z0-9-]+):\s*(.*)$/);

    if (topLevelMatch) {
      const [, key, rawValue] = topLevelMatch;
      section = rawValue === "" ? key : null;

      if (rawValue === ">" || rawValue === "|") {
        const parts = [];
        while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) {
          index += 1;
          parts.push(lines[index].trim());
        }
        values[key] = rawValue === ">" ? parts.join(" ") : parts.join("\n");
        continue;
      }

      if (rawValue !== "") values[key] = cleanScalar(rawValue);
      continue;
    }

    if (section === "metadata") {
      const metadataMatch = lines[index].match(/^\s{2,}([a-zA-Z0-9-]+):\s*(.+)$/);
      if (metadataMatch) {
        values.metadata[metadataMatch[1]] = cleanScalar(metadataMatch[2]);
      }
    }
  }

  return values;
}

async function countFiles(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    let count = 0;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += await countFiles(path.join(directory, entry.name));
      } else if (entry.isFile()) {
        count += 1;
      }
    }

    return count;
  } catch (error) {
    if (error.code === "ENOENT") return 0;
    throw error;
  }
}

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path.join(directory, entry.name), relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

export async function readSkillCatalog(repositoryRoot) {
  const skillsDirectory = path.join(repositoryRoot, "skills");
  const entries = await readdir(skillsDirectory, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const directory = path.join(skillsDirectory, entry.name);
    const relativeSkillFile = path.posix.join("skills", entry.name, "SKILL.md");

    try {
      const source = await readFile(path.join(repositoryRoot, relativeSkillFile), "utf8");
      const frontmatter = parseFrontmatter(source);
      const packageFiles = await listFiles(directory);
      packageFiles.sort((left, right) => {
        if (left === "SKILL.md") return -1;
        if (right === "SKILL.md") return 1;
        return left.localeCompare(right);
      });

      skills.push({
        name: frontmatter.name || entry.name,
        description: frontmatter.description || "Description unavailable.",
        category: frontmatter.metadata.category || "general",
        relativeSkillFile,
        files: packageFiles,
        resources: {
          references: await countFiles(path.join(directory, "references")),
          scripts: await countFiles(path.join(directory, "scripts")),
          assets: await countFiles(path.join(directory, "assets")),
          evals: await countFiles(path.join(directory, "evals")),
        },
      });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  return skills.sort((left, right) => left.name.localeCompare(right.name));
}
