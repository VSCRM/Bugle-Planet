import config from "../config";
import {api} from "./api";
import {
	SavedArticlesStorageSchema,
	ArticlesArraySchema,
	type Article,
} from "../schemas";

/** Contract for saved-articles CRUD operations. */
export interface SavedArticlesService {
	getAll(username: string): Promise<Article[]>;
	save(username: string, article: Article): Promise<void>;
	remove(username: string, articleId: number): Promise<void>;
}

// ─── Mock implementation (localStorage) ──────────────────────────────────────

const mockService: SavedArticlesService = {
	async getAll(username: string): Promise<Article[]> {
		try {
			const raw = localStorage.getItem(`bp_saved_${username}`);
			if (!raw) return [];
			const parsed: unknown = JSON.parse(raw);
			const result = SavedArticlesStorageSchema.safeParse(parsed);
			return result.success ? result.data : [];
		} catch {
			return [];
		}
	},

	// In mock mode persistence is driven by useAuthSync writing to localStorage.
	async save(): Promise<void> {
		/* no-op */
	},
	async remove(): Promise<void> {
		/* no-op */
	},
};

// ─── Real API implementation (Axios) ─────────────────────────────────────────

const apiService: SavedArticlesService = {
	/**
	 * GET /users/:username/saved
	 * Validates the response with ArticlesArraySchema before returning so callers
	 * always receive a well-typed `Article[]` rather than a blindly-cast payload.
	 */
	async getAll(username: string): Promise<Article[]> {
		const {data} = await api.get<unknown>(`/users/${username}/saved`);
		// Runtime-validate: throws ZodError if the server sends unexpected data.
		return ArticlesArraySchema.parse(data);
	},

	async save(username: string, article: Article): Promise<void> {
		await api.post(`/users/${username}/saved`, article);
	},

	async remove(username: string, articleId: number): Promise<void> {
		await api.delete(`/users/${username}/saved/${articleId}`);
	},
};

export const savedArticlesService: SavedArticlesService = config.USE_MOCK
	? mockService
	: apiService;
