import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readLocalUser } from './readLocalUser';
import { createSession, clearSession } from '../security/sessionGuard';

beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
	if (!globalThis.crypto?.randomUUID) {
		vi.stubGlobal('crypto', {
			randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2),
		});
	}
});

describe('readLocalUser', () => {
	it('returns null if localStorage is empty', () => {
		expect(readLocalUser()).toBeNull();
	});

	it('returns null if session is not verified (e.g., copied localStorage context)', () => {
		localStorage.setItem('bp_user', JSON.stringify({ username: 'Admin', nickname: 'Ed' }));
		expect(readLocalUser()).toBeNull();
	});

	it('returns user data after createSession is called', () => {
		createSession('Admin');
		localStorage.setItem('bp_user', JSON.stringify({ username: 'Admin', nickname: 'Ed' }));
		const user = readLocalUser();
		expect(user).not.toBeNull();
		expect(user.username).toBe('Admin');
	});

	it('returns null after clearSession has been executed', () => {
		createSession('Admin');
		localStorage.setItem('bp_user', JSON.stringify({ username: 'Admin', nickname: 'Ed' }));
		clearSession();
		expect(readLocalUser()).toBeNull();
	});

	it('returns null if JSON is invalid', () => {
		localStorage.setItem('bp_user', '{"broken":json}');
		expect(readLocalUser()).toBeNull();
	});

	it('wipes localStorage data if the shape structure is incorrect', () => {
		localStorage.setItem('bp_user', JSON.stringify({ bcryptHash: 'xxx' }));
		readLocalUser();
		expect(localStorage.getItem('bp_user')).toBeNull();
	});

	it('returns null if bcryptHash compromises the object (leak protection)', () => {
		createSession('Admin');
		localStorage.setItem('bp_user', JSON.stringify({
			username: 'Admin',
			nickname: 'Ed',
			bcryptHash: 'should-not-be-here',
		}));
		expect(readLocalUser()).toBeNull();
	});
});
