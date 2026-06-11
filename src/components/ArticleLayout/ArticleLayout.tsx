import type {ReactNode} from "react";
import {useNavigate} from "react-router";
import {ArrowLeft} from "lucide-react";
import {useLocale} from "../../i18n/LocaleContext";
import styles from "./ArticleLayout.module.css";

interface ArticleLayoutProps {
	children: ReactNode;
	showBack?: boolean;
}

export function ArticleLayout({
	children,
	showBack = true,
}: ArticleLayoutProps): React.ReactElement {
	const navigate = useNavigate();
	const {t} = useLocale();
	return (
		<div className={styles.container}>
			{showBack && (
				<button className={styles.backBtn} onClick={() => void navigate(-1)}>
					<ArrowLeft size={16} aria-hidden="true" />
					{t.article.back}
				</button>
			)}
			{children}
		</div>
	);
}
