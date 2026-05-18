import { Save, X, Loader2 } from 'lucide-react';
import styles from './EditProfileForm.module.css';

/** Save / Cancel button row for the edit-profile form. */
export const ProfileFormActions = ({ loading, isDisabled, onCancel }) => (
	<div className={styles.btnRow}>
		<button
			type="submit"
			className={`${styles.btn} ${styles.btnSave}`}
			disabled={isDisabled || loading}
			aria-busy={loading}
		>
			{loading ? (
				<Loader2 size={16} className={styles.spinner} aria-hidden="true" />
			) : (
				<Save size={16} aria-hidden="true" />
			)}
			Зберегти
		</button>

		<button
			type="button"
			className={`${styles.btn} ${styles.btnCancel}`}
			onClick={onCancel}
		>
			<X size={16} aria-hidden="true" /> Скасувати
		</button>
	</div>
);
