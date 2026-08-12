import { appendFile } from "node:fs/promises";
import process from "node:process";
import { resolvePagesPublication } from "./lib/pages-deployment.mjs";

const { profile } = resolvePagesPublication(process.argv[2]);
if (!process.env.GITHUB_OUTPUT) throw new Error("Pages profile selection requires GITHUB_OUTPUT");
await appendFile(process.env.GITHUB_OUTPUT, `name=${profile}\n`);
console.log(`GitHub Pages publication profile: ${profile}`);
