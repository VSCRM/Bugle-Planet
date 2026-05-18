import { FormInput } from '../shared/FormInput';

/** Six-digit confirmation code entry. */
export const ResetCodeField = ({ value, error, onChange }) => (
	<FormInput
		name="code"
		placeholder="6-значний код"
		label="Код підтвердження"
		value={value}
		error={error}
		onChange={onChange}
		autoComplete="one-time-code"
	/>
);
