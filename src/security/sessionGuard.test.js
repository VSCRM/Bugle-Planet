import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSession, verifySession, clearSession } from './sessionGuard';

beforeEach(() => {
	if (!globalThis.crypto?.randomUUID) {
		vi.stubGlobal('crypto', {
			randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2),
		});
	}
	localStorage.clear();
	sessionStorage.clear();
});

afterEach(() => {
	localStorage.clear();
	sessionStorage.clear();
	vi.restoreAllMocks();
});

describe('sessionGuard', () => {
	describe('createSession', () => {
		it('stores sessionKey in sessionStorage', () => {
			createSession('Admin');
			expect(sessionStorage.getItem('bp_sk')).not.toBeNull();
		});

		it('stores signature in localStorage', () => {
			createSession('Admin');
			expect(localStorage.getItem('bp_as')).not.toBeNull();
		});

		it('generates unique keys for different calls', () => {
			createSession('Admin');
			const key1 = sessionStorage.getItem('bp_sk');
			clearSession();
			createSession('Admin');
			const key2 = sessionStorage.getItem('bp_sk');
			expect(key1).not.toBe(key2);
		});

		it('generates different signatures for different users with the same sessionKey', () => {
			vi.stubGlobal('crypto', { randomUUID: () => 'fixed-key' });
			createSession('Alice');
			const sigAlice = localStorage.getItem('bp_as');
			clearSession();
			createSession('Bob');
			const sigBob = localStorage.getItem('bp_as');
			expect(sigAlice).not.toBe(sigBob);
		});
	});

	describe('verifySession', () => {
		it('returns true after createSession with the same username', () => {
			createSession('Admin');
			expect(verifySession('Admin')).toBe(true);
		});

		it('returns false if sessionStorage is empty (e.g., copied localStorage context)', () => {
			createSession('Admin');
			sessionStorage.clear();
			expect(verifySession('Admin')).toBe(false);
		});

		it('returns false for a different username', () => {
			createSession('Admin');
			expect(verifySession('Hacker')).toBe(false);
		});

		it('returns false if the signature in localStorage is spoofed', () => {
			createSession('Admin');
			localStorage.setItem('bp_as', 'fake-signature-aaabbbccc');
			expect(verifySession('Admin')).toBe(false);
		});

		it('returns false if username is empty', () => {
			createSession('Admin');
			expect(verifySession('')).toBe(false);
		});

		it('returns false if nothing is saved', () => {
			expect(verifySession('Admin')).toBe(false);
		});
	});

	describe('clearSession', () => {
		it('removes sessionKey from sessionStorage', () => {
			createSession('Admin');
			clearSession();
			expect(sessionStorage.getItem('bp_sk')).toBeNull();
		});

		it('removes signature from localStorage', () => {
			createSession('Admin');
			clearSession();
			expect(localStorage.getItem('bp_as')).toBeNull();
		});

		it('returns false for verifySession after clearSession is invoked', () => {
			createSession('Admin');
			clearSession();
			expect(verifySession('Admin')).toBe(false);
		});
	});
});
