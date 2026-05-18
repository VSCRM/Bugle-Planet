import { NavLink } from 'react-router';
import styles from './Header.module.css';

const getLinkClass = ({ isActive }) =>
	isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

export function Navigation() {
	return (
		<nav className={styles.nav}>
			<NavLink to="/" end className={getLinkClass}>
				Головна
			</NavLink>
			<NavLink to="/search" className={getLinkClass}>
				Пошук
			</NavLink>
			<NavLink to="/profile" className={getLinkClass}>
				Профіль
			</NavLink>
		</nav>
	);
}
