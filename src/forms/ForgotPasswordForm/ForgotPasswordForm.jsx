import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { FormInput } from '../shared/FormInput';
import { SubmitButton } from '../shared/SubmitButton';
import { FormError } from '../shared/FormError';
import { ResetCodeDisplay } from './ResetCodeDisplay';
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm';
import styles from './ForgotPasswordForm.module.css';
import formStyles from '../shared/forms.module.css';

export const ForgotPasswordForm = () => {
	const {
		email,
		emailError,
		loading,
		serverError,
		result,
		handleEmailChange,
		handleSubmit,
	} = useForgotPasswordForm();

	/* After the code is dispatched, switch to the confirmation screen. */
	if (result) {
		return (
			<AuthLayout title="Код надіслано">
				<ResetCodeDisplay
					email={result.email}
					sent={result.sent}
					devCode={result.devCode}
				/>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout title="Забули пароль?">
			<p className={styles.desc}>
				Введіть email вашого акаунту — ми надішлемо код для скидання пароля.
			</p>

			<FormError message={serverError} />

			<form onSubmit={handleSubmit} noValidate>
				<FormInput
					name="email"
					type="email"
					placeholder="Ваш email"
					value={email}
					error={emailError}
					onChange={handleEmailChange}
					autoComplete="email"
				/>

				<SubmitButton
					loading={loading}
					disabled={Boolean(emailError) || !email}
					label="Надіслати код"
					loadingLabel="Надсилаємо..."
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
