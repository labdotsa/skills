import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [contentSnapshotReload(), tailwindcss(), sveltekit()],
});

function contentSnapshotReload() {
	return {
		name: "lab-content-snapshot-reload",
		configureServer(server: import("vite").ViteDevServer) {
			const root = path.resolve(server.config.root);
			const contentRoots = [path.join(root, "skills"), path.join(root, "recipes")];
			const license = path.join(root, "LICENSE");
			server.watcher.add([...contentRoots, license]);
			let restarting = false;
			server.watcher.on("all", async (_event, filename) => {
				const absolute = path.resolve(filename);
				const relevant = absolute === license || contentRoots.some((directory) =>
					absolute === directory || absolute.startsWith(`${directory}${path.sep}`));
				if (!relevant || restarting) return;
				restarting = true;
				try {
					await server.restart();
				} finally {
					restarting = false;
				}
			});
		},
	};
}
