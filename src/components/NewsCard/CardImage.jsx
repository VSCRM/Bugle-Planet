import styles from './NewsCard.module.css';

/** Fallback image shown when the article's own image fails to load. */
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';

/** Replace a broken image src with the fallback URL. */
const handleImageError = (event) => {
	event.target.src = FALLBACK_IMG;
};

/** Renders the article's hero image with an automatic broken-image fallback. */
export function CardImage({ src, alt }) {
	return (
		<div className={styles.imageWrap}>
			<img src={src} alt={alt} onError={handleImageError} />
		</div>
	);
}
