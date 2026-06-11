import {useLocale} from "../../i18n/LocaleContext";
import styles from "./CategoryFilter.module.css";

interface CategoryFilterProps {
	categories: readonly string[];
	active: string;
	onChange: (category: string) => void;
}

export function CategoryFilter({
	categories,
	active,
	onChange,
}: CategoryFilterProps): React.ReactElement {
	const {t} = useLocale();

	return (
		<nav className={styles.wrap} aria-label={t.home.categoryNav}>
			{categories.map((cat) => (
				<button
					key={cat}
					type="button"
					className={
						active === cat ? `${styles.btn} ${styles.btnActive}` : styles.btn
					}
					onClick={() => onChange(cat)}
					aria-pressed={active === cat}>
					{cat}
				</button>
			))}
		</nav>
	);
}
