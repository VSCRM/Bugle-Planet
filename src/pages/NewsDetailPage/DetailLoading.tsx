import {Spinner} from "../../components/ui/Spinner";
import {ArticleLayout} from "../../components/ArticleLayout/ArticleLayout";
import styles from "./NewsDetailPage.module.css";

export function DetailLoading(): React.ReactElement {
	return (
		<ArticleLayout>
			<div className={styles.notFound} role="status">
				<Spinner size={36} label="Завантаження статті…" />
			</div>
		</ArticleLayout>
	);
}
