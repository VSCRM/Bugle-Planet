import {SavedArticlesEmpty} from "./SavedArticlesEmpty";
import {SavedArticleItem} from "./SavedArticleItem";
import type {Article} from "../../schemas";
import styles from "./SavedArticlesList.module.css";

interface SavedArticlesListProps {
	articles: Article[];
	onRemove: (id: number) => void;
}

export function SavedArticlesList({
	articles,
	onRemove,
}: SavedArticlesListProps): React.ReactElement {
	if (!articles.length) return <SavedArticlesEmpty />;
	return (
		<ul className={styles.list}>
			{articles.map((article) => (
				<SavedArticleItem
					key={article.id}
					article={article}
					onRemove={onRemove}
				/>
			))}
		</ul>
	);
}
