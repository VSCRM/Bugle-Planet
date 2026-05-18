import { getPasswordStrength } from '../../utils/validation';
import styles from './PasswordStrengthHint.module.css';

const RULES = [
	{ label: 'Мінімум 6 символів', test: (v) => v.length >= 6 },
	{ label: 'Лише латинські символи (англ)', test: (v) => !/[\u0080-\uFFFF]/.test(v) },
	{ label: 'Хоча б одна велика літера', test: (v) => /[A-Z]/.test(v) },
	{ label: 'Хоча б одна цифра', test: (v) => /[0-9]/.test(v) },
];

export const PasswordStrengthHint = ({ value }) => {
	if (!value) return null;

	const strength = getPasswordStrength(value);

	return (
		<div className={styles.wrap}>
			{strength && (
				<div className={styles.barRow}>
					<div className={`${styles.bar} ${styles[`bar_${strength.level}`]}`} />
					<span className={`${styles.label} ${styles[`label_${strength.level}`]}`}>
						{strength.label}
					</span>
				</div>
			)}

			<ul className={styles.rules}>
				{RULES.map(({ label, test }) => (
					<li key={label} className={test(value) ? styles.ruleOk : styles.ruleNo}>
						{label}
					</li>
				))}
			</ul>
		</div>
	);
};
