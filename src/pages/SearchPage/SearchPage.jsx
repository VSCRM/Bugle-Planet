import { useNews } from '../../hooks/useNews';
import { useSearch } from '../../hooks/useSearch';
import { useSort } from '../../hooks/useSort';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { SortControl } from '../../components/SortControl/SortControl';
import styles from './SearchPage.module.css';

export function SearchPage() {
	const { articles } = useNews();
	const { results, query, setQuery, date, setDate, clearFilters } = useSearch(articles);
	const { sorted, order, toggleOrder } = useSort(results);

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
			/>
		</>
	);
}
