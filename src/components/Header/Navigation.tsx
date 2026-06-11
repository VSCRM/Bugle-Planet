/**
 * Main navigation bar.
 *
 * Original route set: Home · Search · Profile
 * Login / Register are NOT shown here — they are accessible via the
 * auth redirect on /profile and the LoginFormFooter links.
 */
import {NavLink} from "react-router";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./Header.module.css";

export function Navigation(): React.ReactElement {
	const {t} = useLocale();

	const cls = ({isActive}: {isActive: boolean}): string => {
		const baseClass = styles.navLink ?? "";
		const activeClass = styles.navLinkActive ?? "";
		return isActive ? `${baseClass} ${activeClass}`.trim() : baseClass;
	};

	return (
		<nav className={styles.nav ?? ""} aria-label={t.nav.mainNav ?? ""}>
			<NavLink to="/" end className={cls}>
				{t.nav.home}
			</NavLink>
			<NavLink to="/search" className={cls}>
				{t.nav.search}
			</NavLink>
			<NavLink to="/profile" className={cls}>
				{t.nav.profile}
			</NavLink>
		</nav>
	);
}
