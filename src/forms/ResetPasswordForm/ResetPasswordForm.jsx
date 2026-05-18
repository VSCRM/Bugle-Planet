import { useLocation, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { PasswordInput } from '../shared/PasswordInput';
import { PasswordStrengthHint } from '../shared/PasswordStrengthHint';
import { SubmitButton } from '../shared/SubmitButton';
import { FormError } from '../shared/FormError';
import { ResetEmailField } from './ResetEmailField';
import { ResetCodeField } from './ResetCodeField';
import { useResetPasswordForm } from '../../hooks/useResetPasswordForm';
import formStyles from '../shared/forms.module.css';
import styles from './ResetPasswordForm.module.css';

export const ResetPasswordForm = () => {
	const location = useLocation();
	const email = location.state?.email ?? '';
	const prefillCode = location.state?.code ?? '';

	const { form, errors, serverError, loading, handleChange, handleSubmit } =
		useResetPasswordForm(email);

	/* When navigated from the dev-code screen the code is pre-filled. */
	const codeValue = form.code || prefillCode;

	const isSubmitDisabled =
		!codeValue ||
		!form.password ||
		!form.confirmPassword ||
		Boolean(errors.password) ||
		Boolean(errors.confirmPassword);

	return (
		<AuthLayout title="Новий пароль">
			<FormError message={serverError} />

			<form onSubmit={handleSubmit} noValidate className={styles.form}>
				<ResetEmailField email={email} />

				<div className={styles.field}>
					<ResetCodeField
						value={codeValue}
						error={errors.code}
						onChange={handleChange}
					/>
				</div>

				<div className={styles.field}>
					<PasswordInput
						name="password"
						placeholder="Новий пароль"
						label="Новий пароль"
						value={form.password}
						error={errors.password}
						onChange={handleChange}
						autoComplete="new-password"
					/>
					<PasswordStrengthHint value={form.password} />
				</div>

				<div className={styles.field}>
					<PasswordInput
						name="confirmPassword"
						placeholder="Повторіть пароль"
						label="Підтвердити пароль"
						value={form.confirmPassword}
						error={errors.confirmPassword}
						onChange={handleChange}
						autoComplete="new-password"
					/>
				</div>

				<SubmitButton
					loading={loading}
					disabled={isSubmitDisabled}
					label="Встановити пароль"
					loadingLabel="Збереження..."
				/>
			</form>

			<div className={formStyles.formFooter}>
				<Link to="/login" className={formStyles.footerSecondary}>
					<ArrowLeft size={12} style={{ display: 'inline', marginRight: 4 }} />
					Назад до входу
				</Link>
			</div>
		</AuthLayout>
	);
};
