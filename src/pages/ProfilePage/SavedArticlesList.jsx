import { SavedArticlesEmpty } from './SavedArticlesEmpty';
import { SavedArticleItem } from './SavedArticleItem';
import styles from './SavedArticlesList.module.css';

export const SavedArticlesList = ({ articles, onRemove }) => {
	return !articles.length ? (
		<SavedArticlesEmpty />
	) : (
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
};
