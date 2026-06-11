import {describe, it, expect, vi, beforeEach} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useArticleActions} from "./useArticleActions";
import type {Article, User} from "../schemas";

const mockArticle: Article = {
	id: 1,
	title: "Test Article",
	category: "Місто",
	excerpt: "Excerpt text",
	date: "2026-02-13",
};

const mockUser: User = {username: "u@x.com", nickname: "Alice"};

describe("useArticleActions", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it('saveArticle returns "redirect" when user is null', () => {
		const setSavedArticles = vi.fn();
		const {result} = renderHook(() =>
			useArticleActions(null, setSavedArticles),
		);
		expect(result.current.saveArticle(mockArticle)).toBe("redirect");
		expect(setSavedArticles).not.toHaveBeenCalled();
	});

	it('saveArticle returns "saved" and updates state when user is logged in', () => {
		const setSavedArticles = vi.fn();
		const {result} = renderHook(() =>
			useArticleActions(mockUser, setSavedArticles),
		);
		let actionResult: "saved" | "redirect" = "redirect";
		act(() => {
			actionResult = result.current.saveArticle(mockArticle);
		});
		expect(actionResult).toBe("saved");
		expect(setSavedArticles).toHaveBeenCalled();
	});

	it("saveArticle does not add a duplicate article", () => {
		const setSavedArticles = vi.fn();
		const {result} = renderHook(() =>
			useArticleActions(mockUser, setSavedArticles),
		);

		act(() => {
			result.current.saveArticle(mockArticle);
		});
		// Simulate the setter being called with the updater function:
		const updater = setSavedArticles.mock.calls[0]?.[0] as (
			prev: Article[],
		) => Article[];
		// Already contains the article — should NOT duplicate it.
		const existing = [mockArticle];
		const updated = updater(existing);
		expect(updated).toHaveLength(1);
	});

	it("unsaveArticle filters out the article by id", () => {
		const setSavedArticles = vi.fn();
		const {result} = renderHook(() =>
			useArticleActions(mockUser, setSavedArticles),
		);

		act(() => {
			result.current.unsaveArticle(mockArticle.id);
		});
		expect(setSavedArticles).toHaveBeenCalled();

		const updater = setSavedArticles.mock.calls[0]?.[0] as (
			prev: Article[],
		) => Article[];
		const remaining = updater([mockArticle]);
		expect(remaining).toHaveLength(0);
	});

	it("unsaveArticle leaves other articles untouched", () => {
		const secondArticle: Article = {...mockArticle, id: 2, title: "Second"};
		const setSavedArticles = vi.fn();
		const {result} = renderHook(() =>
			useArticleActions(mockUser, setSavedArticles),
		);

		act(() => {
			result.current.unsaveArticle(1);
		});

		const updater = setSavedArticles.mock.calls[0]?.[0] as (
			prev: Article[],
		) => Article[];
		const remaining = updater([mockArticle, secondArticle]);
		expect(remaining).toHaveLength(1);
		expect(remaining[0]?.id).toBe(2);
	});
});
