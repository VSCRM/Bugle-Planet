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

	it('navigates to /news/42 when clicking the card action button', () => {
		renderCard();
		const article = screen.getByRole('button', { name: /Читати/i });
		fireEvent.click(article);
		expect(mockNavigate).toHaveBeenCalledWith('/news/42');
	});

	it('triggers navigation when pressing Enter on the card action button', () => {
		renderCard();
		const article = screen.getByRole('button', { name: /Читати/i });
		fireEvent.keyDown(article, { key: 'Enter' });
		expect(mockNavigate).toHaveBeenCalledWith('/news/42');
	});

	it('triggers navigation when pressing Space on the card action button', () => {
		renderCard();
		const article = screen.getByRole('button', { name: /Читати/i });
		fireEvent.keyDown(article, { key: ' ' });
		expect(mockNavigate).toHaveBeenCalledWith('/news/42');
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

	it('provides role="button" for basic accessibility criteria', () => {
		renderCard();
		expect(screen.getByRole('button', { name: /Читати/i })).toBeInTheDocument();
	});

	it('assigns a valid tabIndex=0 attribute for proper keyboard layout navigation', () => {
		renderCard();
		const article = screen.getByRole('button', { name: /Читати/i });
		expect(article).toHaveAttribute('tabindex', '0');
	});
});
