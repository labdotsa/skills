import assert from "node:assert/strict";
import test from "node:test";

test("selects the largest rendered Skill and Recipe with a stable filename tie-breaker", async () => {
  const { representativeRoutes } = await import("../scripts/lib/quality-routes.mjs");
  const files = new Map([
    ["index.html", "<html><main><h1>Home</h1></main></html>"],
    ["404.html", "<html><main><h1>Missing</h1></main></html>"],
    ["recipes/index.html", "<html><main><h1>Recipes</h1></main></html>"],
    ["skills/alpha/index.html", "<main><h1>Alpha</h1><script>ignored ignored ignored</script><p>Short</p></main>"],
    ["skills/beta/index.html", "<main><h1>Beta</h1><p>Much longer visible document text</p></main>"],
    ["skills/gamma/index.html", "<main><h1>Tie</h1><p>same visible text</p></main>"],
    ["skills/delta/index.html", "<main><h1>Tie</h1><p>same visible text</p></main>"],
    ["recipes/alpha/index.html", "<main><h1>Short Recipe</h1></main>"],
    ["recipes/beta/index.html", "<main><h1>Long Recipe</h1><p>with more visible content</p></main>"],
  ]);

  assert.deepEqual(representativeRoutes(files, ""), [
    { id: "home", filename: "index.html", pathname: "/" },
    { id: "skill", filename: "skills/beta/index.html", pathname: "/skills/beta/" },
    { id: "recipe-index", filename: "recipes/index.html", pathname: "/recipes/" },
    { id: "recipe", filename: "recipes/beta/index.html", pathname: "/recipes/beta/" },
    { id: "not-found", filename: "404.html", pathname: "/__quality-not-found__" },
  ]);
  assert.equal(representativeRoutes(files, "/skills")[1].pathname, "/skills/skills/beta/");
});
