import { Clock } from 'lucide-react';
import styles from './NewsCard.module.css';

/** Displays the article's category badge and publication date. */
export function CardMeta({ category, date }) {
	return (
		<div className={styles.meta}>
			<span className={styles.badge}>{category}</span>
			<span className={styles.clockItem}>
				<Clock size={12} /> {date}
			</span>
		</div>
	);
}
