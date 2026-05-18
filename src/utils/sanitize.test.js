import { describe, it, expect } from 'vitest';
import {
	sanitizeText,
	sanitizeEmail,
	sanitizeNickname,
	sanitizeSearchQuery,
	safeStringify,
	safeParse,
	isValidUserShape,
} from './sanitize';

describe('sanitizeText', () => {
	it('trims whitespace', () => {
		expect(sanitizeText('  hello  ')).toBe('hello');
	});
	it('removes HTML tags', () => {
		expect(sanitizeText('<script>alert(1)</script>')).toBe('alert(1)');
	});
	it('removes javascript: URIs', () => {
		expect(sanitizeText('javascript:alert(1)')).not.toContain('javascript:');
	});
	it('removes data: URIs', () => {
		expect(sanitizeText('data:text/html,<h1>XSS</h1>')).not.toContain('data:');
	});
	it('removes null bytes', () => {
		expect(sanitizeText('admin\x00root')).toBe('adminroot');
	});
	it('trims to maxLength', () => {
		expect(sanitizeText('a'.repeat(300), 100).length).toBe(100);
	});
	it('returns empty string for non-string input', () => {
		expect(sanitizeText(null)).toBe('');
		expect(sanitizeText(undefined)).toBe('');
		expect(sanitizeText(123)).toBe('');
	});
	it('passes normal text through unchanged', () => {
		expect(sanitizeText('Hello, world!')).toBe('Hello, world!');
	});
});

describe('sanitizeEmail', () => {
	it('lowercases the value', () => {
		expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
	});
	it('trims whitespace', () => {
		expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com');
	});
	it('truncates at 254 characters', () => {
		const long = 'a'.repeat(250) + '@b.io';
		expect(sanitizeEmail(long).length).toBeLessThanOrEqual(254);
	});
});

describe('sanitizeNickname', () => {
	it('allows Latin, Cyrillic, spaces, hyphens, underscores', () => {
		expect(sanitizeNickname('Bug-Editor_2')).toBe('Bug-Editor_2');
	});
	it('removes angle brackets', () => {
		const result = sanitizeNickname('Bug<script>');
		expect(result).not.toContain('<');
		expect(result).not.toContain('>');
	});
});

describe('sanitizeSearchQuery', () => {
	it('allows Cyrillic text', () => {
		expect(sanitizeSearchQuery('новини 2026')).toBe('новини 2026');
	});
	it('removes HTML tags', () => {
		expect(sanitizeSearchQuery('<b>test</b>')).toBe('test');
	});
	it('truncates at 200 chars', () => {
		expect(sanitizeSearchQuery('x'.repeat(300)).length).toBeLessThanOrEqual(200);
	});
});

describe('safeStringify', () => {
	it('serialises a plain object to JSON', () => {
		expect(safeStringify({ a: 1 })).toBe('{"a":1}');
	});
	it('returns null for circular references', () => {
		const obj = {};
		obj.self = obj;
		expect(safeStringify(obj)).toBeNull();
	});
});

describe('safeParse', () => {
	it('parses valid JSON', () => {
		expect(safeParse('{"username":"user@example.com"}')).toEqual({ username: 'user@example.com' });
	});
	it('returns null for invalid JSON', () => {
		expect(safeParse('{broken}')).toBeNull();
	});
	it('returns null for null/undefined', () => {
		expect(safeParse(null)).toBeNull();
		expect(safeParse(undefined)).toBeNull();
	});
});

describe('isValidUserShape', () => {
	it('returns true for valid shape with email username', () => {
		expect(isValidUserShape({ username: 'user@example.com', nickname: 'Ed' })).toBe(true);
	});
	it('returns true when only username is present', () => {
		expect(isValidUserShape({ username: 'user@example.com' })).toBe(true);
	});
	it('returns false for null', () => {
		expect(isValidUserShape(null)).toBe(false);
	});
	it('returns false when username is not a string', () => {
		expect(isValidUserShape({ username: 123 })).toBe(false);
	});
	it('returns false when extra fields like bcryptHash exist', () => {
		expect(isValidUserShape({ username: 'user@example.com', bcryptHash: 'xxx' })).toBe(false);
	});
	it('returns false for empty object', () => {
		expect(isValidUserShape({})).toBe(false);
	});
});
