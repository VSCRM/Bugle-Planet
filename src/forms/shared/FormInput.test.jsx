import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from './FormInput';

describe('FormInput', () => {
	it('renders placeholder text', () => {
		render(<FormInput name="email" placeholder="EMAIL" value="" onChange={() => { }} />);
		expect(screen.getByPlaceholderText('EMAIL')).toBeInTheDocument();
	});

	it('renders error message when error prop is set', () => {
		render(<FormInput name="email" value="" error="Невірний email" onChange={() => { }} />);
		expect(screen.getByText('Невірний email')).toBeInTheDocument();
	});

	it('does not render error element when no error', () => {
		render(<FormInput name="email" value="" onChange={() => { }} />);
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('calls onChange when user types', async () => {
		const onChange = vi.fn();
		render(<FormInput name="email" value="" onChange={onChange} />);
		await userEvent.type(screen.getByRole('textbox'), 'a');
		expect(onChange).toHaveBeenCalled();
	});

	it('renders label when provided', () => {
		render(<FormInput name="email" label="Email" value="" onChange={() => { }} />);
		expect(screen.getByText('Email')).toBeInTheDocument();
	});
});
