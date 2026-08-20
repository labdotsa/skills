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
	lab?: "Research" | "Design" | "Development" | "Marketing";
	background: string;
}>;

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [requestedOutput] = process.argv.slice(2);
if (!requestedOutput || (requestedOutput !== "site" && !requestedOutput.startsWith(".artifacts/"))) {
	throw new Error("A safe publication output directory is required");
}
if (requestedOutput.split(/[\\/]/).includes("..")) throw new Error("Publication output cannot escape its root");

const outputDirectory = path.join(repositoryRoot, requestedOutput);
const snapshot = await getCatalogSnapshot();
const [displayFont, bodyFont, bodyMediumFont, bodyBoldFont, logo] = await Promise.all([
	readFile(path.join(repositoryRoot, "src/lib/assets/fonts/maax-unicase/black.otf")),
	readFile(path.join(repositoryRoot, "src/lib/assets/fonts/ibm-plex-sans-arabic/regular.ttf")),
	readFile(path.join(repositoryRoot, "src/lib/assets/fonts/ibm-plex-sans-arabic/medium.ttf")),
	readFile(path.join(repositoryRoot, "src/lib/assets/fonts/ibm-plex-sans-arabic/bold.ttf")),
	readFile(path.join(repositoryRoot, "static/brand/logo.svg")),
]);
const logoDataUrl = `data:image/svg+xml;base64,${logo.toString("base64")}`;

const cards: Card[] = [
	{
		path: "thumbnail.png",
		kind: "CATALOG",
		title: "Public agent skills",
		description: "Portable protocols for research, design, development, and delivery.",
		label: `${snapshot.skills.length} SKILLS · ${snapshot.recipes.length} ${snapshot.recipes.length === 1 ? "RECIPE" : "RECIPES"}`,
		watermark: "LAB SKILLS",
		background: "#B5AFFF",
	},
	{
		path: "recipes/thumbnail.png",
		kind: "CATALOG",
		title: "Delivery recipes",
		description: "Sequenced playbooks that combine focused skills into complete outcomes.",
		label: `${snapshot.recipes.length} ${snapshot.recipes.length === 1 ? "RECIPE" : "RECIPES"}`,
		watermark: "RECIPES",
		background: "#B5AFFF",
	},
	...snapshot.skills.map((skill): Card => {
		const identity = labIdentityFor(skill.category);
		return {
			path: `skills/${skill.slug}/thumbnail.png`,
			kind: "SKILL",
			title: skill.name,
			description: skill.description,
			label: skill.category.replaceAll("-", " ").toUpperCase(),
			watermark: skill.slug.replaceAll("-", " ").toUpperCase(),
			...identity,
		};
	}),
	...snapshot.recipes.map((recipe): Card => ({
		path: `recipes/${recipe.slug}/thumbnail.png`,
		kind: "RECIPE",
		title: recipe.title,
		description: recipe.description,
		label: `${recipe.status.toUpperCase()} · ${recipe.stages.length} ${recipe.stages.length === 1 ? "PHASE" : "PHASES"}`,
		watermark: recipe.slug.replaceAll("-", " ").toUpperCase(),
		background: "#B5AFFF",
	})),
];

for (const card of cards) {
	const svg = await satori(cardMarkup(card), {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Maax Unicase", data: displayFont, weight: 900, style: "normal" },
			{ name: "IBM Plex Sans", data: bodyFont, weight: 400, style: "normal" },
			{ name: "IBM Plex Sans", data: bodyMediumFont, weight: 500, style: "normal" },
			{ name: "IBM Plex Sans", data: bodyBoldFont, weight: 700, style: "normal" },
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
				background: card.background,
				color: "#111111",
				fontFamily: "IBM Plex Sans",
			},
			children: [
				{
					type: "img",
					props: {
						src: logoDataUrl,
						style: { position: "absolute", top: "-256px", left: "-384px", width: "1200px", height: "1200px", objectFit: "contain", objectPosition: "center", opacity: 0.06125 },
					},
				},
				{
					type: "div",
					props: {
						style: { display: "flex", position: "relative", flexDirection: "column", justifyContent: "space-between", width: "1200px", height: "630px", padding: "54px 68px 56px" },
						children: [
							{
								type: "div",
								props: {
									style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
									children: [
										{ type: "img", props: { src: logoDataUrl, width: 34, height: 46, style: { width: "34px", height: "46px" } } },
										{ type: "div", props: { children: `${card.kind} / ${card.label}`, style: { fontSize: "17px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" } } },
									],
								},
							},
							{
								type: "div",
								props: {
									style: { display: "flex", flexDirection: "column", maxWidth: "940px" },
									children: [
										{ type: "div", props: { children: card.title, style: { fontFamily: "Maax Unicase", fontSize: titleSize(card.title), lineHeight: 0.92, letterSpacing: "-0.035em", marginBottom: "28px" } } },
										{ type: "div", props: { children: clamp(card.description, 190), style: { fontSize: "27px", lineHeight: 1.3, fontWeight: 400, opacity: 0.72, maxWidth: "900px" } } },
									],
								},
							},
							{ type: "div", props: { children: "skills.lab.sa", style: { fontSize: "20px", fontWeight: 700, letterSpacing: "0.04em" } } },
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

function labIdentityFor(category: string): Pick<Card, "lab" | "background"> {
	if (["product", "research"].includes(category)) return { lab: "Research", background: "#00BFFF" };
	if (category === "design") return { lab: "Design", background: "#F9C431" };
	if (["frontend", "integrations", "engineering", "delivery"].includes(category)) {
		return { lab: "Development", background: "#FF6347" };
	}
	if (["content", "growth", "marketing"].includes(category)) return { lab: "Marketing", background: "#01A26B" };
	return { background: "#B5AFFF" };
}

function titleSize(value: string) {
	if (value.length > 45) return "54px";
	if (value.length > 30) return "64px";
	return "80px";
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
