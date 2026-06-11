import type {MouseEvent} from "react";
import {X} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./SearchPage.module.css";

interface SearchFiltersProps {
	query: string;
	setQuery: (value: string) => void;
	date: string;
	setDate: (value: string) => void;
	clearFilters: () => void;
}

export function SearchFilters({
	query,
	setQuery,
	date,
	setDate,
	clearFilters,
}: SearchFiltersProps): React.ReactElement {
	const {t} = useLocale();
	const hasFilters = query.trim() || date;

	return (
		<>
			<div className={styles.inputWrapper}>
				<span className={styles.searchIcon} aria-hidden="true">
					🔍
				</span>
				<input
					type="text"
					className={styles.inputText}
					placeholder={t.search.inputPlaceholder}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					aria-label={t.search.inputLabel}
					maxLength={200}
					autoComplete="off"
				/>
			</div>

			<input
				type="date"
				className={styles.inputDate}
				value={date}
				onChange={(e) => setDate(e.target.value)}
				onClick={(e: MouseEvent<HTMLInputElement>) =>
					(
						e.target as HTMLInputElement & {showPicker?: () => void}
					).showPicker?.()
				}
				aria-label={t.search.dateLabel}
			/>

			{hasFilters && (
				<button className={styles.clearBtn} onClick={clearFilters}>
					<X size={14} aria-hidden="true" /> {t.search.resetFilters}
				</button>
			)}
		</>
	);
}
