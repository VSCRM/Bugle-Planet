import type {Article} from "../../schemas";
import {CATEGORIES_BY_LOCALE} from "../../mock/newsData";
import type {Locale} from "../../i18n/translations";

/**
 * Filters articles by category.
 *
 * Returns the full list when `category` equals the locale-specific "All"
 * sentinel (e.g. "Всі" for Ukrainian, "All" for English).
 *
 * @param articles - Full article list to filter.
 * @param category - Currently selected category label.
 * @param locale   - Active app locale (used to identify the "All" sentinel).
 */
export function filterByCategory(
	articles: Article[],
	category: string,
	locale: Locale = "uk",
): Article[] {
	const allLabel = CATEGORIES_BY_LOCALE[locale][0];
	if (category === allLabel) return articles;
	return articles.filter((a) => a.category === category);
}
