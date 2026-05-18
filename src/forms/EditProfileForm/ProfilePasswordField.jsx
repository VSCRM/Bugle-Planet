import { PasswordInput } from '../shared/PasswordInput';
import { PasswordStrengthHint } from '../shared/PasswordStrengthHint';

/**
 * Password field for the edit-profile form.
 * Includes the live strength hint below the input.
 * The field is optional — leaving it empty keeps the current password.
 */
export const ProfilePasswordField = ({ value, error, onChange }) => (
	<>
		<PasswordInput
			name="password"
			placeholder="Залиш порожнім, щоб не змінювати"
			label="Новий пароль"
			value={value}
			error={error}
			onChange={onChange}
			autoComplete="new-password"
			required={false}
		/>
		<PasswordStrengthHint value={value} />
	</>
);
