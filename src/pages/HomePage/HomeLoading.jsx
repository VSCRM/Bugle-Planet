import { Loader2 } from 'lucide-react';
import styles from "./HomePage.module.css"

export const HomeLoading = () => (
	<div className={styles.loader}>
		<Loader2 size={20} className={styles.spinner} />
		Завантаження новин...
	</div>
);
