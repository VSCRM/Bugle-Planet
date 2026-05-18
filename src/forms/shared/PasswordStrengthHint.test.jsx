import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrengthHint } from './PasswordStrengthHint';

describe('PasswordStrengthHint', () => {
	it('renders nothing for empty value', () => {
		const { container } = render(<PasswordStrengthHint value="" />);
		expect(container.firstChild).toBeNull();
	});

	it('shows all three rules when value is provided', () => {
		render(<PasswordStrengthHint value="a" />);
		expect(screen.getByText('Мінімум 6 символів')).toBeInTheDocument();
		expect(screen.getByText('Хоча б одна велика літера')).toBeInTheDocument();
		expect(screen.getByText('Хоча б одна цифра')).toBeInTheDocument();
	});

	it('shows Weak label for simple passwords', () => {
		render(<PasswordStrengthHint value="abc" />);
		expect(screen.getByText('Слабкий')).toBeInTheDocument();
	});

	it('shows Strong label for complex passwords', () => {
		render(<PasswordStrengthHint value="SecretAbc1!" />);
		expect(screen.getByText('Надійний')).toBeInTheDocument();
	});
});
