import {useState, useEffect} from "react";
import {useNews} from "../../hooks/useNews";
import {useSearch} from "../../hooks/useSearch";
import {useSort} from "../../hooks/useSort";
import {useLocale} from "../../i18n/LocaleContext";
import {CategoryFilter} from "./CategoryFilter";
import {SortControl} from "../../components/SortControl/SortControl";
import {HomeGrid} from "./HomeGrid";
import {HomeLoading} from "./HomeLoading";
import {HomeError} from "./HomeError";
import {HomeSearchBar} from "./HomeSearchBar";
import {HomeResultCount} from "./HomeResultCount";
import {filterByCategory} from "./homeHelpers";
import {CATEGORIES_BY_LOCALE} from "../../mock/newsData";
import styles from "./HomePage.module.css";

export function HomePage(): React.ReactElement {
	const {articles, categories, loading, error} = useNews();
	const {results, query, setQuery, date, setDate, clearFilters} =
		useSearch(articles);
	const {locale, t} = useLocale();

	// Always use the locale-aware "All" sentinel — reset when language switches.
	const allLabel = CATEGORIES_BY_LOCALE[locale][0] ?? t.home.allCategories;
	const [activeCategory, setActiveCategory] = useState<string>(allLabel);
	useEffect(() => {
		setActiveCategory(allLabel);
	}, [allLabel]);

	const filtered = filterByCategory(results, activeCategory, locale);
	const {sorted, order, toggleOrder} = useSort(filtered, "date");

	if (loading) {
		return (
			<main aria-busy="true" aria-label={t.home.heading}>
				<HomeLoading />
			</main>
		);
	}
	if (error) {
		return (
			<main aria-label={t.home.heading}>
				<HomeError message={error} />
			</main>
		);
	}

	return (
		<main aria-label={t.home.heading}>
			<h1 style={{textTransform: "uppercase", marginBottom: 24}}>
				{t.home.heading}
			</h1>

			<HomeSearchBar
				query={query}
				date={date}
				onQueryChange={setQuery}
				onDateChange={setDate}
				onClear={clearFilters}
			/>

			<div className={styles.toolbar} style={{marginBottom: 12}}>
				<CategoryFilter
					categories={categories}
					active={activeCategory}
					onChange={setActiveCategory}
				/>
				<SortControl order={order} onToggle={toggleOrder} />
			</div>

			<HomeResultCount count={sorted.length} />

			{sorted.length === 0 ? (
				<p
					role="status"
					style={{
						textAlign: "center",
						padding: 40,
						color: "var(--color-gray)",
					}}>
					{t.home.empty}
				</p>
			) : (
				<HomeGrid articles={sorted} />
			)}
		</main>
	);
}
