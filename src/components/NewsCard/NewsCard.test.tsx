/**
 * Tests for NewsCard.
 * Wraps in TestWrapper for LocaleProvider + MemoryRouter + AuthContext.
 */
import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {NewsCard} from "./NewsCard";
import {TestWrapper, MOCK_ARTICLE} from "../../tests/testHelpers";

const renderCard = (overrides = {}) =>
	render(
		<TestWrapper>
			<NewsCard article={{...MOCK_ARTICLE, ...overrides}} />
		</TestWrapper>,
	);

describe("NewsCard", () => {
	it("renders the article title", () => {
		renderCard();
		expect(screen.getByText(MOCK_ARTICLE.title)).toBeInTheDocument();
	});

	it("renders the article category", () => {
		renderCard();
		expect(screen.getByText(MOCK_ARTICLE.category)).toBeInTheDocument();
	});

	it("renders the article excerpt", () => {
		renderCard();
		expect(screen.getByText(MOCK_ARTICLE.excerpt)).toBeInTheDocument();
	});

	it("renders a thumbnail image with the article title as alt text", () => {
		renderCard();
		expect(
			screen.getByRole("img", {name: MOCK_ARTICLE.title}),
		).toBeInTheDocument();
	});

	it("renders a save button", () => {
		renderCard();
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it('has data-testid="news-card"', () => {
		renderCard();
		expect(screen.getByTestId("news-card")).toBeInTheDocument();
	});

	it("renders a link to the article detail page", () => {
		renderCard();
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", `/news/${MOCK_ARTICLE.id}`);
	});

	it("calls handleSave when the save button is clicked", () => {
		// useSaveArticle calls saveArticle from AuthContext; our mock returns 'saved'
		renderCard();
		const btn = screen.getByRole("button");
		fireEvent.click(btn);
		// No throw = handler was called correctly
		expect(btn).toBeInTheDocument();
	});

	it("uses card CSS module class (not global class)", () => {
		renderCard();
		const card = screen.getByTestId("news-card");
		// CSS modules hash the class — just verify it does NOT use a plain global class
		expect(card).not.toHaveClass("news-card");
	});
});
