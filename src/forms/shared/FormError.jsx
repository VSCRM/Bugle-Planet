import styles from './forms.module.css';

/** Displays a server-side or auth error banner above the form. */
export const FormError = ({ message }) =>
	message ? (
		<div className={styles.formError} role="alert">
			{message}
		</div>
	) : null;
