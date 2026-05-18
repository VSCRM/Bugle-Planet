import { Calendar, MapPin } from 'lucide-react';
import styles from './Header.module.css';

export function TopBar({ date }) {
	return (
		<div className={styles.topBar}>
			<div className={styles.topBarItem}>
				<Calendar size={14} />
				<span>{date}</span>
			</div>
			<div className={styles.topBarItem}>
				<MapPin size={14} />
				<span>Калуш</span>
			</div>
		</div>
	);
}
