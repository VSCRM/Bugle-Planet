import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortControl } from './SortControl';

describe('SortControl', () => {
	it('shows "Спаданням" when order="desc"', () => {
		render(<SortControl order="desc" onToggle={() => { }} />);
		expect(screen.getByText('Спаданням')).toBeInTheDocument();
	});

	it('shows "Зростанням" when order="asc"', () => {
		render(<SortControl order="asc" onToggle={() => { }} />);
		expect(screen.getByText('Зростанням')).toBeInTheDocument();
	});

	it('invokes onToggle upon clicking the button', () => {
		const onToggle = vi.fn();
		render(<SortControl order="desc" onToggle={onToggle} />);
		fireEvent.click(screen.getByRole('button'));
		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it('has an aria-label indicating the current sorting mode', () => {
		render(<SortControl order="asc" onToggle={() => { }} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Сортування: Зростанням');
	});

	it('updates aria-label dynamically for desc order', () => {
		render(<SortControl order="desc" onToggle={() => { }} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Сортування: Спаданням');
	});

	it('renders without breaking for any allowed order value', () => {
		expect(() =>
			render(<SortControl order="desc" onToggle={() => { }} />)
		).not.toThrow();
	});
});
