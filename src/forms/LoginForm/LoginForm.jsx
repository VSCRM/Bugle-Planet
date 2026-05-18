import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { FormInput } from '../shared/FormInput';
import { PasswordInput } from '../shared/PasswordInput';
import { PasswordStrengthHint } from '../shared/PasswordStrengthHint';
import { SubmitButton } from '../shared/SubmitButton';
import { FormError } from '../shared/FormError';
import { GoogleLoginButton } from '../shared/GoogleLoginButton';
import { LoginFormFooter } from './LoginFormFooter';
import { ResetSuccessBanner } from './ResetSuccessBanner';
import { validateEmail } from '../../utils/validation';
import { useLoginForm } from '../../hooks/useLoginForm';

export const LoginForm = () => {
	const {
		email,
		password,
		emailError,
		authError,
		loading,
		resetSuccess,
		setEmail,
		setPassword,
		setEmailError,
		handleSubmit,
	} = useLoginForm();

	const handleEmailChange = (event) => {
		const { value } = event.target;
		setEmail(value);
		setEmailError(validateEmail(value));
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const isSubmitDisabled = Boolean(emailError) || !email || !password;

	return (
		<AuthLayout title="Вхід">
			{resetSuccess && <ResetSuccessBanner />}

			<FormError message={authError} />

			<form onSubmit={handleSubmit} noValidate>
				<FormInput
					name="email"
					type="email"
					placeholder="EMAIL"
					value={email}
					error={emailError}
					onChange={handleEmailChange}
					autoComplete="email"
				/>

				<PasswordInput
					name="password"
					placeholder="ПАРОЛЬ"
					value={password}
					onChange={handlePasswordChange}
					autoComplete="current-password"
				/>

				<PasswordStrengthHint value={password} />

				<SubmitButton
					loading={loading}
					disabled={isSubmitDisabled}
					label="УВІЙТИ"
					loadingLabel="Вхід..."
				/>
			</form>

			{/*
			 * GoogleLoginButton is styled and ready.
			 * Pass the real handler once your backend OAuth endpoint exists:
			 *   onLogin={() => initiateGoogleOAuth()}
			 */}
			<GoogleLoginButton onLogin={null} />

			<LoginFormFooter />
		</AuthLayout>
	);
};
