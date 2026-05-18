import { FormInput } from '../shared/FormInput';

/** Nickname input for the edit-profile form. */
export const NicknameField = ({ value, onChange }) => (
	<FormInput
		name="nickname"
		placeholder="Новий нікнейм"
		label="Нікнейм"
		value={value}
		onChange={onChange}
		autoComplete="off"
		required={false}
	/>
);
