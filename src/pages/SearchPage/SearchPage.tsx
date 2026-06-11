/**
 * Full-text search page.
 *
 * `useSearch` uses `useTransition` internally, so `isPending` is true while
 * React is computing the filtered result.  We pass it to SearchResults to
 * show a subtle opacity change during filtering.
 */
import {useNews} from "../../hooks/useNews";
import {useSearch} from "../../hooks/useSearch";
import {useSort} from "../../hooks/useSort";
import {SearchFilters} from "./SearchFilters";
import {SearchResults} from "./SearchResults";
import {SortControl} from "../../components/SortControl/SortControl";
import styles from "./SearchPage.module.css";

export function SearchPage(): React.ReactElement {
	const {articles} = useNews();
	const {results, query, setQuery, date, setDate, clearFilters, isPending} =
		useSearch(articles);
	const {sorted, order, toggleOrder} = useSort(results);

	return (
		<>
			<div className={styles.searchBox}>
				<SearchFilters
					query={query}
					setQuery={setQuery}
					date={date}
					setDate={setDate}
					clearFilters={clearFilters}
				/>
				<SortControl order={order} onToggle={toggleOrder} />
			</div>
			<SearchResults
				results={sorted}
				totalArticles={articles.length}
				isPending={isPending}
			/>
		</>
	);
}
