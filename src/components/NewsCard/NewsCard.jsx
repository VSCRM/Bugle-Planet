import { useNavigate } from 'react-router';
import { useSaveArticle } from '../../hooks/useSaveArticle';
import { CardImage } from './CardImage';
import { CardMeta } from './CardMeta';
import { CardTitle } from './CardTitle';
import { CardActions } from './CardActions';
import styles from './NewsCard.module.css';

/**
 * Clickable article card used on the home page and search results.
 * The `featured` flag switches to a larger, hero-style layout.
 */
export function NewsCard({ article, featured = false }) {
	const { isSaved, handleSave } = useSaveArticle(article);
	const navigate = useNavigate();

	const cardClass = featured ? styles.cardFeatured : styles.card;
	const titleSize = featured ? '32px' : '20px';

	const handleCardClick = () => navigate(`/news/${article.id}`);

	// Allow keyboard users to activate the card with Enter or Space.
	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') handleCardClick();
	};

	return (
		<article
			className={`${cardClass} ${styles.clickable}`}
			onClick={handleCardClick}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			aria-label={`Читати: ${article.title}`}
		>
			<CardImage src={article.image} alt={article.title} />
			<CardMeta category={article.category} date={article.date} />
			<CardTitle title={article.title} size={titleSize} />
			<p className={styles.excerpt}>{article.excerpt}</p>
			<CardActions isSaved={isSaved} onSave={handleSave} />
		</article>
	);
}
