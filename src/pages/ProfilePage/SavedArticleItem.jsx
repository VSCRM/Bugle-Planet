import { useNavigate } from 'react-router';
import { Trash2 } from 'lucide-react';
import styles from './SavedArticlesList.module.css';

export const SavedArticleItem = ({ article, onRemove }) => {
	const navigate = useNavigate();

	return (
		<li className={styles.item}>
			<div
				className={styles.clickableArea}
				onClick={() => navigate(`/news/${article.id}`)}
			>
				<p className={styles.itemTitle}>{article.title}</p>
				<span className={styles.itemMeta}>
					{article.category} • {article.date}
				</span>
			</div>

			<button
				className={styles.removeBtn}
				onClick={() => onRemove(article.id)}
				aria-label="Видалити зі збережених"
			>
				<Trash2 size={18} />
			</button>
		</li>
	);
};
