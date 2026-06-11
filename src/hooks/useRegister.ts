import {useCallback, type Dispatch, type SetStateAction} from "react";
import {authService} from "../services/authService";
import {popPendingArticle} from "../context/popPendingArticle";
import {createSession} from "../security/sessionGuard";
import {sanitizeEmail, sanitizeNickname} from "../utils/sanitize";
import type {User, Article, AuthResult} from "../schemas";

/**
 * Produces a memoised `register` function that handles session creation
 * and pending-article handling after a successful registration.
 */
export function useRegister(
	setUser: Dispatch<SetStateAction<User | null>>,
	setSavedArticles: Dispatch<SetStateAction<Article[]>>,
	setLoading: Dispatch<SetStateAction<boolean>>,
): (
	rawEmail: string,
	password: string,
	rawNickname: string,
) => Promise<AuthResult> {
	return useCallback(
		async (
			rawEmail: string,
			password: string,
			rawNickname: string,
		): Promise<AuthResult> => {
			const email = sanitizeEmail(rawEmail);
			const nickname = rawNickname
				? sanitizeNickname(rawNickname)
				: (email.split("@")[0] ?? email);

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
		},
		[setUser, setSavedArticles, setLoading],
	);
}
