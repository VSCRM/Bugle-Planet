import styles from './NewsCard.module.css';

/**
 * Renders the article headline.
 * Font size is supplied by the parent so featured cards can use a larger size.
 */
export function CardTitle({ title, size }) {
	return (
		<h2 className={styles.title} style={{ fontSize: size }}>
			{title}
		</h2>
	);
}
