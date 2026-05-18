import { describe, it, expect } from 'vitest';
import { hashPassword } from './hashPassword';

describe('hashPassword', () => {
	it('returns a string type', () => {
		expect(typeof hashPassword('mypassword')).toBe('string');
	});

	it('returns a 64-character hex string (SHA-256 standard)', () => {
		expect(hashPassword('secret').length).toBe(64);
	});

	it('produces the exact same hash for identical passwords (determinism)', () => {
		expect(hashPassword('password123')).toBe(hashPassword('password123'));
	});

	it('produces completely different hashes for different passwords', () => {
		expect(hashPassword('pass1')).not.toBe(hashPassword('pass2'));
	});

	it('does not include the plaintext password in the generated hash', () => {
		const hash = hashPassword('mysecret');
		expect(hash).not.toContain('mysecret');
	});

	it('hashes an empty string successfully without throwing errors', () => {
		expect(() => hashPassword('')).not.toThrow();
	});
});
