import {NewsCard} from "../../components/NewsCard/NewsCard";
import {useLocale} from "../../i18n/LocaleContext";
import type {Article} from "../../schemas";
import styles from "./SearchPage.module.css";

interface SearchResultsProps {
	results: Article[];
	totalArticles: number;
	/** True while React is computing filtered results (useTransition). */
	isPending?: boolean;
}

export function SearchResults({
	results,
	totalArticles,
	isPending = false,
}: SearchResultsProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<>
			<p className={styles.stats} aria-live="polite" aria-atomic="true">
				<span className={styles.statsIcon} aria-hidden="true">
					🔍
				</span>
				{t.search.foundOf(results.length, totalArticles)}
			</p>
			<div
				className={styles.grid}
				style={{opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s"}}
				aria-busy={isPending}>
				{results.length > 0 ? (
					results.map((item) => <NewsCard key={item.id} article={item} />)
				) : (
					<p className={styles.noResults}>{t.search.noResults}</p>
				)}
			</div>
		</>
	);
}
