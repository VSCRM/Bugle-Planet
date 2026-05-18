import styles from './LoginForm.module.css';

/** One-time banner shown after a successful password reset. */
export const ResetSuccessBanner = () => (
	<p className={styles.resetSuccess} role="status">
		✓ Пароль успішно змінено. Увійдіть з новим паролем.
	</p>
);
