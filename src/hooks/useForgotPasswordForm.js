import { useState } from 'react';
import { authService } from '../services/authService';
import { validateEmail } from '../utils/validation';

export function useForgotPasswordForm() {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [loading, setLoading] = useState(false);
	const [serverError, setServerError] = useState('');
	/**
	 * Set after a successful request.
	 * Shape: { email: string, sent: boolean, devCode?: string }
	 */
	const [result, setResult] = useState(null);

	const handleEmailChange = (event) => {
		const value = event.target.value;
		setEmail(value);
		setEmailError(validateEmail(value));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Re-validate before submitting in case the field was never touched.
		const validationError = validateEmail(email);
		if (validationError) {
			setEmailError(validationError);
			return;
		}

		setServerError('');
		setLoading(true);

		try {
			const response = await authService.forgotPassword(email);

			if (response.success) {
				setResult({
					email: response.email,
					sent: response.sent,
					devCode: response.devCode,
				});
			} else {
				setServerError(response.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		email, emailError, loading, serverError, result, handleEmailChange, handleSubmit
	};
}
