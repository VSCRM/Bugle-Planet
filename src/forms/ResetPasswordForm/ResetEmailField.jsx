import styles from './ResetPasswordForm.module.css';

/** Read-only email display — confirms which account is being reset. */
export const ResetEmailField = ({ email }) => (
	<div>
		<label className={styles.label}>Email</label>
		<input
			className={styles.readonlyInput}
			value={email}
			readOnly
			tabIndex={-1}
			aria-label="Email для скидання пароля"
		/>
	</div>
);
