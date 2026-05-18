import { useState } from 'react';
import { useNews } from '../../hooks/useNews';
import { useSort } from '../../hooks/useSort';
import { CategoryFilter } from './CategoryFilter';
import { filterByCategory } from './homeHelpers';
import { HomeLoading } from './HomeLoading';
import { HomeError } from './HomeError';
import { HomeGrid } from './HomeGrid';
import { SortControl } from '../../components/SortControl/SortControl';
import styles from './HomePage.module.css';

export function HomePage() {
	const { articles, categories, loading, error } = useNews();
	const [activeCategory, setActiveCategory] = useState('Всі');

	const filtered = filterByCategory(articles, activeCategory);
	const { sorted, order, toggleOrder } = useSort(filtered);

	return (
		<>
			<div className={styles.toolbar}>
				<CategoryFilter
					categories={categories}
					activeCategory={activeCategory}
					onSelect={setActiveCategory}
				/>
				{!loading && !error && (
					<SortControl order={order} onToggle={toggleOrder} />
				)}
			</div>
			{loading && <HomeLoading />}
			{error && <HomeError message={error} />}
			{!loading && !error && <HomeGrid articles={sorted} />}
		</>
	);
}
