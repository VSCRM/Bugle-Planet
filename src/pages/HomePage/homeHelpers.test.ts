import {describe, it, expect} from "vitest";
import {filterByCategory} from "./homeHelpers";
import type {Article} from "../../schemas";

const makeArticle = (id: number, category: string): Article => ({
	id,
	title: `Article ${id}`,
	category,
	excerpt: "Excerpt",
	date: "2026-01-01",
});

const articles: Article[] = [
	makeArticle(1, "Місто"),
	makeArticle(2, "Спорт"),
	makeArticle(3, "Місто"),
	makeArticle(4, "Культура"),
];

describe("filterByCategory", () => {
	it('returns all articles when category is "Всі"', () => {
		expect(filterByCategory(articles, "Всі")).toHaveLength(4);
	});

	it("filters correctly by a specific category", () => {
		const result = filterByCategory(articles, "Місто");
		expect(result).toHaveLength(2);
		result.forEach((a) => expect(a.category).toBe("Місто"));
	});

	it("returns an empty array when no articles match", () => {
		expect(filterByCategory(articles, "Екологія")).toHaveLength(0);
	});

	it("handles an empty input array", () => {
		expect(filterByCategory([], "Місто")).toHaveLength(0);
	});

	it("does not mutate the original array", () => {
		const copy = [...articles];
		filterByCategory(articles, "Спорт");
		expect(articles).toEqual(copy);
	});
});
