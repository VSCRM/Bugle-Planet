import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditProfileForm } from './useEditProfileForm';

const mockUser = { username: 'user@example.com', nickname: 'OldNick' };

describe('useEditProfileForm', () => {
	it('initialises form with user nickname', () => {
		const { result } = renderHook(() => useEditProfileForm(mockUser, vi.fn()));
		expect(result.current.form.nickname).toBe('OldNick');
		expect(result.current.form.password).toBe('');
	});

	it('sets password error for weak password', () => {
		const { result } = renderHook(() => useEditProfileForm(mockUser, vi.fn()));
		act(() => {
			result.current.handleChange({ target: { name: 'password', value: 'weak' } });
		});
		expect(result.current.errors.password).not.toBe('');
		expect(result.current.isSubmitDisabled).toBe(true);
	});

	it('clears password error for empty value (optional field)', () => {
		const { result } = renderHook(() => useEditProfileForm(mockUser, vi.fn()));
		act(() => {
			result.current.handleChange({ target: { name: 'password', value: '' } });
		});
		expect(result.current.errors.password).toBe('');
	});

	it('does not call onSave when nothing changed', async () => {
		const onSave = vi.fn();
		const { result } = renderHook(() => useEditProfileForm(mockUser, onSave));
		await act(async () => {
			await result.current.handleSubmit({ preventDefault: vi.fn() });
		});
		expect(onSave).not.toHaveBeenCalled();
	});

	it('calls onSave with nickname when nickname changed', async () => {
		const onSave = vi.fn();
		const { result } = renderHook(() => useEditProfileForm(mockUser, onSave));
		act(() => {
			result.current.handleChange({ target: { name: 'nickname', value: 'NewNick' } });
		});
		await act(async () => {
			await result.current.handleSubmit({ preventDefault: vi.fn() });
		});
		expect(onSave).toHaveBeenCalledWith({ nickname: 'NewNick' });
	});

	it('calls onSave with password when password is valid and non-empty', async () => {
		const onSave = vi.fn();
		const { result } = renderHook(() => useEditProfileForm(mockUser, onSave));
		act(() => {
			result.current.handleChange({ target: { name: 'password', value: 'Secret1' } });
		});
		await act(async () => {
			await result.current.handleSubmit({ preventDefault: vi.fn() });
		});
		expect(onSave).toHaveBeenCalledWith({ password: 'Secret1' });
	});
});
