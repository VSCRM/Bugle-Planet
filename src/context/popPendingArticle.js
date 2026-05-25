/** Returns true only when the parsed value looks like an article object. */
function isValidArticle(value) {
	return (
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		typeof value.id !== 'undefined' &&
		typeof value.title === 'string'
	);
}

export const popPendingArticle = () => {
	try {
		const raw = sessionStorage.getItem('bp_pending_save');
		if (!raw) return null;
		sessionStorage.removeItem('bp_pending_save');
		const parsed = JSON.parse(raw);
		return isValidArticle(parsed) ? parsed : null;
	} catch {
		return null;
	}
};
