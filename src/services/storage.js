const TOKEN_KEY = 'bp_token';
const USER_KEY = 'bp_user';

export const storage = {
	getToken: () => localStorage.getItem(TOKEN_KEY),
	setToken: (token) => localStorage.setItem(TOKEN_KEY, token),

	getUser: () => {
		try {
			const user = localStorage.getItem(USER_KEY);
			return user ? JSON.parse(user) : null;
		} catch {
			localStorage.removeItem(USER_KEY);
			return null;
		}
	},
	setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

	clearAuth: () => {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	}
};
