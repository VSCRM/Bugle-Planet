import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
	it('returns a string type', () => {
		expect(typeof formatDate()).toBe('string');
	});

	it('contains a 4-digit year format', () => {
		const result = formatDate(new Date(2026, 4, 16)); // May 16, 2026
		expect(result).toMatch(/2026/);
	});

	it('contains the localized Ukrainian month name', () => {
		const result = formatDate(new Date(2026, 0, 1)); // January
		expect(result).toContain('Січня');
	});

	it('contains the correct localized day of the week', () => {
		// May 16, 2026 was a Saturday
		const result = formatDate(new Date(2026, 4, 16));
		expect(result).toContain('Субота');
	});

	it('accepts a valid date string as an argument', () => {
		const result = formatDate('2026-01-01');
		expect(result).toContain('Січня');
		expect(result).toContain('2026');
	});

	it('returns the current date by default without throwing errors', () => {
		expect(() => formatDate()).not.toThrow();
	});
});
