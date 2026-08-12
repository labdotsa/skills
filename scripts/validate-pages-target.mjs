import process from "node:process";
import { validatePagesTarget } from "./lib/pages-deployment.mjs";

const [profile, configuredBasePath] = process.argv.slice(2);
validatePagesTarget(profile, configuredBasePath);
console.log(`GitHub Pages ${profile} target is correctly mounted at ${configuredBasePath || "/"}.`);
