import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileInfo } from './ProfileInfo';

const MOCK_USER = { username: 'Admin123', nickname: 'BugEditor' };

describe('ProfileInfo', () => {
	it('displays the user nickname', () => {
		render(<ProfileInfo user={MOCK_USER} onEdit={() => { }} />);
		expect(screen.getByText(MOCK_USER.nickname)).toBeInTheDocument();
	});

	it('displays the username prepended with @', () => {
		render(<ProfileInfo user={MOCK_USER} onEdit={() => { }} />);
		expect(screen.getByText(`@${MOCK_USER.username}`)).toBeInTheDocument();
	});

	it('displays the first letter of the nickname inside the avatar', () => {
		render(<ProfileInfo user={MOCK_USER} onEdit={() => { }} />);
		expect(screen.getByText('B')).toBeInTheDocument();
	});

	it('calls onEdit when the edit button is clicked', () => {
		const onEdit = vi.fn();
		render(<ProfileInfo user={MOCK_USER} onEdit={onEdit} />);

		fireEvent.click(screen.getByText(/редагувати/i));
		expect(onEdit).toHaveBeenCalledTimes(1);
	});

	it('fallback to username if nickname is missing', () => {
		const userWithoutNickname = { username: 'Plain123' };
		render(<ProfileInfo user={userWithoutNickname} onEdit={() => { }} />);

		expect(screen.getByText(userWithoutNickname.username)).toBeInTheDocument();
	});
});
