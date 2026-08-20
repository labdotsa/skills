import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { getCatalogSnapshot } from "../src/lib/server/content/index.js";

type Card = Readonly<{
	path: string;
	kind: "CATALOG" | "SKILL" | "RECIPE";
	title: string;
	description: string;
	label: string;
	watermark: string;
	accent: string;
}>;

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [requestedOutput] = process.argv.slice(2);
if (!requestedOutput || (requestedOutput !== "site" && !requestedOutput.startsWith(".artifacts/"))) {
	throw new Error("A safe publication output directory is required");
}
if (requestedOutput.split(/[\\/]/).includes("..")) throw new Error("Publication output cannot escape its root");

const outputDirectory = path.join(repositoryRoot, requestedOutput);
const snapshot = await getCatalogSnapshot();
const [displayFont, bodyFont] = await Promise.all([
	readFile(path.join(repositoryRoot, "src/lib/assets/fonts/maax-unicase/black.otf")),
	readFile(path.join(repositoryRoot, "src/lib/assets/fonts/maax-unicase/bold.otf")),
]);

const cards: Card[] = [
	{
		path: "thumbnail.png",
		kind: "CATALOG",
		title: "Public agent skills",
		description: "Portable protocols for research, design, development, and delivery.",
		label: `${snapshot.skills.length} SKILLS · ${snapshot.recipes.length} ${snapshot.recipes.length === 1 ? "RECIPE" : "RECIPES"}`,
		watermark: "LAB SKILLS",
		accent: "#B5AFFF",
	},
	{
		path: "recipes/thumbnail.png",
		kind: "CATALOG",
		title: "Delivery recipes",
		description: "Sequenced playbooks that combine focused skills into complete outcomes.",
		label: `${snapshot.recipes.length} ${snapshot.recipes.length === 1 ? "RECIPE" : "RECIPES"}`,
		watermark: "RECIPES",
		accent: "#FFB4A2",
	},
	...snapshot.skills.map((skill): Card => ({
		path: `skills/${skill.slug}/thumbnail.png`,
		kind: "SKILL",
		title: skill.name,
		description: skill.description,
		label: skill.category.replaceAll("-", " ").toUpperCase(),
		watermark: skill.slug.replaceAll("-", " ").toUpperCase(),
		accent: accentFor(skill.category),
	})),
	...snapshot.recipes.map((recipe): Card => ({
		path: `recipes/${recipe.slug}/thumbnail.png`,
		kind: "RECIPE",
		title: recipe.title,
		description: recipe.description,
		label: `${recipe.status.toUpperCase()} · ${recipe.stages.length} ${recipe.stages.length === 1 ? "PHASE" : "PHASES"}`,
		watermark: recipe.slug.replaceAll("-", " ").toUpperCase(),
		accent: "#FFB4A2",
	})),
];

for (const card of cards) {
	const svg = await satori(cardMarkup(card), {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Maax Unicase", data: displayFont, weight: 900, style: "normal" },
			{ name: "Maax Unicase Text", data: bodyFont, weight: 700, style: "normal" },
		],
	});
	const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
	const pathname = safeOutputPath(card.path);
	await mkdir(path.dirname(pathname), { recursive: true });
	await writeFile(pathname, png);
}

console.log(`Generated ${cards.length} route thumbnails.`);

function cardMarkup(card: Card) {
	return {
		type: "div",
		props: {
			style: {
				display: "flex",
				position: "relative",
				width: "1200px",
				height: "630px",
				overflow: "hidden",
				background: "#F3F3F0",
				color: "#111111",
				fontFamily: "Maax Unicase Text",
			},
			children: [
				{
					type: "div",
					props: { style: { display: "flex", width: "28px", height: "630px", background: card.accent } },
				},
				{
					type: "div",
					props: {
						style: { display: "flex", flexDirection: "column", justifyContent: "space-between", width: "1172px", padding: "62px 72px 58px" },
						children: [
							{
								type: "div",
								props: {
									style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
									children: [
										{ type: "div", props: { children: "LAB", style: { fontFamily: "Maax Unicase", fontSize: "44px", lineHeight: 1 } } },
										{ type: "div", props: { children: `${card.kind} / ${card.label}`, style: { fontSize: "18px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" } } },
									],
								},
							},
							{
								type: "div",
								props: {
									style: { display: "flex", flexDirection: "column", maxWidth: "940px" },
									children: [
										{ type: "div", props: { children: card.title, style: { fontFamily: "Maax Unicase", fontSize: titleSize(card.title), lineHeight: 0.92, letterSpacing: "-0.035em", marginBottom: "28px" } } },
										{ type: "div", props: { children: clamp(card.description, 190), style: { fontSize: "27px", lineHeight: 1.3, opacity: 0.68, maxWidth: "900px" } } },
									],
								},
							},
							{
								type: "div",
								props: { children: "skills.lab.sa", style: { fontSize: "20px", fontWeight: 700, letterSpacing: "0.04em" } },
							},
						],
					},
				},
				{
					type: "div",
					props: {
						children: card.watermark,
						style: { position: "absolute", right: "-28px", bottom: "-20px", fontFamily: "Maax Unicase", fontSize: "88px", lineHeight: 1, opacity: 0.045, whiteSpace: "nowrap" },
					},
				},
			],
		},
	};
}

function accentFor(category: string) {
	if (category === "design") return "#FFB4A2";
	if (["frontend", "integrations", "engineering", "delivery"].includes(category)) return "#91D7C3";
	if (["content", "growth", "marketing"].includes(category)) return "#FFD166";
	return "#B5AFFF";
}

function titleSize(value: string) {
	if (value.length > 34) return "58px";
	if (value.length > 24) return "68px";
	return "82px";
}

function clamp(value: string, maximum: number) {
	const normalized = value.replace(/\s+/g, " ").trim();
	if (normalized.length <= maximum) return normalized;
	return `${normalized.slice(0, maximum - 1).trimEnd()}…`;
}

function safeOutputPath(filename: string) {
	if (path.isAbsolute(filename) || filename.split(/[\\/]/).includes("..")) throw new Error(`Unsafe thumbnail path: ${filename}`);
	const pathname = path.resolve(outputDirectory, filename);
	if (pathname !== outputDirectory && !pathname.startsWith(`${outputDirectory}${path.sep}`)) {
		throw new Error(`Thumbnail path escapes publication output: ${filename}`);
	}
	return pathname;
}
