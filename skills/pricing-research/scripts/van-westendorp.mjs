#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const FIELDS = Object.freeze(["tooCheap", "cheap", "expensive", "tooExpensive"]);
const RANGE_DEFINITIONS = new Set(["original", "narrower"]);
const INTERSECTION_METHOD = "piecewise-linear";
const ANALYZER_VERSION = "1.0.0";

/**
 * Analyze respondent-level Van Westendorp Price Sensitivity Meter responses.
 *
 * The four input fields are the prices where each respondent begins to
 * perceive the offer as too cheap, cheap, expensive, and too expensive.
 */
export function analyzeVanWestendorp(rows, options = {}) {
	if (!Array.isArray(rows)) throw new TypeError("Van Westendorp input must be an array of response rows.");
	const acceptableRange = options.acceptableRange ?? "original";
	if (!RANGE_DEFINITIONS.has(acceptableRange)) {
		throw new RangeError("acceptableRange must be original or narrower.");
	}

	const normalized = [];
	const exclusions = { missing_or_non_numeric: 0, intransitive_order: 0 };
	for (const row of rows) {
		const values = FIELDS.map((field) => toFinitePrice(row?.[field]));
		if (values.some((value) => value === null)) {
			exclusions.missing_or_non_numeric += 1;
			continue;
		}
		const [tooCheap, cheap, expensive, tooExpensive] = values;
		if (!(tooCheap < cheap && cheap < expensive && expensive < tooExpensive)) {
			exclusions.intransitive_order += 1;
			continue;
		}
		normalized.push({ tooCheap, cheap, expensive, tooExpensive });
	}

	if (normalized.length === 0) throw new RangeError("Van Westendorp analysis requires at least one valid response.");

	const result = analyzeValidRows(normalized, acceptableRange);
	const bootstrapReplicates = normalizeBootstrapCount(options.bootstrap);
	const seed = options.seed === undefined ? 42 : normalizeSeed(options.seed);
	result.sample = {
		input: rows.length,
		analyzed: normalized.length,
		excluded: rows.length - normalized.length,
		exclusionRate: rows.length === 0 ? 0 : (rows.length - normalized.length) / rows.length,
	};
	result.diagnostics = {
		exclusions,
		valid_response_order: "tooCheap < cheap < expensive < tooExpensive",
		price_points: result.curves.length,
		intersection_method: INTERSECTION_METHOD,
		missing_intersections: Object.entries(result.pricePoints)
			.filter(([, point]) => point === null)
			.map(([name]) => name),
	};
	result.uncertainty = bootstrapReplicates > 0
		? bootstrapUncertainty(normalized, acceptableRange, bootstrapReplicates, seed)
		: { method: "not-estimated", replicates: 0, seed: null, intervals: {} };
	result.claimBoundary = "perceived-price-acceptance";
	result.limitations = [
		"Does not estimate actual purchase, demand, elasticity, or revenue.",
		"The acceptable range depends on the declared original or narrower intersection convention.",
		"Bootstrap intervals describe sampling uncertainty only; they do not correct offer misunderstanding or selection bias.",
	];
	return result;
}

function analyzeValidRows(rows, acceptableRange) {
	const prices = [...new Set(rows.flatMap((row) => FIELDS.map((field) => row[field])))].sort((left, right) => left - right);
	const curves = prices.map((price) => {
		const tooCheap = proportion(rows, (row) => row.tooCheap >= price);
		const cheap = proportion(rows, (row) => row.cheap >= price);
		const expensive = proportion(rows, (row) => row.expensive <= price);
		const tooExpensive = proportion(rows, (row) => row.tooExpensive <= price);
		return {
			price,
			tooCheap,
			cheap,
			expensive,
			tooExpensive,
			notCheap: 1 - cheap,
			notExpensive: 1 - expensive,
		};
	});

	const pricePoints = {
		pmc: intersection(curves, "tooCheap", "notCheap"),
		pme: intersection(curves, "tooExpensive", "notExpensive"),
		idp: intersection(curves, "cheap", "expensive"),
		opp: intersection(curves, "tooCheap", "tooExpensive"),
		narrowerLower: intersection(curves, "tooCheap", "expensive"),
		narrowerUpper: intersection(curves, "cheap", "tooExpensive"),
	};

	const lower = acceptableRange === "original" ? pricePoints.pmc : pricePoints.narrowerLower;
	const upper = acceptableRange === "original" ? pricePoints.pme : pricePoints.narrowerUpper;
	return {
		method: "van-westendorp-psm",
		acceptableRange: {
			definition: acceptableRange,
			lower: lower?.price ?? null,
			upper: upper?.price ?? null,
			lowerGap: lower?.gap ?? null,
			upperGap: upper?.gap ?? null,
		},
		analyzerVersion: ANALYZER_VERSION,
		pricePoints,
		curves,
	};
}

function intersection(curves, leftKey, rightKey) {
	if (curves.length === 0) return null;
	let best = null;
	for (let index = 0; index < curves.length; index += 1) {
		const current = curves[index];
		const currentDifference = current[leftKey] - current[rightKey];
		const exact = point(current.price, currentDifference, leftKey, rightKey);
		if (currentDifference === 0) return exact;
		best = chooseClosest(best, exact);
		const next = curves[index + 1];
		if (!next) continue;
		const nextDifference = next[leftKey] - next[rightKey];
		if (currentDifference * nextDifference < 0) {
			const price = current.price + ((-currentDifference * (next.price - current.price)) / (nextDifference - currentDifference));
			return { price, gap: 0, curves: [leftKey, rightKey], method: INTERSECTION_METHOD };
		}
		best = chooseClosest(best, point(next.price, nextDifference, leftKey, rightKey));
	}
	return best && { ...best, curves: [leftKey, rightKey], method: INTERSECTION_METHOD };
}

function point(price, difference, leftKey, rightKey) {
	return { price, gap: Math.abs(difference), curves: [leftKey, rightKey], method: INTERSECTION_METHOD };
}

function chooseClosest(current, candidate) {
	if (!current || candidate.gap < current.gap || (candidate.gap === current.gap && candidate.price < current.price)) return candidate;
	return current;
}

function proportion(rows, predicate) {
	return rows.reduce((total, row) => total + (predicate(row) ? 1 : 0), 0) / rows.length;
}

function toFinitePrice(value) {
	if (typeof value === "string" && value.trim() === "") return null;
	if (typeof value !== "number" && typeof value !== "string") return null;
	const number = typeof value === "number" ? value : Number(value.trim());
	return Number.isFinite(number) && number >= 0 ? number : null;
}

function normalizeBootstrapCount(value) {
	if (value === undefined) return 0;
	const count = Number(value);
	if (!Number.isInteger(count) || count < 0) throw new RangeError("bootstrap must be a non-negative integer.");
	return count;
}

function normalizeSeed(value) {
	const seed = Number(value);
	if (!Number.isInteger(seed) || seed < 0) throw new RangeError("seed must be a non-negative integer.");
	return seed >>> 0;
}

function bootstrapUncertainty(rows, acceptableRange, replicates, seed) {
	const random = seededRandom(seed);
	const prices = Object.fromEntries(["pmc", "pme", "idp", "opp", "narrowerLower", "narrowerUpper"].map((name) => [name, []]));
	for (let replicate = 0; replicate < replicates; replicate += 1) {
		const sample = Array.from({ length: rows.length }, () => rows[Math.floor(random() * rows.length)]);
		const points = analyzeValidRows(sample, acceptableRange).pricePoints;
		for (const name of Object.keys(prices)) {
			const value = points[name]?.price;
			if (Number.isFinite(value)) prices[name].push(value);
		}
	}

	const intervals = {};
	for (const [name, values] of Object.entries(prices)) {
		if (values.length === 0) continue;
		intervals[name] = {
			lower: percentile(values, 0.025),
			upper: percentile(values, 0.975),
			estimates: values.length,
		};
	}
	return { method: "bootstrap-percentile", replicates, seed, intervals };
}

function percentile(values, quantile) {
	const sorted = [...values].sort((left, right) => left - right);
	const index = (sorted.length - 1) * quantile;
	const lower = Math.floor(index);
	const upper = Math.ceil(index);
	if (lower === upper) return sorted[lower];
	return sorted[lower] + ((sorted[upper] - sorted[lower]) * (index - lower));
}

function seededRandom(seed) {
	let state = seed || 0x6d2b79f5;
	return () => {
		state |= 0;
		state = (state + 0x6d2b79f5) | 0;
		let value = Math.imul(state ^ (state >>> 15), 1 | state);
		value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

export function parseInput(text, format = "csv") {
	if (format === "json") {
		const parsed = JSON.parse(text);
		const rows = Array.isArray(parsed) ? parsed : parsed?.rows;
		if (!Array.isArray(rows)) throw new TypeError("JSON input must be an array or an object with a rows array.");
		return rows;
	}
	return parseDelimited(text, format === "tsv" ? "\t" : ",");
}

function parseDelimited(text, delimiter) {
	const records = [];
	let record = [];
	let value = "";
	let quoted = false;
	for (let index = 0; index < text.length; index += 1) {
		const character = text[index];
		if (quoted) {
			if (character === '"' && text[index + 1] === '"') {
				value += '"';
				index += 1;
			} else if (character === '"') {
				quoted = false;
			} else {
				value += character;
			}
		} else if (character === '"' && value === "") {
			quoted = true;
		} else if (character === delimiter) {
			record.push(value);
			value = "";
		} else if (character === "\n") {
			record.push(value.endsWith("\r") ? value.slice(0, -1) : value);
			if (record.some((cell) => cell !== "")) records.push(record);
			record = [];
			value = "";
		} else {
			value += character;
		}
	}
	if (quoted) throw new SyntaxError("Delimited input contains an unterminated quoted field.");
	record.push(value);
	if (record.some((cell) => cell !== "")) records.push(record);
	if (records.length < 2) throw new SyntaxError("Delimited input must contain a header and at least one row.");

	const headers = records.shift().map((header) => header.trim());
	if (headers.some((header) => header === "") || new Set(headers).size !== headers.length) {
		throw new SyntaxError("Delimited input headers must be non-empty and unique.");
	}
	return records.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}

async function main() {
	const args = parseArguments(process.argv.slice(2));
	if (args.help || !args.input) {
		console.log("Usage: node van-westendorp.mjs <input.json|input.csv|input.tsv> [--range original|narrower] [--bootstrap N] [--seed N] [--output FILE]");
		return;
	}
	const format = args.format ?? inputFormat(args.input);
	const rows = parseInput(await readFile(args.input, "utf8"), format);
	const result = analyzeVanWestendorp(rows, {
		acceptableRange: args.range,
		bootstrap: args.bootstrap,
		seed: args.seed,
	});
	const output = `${JSON.stringify(result, null, 2)}\n`;
	if (args.output) await writeFile(args.output, output);
	else process.stdout.write(output);
}

function parseArguments(argv) {
	const args = { range: "original" };
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === "--help" || argument === "-h") {
			args.help = true;
		} else if (argument === "--range") {
			args.range = argv[++index];
		} else if (argument === "--bootstrap") {
			args.bootstrap = argv[++index];
		} else if (argument === "--seed") {
			args.seed = argv[++index];
		} else if (argument === "--format") {
			args.format = argv[++index];
		} else if (argument === "--output") {
			args.output = argv[++index];
		} else if (argument.startsWith("--")) {
			throw new Error(`Unknown option: ${argument}`);
		} else if (args.input) {
			throw new Error("Only one input file may be supplied.");
		} else {
			args.input = path.resolve(argument);
		}
	}
	if (args.range && !RANGE_DEFINITIONS.has(args.range)) throw new RangeError("--range must be original or narrower.");
	if (args.format && !new Set(["json", "csv", "tsv"]).has(args.format)) throw new RangeError("--format must be json, csv, or tsv.");
	return args;
}

function inputFormat(filename) {
	const extension = path.extname(filename).toLowerCase();
	if (extension === ".json") return "json";
	if (extension === ".tsv") return "tsv";
	return "csv";
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (import.meta.url === invokedPath) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
