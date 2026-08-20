import assert from "node:assert/strict";
import test from "node:test";

test("builds route-aware Hoko tracking URLs for the supplied Skills link", async () => {
  const { buildHokoTrackingScriptUrl } = await import("../src/lib/domain/hoko-tracking.ts");

  const trackingUrl = new URL(
    buildHokoTrackingScriptUrl(
      new URL("https://skills.lab.sa/skills/copywriting/?utm_source=newsletter&utm_term=agents&ref=lab")
    )
  );

  assert.equal(trackingUrl.origin, "https://hoko.to");
  assert.equal(trackingUrl.pathname, "/OTa83BOY/analytics.js");
  assert.equal(trackingUrl.searchParams.get("utm_source"), "newsletter");
  assert.equal(trackingUrl.searchParams.get("utm_medium"), "skill");
  assert.equal(trackingUrl.searchParams.get("utm_campaign"), "discovery-site");
  assert.equal(trackingUrl.searchParams.get("utm_content"), "skills-copywriting");
  assert.equal(trackingUrl.searchParams.get("utm_term"), "agents");
  assert.equal(trackingUrl.searchParams.get("ref"), "lab");
});

test("uses stable directory defaults without forwarding unrelated query parameters", async () => {
  const { buildHokoTrackingScriptUrl } = await import("../src/lib/domain/hoko-tracking.ts");
  const trackingUrl = new URL(
    buildHokoTrackingScriptUrl(new URL("https://skills.lab.sa/?query=copywriting&hoko_id=click-id"))
  );

  assert.equal(trackingUrl.searchParams.get("utm_source"), "skills.lab.sa");
  assert.equal(trackingUrl.searchParams.get("utm_medium"), "directory");
  assert.equal(trackingUrl.searchParams.get("utm_content"), "skills-directory");
  assert.equal(trackingUrl.searchParams.has("query"), false);
  assert.equal(trackingUrl.searchParams.has("hoko_id"), false);
});
