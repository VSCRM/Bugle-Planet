import {useEffect, type Dispatch, type SetStateAction} from "react";
import config from "../config";
import {clearSession} from "../security/sessionGuard";
import {storage} from "../services/storage";
import {savedArticlesService} from "../services/savedArticlesService";
import {safeStringify} from "../utils/sanitize";
import type {User, Article} from "../schemas";

/**
 * Manages side-effects that keep React state, localStorage, and the
 * real API in sync whenever `user` or `savedArticles` changes.
 *
 * This hook is intentionally opaque to consumers — it is called once by
 * AuthProvider and handles all persistence concerns internally.
 */
export function useAuthSync(
	user: User | null,
	savedArticles: Article[],
	setSavedArticles: Dispatch<SetStateAction<Article[]>>,
): void {
	// Real mode only: re-fetch saved articles from the API on mount when the
	// user is already logged in (e.g. after a page refresh).
	useEffect(() => {
		if (!config.USE_MOCK && user) {
			savedArticlesService
				.getAll(user.username)
				.then(setSavedArticles)
				.catch(() => {
					/* silent — UI state remains unchanged */
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // intentionally runs once on mount only

	// Persist the safe user object to localStorage so login survives page refresh.
	// On logout clear everything including the JWT token and session.
	useEffect(() => {
		if (user) {
			const safeUser: User = {username: user.username, nickname: user.nickname};
			const serialized = safeStringify(safeUser);
			if (serialized) {
				localStorage.setItem("bp_user", serialized);
			}
		} else {
			storage.clearAuth();
			clearSession();
			setSavedArticles([]);
		}
	}, [user, setSavedArticles]);

	// Mock mode only: persist saved articles to localStorage so they survive page refresh.
	useEffect(() => {
		if (user && config.USE_MOCK) {
			const serialized = safeStringify(savedArticles);
			if (serialized) {
				localStorage.setItem(`bp_saved_${user.username}`, serialized);
			}
		}
	}, [savedArticles, user]);
}
