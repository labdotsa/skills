import assert from "node:assert/strict";
import test from "node:test";

import {
  buildHokoEmbeddedScriptUrl,
  hokoEmbeddedScriptElementId,
} from "../assets/sveltekit/hoko-embedded.js";

const baseCampaign = {
  shortId: "signup123",
  source: "site",
  medium: "owned",
  campaign: "website-signup",
  content: "signup-page",
};

test("builds the documented embedded script URL", () => {
  const result = buildHokoEmbeddedScriptUrl(
    new URL("https://app.example.com/signup"),
    baseCampaign,
  );

  assert.equal(result.origin, "https://hoko.to");
  assert.equal(result.pathname, "/signup123/analytics.js");
  assert.equal(result.searchParams.get("utm_source"), "site");
  assert.equal(result.searchParams.get("utm_medium"), "owned");
  assert.equal(result.searchParams.get("utm_campaign"), "website-signup");
  assert.equal(result.searchParams.get("utm_content"), "signup-page");
});

test("preserves supported incoming campaign values and gives ref precedence", () => {
  const page = new URL(
    "https://app.example.com/signup?utm_source=partner&utm_medium=affiliate&utm_campaign=q3&utm_term=brand&utm_content=card&ref=primary&referral=fallback",
  );
  const result = buildHokoEmbeddedScriptUrl(page, {
    ...baseCampaign,
    referral: "default",
  });

  assert.deepEqual(Object.fromEntries(result.searchParams), {
    utm_source: "partner",
    utm_medium: "affiliate",
    utm_campaign: "q3",
    utm_content: "card",
    utm_term: "brand",
    ref: "primary",
  });
});

test("rejects unresolved publication inputs", () => {
  assert.throws(
    () =>
      buildHokoEmbeddedScriptUrl(new URL("https://app.example.com/signup"), {
        ...baseCampaign,
        shortId: " ",
      }),
    /requires shortId and campaign/,
  );
});

test("uses a stable element ID for duplicate-script prevention", () => {
  assert.equal(
    hokoEmbeddedScriptElementId(" signup123 "),
    "hoko-embedded-click-signup123",
  );
});
