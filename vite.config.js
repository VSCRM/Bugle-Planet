import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	base: '/Bugle-Planet/',
	plugins: [react()],
	server: {
		open: true,
		fs: {
			strict: false,
		},
	},
	preview: {
		historyApiFallback: true,
		port: 4173,
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/tests/setup.js',
	},
});
