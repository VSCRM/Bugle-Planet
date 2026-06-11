import {logger} from "./../utils/logger";
import {useCallback, type Dispatch, type SetStateAction} from "react";
import config from "../config";
import {savedArticlesService} from "../services/savedArticlesService";
import type {User, Article} from "../schemas";

export interface ArticleActionsResult {
	saveArticle: (article: Article) => "saved" | "redirect";
	unsaveArticle: (id: number) => void;
}

/**
 * Low-level save / unsave actions used by AuthProvider.
 * Returns `'saved'` on success, or `'redirect'` when the user is not logged in.
 *
 * In mock mode, persistence is handled by useAuthSync (localStorage).
 * In real mode, each action fires a background API call.
 */
export function useArticleActions(
	user: User | null,
	setSavedArticles: Dispatch<SetStateAction<Article[]>>,
): ArticleActionsResult {
	const saveArticle = useCallback(
		(article: Article): "saved" | "redirect" => {
			if (!user) return "redirect";

			setSavedArticles((previous) =>
				previous.some((saved) => saved.id === article.id)
					? previous
					: [...previous, article],
			);

			if (!config.USE_MOCK) {
				savedArticlesService
					.save(user.username, article)
					.catch((err: unknown) => {
						logger.error("saveArticle failed", err, "useArticleActions");
					});
			}

			return "saved";
		},
		[user, setSavedArticles],
	);

	const unsaveArticle = useCallback(
		(id: number): void => {
			setSavedArticles((previous) =>
				previous.filter((saved) => saved.id !== id),
			);

			if (!config.USE_MOCK && user) {
				savedArticlesService.remove(user.username, id).catch((err: unknown) => {
					logger.error("unsaveArticle failed", err, "useArticleActions");
				});
			}
		},
		[user, setSavedArticles],
	);

	return {
		saveArticle,
		unsaveArticle,
	};
}
