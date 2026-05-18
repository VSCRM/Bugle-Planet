import styles from './forms.module.css';

export const FormInput = ({
	name,
	type = 'text',
	placeholder,
	label,
	value,
	error,
	onChange,
	autoComplete,
	required = true,
}) => (
	<div className={styles.field}>
		{label && <label className={styles.label} htmlFor={name}>{label}</label>}
		<input
			id={name}
			name={name}
			type={type}
			placeholder={placeholder}
			className={`${styles.input} ${error ? styles.inputError : ''}`}
			onChange={onChange}
			value={value}
			required={required}
			autoComplete={autoComplete}
		/>
		{error && <span className={styles.errorMsg}>{error}</span>}
	</div>
);
