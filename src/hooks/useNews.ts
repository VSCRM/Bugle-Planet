/**
 * Fetches the article list for the active locale.
 *
 * Re-fetches automatically when the user switches language — the locale
 * is included in the useEffect dependency array so a new request fires
 * with the correct locale whenever it changes.
 */
import {useState, useEffect} from "react";
import {newsService} from "../services/newsService";
import {useLocale} from "../i18n/LocaleContext";
import type {Article} from "../schemas";
import {CATEGORIES_BY_LOCALE} from "../mock/newsData";

interface UseNewsResult {
	articles: Article[];
	categories: string[];
	loading: boolean;
	error: string | null;
}

export function useNews(): UseNewsResult {
	const {locale, t} = useLocale();

	const [articles, setArticles] = useState<Article[]>([]);
	const [categories, setCategories] = useState<string[]>([
		...CATEGORIES_BY_LOCALE[locale],
	]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		const fetchArticles = async (): Promise<void> => {
			try {
				setLoading(true);
				setError(null);

				const data = await newsService.getAll(controller.signal, locale);
				if (controller.signal.aborted) return;

				setArticles(data);

				// Build unique category list; keep locale-specific "All" sentinel first.
				const allLabel =
					CATEGORIES_BY_LOCALE[locale][0] ?? t.home.allCategories;
				const unique = Array.from(new Set(data.map((a) => a.category)));
				setCategories([allLabel, ...unique]);
			} catch {
				if (controller.signal.aborted) return;
				setError(t.home.error + " Could not load articles.");
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		};

		void fetchArticles();
		return () => controller.abort();
	}, [locale]); // re-fetch when language switches

	return {
		articles,
		categories,
		loading,
		error,
	};
}
