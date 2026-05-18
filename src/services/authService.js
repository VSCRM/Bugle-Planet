import bcrypt from 'bcryptjs';
import config from '../config';
import { api } from './api';
import { storage } from './storage';
import { hashPassword } from '../utils/hashPassword';
import { mockDelay } from '../mock/mockDelay';
import { sanitizeEmail, sanitizeNickname } from '../utils/sanitize';
import { sendResetCode } from './emailService';

const BCRYPT_ROUNDS = 10;

function generateCode() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Mock implementation (localStorage) ──────────────────────────────────────

const mockAuth = {
	async login(rawEmail, password) {
		const email = sanitizeEmail(rawEmail);
		if (!email || !password) {
			return { success: false, message: 'Будь ласка, заповніть усі поля!' };
		}

		try {
			const networkHash = hashPassword(password);
			await mockDelay();

			const stored = localStorage.getItem(`user_db_${email}`);
			if (!stored) return { success: false, message: 'Користувача не існує!' };

			let user;
			try { user = JSON.parse(stored); } catch {
				return { success: false, message: 'Помилка даних користувача.' };
			}

			if (!user.bcryptHash) {
				return { success: false, message: 'Помилка даних в системі.' };
			}

			const ok = await bcrypt.compare(networkHash, user.bcryptHash);
			if (!ok) return { success: false, message: 'Невірний пароль!' };

			return { success: true, user: { username: user.username, nickname: user.nickname ?? email } };
		} catch (err) {
			console.error('login error', err);
			return { success: false, message: 'Внутрішня помилка.' };
		}
	},

	async register(rawEmail, password, rawNickname) {
		const email = sanitizeEmail(rawEmail);
		const nickname = rawNickname ? sanitizeNickname(rawNickname) : email.split('@')[0];

		if (!email || !password) {
			return { success: false, message: "Email та пароль є обов'язковими!" };
		}

		await mockDelay();

		if (localStorage.getItem(`user_db_${email}`)) {
			return { success: false, message: 'Цей email вже зайнятий!' };
		}

		const networkHash = hashPassword(password);
		const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
		const bcryptHash = await bcrypt.hash(networkHash, salt);

		localStorage.setItem(`user_db_${email}`, JSON.stringify({ username: email, nickname, bcryptHash }));
		return { success: true, user: { username: email, nickname } };
	},

	async updateUser(username, updates) {
		await mockDelay();
		const raw = localStorage.getItem(`user_db_${username}`);
		if (!raw) return { success: false, message: 'Користувача не знайдено.' };

		let stored;
		try { stored = JSON.parse(raw); } catch {
			return { success: false, message: 'Помилка даних.' };
		}

		const patch = {};
		if (updates.nickname !== undefined) patch.nickname = sanitizeNickname(updates.nickname);
		if (updates.password) {
			const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
			patch.bcryptHash = await bcrypt.hash(hashPassword(updates.password), salt);
		}

		const updated = { ...stored, ...patch };
		localStorage.setItem(`user_db_${username}`, JSON.stringify(updated));
		return { success: true, user: { username: updated.username, nickname: updated.nickname } };
	},

	async forgotPassword(rawEmail) {
		const email = sanitizeEmail(rawEmail);
		if (!email) return { success: false, message: 'Невірний email.' };

		await mockDelay();

		if (!localStorage.getItem(`user_db_${email}`)) {
			return { success: false, message: 'Акаунт з таким email не знайдено.' };
		}

		const code = generateCode();
		const expiry = Date.now() + 15 * 60 * 1000;
		localStorage.setItem(`reset_${email}`, JSON.stringify({ code, expiry }));

		const { sent, devCode } = await sendResetCode(email, code);
		return { success: true, email, sent, devCode };
	},

	async resetPassword(rawEmail, code, newPassword) {
		const email = sanitizeEmail(rawEmail);
		await mockDelay();

		const raw = localStorage.getItem(`reset_${email}`);
		if (!raw) return { success: false, message: 'Код не знайдено. Запросіть новий.' };

		let record;
		try { record = JSON.parse(raw); } catch {
			return { success: false, message: 'Помилка даних.' };
		}

		if (record.code !== code.trim()) return { success: false, message: 'Невірний код.' };
		if (Date.now() > record.expiry) {
			localStorage.removeItem(`reset_${email}`);
			return { success: false, message: 'Код прострочено. Запросіть новий.' };
		}

		const result = await mockAuth.updateUser(email, { password: newPassword });
		if (result.success) localStorage.removeItem(`reset_${email}`);
		return result;
	},
};

// ─── Real API implementation (axios) ─────────────────────────────────────────

const apiAuth = {
	async login(email, password) {
		const { data } = await api.post('/auth/login', {
			email: sanitizeEmail(email),
			passwordHash: hashPassword(password),
		});
		if (data.token) storage.setToken(data.token);
		return data;
	},

	async register(email, password, nickname) {
		const { data } = await api.post('/auth/register', {
			email: sanitizeEmail(email),
			passwordHash: hashPassword(password),
			nickname: nickname ? sanitizeNickname(nickname) : undefined,
		});
		if (data.token) storage.setToken(data.token);
		return data;
	},

	async updateUser(username, updates) {
		const payload = {};
		if (updates.nickname !== undefined) payload.nickname = sanitizeNickname(updates.nickname);
		if (updates.password) payload.passwordHash = hashPassword(updates.password);
		const { data } = await api.put(`/users/${username}`, payload);
		return data;
	},

	async forgotPassword(email) {
		const { data } = await api.post('/auth/forgot-password', { email: sanitizeEmail(email) });
		return data;
	},

	async resetPassword(email, code, newPassword) {
		const { data } = await api.post('/auth/reset-password', {
			email: sanitizeEmail(email),
			code,
			passwordHash: hashPassword(newPassword),
		});
		return data;
	},
};

export const authService = config.USE_MOCK ? mockAuth : apiAuth;
