import {User, Clock} from "lucide-react";
import {formatDate} from "../../utils/formatDate";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./NewsDetailPage.module.css";

interface ArticleMetaProps {
	author?: string;
	date: string;
}

/** Author + publication date — respects active locale. */
export function ArticleMeta({
	author,
	date,
}: ArticleMetaProps): React.ReactElement {
	const {locale} = useLocale();

	return (
		<div className={styles.meta}>
			{author && (
				<span className={styles.metaItem}>
					<User size={14} aria-hidden="true" /> {author}
				</span>
			)}
			<span className={styles.metaItem}>
				<Clock size={14} aria-hidden="true" /> {formatDate(date, locale)}
			</span>
		</div>
	);
}
