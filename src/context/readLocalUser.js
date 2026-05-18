import { verifySession } from '../security/sessionGuard';
import { safeParse, isValidUserShape } from '../utils/sanitize';

export const readLocalUser = () => {
	try {
		const raw = localStorage.getItem('bp_user');
		if (!raw) return null;

		const user = safeParse(raw);
		if (!isValidUserShape(user)) {
			localStorage.removeItem('bp_user');
			return null;
		}

		if (!verifySession(user.username)) {
			localStorage.removeItem('bp_user');
			return null;
		}

		return user;
	} catch {
		return null;
	}
};
