import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './useAuth';

export function useProfilePage() {
	const { user, logout, updateUser, loading, savedArticles, unsaveArticle } = useAuth();
	const navigate = useNavigate();
	const [editing, setEditing] = useState(false);
	const [saveError, setSaveError] = useState('');

	const [savedType, setSavedType] = useState(null);
	const toastTimerRef = useRef(null);

	useEffect(() => {
		return () => {
			if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		};
	}, []);

	/** Log the user out and redirect to the home page. */
	const handleLogout = () => {
		logout();
		navigate('/');
	};

	/** Persist profile changes and show a success toast for 3.5 s. */
	const handleSave = async (payload) => {
		setSaveError('');
		try {
			await updateUser(payload);
		} catch (err) {
			setSaveError(err?.message ?? 'Не вдалося зберегти зміни.');
			return;
		}

		// Determine which combination of fields was updated.
		if (payload.nickname && payload.password) setSavedType('both');
		else if (payload.nickname) setSavedType('nickname');
		else setSavedType('password');

		setEditing(false);

		// Cancel any previous timer before starting a new one.
		if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		toastTimerRef.current = setTimeout(() => {
			setSavedType(null);
			toastTimerRef.current = null;
		}, 3500);
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
		saveError,
		handleLogout,
		handleSave,
		toggleEditing,
		closeEditing,
	};
}
