import path from "node:path";
import process from "node:process";
import { createPublicationServer } from "./lib/publication-server.mjs";

const rootDirectory = path.resolve(process.argv[2] || ".artifacts/e2e");
const host = process.env.PUBLICATION_HOST || "127.0.0.1";
const port = Number(process.env.PUBLICATION_PORT || 4173);
const basePath = process.env.PUBLICATION_BASE || "";
const server = createPublicationServer({ rootDirectory, basePath });

server.listen(port, host, () => {
  console.log(`Serving ${rootDirectory} at http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
