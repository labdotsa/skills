import { z } from "zod";

const nonEmpty = z.string().trim().min(1);
const packageName = nonEmpty.regex(
	/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
	"must use lowercase letters, numbers, and hyphens",
);
const category = nonEmpty.regex(
	/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
	"must use lowercase letters, numbers, and hyphens",
);

export const skillSourceSchema = z.object({
	name: packageName,
	description: nonEmpty,
	license: nonEmpty.optional(),
	compatibility: nonEmpty.optional(),
	metadata: z.record(z.string(), z.string()).and(z.object({ category })),
	"allowed-tools": nonEmpty.optional(),
}).loose();

const recipeRequirementSchema = z.object({
	name: packageName,
	source: nonEmpty,
	url: z.url().optional(),
	availability: z.literal("built-in").optional(),
}).superRefine((value, context) => {
	if (value.availability === "built-in" && value.url !== undefined) {
		context.addIssue({ code: "custom", path: ["url"], message: "built-in requirements must not declare a URL" });
	}
	if (value.availability !== "built-in" && value.url === undefined) {
		context.addIssue({ code: "custom", path: ["url"], message: "non-built-in requirements need an explicit URL" });
	}
});

export const recipeSourceSchema = z.object({
	name: nonEmpty,
	description: nonEmpty,
	metadata: z.object({
		author: nonEmpty,
		category,
		status: z.enum(["draft", "stable"]),
		"detail-url": nonEmpty,
		outcome: nonEmpty,
		"conversation-layers": z.array(nonEmpty).min(1),
		skills: z.array(recipeRequirementSchema).min(1),
	}).strict(),
}).strict();

export type SkillSourceInput = z.infer<typeof skillSourceSchema>;
export type RecipeSourceInput = z.infer<typeof recipeSourceSchema>;
