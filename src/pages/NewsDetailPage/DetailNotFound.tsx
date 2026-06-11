import {useLocale} from "../../i18n/LocaleContext";
import styles from "./NewsDetailPage.module.css";

export function DetailNotFound(): React.ReactElement {
	const {t} = useLocale();
	return (
		<p className={styles.notFound} role="alert">
			{t.detail.notFound}
		</p>
	);
}
