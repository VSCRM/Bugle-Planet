import { ArrowUp, ArrowDown } from 'lucide-react';
import styles from './SortControl.module.css';

export function SortControl({ order, onToggle }) {
	const isDesc = order === 'desc';
	const Icon = isDesc ? ArrowDown : ArrowUp;
	const label = isDesc ? 'Спаданням' : 'Зростанням';

	return (
		<button
			className={styles.btn}
			onClick={onToggle}
			aria-label={`Сортування: ${label}`}
			title={`Сортувати: ${label}`}
		>
			<Icon size={14} />
			{label}
		</button>
	);
}
