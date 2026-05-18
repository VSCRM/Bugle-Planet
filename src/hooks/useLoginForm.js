import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from './useAuth';

export function useLoginForm() {
	const { login, loading } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [authError, setAuthError] = useState('');
	const navigate = useNavigate();
	const location = useLocation();

	/** Route the user came from, or /profile as the default destination. */
	const redirectTo = location.state?.from?.pathname ?? '/profile';

	/** True when the user just completed a successful password reset. */
	const resetSuccess = location.state?.resetSuccess ?? false;

	const handleSubmit = async (event) => {
		event.preventDefault();
		setAuthError('');

		const result = await login(email, password);

		if (!result.success) {
			setAuthError(result.message);
		} else {
			navigate(redirectTo, { replace: true });
		}
	};

	return {
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
	};
}
