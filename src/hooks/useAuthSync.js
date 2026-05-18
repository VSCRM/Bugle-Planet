import { useEffect } from 'react';
import config from '../config';
import { clearSession } from '../security/sessionGuard';
import { storage } from '../services/storage';
import { savedArticlesService } from '../services/savedArticlesService';
import { safeStringify } from '../utils/sanitize';

export function useAuthSync(user, savedArticles, setSavedArticles) {
	// Real mode only: on mount re-load saved articles from the API when the
	// user is already logged in (e.g. after a page refresh).
	useEffect(() => {
		if (!config.USE_MOCK && user) {
			savedArticlesService.getAll(user.username)
				.then(setSavedArticles)
				.catch(() => { });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // intentionally runs once on mount

	// Keep the user object in localStorage so login survives a page refresh.
	// On logout clear everything including the JWT token.
	useEffect(() => {
		if (user) {
			const safeUser = { username: user.username, nickname: user.nickname };
			const serialized = safeStringify(safeUser);
			if (serialized) {
				localStorage.setItem('bp_user', serialized);
			}
		} else {
			storage.clearAuth();
			clearSession();
			setSavedArticles([]);
		}
	}, [user, setSavedArticles]);

	// Mock mode only: persist saved articles to localStorage.
	// In real mode the API is the source of truth (calls made in useArticleActions).
	useEffect(() => {
		if (user && config.USE_MOCK) {
			const serialized = safeStringify(savedArticles);
			if (serialized) {
				localStorage.setItem(`bp_saved_${user.username}`, serialized);
			}
		}
	}, [savedArticles, user]);
}
