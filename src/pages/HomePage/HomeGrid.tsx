import {NewsCard} from "../../components/NewsCard/NewsCard";
import type {Article} from "../../schemas";
import styles from "./HomePage.module.css";

interface HomeGridProps {
	articles: Article[];
}

/** Responsive article grid — no list element to avoid browser bullet defaults. */
export function HomeGrid({articles}: HomeGridProps): React.ReactElement {
	return (
		<div className={styles.grid}>
			{articles.map((item) => (
				<NewsCard key={item.id} article={item} />
			))}
		</div>
	);
}
