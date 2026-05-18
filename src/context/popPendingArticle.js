export const popPendingArticle = () => {
	try {
		const raw = sessionStorage.getItem('bp_pending_save');
		if (!raw) return null;
		sessionStorage.removeItem('bp_pending_save');
		return JSON.parse(raw);
	} catch {
		return null;
	}
};
