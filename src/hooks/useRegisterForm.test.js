import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('react-router', () => ({
	useNavigate: () => vi.fn(),
}));

vi.mock('./useAuth', () => ({
	useAuth: () => ({
		register: vi.fn().mockResolvedValue({ success: false, message: 'Email зайнятий!' }),
		loading: false,
	}),
}));

import { useRegisterForm } from './useRegisterForm';

describe('useRegisterForm', () => {
	it('initialises with empty form fields', () => {
		const { result } = renderHook(() => useRegisterForm());
		expect(result.current.form.email).toBe('');
		expect(result.current.form.password).toBe('');
	});

	it('sets an email error for an invalid email', () => {
		const { result } = renderHook(() => useRegisterForm());
		act(() => {
			result.current.handleChange({ target: { name: 'email', value: 'invalid' } });
		});
		expect(result.current.errors.email).not.toBe('');
	});

	it('clears the email error for a valid email', () => {
		const { result } = renderHook(() => useRegisterForm());
		act(() => {
			result.current.handleChange({ target: { name: 'email', value: 'user@example.com' } });
		});
		expect(result.current.errors.email).toBe('');
	});

	it('sets a password error for a weak password', () => {
		const { result } = renderHook(() => useRegisterForm());
		act(() => {
			result.current.handleChange({ target: { name: 'password', value: 'weak' } });
		});
		expect(result.current.errors.password).not.toBe('');
	});

	it('marks isValid as false when required fields are empty', () => {
		const { result } = renderHook(() => useRegisterForm());
		expect(result.current.isValid).toBe(false);
	});

	it('sets authError when registration fails', async () => {
		const { result } = renderHook(() => useRegisterForm());
		await act(async () => {
			await result.current.handleSubmit({ preventDefault: vi.fn() });
		});
		expect(result.current.authError).toBe('Email зайнятий!');
	});
});
