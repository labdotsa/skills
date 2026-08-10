(function exposeCatalogModel(global) {
  "use strict";

  const SCHEMA_VERSION = 1;
  const categoryLabels = {
    all: "All",
    content: "Content",
    design: "Design",
    frontend: "Frontend",
    general: "General",
    growth: "Growth",
    integrations: "Integrations",
    product: "Product",
  };

  function assertString(value, field) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new TypeError(`Catalog field \`${field}\` must be a non-empty string.`);
    }
  }

  function validateCatalog(catalog) {
    if (!catalog || typeof catalog !== "object") throw new TypeError("Catalog must be an object.");
    if (catalog.schemaVersion !== SCHEMA_VERSION) {
      throw new TypeError(`Unsupported catalog schema version: ${catalog.schemaVersion}.`);
    }

    assertString(catalog.installCommand, "installCommand");
    assertString(catalog.repositoryUrl, "repositoryUrl");
    if (!Array.isArray(catalog.skills)) throw new TypeError("Catalog field `skills` must be an array.");

    const names = new Set();
    catalog.skills.forEach((skill, index) => {
      const prefix = `skills[${index}]`;
      if (!skill || typeof skill !== "object") throw new TypeError(`${prefix} must be an object.`);
      assertString(skill.name, `${prefix}.name`);
      assertString(skill.description, `${prefix}.description`);
      assertString(skill.category, `${prefix}.category`);
      assertString(skill.detailUrl, `${prefix}.detailUrl`);
      assertString(skill.sourceUrl, `${prefix}.sourceUrl`);
      assertString(skill.fileUrl, `${prefix}.fileUrl`);
      if (!Array.isArray(skill.files) || skill.files[0] !== "SKILL.md") {
        throw new TypeError(`${prefix}.files must start with SKILL.md.`);
      }
      if (names.has(skill.name)) throw new TypeError(`Catalog contains duplicate skill: ${skill.name}.`);
      names.add(skill.name);
    });

    return catalog;
  }

  function labelForCategory(category) {
    return categoryLabels[category] || category.replaceAll("-", " ");
  }

  function packageFileCount(skill) {
    return skill.files.length;
  }

  function commandForSkill(catalog, name) {
    return `${catalog.installCommand} --skill ${name}`;
  }

  function fileUrl(catalog, skill, file) {
    return `${catalog.repositoryUrl}/blob/main/skills/${encodeURIComponent(skill.name)}/${file
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
  }

  function filterSkills(skills, options = {}) {
    const query = (options.query || "").trim().toLowerCase();
    const category = options.category || "all";

    return skills.filter((skill) => {
      const categoryMatches = category === "all" || skill.category === category;
      const searchable = `${skill.name} ${skill.description} ${skill.category} ${skill.files.join(" ")}`.toLowerCase();
      return categoryMatches && (!query || searchable.includes(query));
    });
  }

  function categoryCounts(skills) {
    const counts = new Map();
    for (const skill of skills) counts.set(skill.category, (counts.get(skill.category) || 0) + 1);
    return counts;
  }

  global.LabsCatalog = Object.freeze({
    SCHEMA_VERSION,
    categoryCounts,
    commandForSkill,
    fileUrl,
    filterSkills,
    labelForCategory,
    packageFileCount,
    validateCatalog,
  });
})(globalThis);
