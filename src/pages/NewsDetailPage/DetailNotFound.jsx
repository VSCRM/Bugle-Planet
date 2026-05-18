import { ArticleLayout } from '../../components/ArticleLayout/ArticleLayout';
import styles from './NewsDetailPage.module.css';

export const DetailNotFound = () => (
	<ArticleLayout>
		<p className={styles.notFound}>Новину не знайдено</p>
	</ArticleLayout>
);
