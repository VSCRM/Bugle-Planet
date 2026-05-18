import { describe, it, expect } from 'vitest';
import {
	validateEmail,
	validateNickname,
	validatePassword,
	validatePasswordOptional,
	getPasswordStrength,
} from './validation';

describe('validateEmail', () => {
	it('returns error for empty value', () => {
		expect(validateEmail('')).not.toBe('');
	});
	it('returns error for missing @', () => {
		expect(validateEmail('notanemail')).not.toBe('');
	});
	it('returns error for missing domain', () => {
		expect(validateEmail('user@')).not.toBe('');
	});
	it('returns empty string for valid email', () => {
		expect(validateEmail('user@example.com')).toBe('');
	});
	it('accepts subdomain email', () => {
		expect(validateEmail('user@mail.example.com')).toBe('');
	});
	it('returns error for email exceeding 254 chars', () => {
		expect(validateEmail('a'.repeat(250) + '@b.com')).not.toBe('');
	});
});

describe('validateNickname', () => {
	it('returns error for empty value', () => {
		expect(validateNickname('')).not.toBe('');
	});
	it('returns error for single character', () => {
		expect(validateNickname('A')).not.toBe('');
	});
	it('returns empty string for valid nickname', () => {
		expect(validateNickname('BugPlanet')).toBe('');
	});
	it('returns error for nickname longer than 32 chars', () => {
		expect(validateNickname('A'.repeat(33))).not.toBe('');
	});
});

describe('validatePassword', () => {
	it('returns error for empty value', () => {
		expect(validatePassword('')).not.toBe('');
	});
	it('returns error for fewer than 6 chars', () => {
		expect(validatePassword('Ab1')).not.toBe('');
	});
	it('returns error when no uppercase letter', () => {
		expect(validatePassword('secret1')).not.toBe('');
	});
	it('returns error when no digit', () => {
		expect(validatePassword('SecretAbc')).not.toBe('');
	});
	it('returns empty string for valid password', () => {
		expect(validatePassword('Secret1')).toBe('');
	});
	it('accepts password with special characters', () => {
		expect(validatePassword('Secret1!')).toBe('');
	});
});

describe('validatePasswordOptional', () => {
	it('returns empty string for empty value (field is optional)', () => {
		expect(validatePasswordOptional('')).toBe('');
	});
	it('returns error for non-empty invalid password', () => {
		expect(validatePasswordOptional('weak')).not.toBe('');
	});
	it('returns empty string for valid non-empty password', () => {
		expect(validatePasswordOptional('Secret1')).toBe('');
	});
});

describe('getPasswordStrength', () => {
	it('returns null for empty string', () => {
		expect(getPasswordStrength('')).toBeNull();
	});
	it('returns weak for short simple password', () => {
		expect(getPasswordStrength('abc').level).toBe('weak');
	});
	it('returns medium for moderate password', () => {
		expect(getPasswordStrength('Secret1').level).toBe('medium');
	});
	it('returns strong for complex password', () => {
		expect(getPasswordStrength('SecretAbc1!').level).toBe('strong');
	});
});
