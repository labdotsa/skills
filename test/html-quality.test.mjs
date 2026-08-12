import assert from "node:assert/strict";
import test from "node:test";

const validDocument = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Useful page title</title></head>
  <body><header>Header</header><main id="main"><h1>Useful heading</h1><button type="button">Copy</button></main><footer>Footer</footer></body>
</html>`;

test("accepts a semantic document and rejects duplicate public element identities", async () => {
  const { validateHtmlQuality } = await import("../scripts/lib/html-quality.mjs");

  assert.doesNotThrow(() => validateHtmlQuality("valid.html", validDocument));
  assert.throws(
    () => validateHtmlQuality("duplicate.html", validDocument.replace("</main>", '<p id="main">Duplicate</p></main>')),
    /duplicate.*id|id.*unique/i,
  );
});
