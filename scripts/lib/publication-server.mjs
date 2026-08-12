import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { gzipSync } from "node:zlib";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webmanifest", "application/manifest+json"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

export function createPublicationServer({ rootDirectory, basePath = "" }) {
  const root = path.resolve(rootDirectory);
  const mount = normalizeBasePath(basePath);

  return createServer(async (request, response) => {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    const mountedPathname = stripBasePath(pathname, mount);
    if (mountedPathname === undefined) {
      await sendNotFound(root, request, response);
      return;
    }
    let relativePath;
    try {
      relativePath = decodeURIComponent(mountedPathname).replace(/^\/+/, "");
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
      sendFile(request, response, 200, contents, contentTypes.get(path.extname(filePath)) || "application/octet-stream");
    } catch (error) {
      if (error.code === "ENOENT") {
        await sendNotFound(root, request, response);
        return;
      }
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end(error.message);
    }
  });
}

function normalizeBasePath(value) {
  const trimmed = String(value).trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

function stripBasePath(pathname, basePath) {
  if (!basePath) return pathname;
  if (pathname === basePath || pathname === `${basePath}/`) return "/";
  if (!pathname.startsWith(`${basePath}/`)) return undefined;
  return pathname.slice(basePath.length);
}

async function sendNotFound(root, request, response) {
  try {
    const notFound = await readFile(path.join(root, "404.html"));
    sendFile(request, response, 404, notFound, "text/html; charset=utf-8");
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end(error.message);
  }
}

function sendFile(request, response, status, contents, contentType) {
  const acceptsGzip = /(?:^|,)\s*gzip\s*(?:;|,|$)/i.test(request.headers["accept-encoding"] || "");
  const compressible = contentType.startsWith("text/")
    || /^(?:application\/(?:json|manifest\+json|xml))|(?:image\/svg\+xml)/.test(contentType);
  const body = acceptsGzip && compressible ? gzipSync(contents) : contents;
  const headers = {
    "content-type": contentType,
    "content-length": body.byteLength,
    vary: "accept-encoding",
  };
  if (body !== contents) headers["content-encoding"] = "gzip";
  response.writeHead(status, headers).end(body);
}
