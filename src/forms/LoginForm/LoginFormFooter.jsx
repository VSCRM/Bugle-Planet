import { Link } from 'react-router';
import styles from './LoginForm.module.css';

/** Footer links: forgot password and create account. */
export const LoginFormFooter = () => (
	<div className={styles.footer}>
		<Link to="/forgot-password" className={styles.forgotLink}>
			Забули пароль?
		</Link>
		<Link to="/register" className={styles.registerLink}>
			Створити акаунт
		</Link>
	</div>
);
