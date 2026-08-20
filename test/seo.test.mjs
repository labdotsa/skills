import assert from "node:assert/strict";
import test from "node:test";

test("projects complete Skill metadata and truthful structured data from the page view", async () => {
  const { skillSeo } = await import("../src/lib/domain/seo.ts");
  const skill = {
    kind: "skill",
    slug: "example",
    name: "example",
    title: "Example",
    description: "Example reusable instructions.",
    category: "testing",
    lifecycle: "stable",
    metadata: {},
    installCommand: "npx skills add labdotsa/skills --skill example",
    sourceUrl: "https://github.com/labdotsa/skills/tree/master/skills/example",
    fileUrl: "https://github.com/labdotsa/skills/blob/master/skills/example/SKILL.md",
    packageFiles: [],
    resourceCounts: { references: 0, scripts: 0, assets: 0, evals: 0 },
    document: { type: "root", children: [] },
    outline: [],
    relatedRecipes: [],
    recommendedSkills: [],
    related: [],
  };

  const seo = skillSeo(skill, "https://skills.lab.sa", true);

  assert.equal(seo.canonicalUrl, "https://skills.lab.sa/skills/example/");
  assert.deepEqual(seo.alternate, {
    type: "text/markdown",
    href: "https://skills.lab.sa/skills/example/index.md",
  });
  assert.equal(seo.openGraph.type, "article");
  assert.equal(seo.openGraph.url, seo.canonicalUrl);
  assert.equal(seo.openGraph.image, "https://skills.lab.sa/skills/example/thumbnail.png");
  assert.equal(seo.openGraph.imageAlt, "example — LAB Skill");
  assert.equal(seo.openGraph.imageWidth, 1200);
  assert.equal(seo.openGraph.imageHeight, 630);
  assert.equal(seo.openGraph.imageType, "image/png");
	assert.equal(seo.twitter.card, "summary_large_image");
	assert.equal(seo.twitter.imageAlt, seo.openGraph.imageAlt);
  assert.deepEqual(seo.structuredData["@graph"].map((node) => node["@type"]), [
    "WebPage",
    "BreadcrumbList",
    "SoftwareSourceCode",
  ]);
  assert.deepEqual(
    seo.structuredData["@graph"][1].itemListElement.map(({ position, name }) => ({ position, name })),
    [
      { position: 1, name: "LAB" },
      { position: 2, name: "Skills" },
      { position: 3, name: "example" },
    ],
  );
  assert.equal(seo.structuredData["@graph"][2].codeRepository, skill.sourceUrl);
  assert.equal(JSON.stringify(seo.structuredData).includes('"Recipe"'), false);
  assert.equal(Object.isFrozen(seo), true);
});

test("serializes JSON-LD as inert valid JSON without an HTML injection boundary", async () => {
  const { serializeJsonLd } = await import("../src/lib/domain/seo.ts");
  const serialized = serializeJsonLd({
    "@context": "https://schema.org",
    name: "A & B </script>\u2028safe",
  });

  assert.deepEqual(JSON.parse(serialized), {
    "@context": "https://schema.org",
    name: "A & B </script>\u2028safe",
  });
  assert.equal(serialized.includes("</script>"), false);
  assert.equal(serialized.includes("&"), false);
  assert.match(serialized, /\\u003c\/script\\u003e/);
});

test("projects collection structured data in the same visible Catalog order", async () => {
  const { homeSeo, recipeIndexSeo } = await import("../src/lib/domain/seo.ts");
  const skill = {
    kind: "skill",
    slug: "alpha",
    title: "alpha",
    description: "Alpha instructions.",
    category: "testing",
    pillar: "research",
    files: ["SKILL.md"],
  };
  const recipe = {
    kind: "recipe",
    slug: "example",
    title: "Example Recipe",
    description: "Example sequence.",
    category: "testing",
    pillar: "research",
    status: "draft",
    conversations: 1,
    phases: ["Foundation"],
  };

  const home = homeSeo({ skills: [skill], recipes: [recipe] }, "https://skills.lab.sa", true);
  const recipeIndex = recipeIndexSeo({ recipes: [recipe] }, "https://skills.lab.sa", true);

  assert.equal(home.title, "Agent Skills for Digital Product Teams — LAB Skills");
  assert.equal(
    home.description,
    "Browse reusable agent skills for product research, design, development, and marketing. Install one skill or the complete LAB collection.",
  );
  assert.equal(recipeIndex.title, "Agent Workflow Recipes for Product Delivery — LAB Skills");
  assert.equal(
    recipeIndex.description,
    "Follow step-by-step agent workflows that combine focused skills, prompts, artifacts, and handoffs from product discovery through implementation.",
  );
  assert.deepEqual(home.structuredData["@graph"].map((node) => node["@type"]), [
    "WebSite",
    "CollectionPage",
    "ItemList",
  ]);
  assert.equal(home.structuredData["@graph"][2].itemListElement[0].url, "https://skills.lab.sa/skills/alpha/");
  assert.deepEqual(recipeIndex.structuredData["@graph"].map((node) => node["@type"]), [
    "CollectionPage",
    "ItemList",
  ]);
  assert.equal(
    recipeIndex.structuredData["@graph"][1].itemListElement[0].url,
    "https://skills.lab.sa/recipes/example/",
  );
  assert.equal(home.openGraph.type, "website");
  assert.equal(recipeIndex.openGraph.type, "website");
  assert.equal(home.openGraph.image, "https://skills.lab.sa/thumbnail.png");
  assert.equal(recipeIndex.openGraph.image, "https://skills.lab.sa/recipes/thumbnail.png");
});

test("describes a delivery Recipe as a WebPage without culinary schema", async () => {
  const { recipeSeo } = await import("../src/lib/domain/seo.ts");
  const recipe = {
    kind: "recipe",
    slug: "example",
    name: "example",
    title: "Example Recipe",
    description: "Complete the example delivery sequence.",
    category: "testing",
    status: "draft",
    author: "labdotsa",
    outcome: "example",
    sourceUrl: "https://github.com/labdotsa/skills/tree/master/recipes/example",
    fileUrl: "https://github.com/labdotsa/skills/blob/master/recipes/example/RECIPE.md",
    document: { type: "root", children: [] },
    introduction: { type: "root", children: [] },
    outline: [],
    stages: [],
    skillRequirements: [],
    phases: [{ id: "foundation", slug: "foundation", title: "Foundation", number: 1, introduction: { type: "root", children: [] }, steps: [] }],
    requirements: [],
    localSkills: [],
    recommendedRecipes: [],
  };

  const seo = recipeSeo(recipe, "https://skills.lab.sa", true);

  assert.equal(seo.canonicalUrl, "https://skills.lab.sa/recipes/example/");
  assert.deepEqual(seo.alternate, {
    type: "text/markdown",
    href: "https://skills.lab.sa/recipes/example/index.md",
  });
  assert.equal(seo.openGraph.type, "article");
  assert.equal(seo.openGraph.image, "https://skills.lab.sa/recipes/example/thumbnail.png");
  assert.deepEqual(seo.structuredData["@graph"].map((node) => node["@type"]), [
    "WebPage",
    "BreadcrumbList",
  ]);
  assert.equal(seo.structuredData["@graph"][0].name, recipe.title);
  assert.equal(seo.structuredData["@graph"][0].description, recipe.description);
  assert.deepEqual(
    seo.structuredData["@graph"][1].itemListElement.map(({ position, name }) => ({ position, name })),
    [
      { position: 1, name: "LAB" },
      { position: 2, name: "Recipes" },
      { position: 3, name: "Example Recipe" },
    ],
  );
  assert.equal(JSON.stringify(seo.structuredData).includes('"Recipe"'), false);
  assert.equal(JSON.stringify(seo.structuredData).includes('"HowTo"'), false);
});

test("keeps backup pages noindex and the not-found page noncanonical", async () => {
  const { homeSeo, notFoundSeo } = await import("../src/lib/domain/seo.ts");
  const backup = homeSeo({ skills: [], recipes: [] }, "https://skills.lab.sa", false);
  const notFound = notFoundSeo();

  assert.equal(backup.robots, "noindex,follow");
  assert.equal(backup.canonicalUrl, "https://skills.lab.sa/");
  assert.equal("structuredData" in backup, false);
  assert.equal(notFound.robots, "noindex,follow");
  assert.equal("canonicalUrl" in notFound, false);
  assert.equal("structuredData" in notFound, false);
});
