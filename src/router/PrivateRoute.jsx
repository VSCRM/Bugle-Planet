import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute({ children }) {
	const { user } = useAuth();
	const location = useLocation();

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
}
