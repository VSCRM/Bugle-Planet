import styles from './CategoryFilter.module.css';

export const CategoryFilter = ({ categories, activeCategory, onSelect }) => (
	<div className={styles.wrap}>
		{categories.map((cat) => (
			<button
				key={cat}
				onClick={() => onSelect(cat)}
				className={
					cat === activeCategory
						? `${styles.btn} ${styles.btnActive}`
						: styles.btn
				}
			>
				{cat}
			</button>
		))}
	</div>
);
