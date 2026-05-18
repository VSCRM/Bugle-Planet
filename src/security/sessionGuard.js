import CryptoJS from 'crypto-js';

const SK_KEY = 'bp_sk';
const SIG_KEY = 'bp_as';
const BC_CHANNEL = 'bp_auth_bc';

function signSession(username, sessionKey) {
	return CryptoJS.SHA256(`${username}:${sessionKey}:bugle-planet-v1`).toString();
}

export function createSession(username) {
	const sessionKey = crypto.randomUUID();
	sessionStorage.setItem(SK_KEY, sessionKey);
	localStorage.setItem(SIG_KEY, signSession(username, sessionKey));

	try {
		const bc = new BroadcastChannel(BC_CHANNEL);
		bc.postMessage({ type: 'SESSION_CREATED', key: sessionKey, username });
		bc.close();
	} catch {
		//
	}
}

export function verifySession(username) {
	try {
		const sessionKey = sessionStorage.getItem(SK_KEY);
		const storedSig = localStorage.getItem(SIG_KEY);
		if (!sessionKey || !storedSig || !username) return false;
		return signSession(username, sessionKey) === storedSig;
	} catch {
		return false;
	}
}

export function clearSession() {
	sessionStorage.removeItem(SK_KEY);
	localStorage.removeItem(SIG_KEY);
	try {
		const bc = new BroadcastChannel(BC_CHANNEL);
		bc.postMessage({ type: 'SESSION_CLEARED' });
		bc.close();
	} catch {
		//
	}
}

export function listenForSessionSync(onSessionRestored, onSessionCleared) {
	try {
		const bc = new BroadcastChannel(BC_CHANNEL);

		bc.onmessage = (event) => {
			const { type, key, username } = event.data ?? {};

			if (type === 'SESSION_CREATED' && key && username) {
				sessionStorage.setItem(SK_KEY, key);
				onSessionRestored?.();
			}

			if (type === 'SESSION_CLEARED') {
				sessionStorage.removeItem(SK_KEY);
				onSessionCleared?.();
			}

			if (type === 'REQUEST_SESSION_KEY') {
				const sk = sessionStorage.getItem(SK_KEY);
				if (sk) {
					bc.postMessage({ type: 'SESSION_KEY_RESPONSE', key: sk });
				}
			}

			if (type === 'SESSION_KEY_RESPONSE' && event.data.key) {
				sessionStorage.setItem(SK_KEY, event.data.key);
				onSessionRestored?.();
			}
		};

		const sk = sessionStorage.getItem(SK_KEY);
		if (!sk) {
			bc.postMessage({ type: 'REQUEST_SESSION_KEY' });
		}

		return () => bc.close();
	} catch {
		return () => { };
	}
}
