/**
 * Vite + Vitest configuration.
 *
 * Bundle strategy — manual chunks for optimal caching:
 * ─────────────────────────────────────────────────────
 * vendor-react   react + react-dom + react-router  (very stable, cache for months)
 * vendor-utils   axios + zod                        (stable, cache for months)
 * vendor-ui      lucide-react (ALL icons)           (stable, cache for months)
 * vendor-crypto  bcrypt-ts                          (stable, cache for months)
 * index          app shell: Header, Auth, i18n      (changes per deploy)
 *
 * Page components are lazy-loaded from App.tsx → each becomes its own chunk
 * that is downloaded only when that route is visited.
 */
import {defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";
import {fileURLToPath, URL} from "node:url";

export default defineConfig({
	base: "/Bugle-Planet/",

	plugins: [react()],

	resolve: {
		alias: {"@": fileURLToPath(new URL("./src", import.meta.url))},
	},

	build: {
		chunkSizeWarningLimit: 600,
		rollupOptions: {
			output: {
				// Group modules into stable vendor chunks so the browser can cache
				// third-party code independently of application code changes.
				manualChunks: (id: string): string | undefined => {
					if (
						id.includes("node_modules/react") ||
						id.includes("node_modules/react-dom") ||
						id.includes("react-router")
					)
						return "vendor-react";
					if (
						id.includes("node_modules/axios") ||
						id.includes("node_modules/zod")
					)
						return "vendor-utils";
					// All lucide icons → one cacheable chunk
					if (
						id.includes("node_modules/lucide-react") ||
						id.includes("lucide-react")
					)
						return "vendor-ui";
					if (id.includes("node_modules/bcrypt-ts")) return "vendor-crypto";
					return undefined;
				},
			},
		},
	},

	server: {
		open: true,
		proxy: {
			"/api": "http://localhost:3000",
			"/images": "http://localhost:3000",
		},
	},

	preview: {port: 4173},

	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/tests/setup.ts",
	},
});
