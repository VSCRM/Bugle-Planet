import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('../../hooks/useRegisterForm', () => ({
	useRegisterForm: () => ({
		form: { email: '', nickname: '', password: '' },
		errors: {},
		authError: '',
		loading: false,
		isValid: false,
		handleChange: vi.fn(),
		handleSubmit: vi.fn(),
	}),
}));

import { RegisterForm } from './RegisterForm';

describe('RegisterForm', () => {
	const renderForm = () => render(<MemoryRouter><RegisterForm /></MemoryRouter>);

	it('renders email, nickname and password inputs', () => {
		renderForm();
		expect(screen.getByPlaceholderText('EMAIL')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('НІКНЕЙМ')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('ПАРОЛЬ')).toBeInTheDocument();
	});

	it('renders the submit button', () => {
		renderForm();
		expect(screen.getByRole('button', { name: /зареєструватися/i })).toBeInTheDocument();
	});

	it('renders link to login page', () => {
		renderForm();
		expect(screen.getByText('Вже є акаунт?')).toBeInTheDocument();
	});
});
