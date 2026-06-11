import {useCallback, type Dispatch, type SetStateAction} from "react";
import config from "../config";
import {authService} from "../services/authService";
import {savedArticlesService} from "../services/savedArticlesService";
import {readSavedArticles} from "../context/readSavedArticles";
import {popPendingArticle} from "../context/popPendingArticle";
import {createSession} from "../security/sessionGuard";
import {
	checkRateLimit,
	recordFailedAttempt,
	clearRateLimit,
} from "../security/rateLimiter";
import {sanitizeEmail} from "../utils/sanitize";
import type {User, Article, AuthResult} from "../schemas";

/**
 * Produces a memoised `login` function that handles rate-limiting,
 * session creation, and pending-article merging after a successful auth.
 */
export function useLogin(
	setUser: Dispatch<SetStateAction<User | null>>,
	setSavedArticles: Dispatch<SetStateAction<Article[]>>,
	setLoading: Dispatch<SetStateAction<boolean>>,
): (rawEmail: string, password: string) => Promise<AuthResult> {
	return useCallback(
		async (rawEmail: string, password: string): Promise<AuthResult> => {
			const email = sanitizeEmail(rawEmail);

			const blocked = checkRateLimit(email);
			if (blocked) return {success: false, message: blocked};

			setLoading(true);
			try {
				const result = await authService.login(email, password);

				if (result.success) {
					createSession(result.user.username);
					clearRateLimit(email);
					setUser(result.user);

					// In mock mode: read saved articles from localStorage.
					// In real mode: fetch from the API.
					const existing = config.USE_MOCK
						? readSavedArticles(result.user.username)
						: await savedArticlesService.getAll(result.user.username);

					const pending = popPendingArticle();
					const merged =
						pending && !existing.find((a) => a.id === pending.id)
							? [...existing, pending]
							: existing;

					setSavedArticles(merged);

					// Real mode: persist the merged pending article immediately.
					if (!config.USE_MOCK && pending && merged.length > existing.length) {
						savedArticlesService
							.save(result.user.username, pending)
							.catch(() => {});
					}
				} else {
					recordFailedAttempt(email);
				}

				return result;
			} finally {
				setLoading(false);
			}
		},
		[setUser, setSavedArticles, setLoading],
	);
}
