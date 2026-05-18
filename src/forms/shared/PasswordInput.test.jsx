import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
	it('renders a password-type input by default', () => {
		render(<PasswordInput value="" onChange={() => { }} />);
		// password inputs have no implicit ARIA role — query by DOM directly
		expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
	});

	it('switches to text type when the eye button is clicked', async () => {
		render(<PasswordInput value="" onChange={() => { }} />);
		const input = document.querySelector('input');
		expect(input).toHaveAttribute('type', 'password');
		await userEvent.click(screen.getByRole('button'));
		expect(input).toHaveAttribute('type', 'text');
	});

	it('shows an error message when the error prop is set', () => {
		render(<PasswordInput value="" error="Потрібна велика літера" onChange={() => { }} />);
		expect(screen.getByText('Потрібна велика літера')).toBeInTheDocument();
	});

	it('renders a label when the label prop is provided', () => {
		render(<PasswordInput value="" label="Пароль" onChange={() => { }} />);
		expect(screen.getByText('Пароль')).toBeInTheDocument();
	});

	it('sets aria-pressed on the toggle button', async () => {
		render(<PasswordInput value="" onChange={() => { }} />);
		const btn = screen.getByRole('button');
		expect(btn).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(btn);
		expect(btn).toHaveAttribute('aria-pressed', 'true');
	});
});
