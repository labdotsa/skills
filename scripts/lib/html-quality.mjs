import { HtmlValidate } from "html-validate";

const validator = new HtmlValidate({
  extends: ["html-validate:standard", "html-validate:a11y", "html-validate:document"],
  rules: {
    "require-sri": "off",
  },
});

export function validateHtmlQuality(filename, html) {
  const report = validator.validateStringSync(html, filename);
  if (!report.valid) {
    const details = report.results.flatMap((result) => result.messages).map((message) =>
      `${message.ruleId ?? "html"} at ${message.line}:${message.column}: ${message.message}`,
    );
    throw new Error(`${filename}: invalid HTML\n${details.join("\n")}`);
  }

  const lang = html.match(/<html\b[^>]*\blang="([^"]+)"/i)?.[1];
  if (lang !== "en") throw new Error(`${filename}: html lang must be en`);
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => plainText(match[1]));
  if (titles.length !== 1 || titles[0].length < 4) throw new Error(`${filename}: requires one descriptive title`);
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => plainText(match[1]));
  if (headings.length !== 1 || !headings[0]) throw new Error(`${filename}: requires one descriptive h1`);
  if ((html.match(/<main\b/gi) ?? []).length !== 1) throw new Error(`${filename}: requires one main landmark`);

  return Object.freeze({ title: titles[0], heading: headings[0] });
}

function plainText(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
