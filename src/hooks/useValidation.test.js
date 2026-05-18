import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useValidation } from './useValidation';

describe('useValidation', () => {
	it('starts with an empty errors object', () => {
		const { result } = renderHook(() => useValidation());
		expect(result.current.errors).toEqual({});
	});

	it('sets isValid to true when there are no errors', () => {
		const { result } = renderHook(() => useValidation());
		expect(result.current.isValid).toBe(true);
	});

	it('records an error when validating an empty email', () => {
		const { result } = renderHook(() => useValidation());
		act(() => { result.current.validate('email', ''); });
		expect(result.current.errors.email).not.toBe('');
	});

	it('clears the error when a valid password is provided', () => {
		const { result } = renderHook(() => useValidation());
		act(() => { result.current.validate('password', ''); });
		act(() => { result.current.validate('password', 'Secret1'); });
		expect(result.current.errors.password).toBe('');
	});

	it('sets isValid to false when at least one error is active', () => {
		const { result } = renderHook(() => useValidation());
		act(() => { result.current.validate('email', ''); });
		expect(result.current.isValid).toBe(false);
	});

	it('clears all errors on resetErrors', () => {
		const { result } = renderHook(() => useValidation());
		act(() => { result.current.validate('email', ''); });
		act(() => { result.current.resetErrors(); });
		expect(result.current.errors).toEqual({});
		expect(result.current.isValid).toBe(true);
	});

	it('does not throw for an unknown field name', () => {
		const { result } = renderHook(() => useValidation());
		expect(() => {
			act(() => { result.current.validate('unknownField', 'value'); });
		}).not.toThrow();
	});
});
