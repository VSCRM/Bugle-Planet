/**
 * Shared test utilities.
 *
 * `TestWrapper` — wraps children in every context provider required by the app:
 *   LocaleProvider → MemoryRouter → AuthContext
 *
 * All component tests that render routes, auth state, or translations should
 * use this wrapper. That way each test file stays focused on behaviour rather
 * than plumbing.
 */

import React, {type ReactNode} from "react";
import {MemoryRouter} from "react-router";
import {LocaleProvider} from "../i18n/LocaleContext";
import {AuthContext, type AuthContextValue} from "../context/authContext";
import type {User, Article} from "../schemas";
import {vi} from "vitest";

/** Default no-op auth context for tests that do not care about auth state. */
export function makeAuthContext(
	overrides?: Partial<AuthContextValue>,
): AuthContextValue {
	return {
		user: null,
		loading: false,
		savedArticles: [],
		login: vi.fn(),
		register: vi.fn(),
		logout: vi.fn(),
		updateUser: vi.fn(),
		saveArticle: vi.fn().mockReturnValue("saved"),
		unsaveArticle: vi.fn(),
		...overrides,
	};
}

/** A pre-built logged-in user for use in tests. */
export const MOCK_USER: User = {
	username: "test@example.com",
	nickname: "Tester",
};

/** A pre-built valid article for use in tests. */
export const MOCK_ARTICLE: Article = {
	id: 1,
	title: "Test Article Title",
	category: "Місто",
	excerpt: "Test excerpt text",
	date: "2026-02-13",
	image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800",
	author: "Test Author",
};

interface TestWrapperProps {
	children: ReactNode;
	authValue?: Partial<AuthContextValue>;
	initialRoute?: string;
}

/**
 * Full provider stack for component tests:
 *   LocaleProvider → MemoryRouter → AuthContext.Provider
 *
 * @param authValue    - Optional AuthContext overrides (defaults to no user).
 * @param initialRoute - Initial path for MemoryRouter (default: '/').
 */
export function TestWrapper({
	children,
	authValue,
	initialRoute = "/",
}: TestWrapperProps): React.ReactElement {
	const context = makeAuthContext(authValue);
	return (
		<LocaleProvider>
			<MemoryRouter initialEntries={[initialRoute]}>
				<AuthContext.Provider value={context}>{children}</AuthContext.Provider>
			</MemoryRouter>
		</LocaleProvider>
	);
}

/**
 * Minimal wrapper for components that only need `LocaleProvider`
 * (no router, no auth).
 */
export function LocaleWrapper({
	children,
}: {
	children: ReactNode;
}): React.ReactElement {
	return <LocaleProvider>{children}</LocaleProvider>;
}
