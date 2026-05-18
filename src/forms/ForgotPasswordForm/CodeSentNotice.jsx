import styles from './ForgotPasswordForm.module.css';

/**
 * Shown when EmailJS is configured and the code was successfully emailed.
 * The user should check their inbox.
 */
export const CodeSentNotice = ({ email }) => (
	<p className={styles.codeDesc}>
		Код надіслано на <strong>{email}</strong>.{' '}
		Якщо листа немає — перевірте папку «Спам».
	</p>
);
