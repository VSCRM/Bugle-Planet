import { User, Clock } from 'lucide-react';
import styles from "./NewsDetailPage.module.css"

export const ArticleMeta = ({ author, date }) => (
	<div className={styles.meta}>
		<span className={styles.metaItem}>
			<User size={14} /> {author}
		</span>
		<span className={styles.metaItem}>
			<Clock size={14} /> {date}
		</span>
	</div>
);
