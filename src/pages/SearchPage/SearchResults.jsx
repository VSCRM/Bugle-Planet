import { Search } from 'lucide-react';
import { NewsCard } from '../../components/NewsCard/NewsCard';
import styles from './SearchPage.module.css';

export const SearchResults = ({ results, totalArticles }) => {
	return (
		<>
			<p className={styles.stats}>
				<Search size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
				Знайдено: {results.length} з {totalArticles}
			</p>

			<div className={styles.grid}>
				{results.length > 0 ? (
					results.map((item) => <NewsCard key={item.id} article={item} />)
				) : (
					<p className={styles.noResults}>
						Нічого не знайдено. Спробуй інший запит.
					</p>
				)}
			</div>
		</>
	);
};
