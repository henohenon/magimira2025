import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import fs from "node:fs";

export default defineConfig({
	root: "src",
	envDir: "../",
	publicDir: "../public",
	base: "./",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: "src/index.html",
			},
		},
	},
	plugins: [
		{
			name: "dev-only-page",
			configureServer(server) {
				server.middlewares.use("/dev", (req, res, next) => {
					if (req.url === "/dev") {
						res.setHeader("Content-Type", "text/html");
						res.end(fs.readFileSync("src/dev/index.html", "utf-8"));
					} else {
						next(); // 他のファイル（main.tsなど）はViteに任せる
					}
				});
			},
			// build 時は dev.html を emit しない
			generateBundle() {
				/* no-op */
			},
		},
		tailwind(),
		visualizer({ open: true }),
	],
});
