import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('../../hooks/useLoginForm', () => ({
	useLoginForm: () => ({
		email: '',
		password: '',
		emailError: '',
		authError: '',
		loading: false,
		resetSuccess: false,
		setEmail: vi.fn(),
		setPassword: vi.fn(),
		setEmailError: vi.fn(),
		handleSubmit: vi.fn((event) => event.preventDefault()),
	}),
}));

import { LoginForm } from './LoginForm';

const renderForm = () =>
	render(<MemoryRouter><LoginForm /></MemoryRouter>);

describe('LoginForm', () => {
	it('renders the email input', () => {
		renderForm();
		expect(screen.getByPlaceholderText('EMAIL')).toBeInTheDocument();
	});

	it('renders the password input', () => {
		renderForm();
		expect(screen.getByPlaceholderText('ПАРОЛЬ')).toBeInTheDocument();
	});

	it('renders the primary УВІЙТИ submit button', () => {
		renderForm();
		// Use getAllByRole to handle the Google button which also contains the word
		const buttons = screen.getAllByRole('button');
		const submitBtn = buttons.find((btn) => btn.type === 'submit');
		expect(submitBtn).toBeInTheDocument();
		expect(submitBtn).toHaveTextContent('УВІЙТИ');
	});

	it('submit button is disabled when email and password are empty', () => {
		renderForm();
		const submitBtn = screen.getAllByRole('button').find((btn) => btn.type === 'submit');
		expect(submitBtn).toBeDisabled();
	});

	it('renders the forgot-password link', () => {
		renderForm();
		expect(screen.getByText('Забули пароль?')).toBeInTheDocument();
	});

	it('renders the create-account link', () => {
		renderForm();
		expect(screen.getByText('Створити акаунт')).toBeInTheDocument();
	});
});
