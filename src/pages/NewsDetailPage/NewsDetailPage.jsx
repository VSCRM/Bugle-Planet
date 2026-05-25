import { useNewsDetail } from '../../hooks/useNewsDetail';
import { DetailLoading } from './DetailLoading';
import { DetailNotFound } from './DetailNotFound';
import { SaveButton } from './SaveButton';
import { ArticleLayout } from '../../components/ArticleLayout/ArticleLayout';
import { ArticleMeta } from './ArticleMeta';
import styles from './NewsDetailPage.module.css';

export function NewsDetailPage() {
	const { article, loading, error, isSaved, handleSave } = useNewsDetail();

	if (loading) return <DetailLoading />;
	if (error || !article) return <DetailNotFound />;

	return (
		<ArticleLayout>
			<img src={article.image} alt={article.title} className={styles.heroImg} />

			<div className={styles.topRow}>
				<span className={styles.badge}>{article.category}</span>
				<SaveButton isSaved={isSaved} onSave={handleSave} />
			</div>

			<h1 className={styles.title}>{article.title}</h1>

			<ArticleMeta author={article.author} date={article.date} />

			<div className={styles.body}>
				<p className={styles.lead}>{article.excerpt}</p>
				<p>{article.content}</p>
			</div>
		</ArticleLayout>
	);
};
