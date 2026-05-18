import { useEditProfileForm } from '../../hooks/useEditProfileForm';
import { NicknameField } from './NicknameField';
import { ProfilePasswordField } from './ProfilePasswordField';
import { ProfileFormActions } from './ProfileFormActions';
import styles from './EditProfileForm.module.css';

/**
 * Edit-profile form.
 * Both fields are optional — leaving them unchanged submits nothing.
 */
export const EditProfileForm = ({ user, onSave, onCancel, loading }) => {
	const { form, errors, isSubmitDisabled, handleChange, handleSubmit } =
		useEditProfileForm(user, onSave);

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			<p className={styles.title}>Редагування профілю</p>

			<NicknameField value={form.nickname} onChange={handleChange} />

			<ProfilePasswordField
				value={form.password}
				error={errors.password}
				onChange={handleChange}
			/>

			<ProfileFormActions
				loading={loading}
				isDisabled={isSubmitDisabled}
				onCancel={onCancel}
			/>
		</form>
	);
};
