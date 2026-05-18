import config from '../config';
import { api } from './api';

// ─── Mock implementation (localStorage) ──────────────────────────────────────

const mockService = {
	async getAll(username) {
		try {
			const raw = localStorage.getItem(`bp_saved_${username}`);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	},
	// In mock mode persistence is handled by useAuthSync writing to localStorage.
	async save() { },
	async remove() { },
};

// ─── Real API implementation (axios) ─────────────────────────────────────────

const apiService = {
	async getAll(username) {
		const { data } = await api.get(`/users/${username}/saved`);
		return data;
	},

	async save(username, article) {
		await api.post(`/users/${username}/saved`, article);
	},

	async remove(username, articleId) {
		await api.delete(`/users/${username}/saved/${articleId}`);
	},
};

export const savedArticlesService = config.USE_MOCK ? mockService : apiService;
