import { useState } from 'react';
import { validatePasswordOptional } from '../utils/validation';

/**
 * Drives the edit-profile form.
 * Password is optional — leaving it empty keeps the existing password.
 *
 * @param {{ nickname: string }} user   - Current user object.
 * @param {(payload: object) => Promise<void>} onSave - Called with the changed fields.
 */
export function useEditProfileForm(user, onSave) {
	const [form, setForm] = useState({ nickname: user?.nickname ?? '', password: '' });
	const [errors, setErrors] = useState({ password: '' });

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));

		// Validate password on every keystroke so hints update in real time.
		if (name === 'password') {
			setErrors((previous) => ({ ...previous, password: validatePasswordOptional(value) }));
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Re-check password before submit in case the user bypassed onChange.
		const passwordError = validatePasswordOptional(form.password);
		if (passwordError) {
			setErrors((previous) => ({ ...previous, password: passwordError }));
			return;
		}

		// Build a patch object that contains only what actually changed.
		const payload = {};
		if (form.nickname && form.nickname !== user?.nickname) payload.nickname = form.nickname;
		if (form.password) payload.password = form.password;

		// Nothing changed — skip the network call.
		if (!Object.keys(payload).length) return;

		await onSave(payload);

		// Clear the password field after a successful save.
		setForm((previous) => ({ ...previous, password: '' }));
		setErrors({ password: '' });
	};

	/** Block submission while the password field has a validation error. */
	const isSubmitDisabled = Boolean(errors.password);

	return {
		form, errors, isSubmitDisabled, handleChange, handleSubmit
	};
}
