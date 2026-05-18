import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './useAuth';

/**
 * Encapsulates all logic for the ProfilePage:
 * logout, editing mode toggling, and saving profile changes.
 */
export function useProfilePage() {
	const { user, logout, updateUser, loading, savedArticles, unsaveArticle } = useAuth();
	const navigate = useNavigate();
	const [editing, setEditing] = useState(false);

	/** Tracks which fields were saved so the correct Toast message is shown. */
	const [savedType, setSavedType] = useState(null);

	/** Log the user out and redirect to the home page. */
	const handleLogout = () => {
		logout();
		navigate('/');
	};

	/** Persist profile changes and show a success toast for 3.5 s. */
	const handleSave = async (payload) => {
		await updateUser(payload);

		// Determine which combination of fields was updated.
		if (payload.nickname && payload.password) setSavedType('both');
		else if (payload.nickname) setSavedType('nickname');
		else setSavedType('password');

		setEditing(false);
		setTimeout(() => setSavedType(null), 3500);
	};

	const toggleEditing = () => setEditing((previous) => !previous);
	const closeEditing = () => setEditing(false);

	return {
		user,
		loading,
		savedArticles,
		unsaveArticle,
		editing,
		savedType,
		handleLogout,
		handleSave,
		toggleEditing,
		closeEditing,
	};
}
