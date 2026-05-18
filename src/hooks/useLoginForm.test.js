import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('react-router', () => ({
	useNavigate: () => vi.fn(),
	useLocation: () => ({ state: null, pathname: '/login' }),
}));

vi.mock('./useAuth', () => ({
	useAuth: () => ({
		login: vi.fn().mockResolvedValue({ success: false, message: 'Невірний пароль!' }),
		loading: false,
	}),
}));

import { useLoginForm } from './useLoginForm';

describe('useLoginForm', () => {
	it('initialises with empty fields and no errors', () => {
		const { result } = renderHook(() => useLoginForm());
		expect(result.current.email).toBe('');
		expect(result.current.password).toBe('');
		expect(result.current.authError).toBe('');
	});

	it('sets authError when login fails', async () => {
		const { result } = renderHook(() => useLoginForm());
		await act(async () => {
			await result.current.handleSubmit({ preventDefault: vi.fn() });
		});
		expect(result.current.authError).toBe('Невірний пароль!');
	});
});
