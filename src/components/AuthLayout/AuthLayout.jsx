import styles from './AuthLayout.module.css';

export function AuthLayout({ children, title }) {
	return (
		<div className={styles.container}>
			{title && <h2 className={styles.title}>{title}</h2>}
			{children}
		</div>
	);
}
