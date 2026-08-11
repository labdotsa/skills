import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

export function createPublicationServer({ rootDirectory }) {
  const root = path.resolve(rootDirectory);

  return createServer(async (request, response) => {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    let relativePath;
    try {
      relativePath = decodeURIComponent(pathname).replace(/^\/+/, "");
    } catch {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" }).end("Malformed path");
      return;
    }

    if (relativePath === "" || relativePath.endsWith("/")) relativePath += "index.html";
    const filePath = path.resolve(root, relativePath);
    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" }).end("Forbidden");
      return;
    }

    try {
      const contents = await readFile(filePath);
      response
        .writeHead(200, { "content-type": contentTypes.get(path.extname(filePath)) || "application/octet-stream" })
        .end(contents);
    } catch (error) {
      if (error.code === "ENOENT") {
        try {
          const notFound = await readFile(path.join(root, "404.html"));
          response.writeHead(404, { "content-type": "text/html; charset=utf-8" }).end(notFound);
        } catch (notFoundError) {
          response.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end(notFoundError.message);
        }
        return;
      }
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end(error.message);
    }
  });
}
