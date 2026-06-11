import {hash, compare, genSalt} from "bcrypt-ts";
import config from "../config";
import {api} from "./api";
import {storage} from "./storage";
import {hashPassword} from "../utils/hashPassword";
import {guardFormPayload} from "../security/inputGuard";
import {mockDelay} from "../mock/mockDelay";
import {sanitizeEmail, sanitizeNickname} from "../utils/sanitize";
import {sendResetCode} from "./emailService";
import {z} from "zod";
import {ResetRecordSchema} from "../schemas";
import type {AuthResult, ForgotPasswordResponse} from "../schemas";
import {logger} from "../utils/logger";

const BCRYPT_ROUNDS = 10;

/** Generates a random 6-digit numeric code string. */
function generateCode(): string {
	return Math.floor(100_000 + Math.random() * 900_000).toString();
}

/** Interface all auth service implementations must satisfy. */
export interface AuthService {
	login(email: string, password: string): Promise<AuthResult>;
	register(
		email: string,
		password: string,
		nickname: string,
	): Promise<AuthResult>;
	updateUser(username: string, updates: UpdateUserPayload): Promise<AuthResult>;
	forgotPassword(email: string): Promise<ForgotPasswordResponse>;
	resetPassword(
		email: string,
		code: string,
		newPassword: string,
	): Promise<AuthResult>;
}

/** Allowed fields for a profile-update operation. */
export interface UpdateUserPayload {
	nickname?: string;
	password?: string;
}

/**
 * Zod schema for a mock-DB user record stored in localStorage.
 * Kept private to this module — external code works with `User`, not raw records.
 */
const StoredMockUserSchema = z.object({
	username: z.string().min(1),
	nickname: z.string(),
	bcryptHash: z.string().min(1),
});

type StoredMockUser = z.infer<typeof StoredMockUserSchema>;

// ─── Mock implementation (localStorage + bcrypt) ─────────────────────────────

const mockAuth: AuthService = {
	async login(rawEmail: string, password: string): Promise<AuthResult> {
		const email = sanitizeEmail(rawEmail);
		if (!email || !password) {
			return {success: false, message: "fill_all_fields"};
		}

		try {
			const networkHash = hashPassword(password);
			await mockDelay();

			const stored = localStorage.getItem(`user_db_${email}`);
			if (!stored) return {success: false, message: "user_not_found"};

			// Zod-validate the raw localStorage value instead of a blind cast.
			const userResult = StoredMockUserSchema.safeParse(JSON.parse(stored));
			if (!userResult.success) {
				return {success: false, message: "user_data_error"};
			}
			const user: StoredMockUser = userResult.data;

			const ok = await compare(networkHash, user.bcryptHash);
			if (!ok) return {success: false, message: "wrong_password"};

			return {
				success: true,
				user: {username: user.username, nickname: user.nickname},
			};
		} catch (err) {
			logger.error("mockAuth.login failed", err, "authService");
			return {success: false, message: "internal_error"};
		}
	},

	async register(
		rawEmail: string,
		password: string,
		rawNickname: string,
	): Promise<AuthResult> {
		const email = sanitizeEmail(rawEmail);
		const nickname = rawNickname
			? sanitizeNickname(rawNickname)
			: (email.split("@")[0] ?? email);

		if (!email || !password) {
			return {success: false, message: "email_password_required"};
		}

		await mockDelay();

		if (localStorage.getItem(`user_db_${email}`)) {
			return {success: false, message: "email_taken"};
		}

		const networkHash = hashPassword(password);
		const salt = await genSalt(BCRYPT_ROUNDS);
		const bcryptHash = await hash(networkHash, salt);

		const record: StoredMockUser = {username: email, nickname, bcryptHash};
		localStorage.setItem(`user_db_${email}`, JSON.stringify(record));
		return {success: true, user: {username: email, nickname}};
	},

	async updateUser(
		username: string,
		updates: UpdateUserPayload,
	): Promise<AuthResult> {
		await mockDelay();

		const raw = localStorage.getItem(`user_db_${username}`);
		if (!raw) return {success: false, message: "user_not_found_update"};

		// Zod-validate the raw localStorage value instead of a blind cast.
		const storedResult = StoredMockUserSchema.safeParse(JSON.parse(raw));
		if (!storedResult.success) {
			return {success: false, message: "update_data_error"};
		}
		const stored: StoredMockUser = storedResult.data;

		const patch: Partial<StoredMockUser> = {};
		if (updates.nickname !== undefined) {
			patch.nickname = sanitizeNickname(updates.nickname);
		}
		if (updates.password) {
			const salt = await genSalt(BCRYPT_ROUNDS);
			patch.bcryptHash = await hash(hashPassword(updates.password), salt);
		}

		const updated: StoredMockUser = {...stored, ...patch};
		localStorage.setItem(`user_db_${username}`, JSON.stringify(updated));
		return {
			success: true,
			user: {username: updated.username, nickname: updated.nickname},
		};
	},

	async forgotPassword(rawEmail: string): Promise<ForgotPasswordResponse> {
		const email = sanitizeEmail(rawEmail);
		if (!email) return {success: false, message: "invalid_email_auth"};

		await mockDelay();

		if (!localStorage.getItem(`user_db_${email}`)) {
			return {success: false, message: "account_not_found"};
		}

		const code = generateCode();
		const expiry = Date.now() + 15 * 60 * 1000;
		localStorage.setItem(`reset_${email}`, JSON.stringify({code, expiry}));

		const {sent, devCode} = await sendResetCode(email, code);
		return {success: true, email, sent, devCode};
	},

	async resetPassword(
		rawEmail: string,
		code: string,
		newPassword: string,
	): Promise<AuthResult> {
		const email = sanitizeEmail(rawEmail);
		await mockDelay();

		const raw = localStorage.getItem(`reset_${email}`);
		if (!raw) return {success: false, message: "code_not_found"};

		const parsed = ResetRecordSchema.safeParse(JSON.parse(raw));
		if (!parsed.success) return {success: false, message: "update_data_error"};

		const record = parsed.data;
		if (record.code !== code.trim())
			return {success: false, message: "invalid_code"};
		if (Date.now() > record.expiry) {
			localStorage.removeItem(`reset_${email}`);
			return {success: false, message: "code_expired"};
		}

		const result = await mockAuth.updateUser(email, {password: newPassword});
		if (result.success) localStorage.removeItem(`reset_${email}`);
		return result;
	},
};

// ─── Real API implementation (Axios) ─────────────────────────────────────────

const apiAuth: AuthService = {
	async login(email: string, password: string): Promise<AuthResult> {
		const guard = guardFormPayload({email, password});
		if (guard) return {success: false, message: "invalid_input"};
		const {data} = await api.post<AuthResult>("/auth/login", {
			email: sanitizeEmail(email),
			passwordHash: hashPassword(password),
		});
		if (data.success && "token" in data) {
			storage.setToken((data as {token: string}).token);
		}
		return data;
	},

	async register(
		email: string,
		password: string,
		nickname: string,
	): Promise<AuthResult> {
		const {data} = await api.post<AuthResult>("/auth/register", {
			email: sanitizeEmail(email),
			passwordHash: hashPassword(password),
			nickname: nickname ? sanitizeNickname(nickname) : undefined,
		});
		if (data.success && "token" in data) {
			storage.setToken((data as {token: string}).token);
		}
		return data;
	},

	async updateUser(
		username: string,
		updates: UpdateUserPayload,
	): Promise<AuthResult> {
		const payload: Record<string, string> = {};
		if (updates.nickname !== undefined)
			payload["nickname"] = sanitizeNickname(updates.nickname);
		if (updates.password)
			payload["passwordHash"] = hashPassword(updates.password);
		const {data} = await api.put<AuthResult>(`/users/${username}`, payload);
		return data;
	},

	async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
		const {data} = await api.post<ForgotPasswordResponse>(
			"/auth/forgot-password",
			{
				email: sanitizeEmail(email),
			},
		);
		return data;
	},

	async resetPassword(
		email: string,
		code: string,
		newPassword: string,
	): Promise<AuthResult> {
		const {data} = await api.post<AuthResult>("/auth/reset-password", {
			email: sanitizeEmail(email),
			code,
			passwordHash: hashPassword(newPassword),
		});
		return data;
	},
};

export const authService: AuthService = config.USE_MOCK ? mockAuth : apiAuth;
