import {useNavigate} from "react-router";
import {Trash2} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import type {Article} from "../../schemas";
import styles from "./SavedArticlesList.module.css";

interface SavedArticleItemProps {
	article: Article;
	onRemove: (id: number) => void;
}

export function SavedArticleItem({
	article,
	onRemove,
}: SavedArticleItemProps): React.ReactElement {
	const navigate = useNavigate();
	const {t} = useLocale();

	return (
		<li className={styles.item} data-testid="saved-article-item">
			<div
				className={styles.clickableArea}
				onClick={() => void navigate(`/news/${article.id}`)}
				role="button"
				tabIndex={0}
				onKeyDown={(e) =>
					e.key === "Enter" && void navigate(`/news/${article.id}`)
				}
				aria-label={t.profile.readArticle(article.title)}>
				<p className={styles.itemTitle}>{article.title}</p>
				<span className={styles.itemMeta}>
					{article.category} • {article.date}
				</span>
			</div>
			<button
				className={styles.removeBtn}
				onClick={() => onRemove(article.id)}
				aria-label={t.profile.removeArticle(article.title)}>
				<Trash2 size={18} />
			</button>
		</li>
	);
}
