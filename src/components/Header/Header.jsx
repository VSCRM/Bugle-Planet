import { useNavigate } from 'react-router';
import { formatDate } from '../../utils/formatDate';
import { TopBar } from './TopBar';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import styles from './Header.module.css';

export function Header() {
	const navigate = useNavigate();
	const today = formatDate();

	return (
		<header className={styles.header}>
			<TopBar date={today} />
			<Logo onLogoClick={() => navigate('/')} />
			<Navigation />
		</header>
	);
};
