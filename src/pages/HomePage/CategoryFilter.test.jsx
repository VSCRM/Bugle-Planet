import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryFilter } from './CategoryFilter';

const CATEGORIES = ['All', 'Sport', 'Culture'];

describe('CategoryFilter', () => {
	it('renders all categories successfully', () => {
		render(
			<CategoryFilter categories={CATEGORIES} activeCategory="All" onSelect={() => { }} />,
		);
		CATEGORIES.forEach((category) => expect(screen.getByText(category)).toBeInTheDocument());
	});

	it('calls onSelect with the correct value when clicked', () => {
		const onSelect = vi.fn();
		render(
			<CategoryFilter categories={CATEGORIES} activeCategory="All" onSelect={onSelect} />,
		);

		fireEvent.click(screen.getByText('Sport'));
		expect(onSelect).toHaveBeenCalledWith('Sport');
		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it('applies the btnActive class to the active category button', () => {
		const { container } = render(
			<CategoryFilter categories={CATEGORIES} activeCategory="Sport" onSelect={() => { }} />,
		);

		const buttons = container.querySelectorAll('button');
		const sportButton = [...buttons].find((btn) => btn.textContent === 'Sport');
		expect(sportButton.className).toMatch(/btnActive/);
	});

	it('does not apply the btnActive class to inactive buttons', () => {
		const { container } = render(
			<CategoryFilter categories={CATEGORIES} activeCategory="All" onSelect={() => { }} />,
		);

		const buttons = container.querySelectorAll('button');
		const sportButton = [...buttons].find((btn) => btn.textContent === 'Sport');
		expect(sportButton.className).not.toMatch(/btnActive/);
	});
});
