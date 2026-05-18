import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './ForgotPasswordForm.module.css';

/**
 * Shown in development mode when EmailJS is not yet configured.
 * Displays the raw reset code and a copy-to-clipboard button so
 * the developer can proceed without email delivery.
 */
export const DevCodeNotice = ({ code }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<>
			<p className={styles.codeDesc}>
				EmailJS не налаштований. Використай цей код для розробки
				(налаштуй <code>VITE_EMAILJS_*</code> у <code>.env</code>, щоб надсилати справжні листи):
			</p>

			<div className={styles.codeDisplay}>
				<span className={styles.codeValue}>{code}</span>

				<button
					type="button"
					className={styles.copyBtn}
					onClick={handleCopy}
					aria-label="Скопіювати код"
				>
					{copied ? <Check size={16} /> : <Copy size={16} />}
				</button>
			</div>
		</>
	);
};
