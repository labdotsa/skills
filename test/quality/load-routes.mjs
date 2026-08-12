import { readFile } from "node:fs/promises";
import path from "node:path";
import { representativeRoutes } from "../../scripts/lib/quality-routes.mjs";

export async function loadRepresentativeRoutes(rootDirectory, basePath) {
  const root = path.resolve(rootDirectory);
  const manifest = JSON.parse(await readFile(path.join(root, "publication-manifest.json"), "utf8"));
  const filenames = manifest.files.map((file) => file.path).filter((filename) => filename.endsWith(".html"));
  const files = new Map(await Promise.all(filenames.map(async (filename) => [
    filename,
    await readFile(path.join(root, filename), "utf8"),
  ])));
  return representativeRoutes(files, basePath);
}
