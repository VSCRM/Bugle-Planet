import { useCallback } from 'react';
import config from '../config';
import { savedArticlesService } from '../services/savedArticlesService';

/**
 * Low-level save / unsave actions used by AuthProvider.
 * Returns 'saved' on success or 'redirect' when the user is not logged in.
 *
 * In mock mode persistence is handled by useAuthSync (localStorage).
 * In real mode each action fires a background API call.
 */
export function useArticleActions(user, setSavedArticles) {
	const saveArticle = useCallback((article) => {
		if (!user) return 'redirect';

		setSavedArticles((previous) =>
			previous.find((saved) => saved.id === article.id)
				? previous
				: [...previous, article],
		);

		if (!config.USE_MOCK) {
			savedArticlesService.save(user.username, article).catch((err) => {
				console.error('[saveArticle] API error:', err);
			});
		}

		return 'saved';
	}, [user, setSavedArticles]);

	const unsaveArticle = useCallback((id) => {
		setSavedArticles((previous) => previous.filter((saved) => saved.id !== id));

		if (!config.USE_MOCK) {
			savedArticlesService.remove(user?.username, id).catch((err) => {
				console.error('[unsaveArticle] API error:', err);
			});
		}
	}, [user, setSavedArticles]);

	return {
		saveArticle, unsaveArticle
	};
}
