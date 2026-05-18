import { Loader2 } from 'lucide-react';
import { ArticleLayout } from '../../components/ArticleLayout/ArticleLayout';
import styles from './NewsDetailPage.module.css';

export const DetailLoading = () => (
	<ArticleLayout>
		<div className={styles.notFound}>
			<Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
		</div>
	</ArticleLayout>
);
