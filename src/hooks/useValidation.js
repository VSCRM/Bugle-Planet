import { useState, useCallback } from 'react';
import { VALIDATORS } from '../utils/validation';

export function useValidation() {
	const [errors, setErrors] = useState({});

	const validate = useCallback((name, value) => {
		const validator = VALIDATORS[name];
		const error = validator ? validator(value) : '';
		setErrors((prev) => ({ ...prev, [name]: error }));
		return error;
	}, []);

	// True only when every field has passed validation (no non-empty error strings).
	const isValid = Object.values(errors).every((error) => !error);

	const resetErrors = useCallback(() => setErrors({}), []);

	return {
		errors, validate, isValid, resetErrors
	};
}
