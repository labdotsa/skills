import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";

import { analyzeVanWestendorp, parseInput } from "../skills/pricing-research/scripts/van-westendorp.mjs";

const rows = [
	{ tooCheap: 1, cheap: 2, expensive: 4, tooExpensive: 5 },
	{ tooCheap: 2, cheap: 3, expensive: 5, tooExpensive: 6 },
	{ tooCheap: 3, cheap: 4, expensive: 6, tooExpensive: 7 },
];

test("returns the original Van Westendorp range and four price points", () => {
	const result = analyzeVanWestendorp(rows);

	assert.equal(result.method, "van-westendorp-psm");
	assert.equal(result.acceptableRange.definition, "original");
	assert.equal(result.sample.input, 3);
	assert.equal(result.sample.analyzed, 3);
	assert.equal(result.sample.excluded, 0);
	assert.equal(result.curves.length, 7);
	assert.equal(result.pricePoints.idp.price, 4);
	assert.equal(result.pricePoints.opp.price, 4);
	assert.equal(result.pricePoints.pmc.price, 3);
	assert.equal(result.pricePoints.pme.price, 5);
	assert.equal(result.acceptableRange.lower, 3);
	assert.equal(result.acceptableRange.upper, 5);
	assert.equal(result.claimBoundary, "perceived-price-acceptance");
});

test("makes the narrower acceptable range explicit", () => {
	const result = analyzeVanWestendorp(rows, { acceptableRange: "narrower" });

	assert.equal(result.acceptableRange.definition, "narrower");
	assert.equal(result.acceptableRange.lower, 3.5);
	assert.equal(result.acceptableRange.upper, 4.5);
});

test("excludes missing and intransitive responses with diagnostics", () => {
	const result = analyzeVanWestendorp([
		...rows,
		{ tooCheap: 4, cheap: 2, expensive: 5, tooExpensive: 6 },
		{ tooCheap: 1, cheap: 2, expensive: null, tooExpensive: 5 },
	]);

	assert.equal(result.sample.input, 5);
	assert.equal(result.sample.analyzed, 3);
	assert.equal(result.sample.excluded, 2);
	assert.deepEqual(result.diagnostics.exclusions, {
		missing_or_non_numeric: 1,
		intransitive_order: 1,
	});
});

test("rejects an empty analyzable sample", () => {
	assert.throws(
		() => analyzeVanWestendorp([{ tooCheap: 1, cheap: 2, expensive: null, tooExpensive: 5 }]),
		/at least one valid response/,
	);
});

test("reports seeded bootstrap intervals when requested", () => {
	const result = analyzeVanWestendorp(rows, { bootstrap: 100, seed: 42 });

	assert.equal(result.uncertainty.method, "bootstrap-percentile");
	assert.equal(result.uncertainty.replicates, 100);
	assert.equal(result.uncertainty.seed, 42);
	assert.ok(result.uncertainty.intervals.idp.lower <= result.uncertainty.intervals.idp.upper);
	assert.ok(result.uncertainty.intervals.narrowerLower);
});

test("parses the documented CSV and TSV response formats", () => {
	const csv = parseInput("tooCheap,cheap,expensive,tooExpensive\n1,2,4,5\n", "csv");
	const tsv = parseInput("tooCheap\tcheap\texpensive\ttooExpensive\n1\t2\t4\t5\n", "tsv");

	assert.deepEqual(csv, [{ tooCheap: "1", cheap: "2", expensive: "4", tooExpensive: "5" }]);
	assert.deepEqual(tsv, csv);
});

test("CLI reads JSON and emits the declared range and curve output", async () => {
	const root = await mkdtemp(path.join(os.tmpdir(), "pricing-research-"));
	const input = path.join(root, "responses.json");
	const script = path.resolve("skills/pricing-research/scripts/van-westendorp.mjs");
	await writeFile(input, JSON.stringify(rows));

	try {
		const output = await new Promise((resolve, reject) => {
			const child = spawn(process.execPath, [script, input, "--range", "narrower", "--bootstrap", "10", "--seed", "7"]);
			let stdout = "";
			let stderr = "";
			child.stdout.on("data", (chunk) => { stdout += chunk; });
			child.stderr.on("data", (chunk) => { stderr += chunk; });
			child.once("error", reject);
			child.once("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(stderr)));
		});
		const result = JSON.parse(output);
		assert.equal(result.acceptableRange.definition, "narrower");
		assert.equal(result.acceptableRange.lower, 3.5);
		assert.equal(result.uncertainty.replicates, 10);
		assert.equal(result.curves.length, 7);
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});
