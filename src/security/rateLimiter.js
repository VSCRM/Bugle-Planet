const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

function getKey(username) {
	return `bp_rl_${username}`;
}

function getRecord(username) {
	try {
		const raw = localStorage.getItem(getKey(username));
		return raw ? JSON.parse(raw) : { attempts: 0, blockedUntil: 0 };
	} catch {
		return { attempts: 0, blockedUntil: 0 };
	}
}

function saveRecord(username, record) {
	try {
		localStorage.setItem(getKey(username), JSON.stringify(record));
	} catch {
		//
	}
}

export function checkRateLimit(username) {
	const record = getRecord(username);
	const now = Date.now();

	if (record.blockedUntil > now) {
		const remainingMs = record.blockedUntil - now;
		const minutes = Math.ceil(remainingMs / 60_000);
		return `Забагато спроб. Спробуйте через ${minutes} хв.`;
	}

	if (record.blockedUntil > 0 && record.blockedUntil <= now) {
		saveRecord(username, { attempts: 0, blockedUntil: 0 });
	}

	return null;
}

export function recordFailedAttempt(username) {
	const record = getRecord(username);
	const attempts = record.attempts + 1;

	if (attempts >= MAX_ATTEMPTS) {
		saveRecord(username, {
			attempts,
			blockedUntil: Date.now() + BLOCK_DURATION_MS,
		});
	} else {
		saveRecord(username, { attempts, blockedUntil: 0 });
	}
}

export function clearRateLimit(username) {
	try {
		localStorage.removeItem(getKey(username));
	} catch {
		//
	}
}

export function getRemainingAttempts(username) {
	const record = getRecord(username);
	if (record.blockedUntil > Date.now()) return 0;
	return Math.max(0, MAX_ATTEMPTS - record.attempts);
}
