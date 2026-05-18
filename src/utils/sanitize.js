export const FIELD_LIMITS = {
	email: 254,
	nickname: 32,
	password: 128,
	search: 200,
};

export function sanitizeText(value, maxLength = 200) {
	if (typeof value !== 'string') return '';

	const stripped = Array.from(value.trim().slice(0, maxLength))
		.filter((ch) => {
			const c = ch.charCodeAt(0);
			return !((c <= 8) || c === 11 || c === 12 || (c >= 14 && c <= 31) || c === 127);
		})
		.join('');

	return stripped
		.replace(/<[^>]*>/g, '')
		.replace(/javascript\s*:/gi, '')
		.replace(/data\s*:/gi, '');
}

export function sanitizeEmail(value) {
	return sanitizeText(value, FIELD_LIMITS.email).toLowerCase().trim();
}

export function sanitizeNickname(value) {
	return sanitizeText(value, FIELD_LIMITS.nickname).replace(/[^a-zA-Z0-9 _\-а-яА-ЯіІїЇєЄ]/g, '');
}

export function sanitizeSearchQuery(value) {
	return sanitizeText(value, FIELD_LIMITS.search);
}

export function safeStringify(data) {
	try {
		return JSON.stringify(data);
	} catch {
		return null;
	}
}

export function safeParse(raw) {
	if (!raw || typeof raw !== 'string') return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function isValidUserShape(user) {
	if (!user || typeof user !== 'object') return false;
	if (typeof user.username !== 'string') return false;
	if (user.username.length < 1 || user.username.length > FIELD_LIMITS.email) return false;
	const allowed = new Set(['username', 'nickname']);
	return Object.keys(user).every((k) => allowed.has(k));
}
