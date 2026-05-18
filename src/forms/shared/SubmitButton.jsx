import { Loader2 } from 'lucide-react';
import styles from './forms.module.css';

/** Primary submit button with a loading spinner state. */
export const SubmitButton = ({
	loading,
	disabled,
	label,
	loadingLabel = 'Завантаження...',
}) => (
	<button
		type="submit"
		className={styles.submitBtn}
		disabled={disabled || loading}
		aria-busy={loading}
	>
		{loading ? (
			<>
				<Loader2 size={18} className={styles.spinner} aria-hidden="true" />
				{loadingLabel}
			</>
		) : (
			label
		)}
	</button>
);
