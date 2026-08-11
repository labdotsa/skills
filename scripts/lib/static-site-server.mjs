import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
]);

export function createStaticSiteServer(options) {
  const rootDirectory = path.resolve(options.rootDirectory);

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
    const filePath = path.resolve(rootDirectory, relativePath);
    if (filePath !== rootDirectory && !filePath.startsWith(`${rootDirectory}${path.sep}`)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" }).end("Forbidden");
      return;
    }

    try {
      const contents = await readFile(filePath);
      const contentType = contentTypes.get(path.extname(filePath)) || "application/octet-stream";
      response.writeHead(200, { "content-type": contentType }).end(contents);
    } catch (error) {
      if (error.code === "ENOENT") {
        try {
          const notFound = await readFile(path.join(rootDirectory, "404.html"));
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
