import path from "node:path";
import process from "node:process";
import { createStaticSiteServer } from "./lib/static-site-server.mjs";

const rootDirectory = path.resolve(process.argv[2] || "site");
const host = process.env.SITE_HOST || "127.0.0.1";
const port = Number(process.env.SITE_PORT || 4173);
const server = createStaticSiteServer({ rootDirectory });

server.listen(port, host, () => {
  console.log(`Serving ${rootDirectory} at http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
