import { useNavigate } from 'react-router';
import { useAuth } from './useAuth';

/**
 * Handles save / unsave logic for a single article.
 * Redirects to /login when the user is not authenticated.
 */
export function useSaveArticle(article) {
	const { saveArticle, unsaveArticle, savedArticles } = useAuth();
	const navigate = useNavigate();

	const isSaved = savedArticles.some((saved) => saved.id === article.id);

	const handleSave = (event) => {
		event.preventDefault();

		if (isSaved) {
			unsaveArticle(article.id);
			return;
		}

		const result = saveArticle(article);

		if (result === 'redirect') {
			// Store the article so it can be auto-saved after login.
			sessionStorage.setItem('bp_pending_save', JSON.stringify(article));
			navigate('/login');
		}
	};

	return {
		isSaved, handleSave
	};
}
