import {describe, it, expect} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useSort} from "./useSort";
import type {Article} from "../schemas";

const makeArticle = (id: number, date: string): Article => ({
	id,
	title: `Article ${id}`,
	category: "Місто",
	excerpt: "Excerpt",
	date,
});

const articles: Article[] = [
	makeArticle(1, "2026-01-10"),
	makeArticle(2, "2026-01-15"),
	makeArticle(3, "2026-01-05"),
];

describe("useSort", () => {
	it("starts with descending order by default", () => {
		const {result} = renderHook(() => useSort(articles));
		expect(result.current.order).toBe("desc");
	});

	it('sorts articles newest-first when order is "desc"', () => {
		const {result} = renderHook(() => useSort(articles));
		const dates = result.current.sorted.map((a) => a.date);
		expect(dates[0]).toBe("2026-01-15");
		expect(dates[dates.length - 1]).toBe("2026-01-05");
	});

	it('sorts articles oldest-first after toggling to "asc"', () => {
		const {result} = renderHook(() => useSort(articles));
		act(() => result.current.toggleOrder());
		expect(result.current.order).toBe("asc");
		const dates = result.current.sorted.map((a) => a.date);
		expect(dates[0]).toBe("2026-01-05");
		expect(dates[dates.length - 1]).toBe("2026-01-15");
	});

	it('toggles back to "desc" on a second call', () => {
		const {result} = renderHook(() => useSort(articles));
		act(() => result.current.toggleOrder());
		act(() => result.current.toggleOrder());
		expect(result.current.order).toBe("desc");
	});

	it("does not mutate the original input array", () => {
		const copy = [...articles];
		renderHook(() => useSort(articles));
		expect(articles).toEqual(copy);
	});

	it("returns an empty array for empty input", () => {
		const {result} = renderHook(() => useSort([]));
		expect(result.current.sorted).toEqual([]);
	});
});
