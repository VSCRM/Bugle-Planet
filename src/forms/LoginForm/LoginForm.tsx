/**
 * Login form.
 *
 * Email is validated on every keystroke (onChange) matching the original
 * real-time behaviour — not on blur.
 */
import {type ChangeEvent} from "react";
import {AuthLayout} from "../../components/AuthLayout/AuthLayout";
import {FormInput} from "../shared/FormInput";
import {PasswordInput} from "../shared/PasswordInput";
import {PasswordStrengthHint} from "../shared/PasswordStrengthHint";
import {SubmitButton} from "../shared/SubmitButton";
import {FormError} from "../shared/FormError";
import {GoogleLoginButton} from "../shared/GoogleLoginButton";
import {LoginFormFooter} from "./LoginFormFooter";
import {ResetSuccessBanner} from "./ResetSuccessBanner";
import {validateEmail} from "../../utils/validation";
import {useLoginForm} from "../../hooks/useLoginForm";
import {useLocale} from "../../i18n/LocaleContext";

export function LoginForm(): React.ReactElement {
	const {t} = useLocale();
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

	/** Validate email on every keystroke — real-time feedback. */
	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const val = e.target.value;
		setEmail(val);
		const key = validateEmail(val);
		const validationTranslations = t.validation as Record<string, any>;
		setEmailError(key ? (validationTranslations[key] ?? "") : "");
	};

	const isSubmitDisabled = Boolean(emailError) || !email || !password;

	return (
		<AuthLayout title={t.login.heading}>
			{resetSuccess && <ResetSuccessBanner />}
			<FormError message={authError} />

			<form onSubmit={(e) => void handleSubmit(e)} noValidate>
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
					placeholder={t.login.passwordLabel.toUpperCase()}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="current-password"
				/>
				<PasswordStrengthHint password={password} />

				<SubmitButton
					loading={loading}
					disabled={isSubmitDisabled}
					label={t.login.submitBtn.toUpperCase()}
					loadingLabel={t.login.loadingBtn}
				/>
			</form>

			<GoogleLoginButton
				onLogin={() => {
					/* wire up when backend OAuth is ready */
				}}
			/>
			<LoginFormFooter />
		</AuthLayout>
	);
}
