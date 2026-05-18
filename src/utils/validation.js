const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_UPPER = /[A-Z]/;
const HAS_DIGIT = /[0-9]/;
const HAS_NON_ASCII = /[\u0080-\uFFFF]/;

export const validateEmail = (value) => {
	if (!value) return "Обов'язкове поле";
	if (!EMAIL_RE.test(value)) return 'Невірний формат email';
	if (value.length > 254) return 'Email занадто довгий';
	return '';
};

export const validateNickname = (value) => {
	if (!value) return "Обов'язкове поле";
	if (value.length < 2) return 'Мінімум 2 символи';
	if (value.length > 32) return 'Максимум 32 символи';
	return '';
};

export const validatePassword = (value) => {
	if (!value) return "Обов'язкове поле";
	if (value.length < 6) return 'Мінімум 6 символів';
	if (HAS_NON_ASCII.test(value)) return 'Лише латинські символи (англійська)';
	if (!HAS_UPPER.test(value)) return 'Потрібна хоча б одна велика літера';
	if (!HAS_DIGIT.test(value)) return 'Потрібна хоча б одна цифра';
	return '';
};

/** Same rules but empty string is valid (used in profile edit). */
export const validatePasswordOptional = (value) => {
	if (!value) return '';
	return validatePassword(value);
};

/** Returns null or { level: 'weak'|'medium'|'strong', label: string } */
export const getPasswordStrength = (value) => {
	if (!value) return null;
	// Non-ASCII characters (e.g. Cyrillic) immediately make the password weak.
	if (HAS_NON_ASCII.test(value)) return { level: 'weak', label: 'Слабкий' };
	let score = 0;
	if (value.length >= 6) score++;
	if (value.length >= 10) score++;
	if (HAS_UPPER.test(value)) score++;
	if (HAS_DIGIT.test(value)) score++;
	if (/[^a-zA-Z0-9]/.test(value)) score++;
	if (score <= 1) return { level: 'weak', label: 'Слабкий' };
	if (score <= 3) return { level: 'medium', label: 'Середній' };
	return { level: 'strong', label: 'Надійний' };
};

export const VALIDATORS = {
	email: validateEmail,
	nickname: validateNickname,
	password: validatePassword,
};
