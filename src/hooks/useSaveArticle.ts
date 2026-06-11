/**
 * Toggles the saved state of an article on a NewsCard.
 *
 * React 19 — useOptimistic
 * ────────────────────────
 * The UI updates immediately (optimistic) before the async operation
 * completes.  If the operation fails, React automatically rolls back to
 * the previous state.  This eliminates the perceived lag users see when
 * waiting for an API call.
 *
 * When the user is not authenticated, clicking save stores the article in
 * sessionStorage as a pending action (key 'bp_pending_save') and redirects
 * to /login.  After login the AuthProvider reads this pending article and
 * saves it automatically via popPendingArticle().
 */
import {useOptimistic, useCallback, startTransition} from "react";
import {useNavigate} from "react-router";
import type {Article} from "../schemas";
import {useAuth} from "./useAuth";
import {logger} from "../utils/logger";

/** Storage key for the article the user tried to save while logged out. */
export const PENDING_SAVE_KEY = "bp_pending_save";

interface UseSaveArticleResult {
	isSaved: boolean;
	handleSave: (e?: React.MouseEvent) => void;
}

export function useSaveArticle(article: Article): UseSaveArticleResult {
	const {user, savedArticles, saveArticle, unsaveArticle} = useAuth();
	const navigate = useNavigate();

	const isRealSaved = savedArticles.some((a) => a.id === article.id);

	/** Optimistic state: flips immediately, rolls back on error. */
	const [optimisticSaved, setOptimisticSaved] = useOptimistic(isRealSaved);

	const handleSave = useCallback(
		(e?: React.MouseEvent): void => {
			e?.stopPropagation();
			e?.preventDefault();

			if (!user) {
				// Store the article so AuthProvider can restore it after login/register.
				try {
					sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(article));
				} catch {
					// sessionStorage can be blocked in some browsers — fail gracefully.
				}
				void navigate("/login");
				return;
			}

			const wasOptimisticSaved = optimisticSaved;

			// Wrap in startTransition to satisfy React 19's requirement that
			// useOptimistic updates happen inside a transition or async action.
			startTransition(() => {
				setOptimisticSaved(!wasOptimisticSaved);
			});

			(wasOptimisticSaved
				? Promise.resolve(unsaveArticle(article.id))
				: Promise.resolve(saveArticle(article))
			).catch((err: unknown) => {
				logger.error("Save article failed", err, "useSaveArticle");
				// useOptimistic automatically reverts on error.
			});
		},
		[
			user,
			optimisticSaved,
			article,
			navigate,
			saveArticle,
			unsaveArticle,
			setOptimisticSaved,
		],
	);

	return {
		isSaved: optimisticSaved,
		handleSave,
	};
}
