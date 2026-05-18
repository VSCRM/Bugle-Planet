import { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import { CATEGORIES } from '../mock/newsData';

export const useNews = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;

		const fetchNews = async () => {
			setLoading(true);
			try {
				const data = await newsService.getAll();
				if (!cancelled) setArticles(data);
			} catch (err) {
				if (!cancelled) setError(err.message ?? 'Помилка завантаження');
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		fetchNews();
		return () => { cancelled = true; };
	}, []);

	return {
		articles, categories: CATEGORIES, loading, error
	};
};
