/**
 * Fetches a single article by the `:id` URL parameter.
 *
 * Uses AbortController to cancel in-flight requests when the component
 * unmounts or the `id` param changes — prevents stale setState in React 19
 * strict-mode double-invocation and rapid navigation.
 *
 * When the user is not authenticated and tries to save, the article is stored
 * in sessionStorage (key 'bp_pending_save') and the user is redirected to
 * /login.  After a successful login or register, AuthProvider automatically
 * restores the pending article via popPendingArticle().
 */
import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import {newsService} from "../services/newsService";
import {useAuth} from "./useAuth";
import {useLocale} from "../i18n/LocaleContext";
import {PENDING_SAVE_KEY} from "./useSaveArticle";
import type {Article} from "../schemas";

interface UseNewsDetailResult {
	article: Article | null;
	loading: boolean;
	error: string | null;
	isSaved: boolean;
	handleSave: () => void;
}

export function useNewsDetail(): UseNewsDetailResult {
	const {id} = useParams<{id: string}>();
	const {user, savedArticles, saveArticle, unsaveArticle} = useAuth();
	const navigate = useNavigate();
	const {locale, t} = useLocale();

	const [article, setArticle] = useState<Article | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		const controller = new AbortController();

		const fetchArticle = async (): Promise<void> => {
			try {
				setLoading(true);
				setError(null);
				const data = await newsService.getById(
					Number(id),
					controller.signal,
					locale,
				);
				if (controller.signal.aborted) return;
				setArticle(data ?? null);
				if (!data) setError(t.detail.notFound);
			} catch {
				if (controller.signal.aborted) return;
				setError(t.detail.loadError);
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		};

		void fetchArticle();
		return () => controller.abort();
	}, [id, locale]);

	const isSaved = !!article && savedArticles.some((a) => a.id === article.id);

	const handleSave = (): void => {
		if (!article) return;

		// Unauthenticated: store article as pending and redirect to login.
		if (!user) {
			try {
				sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(article));
			} catch {
				// sessionStorage may be blocked — fail gracefully.
			}
			void navigate("/login");
			return;
		}

		if (isSaved) {
			unsaveArticle(article.id);
		} else {
			saveArticle(article);
		}
	};

	return {
		article,
		loading,
		error,
		isSaved,
		handleSave,
	};
}
