import { Header } from '../Header/Header';
import styles from './Layout.module.css';

export function Layout({ children }) {
	return (
		<div className={styles.wrapper}>
			<Header />
			<main className={styles.main}>{children}</main>
			<footer className={styles.footer}>
				<p className={styles.footerTitle}>© 2026 BUGLE PLANET</p>
				<p className={styles.footerSub}>
					Калуш, Івано-Франківська обл. • Незалежне видання
				</p>
			</footer>
		</div>
	);
}
