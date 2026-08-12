import { readFile } from "node:fs/promises";
import { validateFieldEvidence, validateManualEvidence } from "./lib/quality-evidence.mjs";

const field = validateFieldEvidence(JSON.parse(await readFile("quality/field-vitals.json", "utf8")));
validateManualEvidence(JSON.parse(await readFile("quality/manual-accessibility.json", "utf8")));

console.log(`Field evidence: ${field.status}. Manual accessibility evidence is complete.`);
