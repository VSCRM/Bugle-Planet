import {Clock} from "lucide-react";
import {Badge} from "../ui/Badge";
import {formatDate} from "../../utils/formatDate";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./NewsCard.module.css";

interface CardMetaProps {
	category: string;
	date: string;
}

/** Category badge + formatted publication date — respects active locale. */
export function CardMeta({category, date}: CardMetaProps): React.ReactElement {
	const {locale} = useLocale();
	const formatted = formatDate(date, locale);

	return (
		<div className={styles.meta}>
			<Badge label={category} />
			<time dateTime={date} className={styles.clockItem} aria-label={formatted}>
				<Clock size={12} aria-hidden="true" />
				{formatted}
			</time>
		</div>
	);
}
