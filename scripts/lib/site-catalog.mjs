export const CATALOG_SCHEMA_VERSION = 1;

function assertString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`Catalog field \`${field}\` must be a non-empty string.`);
  }
}

export function createSiteCatalog(skills, options) {
  const { installCommand, repositoryUrl } = options;
  assertString(installCommand, "installCommand");
  assertString(repositoryUrl, "repositoryUrl");

  return {
    schemaVersion: CATALOG_SCHEMA_VERSION,
    installCommand,
    repositoryUrl,
    skills: skills.map((skill, index) => ({
      index: index + 1,
      name: skill.name,
      description: skill.description,
      category: skill.category,
      files: skill.files,
      resources: skill.resources,
      detailUrl: `./skills/${skill.name}/index.html`,
      sourceUrl: `${repositoryUrl}/tree/main/skills/${skill.name}`,
      fileUrl: `${repositoryUrl}/blob/main/${skill.relativeSkillFile}`,
    })),
  };
}

export function assertSiteCatalog(catalog) {
  if (!catalog || typeof catalog !== "object") throw new TypeError("Catalog must be an object.");
  if (catalog.schemaVersion !== CATALOG_SCHEMA_VERSION) {
    throw new TypeError(`Unsupported catalog schema version: ${catalog.schemaVersion}.`);
  }

  assertString(catalog.installCommand, "installCommand");
  assertString(catalog.repositoryUrl, "repositoryUrl");
  if (!Array.isArray(catalog.skills)) throw new TypeError("Catalog field `skills` must be an array.");

  const names = new Set();
  for (const [index, skill] of catalog.skills.entries()) {
    const prefix = `skills[${index}]`;
    if (!skill || typeof skill !== "object") throw new TypeError(`${prefix} must be an object.`);
    assertString(skill.name, `${prefix}.name`);
    assertString(skill.description, `${prefix}.description`);
    assertString(skill.category, `${prefix}.category`);
    assertString(skill.detailUrl, `${prefix}.detailUrl`);
    assertString(skill.sourceUrl, `${prefix}.sourceUrl`);
    assertString(skill.fileUrl, `${prefix}.fileUrl`);

    if (!Array.isArray(skill.files) || skill.files.length === 0) {
      throw new TypeError(`${prefix}.files must contain at least SKILL.md.`);
    }
    if (skill.files[0] !== "SKILL.md" || skill.files.some((file) => typeof file !== "string")) {
      throw new TypeError(`${prefix}.files must start with SKILL.md and contain only strings.`);
    }
    if (names.has(skill.name)) throw new TypeError(`Catalog contains duplicate skill: ${skill.name}.`);
    names.add(skill.name);
  }

  return catalog;
}
