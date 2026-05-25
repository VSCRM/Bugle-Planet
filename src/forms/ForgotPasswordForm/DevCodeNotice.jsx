import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './ForgotPasswordForm.module.css';

/**
 * Shown in development mode when EmailJS is not yet configured.
 * Displays the raw reset code and a copy-to-clipboard button so
 * the developer can proceed without email delivery.
 */
export const DevCodeNotice = ({ code }) => {
	const [copied, setCopied] = useState(false);
	const timerRef = useRef(null);

	// Clear the timer if the component unmounts before it fires.
	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				setCopied(false);
				timerRef.current = null;
			}, 2000);
		} catch {
			// Clipboard API not available (e.g. non-HTTPS in dev)
		}
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
