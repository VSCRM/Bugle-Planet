/**
 * Site logo button — SVG newspaper icon + brand name.
 */
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./Header.module.css";

interface LogoProps {
	onLogoClick: () => void;
}

export function Logo({onLogoClick}: LogoProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<div className={styles.main}>
			<button
				className={styles.logo}
				onClick={onLogoClick}
				aria-label={t.nav.logoAlt}>
				<svg
					className={styles.logoImg}
					viewBox="0 0 80 80"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true">
					<rect width="80" height="80" rx="8" fill="#d4a574" />
					<rect x="10" y="18" width="60" height="5" rx="1" fill="#2c2416" />
					<rect x="10" y="28" width="40" height="3" rx="1" fill="#2c2416" />
					<rect x="10" y="35" width="45" height="3" rx="1" fill="#2c2416" />
					<rect x="10" y="44" width="27" height="16" rx="1" fill="#2c2416" />
					<rect x="43" y="44" width="27" height="3" rx="1" fill="#2c2416" />
					<rect x="43" y="51" width="27" height="3" rx="1" fill="#2c2416" />
					<rect x="43" y="58" width="20" height="3" rx="1" fill="#2c2416" />
				</svg>
				<h1 className={styles.logoTitle}>BUGLE PLANET</h1>
			</button>
		</div>
	);
}
