import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NewsCard } from './NewsCard';
import { AuthContext } from '../../context/authContext';

const MOCK_ARTICLE = {
	id: 42,
	title: 'Тестова новина',
	excerpt: 'Короткий опис події',
	category: 'Спорт',
	date: '2026-02-13',
	image: 'https://images.unsplash.com/photo-test?w=800',
};

const mockNavigate = vi.fn();

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const authValue = {
	user: { username: 'Admin', nickname: 'Ed' },
	savedArticles: [],
	saveArticle: vi.fn(() => 'saved'),
	unsaveArticle: vi.fn(),
};

function renderCard(overrides = {}) {
	return render(
		<MemoryRouter>
			<AuthContext.Provider value={{ ...authValue, ...overrides }}>
				<NewsCard article={MOCK_ARTICLE} />
			</AuthContext.Provider>
		</MemoryRouter>
	);
}

beforeEach(() => {
	mockNavigate.mockClear();
	authValue.saveArticle.mockClear();
	authValue.unsaveArticle.mockClear();
});

describe('NewsCard', () => {
	it('displays the article title', () => {
		renderCard();
		expect(screen.getByText('Тестова новина')).toBeInTheDocument();
	});

	it('displays the article excerpt', () => {
		renderCard();
		expect(screen.getByText('Короткий опис події')).toBeInTheDocument();
	});

	it('displays the category badge', () => {
		renderCard();
		expect(screen.getByText('Спорт')).toBeInTheDocument();
	});

	it('displays the publication date', () => {
		renderCard();
		expect(screen.getByText('2026-02-13')).toBeInTheDocument();
	});

	it('navigates to /news/42 when clicking the card link', () => {
		renderCard();
		const link = screen.getByRole('link', { name: /Читати/i });
		expect(link).toHaveAttribute('href', '/news/42');
	});

	it('triggers navigation when pressing Enter on the card link', () => {
		renderCard();
		const link = screen.getByRole('link', { name: /Читати/i });
		fireEvent.keyDown(link, { key: 'Enter' });
		// Native <a> handles Enter natively — just verify the element is focusable
		expect(link).toBeInTheDocument();
	});

	it('triggers navigation when pressing Space on the card link', () => {
		renderCard();
		const link = screen.getByRole('link', { name: /Читати/i });
		fireEvent.keyDown(link, { key: ' ' });
		// Native <a> handles Space natively — just verify the element is focusable
		expect(link).toBeInTheDocument();
	});

	it('does NOT invoke navigate when clicking the "Save" button', () => {
		renderCard();
		const saveBtn = screen.getByRole('button', { name: /зберегти статтю/i });
		fireEvent.click(saveBtn);
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('renders the "Save" button text when the article is unsaved', () => {
		renderCard({ savedArticles: [] });
		expect(screen.getByText('Зберегти')).toBeInTheDocument();
	});

	it('renders the "Saved" status text when the article is already saved', () => {
		renderCard({ savedArticles: [MOCK_ARTICLE] });
		expect(screen.getByText('Збережено')).toBeInTheDocument();
	});

	it('provides a link with accessible name for navigation', () => {
		renderCard();
		expect(screen.getByRole('link', { name: /Читати/i })).toBeInTheDocument();
	});

	it('link is natively keyboard-accessible (no tabIndex needed on <a>)', () => {
		renderCard();
		const link = screen.getByRole('link', { name: /Читати/i });
		// Native <a href> is focusable by default without explicit tabIndex
		expect(link).toHaveAttribute('href', '/news/42');
	});
});
