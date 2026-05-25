import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './authContext';
import { readLocalUser } from './readLocalUser';
import { readSavedArticles } from './readSavedArticles';
import { useAuthSync } from '../hooks/useAuthSync';
import { useLogin } from '../hooks/useLogin';
import { useRegister } from '../hooks/useRegister';
import { useArticleActions } from '../hooks/useArticleActions';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { listenForSessionSync } from '../security/sessionGuard';

/**
 * Top-level authentication context provider.
 * Manages the current user, saved articles, and auth operations (login / register / logout).
 * Also subscribes to cross-tab session events via BroadcastChannel so that
 * logging in or out in one tab is reflected immediately in all other open tabs.
 */
export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const initial = readLocalUser();
		return initial;
	});
	const [loading, setLoading] = useState(false);
	const [savedArticles, setSavedArticles] = useState(() => {
		const initial = readLocalUser();
		return readSavedArticles(initial?.username);
	});

	// Keep savedArticles in sync whenever the user or their storage changes.
	useAuthSync(user, savedArticles, setSavedArticles);

	useEffect(() => {
		// Listen for session events broadcast from other tabs.
		const session = listenForSessionSync(
			() => {
				// Another tab logged in — refresh local state from storage.
				const refreshed = readLocalUser();
				if (refreshed) {
					setUser(refreshed);
					setSavedArticles(readSavedArticles(refreshed.username));
				}
			},
			() => {
				// Another tab logged out — clear local state.
				setUser(null);
				setSavedArticles([]);
			},
		);
		return session;
	}, []);

	const login = useLogin(setUser, setSavedArticles, setLoading);
	const register = useRegister(setUser, setSavedArticles, setLoading);
	const updateUser = useUpdateUser(user, setUser, setLoading);
	const { saveArticle, unsaveArticle } = useArticleActions(user, setSavedArticles);

	const logout = useCallback(() => {
		setUser(null);
		setSavedArticles([]);
	}, []);

	const value = {
		user,
		loading,
		savedArticles,
		login,
		register,
		logout,
		updateUser,
		saveArticle,
		unsaveArticle,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
