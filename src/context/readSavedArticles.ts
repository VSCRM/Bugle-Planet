import {SavedArticlesStorageSchema, type Article} from "../schemas";

/**
 * Reads and Zod-validates the saved-articles list for `username` from localStorage.
 * Returns an empty array on any error (missing key, invalid JSON, schema mismatch).
 */
export function readSavedArticles(username: string | undefined): Article[] {
	try {
		if (!username) return [];
		const raw = localStorage.getItem(`bp_saved_${username}`);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		const result = SavedArticlesStorageSchema.safeParse(parsed);
		return result.success ? result.data : [];
	} catch {
		return [];
	}
}
