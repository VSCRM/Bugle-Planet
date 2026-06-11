import {describe, it, expect} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useSearch} from "./useSearch";
import type {Article} from "../schemas";

const makeArticle = (
	id: number,
	title: string,
	excerpt: string,
	date: string,
): Article => ({
	id,
	title,
	category: "Місто",
	excerpt,
	date,
});

const articles: Article[] = [
	makeArticle(1, "Калуш готується до свята", "Цікава інформація", "2026-02-13"),
	makeArticle(2, "Спортивний матч", "Футбол у місті", "2026-02-12"),
	makeArticle(3, "Нова школа в Калуші", "Освіта розвивається", "2026-02-11"),
];

describe("useSearch", () => {
	it("returns all articles when query and date are empty", () => {
		const {result} = renderHook(() => useSearch(articles));
		expect(result.current.results).toHaveLength(3);
	});

	it("filters by case-insensitive title query", () => {
		const {result} = renderHook(() => useSearch(articles));
		act(() => result.current.setQuery("калуш"));
		expect(result.current.results).toHaveLength(2);
	});

	it("filters by excerpt query", () => {
		const {result} = renderHook(() => useSearch(articles));
		act(() => result.current.setQuery("футбол"));
		expect(result.current.results).toHaveLength(1);
		expect(result.current.results[0]?.id).toBe(2);
	});

	it("filters by exact date", () => {
		const {result} = renderHook(() => useSearch(articles));
		act(() => result.current.setDate("2026-02-12"));
		expect(result.current.results).toHaveLength(1);
		expect(result.current.results[0]?.id).toBe(2);
	});

	it("combines query and date filters", () => {
		const {result} = renderHook(() => useSearch(articles));
		act(() => {
			result.current.setQuery("калуш");
			result.current.setDate("2026-02-13");
		});
		expect(result.current.results).toHaveLength(1);
		expect(result.current.results[0]?.id).toBe(1);
	});

	it("returns empty array when no articles match", () => {
		const {result} = renderHook(() => useSearch(articles));
		act(() => result.current.setQuery("qqqqqq"));
		expect(result.current.results).toHaveLength(0);
	});

	it("clearFilters resets query and date", () => {
		const {result} = renderHook(() => useSearch(articles));
		act(() => {
			result.current.setQuery("калуш");
			result.current.setDate("2026-02-13");
		});
		act(() => result.current.clearFilters());
		expect(result.current.query).toBe("");
		expect(result.current.date).toBe("");
		expect(result.current.results).toHaveLength(3);
	});
});
