/**
 * Article filter hook: text query + date.
 *
 * React 19 / useTransition
 * ────────────────────────
 * Filter computation runs inside `startTransition` so it is treated as a
 * non-urgent update.  The UI stays responsive while a large article list is
 * being filtered — React can interrupt and re-schedule the work if the user
 * keeps typing.
 */
import {useState, useTransition, useMemo} from "react";
import type {Article} from "../schemas";

interface UseSearchResult {
	results: Article[];
	query: string;
	date: string;
	isPending: boolean;
	setQuery: (value: string) => void;
	setDate: (value: string) => void;
	clearFilters: () => void;
}

export function useSearch(articles: Article[]): UseSearchResult {
	const [query, setQueryRaw] = useState("");
	const [date, setDateRaw] = useState("");
	const [isPending, startTransition] = useTransition();

	const setQuery = (value: string): void => {
		startTransition(() => setQueryRaw(value));
	};

	const setDate = (value: string): void => {
		startTransition(() => setDateRaw(value));
	};

	const clearFilters = (): void => {
		startTransition(() => {
			setQueryRaw("");
			setDateRaw("");
		});
	};

	/** Derived filtered list — recomputed only when deps change. */
	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		return articles.filter((article) => {
			const matchesQuery =
				!q ||
				article.title.toLowerCase().includes(q) ||
				article.excerpt.toLowerCase().includes(q);
			const matchesDate = !date || article.date === date;
			return matchesQuery && matchesDate;
		});
	}, [articles, query, date]);

	return {
		results,
		query,
		date,
		isPending,
		setQuery,
		setDate,
		clearFilters,
	};
}
