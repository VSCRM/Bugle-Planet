import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../hooks/useEditProfileForm', () => ({
	useEditProfileForm: () => ({
		form: { nickname: 'OldNick', password: '' },
		errors: { password: '' },
		isSubmitDisabled: false,
		handleChange: vi.fn(),
		handleSubmit: vi.fn(),
	}),
}));

import { EditProfileForm } from './EditProfileForm';

const renderForm = () =>
	render(
		<EditProfileForm
			user={{ username: 'user@example.com', nickname: 'OldNick' }}
			onSave={vi.fn()}
			onCancel={vi.fn()}
			loading={false}
		/>,
	);

describe('EditProfileForm', () => {
	it('renders the nickname input', () => {
		renderForm();
		expect(screen.getByPlaceholderText('Новий нікнейм')).toBeInTheDocument();
	});

	it('renders the password input', () => {
		renderForm();
		expect(screen.getByPlaceholderText('Залиш порожнім, щоб не змінювати')).toBeInTheDocument();
	});

	it('renders Save and Cancel buttons', () => {
		renderForm();
		expect(screen.getByText('Зберегти')).toBeInTheDocument();
		expect(screen.getByText('Скасувати')).toBeInTheDocument();
	});

	it('calls onCancel when Cancel is clicked', async () => {
		const onCancel = vi.fn();
		render(
			<EditProfileForm
				user={{ username: 'user@example.com', nickname: 'OldNick' }}
				onSave={vi.fn()}
				onCancel={onCancel}
				loading={false}
			/>,
		);
		await userEvent.click(screen.getByText('Скасувати'));
		expect(onCancel).toHaveBeenCalled();
	});
});
