import {useState, useCallback, useEffect, type ReactNode} from "react";
import {AuthContext, type AuthContextValue} from "./authContext";
import {readLocalUser} from "./readLocalUser";
import {readSavedArticles} from "./readSavedArticles";
import {useAuthSync} from "../hooks/useAuthSync";
import {useLogin} from "../hooks/useLogin";
import {useRegister} from "../hooks/useRegister";
import {useArticleActions} from "../hooks/useArticleActions";
import {useUpdateUser} from "../hooks/useUpdateUser";
import {listenForSessionSync} from "../security/sessionGuard";
import type {User, Article} from "../schemas";

interface AuthProviderProps {
	children: ReactNode;
}

/**
 * Top-level authentication context provider.
 * Manages the current user, saved articles, and auth operations.
 * Subscribes to cross-tab session events via BroadcastChannel so that
 * logging in/out in one tab is immediately reflected in all others.
 */
export function AuthProvider({
	children,
}: AuthProviderProps): React.ReactElement {
	const [user, setUser] = useState<User | null>(() => readLocalUser());
	const [loading, setLoading] = useState<boolean>(false);
	const [savedArticles, setSavedArticles] = useState<Article[]>(() =>
		readSavedArticles(readLocalUser()?.username),
	);

	// Keep savedArticles in sync whenever the user or their storage changes.
	useAuthSync(user, savedArticles, setSavedArticles);

	useEffect(() => {
		// Listen for session events broadcast from other tabs.
		const cleanup = listenForSessionSync(
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
		return cleanup;
	}, []);

	const login = useLogin(setUser, setSavedArticles, setLoading);
	const register = useRegister(setUser, setSavedArticles, setLoading);
	const updateUser = useUpdateUser(user, setUser, setLoading);
	const {saveArticle, unsaveArticle} = useArticleActions(
		user,
		setSavedArticles,
	);

	const logout = useCallback(() => {
		setUser(null);
		setSavedArticles([]);
	}, []);

	const value: AuthContextValue = {
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
