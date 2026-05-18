import { useCallback } from 'react';
import { authService } from '../services/authService';

export function useUpdateUser(user, setUser, setLoading) {
	return useCallback(async (newData) => {
		setLoading(true);
		try {
			const result = await authService.updateUser(user.username, newData);
			if (result.success) setUser(result.user);
			return result;
		} finally {
			setLoading(false);
		}
	}, [user, setUser, setLoading]);
};
