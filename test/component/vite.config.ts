import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	root: path.resolve("test/component/gallery"),
	plugins: [tailwindcss(), svelte()],
	resolve: { alias: { $lib: path.resolve("src/lib") } },
});
