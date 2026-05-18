import { X } from 'lucide-react';
import styles from './SearchPage.module.css';

/**
 * Search filter bar: text query input, date picker, and a clear-all button.
 * All state is lifted to the parent (SearchPage) via props.
 */
export function SearchFilters({ query, setQuery, date, setDate, clearFilters }) {
	const hasFilters = query.trim() || date;

	return (
		<>
			<div className={styles.inputWrapper}>
				<span className={styles.searchIcon}>🔍</span>
				<input
					type="text"
					className={styles.inputText}
					placeholder="Пошук новин..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					aria-label="Пошук"
					maxLength={200}
					autoComplete="off"
				/>
			</div>

			<input
				type="date"
				className={styles.inputDate}
				value={date}
				onChange={(event) => setDate(event.target.value)}
				// Open the native date picker programmatically on click (Chrome/Edge).
				onClick={(event) => event.target.showPicker?.()}
				aria-label="Фільтр за датою"
			/>

			{hasFilters && (
				<button className={styles.clearBtn} onClick={clearFilters}>
					<X size={14} /> Скинути
				</button>
			)}
		</>
	);
}
