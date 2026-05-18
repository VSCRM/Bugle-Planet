import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './forms.module.css';

/**
 * Password field with a show / hide toggle button.
 * Self-contained: manages its own visibility state internally.
 */
export const PasswordInput = ({
	name = 'password',
	label,
	placeholder = 'ПАРОЛЬ',
	value,
	error,
	onChange,
	autoComplete = 'new-password',
	required = true,
}) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => setIsVisible((previous) => !previous);

	return (
		<div className={styles.field}>
			{label && (
				<label className={styles.label} htmlFor={name}>
					{label}
				</label>
			)}

			<div className={styles.passwordWrap}>
				<input
					id={name}
					name={name}
					type={isVisible ? 'text' : 'password'}
					placeholder={placeholder}
					className={`${styles.input} ${error ? styles.inputError : ''}`}
					onChange={onChange}
					value={value}
					required={required}
					autoComplete={autoComplete}
				/>

				<button
					type="button"
					className={styles.eyeBtn}
					onClick={toggleVisibility}
					aria-label={isVisible ? 'Сховати пароль' : 'Показати пароль'}
					aria-pressed={isVisible}
				>
					{isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
			</div>

			{error && <span className={styles.errorMsg} role="alert">{error}</span>}
		</div>
	);
};
