export const readSavedArticles = (username) => {
	try {
		if (!username) return [];
		const string = localStorage.getItem(`bp_saved_${username}`);
		return string ? JSON.parse(string) : [];
	} catch {
		return [];
	}
};
