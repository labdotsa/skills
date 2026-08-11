import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownUrlResolver, renderMarkdown } from "../scripts/lib/markdown.mjs";

test("renders common skill Markdown and removes frontmatter", () => {
  const source = `---
name: example
description: Example
---
# Example

Use **clear behavior** and [the guide](references/guide.md).

- One
- Two

| State | Result |
| --- | --- |
| Ready | Ship |
`;
  const html = renderMarkdown(source, {
    headingOffset: 1,
    resolveUrl: createMarkdownUrlResolver({ repositoryUrl: "https://github.com/labdotsa/skills", skillName: "example" }),
  });

  assert.match(html, /<h2 id="example">Example<\/h2>/);
  assert.match(html, /<strong>clear behavior<\/strong>/);
  assert.match(html, /skills\/example\/references\/guide.md/);
  assert.match(html, /<ul><li>One<\/li><li>Two<\/li><\/ul>/);
  assert.match(html, /<table>/);
  assert.doesNotMatch(html, /description: Example/);
});

test("escapes raw HTML and fenced code", () => {
  const html = renderMarkdown(`<script>alert("no")</script>

\`\`\`html
<button>Safe source</button>
\`\`\`
`);

  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;alert/);
  assert.match(html, /class="markdown-code-block"/);
  assert.match(html, /data-copy-target="#markdown-code-0"/);
  assert.match(html, /<pre id="markdown-code-0"><code class="language-html">&lt;button&gt;Safe source&lt;\/button&gt;<\/code><\/pre>/);
});

test("neutralizes unsafe Markdown URL schemes", () => {
  const html = renderMarkdown(`[Run code](javascript:alert(1))

![Embedded data](data:text/html,unsafe)
`);

  assert.match(html, /<a href="#">Run code<\/a>/);
  assert.match(html, /<img src="#" alt="Embedded data"/);
  assert.doesNotMatch(html, /javascript:|data:text\/html/);
});
