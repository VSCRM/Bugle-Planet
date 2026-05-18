import { useState, useMemo } from 'react';

export function useSearch(articles) {
	const [query, setQuery] = useState('');
	const [date, setDate] = useState('');

	const results = useMemo(() => {
		const q = query.toLowerCase().trim();

		return articles.filter((article) => {
			const textMatch =
				article.title?.toLowerCase().includes(q) ||
				article.excerpt?.toLowerCase().includes(q);
			const dateMatch = !date || article.date === date;
			return textMatch && dateMatch;
		});
	}, [articles, query, date]);

	const clearFilters = () => {
		setQuery('');
		setDate('');
	};

	return {
		results, query, setQuery, date, setDate, clearFilters
	};
};
