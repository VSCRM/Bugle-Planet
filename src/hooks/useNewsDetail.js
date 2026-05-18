import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { newsService } from '../services/newsService';
import { useAuth } from './useAuth';

export function useNewsDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { saveArticle, unsaveArticle, savedArticles } = useAuth();

	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);

	const [prevId, setPrevId] = useState(id);
	if (id !== prevId) {
		setPrevId(id);
		setLoading(true);
	}

	useEffect(() => {
		let cancelled = false;

		newsService.getById(id)
			.then((data) => { if (!cancelled) setArticle(data); })
			.finally(() => { if (!cancelled) setLoading(false); });

		return () => { cancelled = true; };
	}, [id]);

	const isSaved = savedArticles.some((a) => a.id === article?.id);

	const handleSave = () => {
		if (!article) return;
		if (isSaved) {
			unsaveArticle(article.id);
		} else {
			const result = saveArticle(article);
			if (result === 'redirect') {
				sessionStorage.setItem('bp_pending_save', JSON.stringify(article));
				navigate('/login');
			}
		}
	};

	return {
		article, loading, isSaved, handleSave
	};
};
