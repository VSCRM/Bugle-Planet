import { useNavigate } from 'react-router';
import { Mail } from 'lucide-react';
import { CodeSentNotice } from './CodeSentNotice';
import { DevCodeNotice } from './DevCodeNotice';
import styles from './ForgotPasswordForm.module.css';

/**
 * Full "code delivered" screen.
 * Branches between real email delivery (CodeSentNotice) and
 * local dev display (DevCodeNotice) based on the `sent` flag.
 */
export const ResetCodeDisplay = ({ email, sent, devCode }) => {
	const navigate = useNavigate();

	const handleContinue = () => {
		navigate('/reset-password', { state: { email, code: sent ? '' : devCode } });
	};

	return (
		<div className={styles.codeBox}>
			<Mail size={32} className={styles.mailIcon} aria-hidden="true" />

			<p className={styles.codeTitle}>
				{sent ? 'Перевірте пошту' : 'Код для розробника'}
			</p>

			{sent ? (
				<CodeSentNotice email={email} />
			) : (
				<DevCodeNotice code={devCode} />
			)}

			<p className={styles.codeNote}>Код дійсний 15 хвилин.</p>

			<button className={styles.continueBtn} onClick={handleContinue}>
				Ввести код →
			</button>
		</div>
	);
};
