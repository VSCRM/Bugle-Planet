import { useCallback } from 'react';
import { authService } from '../services/authService';
import { popPendingArticle } from '../context/popPendingArticle';
import { createSession } from '../security/sessionGuard';
import { sanitizeEmail, sanitizeNickname } from '../utils/sanitize';

export function useRegister(setUser, setSavedArticles, setLoading) {
	return useCallback(async (rawEmail, password, rawNickname) => {
		const email = sanitizeEmail(rawEmail);
		const nickname = rawNickname ? sanitizeNickname(rawNickname) : email.split('@')[0];

		setLoading(true);
		try {
			const result = await authService.register(email, password, nickname);

			if (result.success) {
				createSession(result.user.username);
				setUser(result.user);
				const pending = popPendingArticle();
				setSavedArticles(pending ? [pending] : []);
			}

			return result;
		} finally {
			setLoading(false);
		}
	}, [setUser, setSavedArticles, setLoading]);
}
