/**
 * Central application configuration.
 * Set VITE_USE_MOCK=false in .env to switch to the real REST API.
 */
const config = {
	USE_MOCK: import.meta.env.VITE_USE_MOCK !== 'false',
	API_BASE_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
	MOCK_DELAY_MS: Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 600),
};

export default config;
