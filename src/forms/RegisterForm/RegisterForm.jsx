import { Link } from 'react-router';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { FormInput } from '../shared/FormInput';
import { PasswordInput } from '../shared/PasswordInput';
import { PasswordStrengthHint } from '../shared/PasswordStrengthHint';
import { SubmitButton } from '../shared/SubmitButton';
import { FormError } from '../shared/FormError';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import styles from '../shared/forms.module.css';

export const RegisterForm = () => {
	const { form, errors, authError, loading, isValid, handleChange, handleSubmit } =
		useRegisterForm();

	return (
		<AuthLayout title="Реєстрація">
			<FormError message={authError} />

			<form onSubmit={handleSubmit} noValidate>
				<FormInput
					name="email"
					type="email"
					placeholder="EMAIL"
					value={form.email}
					error={errors.email}
					onChange={handleChange}
					autoComplete="email"
				/>

				<FormInput
					name="nickname"
					placeholder="НІКНЕЙМ"
					value={form.nickname}
					error={errors.nickname}
					onChange={handleChange}
					autoComplete="nickname"
					required={false}
				/>

				<PasswordInput
					name="password"
					placeholder="ПАРОЛЬ"
					value={form.password}
					error={errors.password}
					onChange={handleChange}
					autoComplete="new-password"
				/>

				<PasswordStrengthHint value={form.password} />

				<div style={{ marginTop: '15px' }}>
					<SubmitButton
						loading={loading}
						disabled={!isValid}
						label="ЗАРЕЄСТРУВАТИСЯ"
						loadingLabel="Реєстрація..."
					/>
				</div>
			</form>

			<div className={styles.formFooter}>
				<Link to="/login" className={styles.footerLink}>
					Вже є акаунт?
				</Link>
			</div>
		</AuthLayout>
	);
};
