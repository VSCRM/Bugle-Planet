import {PendingArticleStorageSchema, type Article} from "../schemas";
import {PENDING_SAVE_KEY} from "../hooks/useSaveArticle";

/**
 * Reads and removes the pending-save article from sessionStorage.
 * Uses Zod to validate the stored value so malformed data is silently discarded.
 *
 * @returns The validated Article, or `null` if nothing is pending / data is invalid.
 */
export function popPendingArticle(): Article | null {
	try {
		const raw = sessionStorage.getItem(PENDING_SAVE_KEY);
		if (!raw) return null;
		sessionStorage.removeItem(PENDING_SAVE_KEY);
		const parsed: unknown = JSON.parse(raw);
		const result = PendingArticleStorageSchema.safeParse(parsed);
		return result.success ? result.data : null;
	} catch {
		return null;
	}
}
