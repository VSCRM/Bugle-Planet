import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './useAuth';
import { validateEmail, validateNickname, validatePassword } from '../utils/validation';

/** Field-level validators keyed by input name. */
const FIELD_VALIDATORS = {
	email: validateEmail,
	nickname: validateNickname,
	password: validatePassword,
};

export function useRegisterForm() {
	const { register, loading } = useAuth();
	const [form, setForm] = useState({ email: '', nickname: '', password: '' });
	const [errors, setErrors] = useState({});
	const [authError, setAuthError] = useState('');
	const navigate = useNavigate();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));

		const validator = FIELD_VALIDATORS[name];
		if (validator) {
			setErrors((previous) => ({ ...previous, [name]: validator(value) }));
		}
	};

	/** True when there are no validation errors and the required fields are filled. */
	const isValid =
		!errors.email &&
		!errors.nickname &&
		!errors.password &&
		Boolean(form.email) &&
		Boolean(form.password);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setAuthError('');

		const result = await register(form.email, form.password, form.nickname);

		if (!result.success) {
			setAuthError(result.message);
		} else {
			navigate('/profile');
		}
	};

	return {
		form, errors, authError, loading, isValid, handleChange, handleSubmit
	};
}
