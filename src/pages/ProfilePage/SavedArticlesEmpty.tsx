import {useLocale} from "../../i18n/LocaleContext";
import styles from "./SavedArticlesList.module.css";

export function SavedArticlesEmpty(): React.ReactElement {
	const {t} = useLocale();
	return <p className={styles.empty}>{t.profile.savedEmpty}</p>;
}
