import assert from "node:assert/strict";
import test from "node:test";

test("accepts only complete publication profiles", async () => {
  const { publicationProfile } = await import("../src/lib/config/publication-profile.ts");

  assert.throws(() => publicationProfile(undefined), /PUBLICATION_PROFILE is required/);
  assert.throws(() => publicationProfile("production"), /Unknown PUBLICATION_PROFILE/);

  assert.deepEqual(publicationProfile("canonical"), {
    name: "canonical",
    base: "",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: true,
    publishMachineSurfaces: true,
  });
  assert.deepEqual(publicationProfile("preview"), {
    name: "preview",
    base: "",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  });
  assert.deepEqual(publicationProfile("pages-project"), {
    name: "pages-project",
    base: "/skills",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  });
  assert.deepEqual(publicationProfile("pages-root"), {
    name: "pages-root",
    base: "",
    canonicalOrigin: "https://skills.lab.sa",
    indexable: false,
    publishMachineSurfaces: false,
  });
});
