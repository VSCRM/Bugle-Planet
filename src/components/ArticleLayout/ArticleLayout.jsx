import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import styles from './ArticleLayout.module.css';

export function ArticleLayout({ children, maxWidth = '800px', showBack = true }) {
	const navigate = useNavigate();

	return (
		<div className={styles.container} style={{ maxWidth }}>
			{showBack && (
				<button className={styles.backBtn} onClick={() => navigate(-1)}>
					<ArrowLeft size={18} /> НАЗАД
				</button>
			)}
			{children}
		</div>
	);
};
