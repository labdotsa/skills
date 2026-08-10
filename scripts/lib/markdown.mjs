import path from "node:path";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(value, options) {
  const url = value.trim();
  if (/^(https?:|mailto:|#)/i.test(url)) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return "#";
  return options.resolveUrl ? options.resolveUrl(url) : url;
}

function slugify(value, usedSlugs) {
  const base = value
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";
  const count = usedSlugs.get(base) || 0;
  usedSlugs.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function renderInline(source, options) {
  const tokens = [];
  const tokenized = source.replace(/`([^`]+)`/g, (_, code) => {
    const token = `\u0000CODE${tokens.length}\u0000`;
    tokens.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  let html = escapeHtml(tokenized);
  html = html.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+["'][^"']*["'])?\)/g, (_, alt, url) => {
    return `<img src="${escapeHtml(safeUrl(url, options))}" alt="${escapeHtml(alt)}" loading="lazy" />`;
  });
  html = html.replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+["'][^"']*["'])?\)/g, (_, label, url) => {
    return `<a href="${escapeHtml(safeUrl(url, options))}">${label}</a>`;
  });
  html = html
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_]+)_/g, "$1<em>$2</em>");

  return html.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
}

function isTableDivider(line) {
  const cells = line.trim().replace(/^\||\|$/g, "").split("|");
  return cells.length > 0 && cells.every((cell) => /^\s*:?-{3,}:?\s*$/.test(cell));
}

function tableCells(line) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function startsBlock(line, nextLine = "") {
  return (
    line.trim() === "" ||
    /^ {0,3}#{1,6}\s+/.test(line) ||
    /^ {0,3}(`{3,}|~{3,})/.test(line) ||
    /^ {0,3}>\s?/.test(line) ||
    /^ {0,3}([-+*])\s+/.test(line) ||
    /^ {0,3}\d+[.)]\s+/.test(line) ||
    /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line) ||
    (line.includes("|") && isTableDivider(nextLine))
  );
}

function stripFrontmatter(source) {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) return source;
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

export function renderMarkdown(source, options = {}) {
  const lines = stripFrontmatter(source).replaceAll("\r\n", "\n").split("\n");
  const html = [];
  const usedSlugs = new Map();
  const headingOffset = options.headingOffset || 0;

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})\s*([\w+-]*)\s*$/);
    if (fenceMatch) {
      const [fence, marker, language] = fenceMatch;
      const code = [];
      index += 1;
      while (index < lines.length && !new RegExp(`^ {0,3}${marker[0]}{${marker.length},}\\s*$`).test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const languageClass = language ? ` class="language-${escapeHtml(language)}"` : "";
      html.push(`<pre><code${languageClass}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const headingMatch = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*#*$/);
    if (headingMatch) {
      const level = Math.min(6, headingMatch[1].length + headingOffset);
      const content = renderInline(headingMatch[2], options);
      html.push(`<h${level} id="${slugify(headingMatch[2], usedSlugs)}">${content}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      html.push("<hr />");
      index += 1;
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].includes("|") && lines[index].trim() !== "") {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      html.push(
        `<div class="markdown-table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${renderInline(cell, options)}</th>`).join("")}</tr></thead><tbody>${rows
          .map(
            (row) =>
              `<tr>${headers.map((_, cellIndex) => `<td>${renderInline(row[cellIndex] || "", options)}</td>`).join("")}</tr>`,
          )
          .join("")}</tbody></table></div>`,
      );
      continue;
    }

    if (/^ {0,3}>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^ {0,3}>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^ {0,3}>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote>${renderMarkdown(quote.join("\n"), { ...options, headingOffset: 0 })}</blockquote>`);
      continue;
    }

    const unorderedMatch = line.match(/^ {0,3}[-+*]\s+(.+)$/);
    const orderedMatch = line.match(/^ {0,3}\d+[.)]\s+(.+)$/);
    if (unorderedMatch || orderedMatch) {
      const ordered = Boolean(orderedMatch);
      const tag = ordered ? "ol" : "ul";
      const items = [];
      const itemPattern = ordered ? /^ {0,3}\d+[.)]\s+(.+)$/ : /^ {0,3}[-+*]\s+(.+)$/;
      while (index < lines.length) {
        const match = lines[index].match(itemPattern);
        if (!match) break;
        let content = match[1];
        const continuation = [];
        index += 1;
        while (index < lines.length && /^ {2,}\S/.test(lines[index]) && !/^ {0,3}(`{3,}|~{3,})/.test(lines[index])) {
          continuation.push(lines[index].trim());
          index += 1;
        }
        if (continuation.length) content += ` ${continuation.join(" ")}`;
        const checkbox = content.match(/^\[([ xX])\]\s+(.+)$/);
        if (checkbox) {
          items.push(`<li class="task-item"><input type="checkbox" disabled${checkbox[1] === " " ? "" : " checked"} /> ${renderInline(checkbox[2], options)}</li>`);
        } else {
          items.push(`<li>${renderInline(content, options)}</li>`);
        }
      }
      html.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && !startsBlock(lines[index], lines[index + 1] || "")) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "), options)}</p>`);
  }

  return html.join("\n");
}

export function createMarkdownUrlResolver(options) {
  const { repositoryUrl, skillName } = options;
  return (url) => {
    const [pathname, hash = ""] = url.split("#", 2);
    const normalized = path.posix
      .normalize(pathname)
      .replace(/^\.\//, "")
      .replace(/^(\.\.\/)+/, "");
    const suffix = hash ? `#${encodeURIComponent(hash)}` : "";
    return `${repositoryUrl}/blob/main/skills/${encodeURIComponent(skillName)}/${normalized
      .split("/")
      .map(encodeURIComponent)
      .join("/")}${suffix}`;
  };
}
