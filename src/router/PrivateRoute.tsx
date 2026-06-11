import {Navigate, useLocation} from "react-router";
import {useAuth} from "../hooks/useAuth";
import type {ReactNode} from "react";

interface PrivateRouteProps {
	children: ReactNode;
}

/**
 * Wraps a route that requires authentication.
 * Unauthenticated users are redirected to `/login`; the current location
 * is stored in router state so they are returned here after logging in.
 */
export function PrivateRoute({
	children,
}: PrivateRouteProps): React.ReactElement {
	const {user} = useAuth();
	const location = useLocation();

	if (!user) {
		return <Navigate to="/login" state={{from: location}} replace />;
	}

	return <>{children}</>;
}
