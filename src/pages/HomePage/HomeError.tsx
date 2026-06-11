import {useLocale} from "../../i18n/LocaleContext";
import styles from "./HomePage.module.css";

interface HomeErrorProps {
	message: string;
}

export function HomeError({message}: HomeErrorProps): React.ReactElement {
	const {t} = useLocale();
	return (
		<div className={styles.error} role="alert">
			{t.home.error}
			{message}
		</div>
	);
}
