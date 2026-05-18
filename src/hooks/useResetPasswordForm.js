import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../services/authService';
import { validatePassword } from '../utils/validation';

/**
 * Manages the reset-password form.
 *
 * @param {string} email - The address to reset the password for.
 *                         Passed in from router location state.
 */
export function useResetPasswordForm(email) {
	const [form, setForm] = useState({ code: '', password: '', confirmPassword: '' });
	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));

		if (name === 'password') {
			setErrors((previous) => ({ ...previous, password: validatePassword(value) }));
		}

		if (name === 'confirmPassword') {
			// Compare against the current password field, not the stale closure value.
			setErrors((previous) => ({
				...previous,
				confirmPassword: value !== form.password ? 'Паролі не збігаються' : '',
			}));
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setServerError('');

		// Final validation before the network call.
		const passwordError = validatePassword(form.password);
		const confirmError = form.password !== form.confirmPassword ? 'Паролі не збігаються' : '';

		if (passwordError || confirmError) {
			setErrors({ password: passwordError, confirmPassword: confirmError });
			return;
		}

		setLoading(true);

		try {
			const response = await authService.resetPassword(email, form.code, form.password);

			if (response.success) {
				// Redirect to login and show a one-time success banner.
				navigate('/login', { state: { resetSuccess: true } });
			} else {
				setServerError(response.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		form, errors, serverError, loading, handleChange, handleSubmit
	};
}
