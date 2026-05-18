import { CheckCircle2, X } from 'lucide-react';
import styles from './Toast.module.css';

/**
 * Slide-in success notification.
 * Rendered outside the form so it survives form unmount.
 */
export const Toast = ({ message, onClose }) => (
	<div className={styles.toast} role="status" aria-live="polite">
		<CheckCircle2 size={18} className={styles.icon} aria-hidden="true" />
		<span>{message}</span>
		<button
			className={styles.closeBtn}
			onClick={onClose}
			aria-label="Закрити повідомлення"
		>
			<X size={14} />
		</button>
	</div>
);
