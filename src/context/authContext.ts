import {createContext, useContext} from "react";
import type {
	User,
	Article,
	AuthResult,
	ForgotPasswordResponse,
} from "../schemas";
import type {UpdateUserPayload} from "../services/authService";

/** All values exposed by the AuthContext to consumers. */
export interface AuthContextValue {
	user: User | null;
	loading: boolean;
	savedArticles: Article[];
	login: (email: string, password: string) => Promise<AuthResult>;
	register: (
		email: string,
		password: string,
		nickname: string,
	) => Promise<AuthResult>;
	logout: () => void;
	updateUser: (payload: UpdateUserPayload) => Promise<AuthResult>;
	saveArticle: (article: Article) => "saved" | "redirect";
	unsaveArticle: (id: number) => void;
	forgotPassword?: (email: string) => Promise<ForgotPasswordResponse>;
}

/** React context — initialised to `null`; always consumed through `useAuth`. */
export const AuthContext = createContext<AuthContextValue | null>(null);

/** Type-safe hook for consuming AuthContext. Throws if used outside AuthProvider. */
export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
	return ctx;
}
