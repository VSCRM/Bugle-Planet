import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
	it('renders the message text', () => {
		render(<Toast message="Збережено!" onClose={vi.fn()} />);
		expect(screen.getByText('Збережено!')).toBeInTheDocument();
	});

	it('calls onClose when the close button is clicked', async () => {
		const onClose = vi.fn();
		render(<Toast message="Збережено!" onClose={onClose} />);
		await userEvent.click(screen.getByRole('button', { name: /закрити/i }));
		expect(onClose).toHaveBeenCalled();
	});

	it('has the correct aria-live attribute for screen readers', () => {
		render(<Toast message="Test" onClose={vi.fn()} />);
		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});
