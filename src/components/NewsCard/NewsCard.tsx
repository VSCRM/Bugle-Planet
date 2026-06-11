import {Link} from "react-router";
import {useSaveArticle} from "../../hooks/useSaveArticle";
import type {Article} from "../../schemas";
import {CardImage} from "./CardImage";
import {CardMeta} from "./CardMeta";
import {CardTitle} from "./CardTitle";
import {CardActions} from "./CardActions";
import styles from "./NewsCard.module.css";

interface NewsCardProps {
	article: Article;
	featured?: boolean;
}

export function NewsCard({
	article,
	featured = false,
}: NewsCardProps): React.ReactElement {
	const {isSaved, handleSave} = useSaveArticle(article);

	return (
		<article
			className={featured ? styles.cardFeatured : styles.card}
			data-testid="news-card">
			<Link
				to={`/news/${article.id}`}
				className={styles.cardLink}
				aria-label={`Читати: ${article.title}`}>
				<CardImage src={article.image} alt={article.title} />
				<CardMeta category={article.category} date={article.date} />
				<CardTitle title={article.title} size={featured ? "32px" : "20px"} />
				<p className={styles.excerpt}>{article.excerpt}</p>
			</Link>
			<CardActions isSaved={isSaved} onSave={handleSave} />
		</article>
	);
}
