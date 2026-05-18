import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	checkRateLimit,
	recordFailedAttempt,
	clearRateLimit,
	getRemainingAttempts,
} from './rateLimiter';

beforeEach(() => {
	localStorage.clear();
	vi.useRealTimers();
});

describe('rateLimiter', () => {
	describe('checkRateLimit', () => {
		it('returns null if there were no attempts', () => {
			expect(checkRateLimit('Admin')).toBeNull();
		});

		it('returns null if there are fewer than 5 attempts', () => {
			recordFailedAttempt('Admin');
			recordFailedAttempt('Admin');
			expect(checkRateLimit('Admin')).toBeNull();
		});

		it('returns a lockout message after 5 attempts', () => {
			for (let i = 0; i < 5; i++) recordFailedAttempt('Admin');
			expect(checkRateLimit('Admin')).toMatch(/Забагато спроб/);
		});

		it('does not block different users independently', () => {
			for (let i = 0; i < 5; i++) recordFailedAttempt('Alice');
			expect(checkRateLimit('Bob')).toBeNull();
		});

		it('message contains the amount of minutes remaining', () => {
			for (let i = 0; i < 5; i++) recordFailedAttempt('Admin');
			const msg = checkRateLimit('Admin');
			expect(msg).toMatch(/\d+ хв/);
		});
	});

	describe('recordFailedAttempt', () => {
		it('increments the attempt counter', () => {
			expect(getRemainingAttempts('Admin')).toBe(5);
			recordFailedAttempt('Admin');
			expect(getRemainingAttempts('Admin')).toBe(4);
		});

		it('remains 0 after 5 attempts', () => {
			for (let i = 0; i < 5; i++) recordFailedAttempt('Admin');
			expect(getRemainingAttempts('Admin')).toBe(0);
		});
	});

	describe('clearRateLimit', () => {
		it('resets the counter after a successful login', () => {
			for (let i = 0; i < 3; i++) recordFailedAttempt('Admin');
			clearRateLimit('Admin');
			expect(getRemainingAttempts('Admin')).toBe(5);
		});

		it('returns null for checkRateLimit after clearing', () => {
			for (let i = 0; i < 5; i++) recordFailedAttempt('Admin');
			clearRateLimit('Admin');
			expect(checkRateLimit('Admin')).toBeNull();
		});
	});

	describe('getRemainingAttempts', () => {
		it('returns 5 if there were no attempts', () => {
			expect(getRemainingAttempts('Admin')).toBe(5);
		});

		it('correctly counts down after each attempt', () => {
			recordFailedAttempt('Admin');
			expect(getRemainingAttempts('Admin')).toBe(4);
			recordFailedAttempt('Admin');
			expect(getRemainingAttempts('Admin')).toBe(3);
		});

		it('returns 0 during a lockout', () => {
			for (let i = 0; i < 5; i++) recordFailedAttempt('Admin');
			expect(getRemainingAttempts('Admin')).toBe(0);
		});
	});
});
