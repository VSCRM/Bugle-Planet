import { NewsCard } from '../../components/NewsCard/NewsCard';
import styles from "./HomePage.module.css"

export const HomeGrid = ({ articles }) => (
	<div className={styles.grid}>
		{articles.map((item) => (
			<NewsCard
				key={item.id}
				article={item}
				featured={item.featured}
			/>
		))}
	</div>
);
