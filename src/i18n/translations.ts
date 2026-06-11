/**
 * @module i18n/translations
 *
 * Application translation dictionaries.
 * Both languages must always contain the same set of keys — TypeScript will
 * flag a missing key as a type error because `uk` is typed as `typeof en`.
 */

export const en = {
	// ─── Navigation ─────────────────────────────────────────────────────────────
	nav: {
		home: "News",
		search: "Search",
		profile: "Profile",
		login: "Sign In",
		register: "Sign Up",
		logoAlt: "Bugle Planet — go to home",
		mainNav: "Main navigation",
	},

	// ─── Home page ───────────────────────────────────────────────────────────────
	home: {
		heading: "Kalush News",
		loading: "Loading news…",
		searchPlaceholder: "Search news…",
		searchLabel: "Search by headline or description",
		dateLabel: "Filter by date",
		clearFilters: "Clear",
		categoryNav: "Filter by category",
		allCategories: "All",
		found: "Found:",
		articles: "articles",
		empty: "No articles found. Try a different query.",
		error: "Error: ",
	},

	// ─── Search page ─────────────────────────────────────────────────────────────
	search: {
		inputPlaceholder: "Search news…",
		inputLabel: "Search",
		dateLabel: "Filter by date",
		resetFilters: "Reset",
		foundOf: (count: number, total: number) => `Found: ${count} of ${total}`,
		noResults: "Nothing found. Try a different query.",
	},

	// ─── Sort control ─────────────────────────────────────────────────────────────
	sort: {
		newestFirst: "Newest first",
		oldestFirst: "Oldest first",
		ariaNewest: "Sort from oldest to newest",
		ariaOldest: "Sort from newest to oldest",
	},

	// ─── News card ────────────────────────────────────────────────────────────────
	card: {
		save: "Save",
		saved: "Saved",
		remove: "Remove",
		readMore: "Read more",
		saveAriaLabel: "Save article",
		removeAriaLabel: "Remove from saved",
	},

	// ─── News detail page ─────────────────────────────────────────────────────────
	detail: {
		loading: "Loading…",
		notFound: "Article not found",
		loadError: "Failed to load article.",
		back: "BACK",
		save: "SAVE",
		saved: "SAVED",
	},

	// ─── Profile page ─────────────────────────────────────────────────────────────
	profile: {
		heading: "Profile",
		editBtn: "✏️ Edit",
		logoutBtn: "Sign Out",
		infoLabel: "Profile information",
		savedHeading: (count: number) => `Saved articles (${count})`,
		savedEmpty: "No saved articles. Save interesting news with 🔖",
		removeArticle: (title: string) => `Remove from saved: ${title}`,
		readArticle: (title: string) => `Read article: ${title}`,
		toast: {
			nickname: "Nickname updated successfully",
			password: "Password updated successfully",
			both: "Nickname and password updated successfully",
		},
	},

	// ─── Edit profile form ────────────────────────────────────────────────────────
	editProfile: {
		formLabel: "Edit profile form",
		title: "Edit profile",
		nicknameLabel: "Nickname",
		passwordLabel: "New password (leave blank to keep current)",
		saveBtn: "Save",
		cancelBtn: "Cancel",
		placeholder: {
			nickname: "New nickname",
			password: "Leave blank to keep unchanged",
		},
	},

	// ─── Auth: login ─────────────────────────────────────────────────────────────
	login: {
		heading: "Sign In",
		emailLabel: "Email",
		passwordLabel: "Password",
		submitBtn: "Sign In",
		loadingBtn: "Loading…",
		forgotPasswordText: "Forgot password?",
		noAccountText: "No account yet?",
		noAccountLink: "Create account",
		resetSuccessMsg: "Password changed successfully! You can now sign in.",
	},

	// ─── Auth: register ───────────────────────────────────────────────────────────
	register: {
		heading: "Register",
		emailLabel: "Email",
		nicknameLabel: "Nickname (optional)",
		passwordLabel: "Password",
		submitBtn: "Create account",
		loadingBtn: "Loading…",
		hasAccountText: "Already have an account?",
		hasAccountLink: "Sign in",
	},

	// ─── Auth: forgot password ────────────────────────────────────────────────────
	forgotPassword: {
		heading: "Forgot password?",
		desc: "Enter your account email — we will send a reset code.",
		emailPlaceholder: "Your email",
		submitBtn: "Send code",
		loadingBtn: "Sending…",
		backToLogin: "Back to sign in",
		codeSentTitle: "Code sent",
		checkEmail: "Check your inbox",
		devCodeTitle: "Developer code",
		codeSentDesc: (email: string) =>
			`Code sent to ${email}. If you don't see it, check Spam.`,
		devCodeDesc:
			"EmailJS is not configured. Use this code for development (set VITE_EMAILJS_* in .env to send real emails):",
		codeValid: "Code valid for 15 minutes.",
		enterCode: "Enter code →",
		copyCode: "Copy code",
	},

	// ─── Auth: reset password ─────────────────────────────────────────────────────
	resetPassword: {
		heading: "New password",
		emailLabel: "Email",
		codeLabel: "Confirmation code",
		codePlaceholder: "6-digit code",
		newPasswordLabel: "New password",
		confirmLabel: "Confirm password",
		submitBtn: "Set password",
		loadingBtn: "Saving…",
		backToLogin: "Back to sign in",
	},

	// ─── Password strength ────────────────────────────────────────────────────────
	passwordStrength: {
		weak: "Weak",
		medium: "Medium",
		strong: "Strong",
		ariaLabel: (level: string) => `Password strength: ${level}`,
	},

	// ─── Shared form ─────────────────────────────────────────────────────────────
	form: {
		showPassword: "Show password",
		hidePassword: "Hide password",
		googleLogin: "Sign in with Google",
		orDivider: "or",
		closeNotice: "Close notification",
	},

	// ─── Validation messages ──────────────────────────────────────────────────────
	validation: {
		required: "Required field",
		invalidEmail: "Invalid email format",
		emailTooLong: "Email is too long",
		minNickname: "Minimum 2 characters",
		maxNickname: "Maximum 32 characters",
		minPassword: "Minimum 6 characters",
		latinOnly: "Latin characters only (English)",
		passwordUpper: "At least one uppercase letter required",
		passwordDigit: "At least one digit required",
		/** Per-rule labels shown inside PasswordStrengthHint checklist. */
		rules: {
			minLength: "Minimum 6 characters",
			latinOnly: "Latin characters only (English)",
			upperCase: "At least one uppercase letter",
			digit: "At least one digit",
		},
	},

	// ─── Layout / footer ─────────────────────────────────────────────────────────
	layout: {
		footerTitle: "© 2026 BUGLE PLANET",
		footerSub: "Kalush, Ivano-Frankivsk region • Independent publication",
		city: "Kalush",
	},

	// ─── Article layout ───────────────────────────────────────────────────────────
	article: {
		back: "BACK",
	},
	// ─── Auth service errors ──────────────────────────────────────────────────────
	auth: {
		fill_all_fields: "Please fill in all fields!",
		user_not_found: "User not found!",
		user_data_error: "User data error.",
		wrong_password: "Incorrect password!",
		internal_error: "Internal error. Please try again.",
		email_password_required: "Email and password are required!",
		email_taken: "This email is already registered!",
		user_not_found_update: "User not found.",
		update_data_error: "Data error.",
		not_authorized: "Not authorized.",
		invalid_email_auth: "Invalid email.",
		account_not_found: "No account found with this email.",
		code_not_found: "Code not found. Please request a new one.",
		invalid_code: "Invalid code.",
		code_expired: "Code expired. Please request a new one.",
		invalid_input: "Invalid input.",
		tooManyAttempts: (minutes: number) =>
			`Too many attempts. Try again in ${minutes} min.`,
	},
};

/** Ukrainian translation — must mirror the shape of `en`. */
export const uk: typeof en = {
	nav: {
		home: "Новини",
		search: "Пошук",
		profile: "Профіль",
		login: "Увійти",
		register: "Реєстрація",
		logoAlt: "Bugle Planet — повернутись на головну",
		mainNav: "Основна навігація",
	},
	home: {
		heading: "Новини Калуша",
		loading: "Завантаження новин…",
		searchPlaceholder: "Пошук новин…",
		searchLabel: "Пошук за заголовком або описом",
		dateLabel: "Фільтр за датою",
		clearFilters: "Очистити",
		categoryNav: "Фільтр за категоріями",
		allCategories: "Всі",
		found: "Знайдено:",
		articles: "статей",
		empty: "Статей не знайдено. Спробуйте інший запит.",
		error: "Помилка: ",
	},
	search: {
		inputPlaceholder: "Пошук новин…",
		inputLabel: "Пошук",
		dateLabel: "Фільтр за датою",
		resetFilters: "Скинути",
		foundOf: (count: number, total: number) => `Знайдено: ${count} з ${total}`,
		noResults: "Нічого не знайдено. Спробуй інший запит.",
	},
	sort: {
		newestFirst: "Нові спочатку",
		oldestFirst: "Старі спочатку",
		ariaNewest: "Сортувати від старих до нових",
		ariaOldest: "Сортувати від нових до старих",
	},
	card: {
		save: "Зберегти",
		saved: "Збережено",
		remove: "Видалити",
		readMore: "Читати далі",
		saveAriaLabel: "Зберегти статтю",
		removeAriaLabel: "Видалити зі збережених",
	},
	detail: {
		loading: "Завантаження…",
		notFound: "Новину не знайдено",
		loadError: "Не вдалося завантажити статтю.",
		back: "НАЗАД",
		save: "ЗБЕРЕГТИ",
		saved: "ЗБЕРЕЖЕНО",
	},
	profile: {
		heading: "Профіль",
		editBtn: "✏️ Редагувати",
		logoutBtn: "Вийти",
		infoLabel: "Інформація про профіль",
		savedHeading: (count: number) => `Збережені статті (${count})`,
		savedEmpty:
			"Збережених статей ще немає. Знайдіть цікаву новину та натисніть 🔖",
		removeArticle: (title: string) => `Видалити зі збережених: ${title}`,
		readArticle: (title: string) => `Читати статтю: ${title}`,
		toast: {
			nickname: "Нікнейм успішно змінено",
			password: "Пароль успішно змінено",
			both: "Нікнейм та пароль успішно змінено",
		},
	},
	editProfile: {
		formLabel: "Форма редагування профілю",
		title: "Редагування профілю",
		nicknameLabel: "Нікнейм",
		passwordLabel: "Новий пароль (залиш порожнім, щоб не змінювати)",
		saveBtn: "Зберегти",
		cancelBtn: "Скасувати",
		placeholder: {
			nickname: "Новий нікнейм",
			password: "Залиш порожнім, щоб не змінювати",
		},
	},
	login: {
		heading: "Вхід",
		emailLabel: "Email",
		passwordLabel: "Пароль",
		submitBtn: "Увійти",
		loadingBtn: "Завантаження…",
		forgotPasswordText: "Забули пароль?",
		noAccountText: "Ще немає акаунту?",
		noAccountLink: "Створити акаунт",
		resetSuccessMsg: "Пароль успішно змінено! Тепер ви можете увійти.",
	},
	register: {
		heading: "Реєстрація",
		emailLabel: "Email",
		nicknameLabel: "Нікнейм (необов'язково)",
		passwordLabel: "Пароль",
		submitBtn: "Зареєструватись",
		loadingBtn: "Завантаження…",
		hasAccountText: "Вже є акаунт?",
		hasAccountLink: "Увійти",
	},
	forgotPassword: {
		heading: "Забули пароль?",
		desc: "Введіть email вашого акаунту — ми надішлемо код для скидання пароля.",
		emailPlaceholder: "Ваш email",
		submitBtn: "Надіслати код",
		loadingBtn: "Надсилаємо…",
		backToLogin: "Назад до входу",
		codeSentTitle: "Код надіслано",
		checkEmail: "Перевірте пошту",
		devCodeTitle: "Код для розробника",
		codeSentDesc: (email: string) =>
			`Код надіслано на ${email}. Якщо листа немає — перевірте папку «Спам».`,
		devCodeDesc:
			"EmailJS не налаштований. Використай цей код для розробки (налаштуй VITE_EMAILJS_* у .env, щоб надсилати справжні листи):",
		codeValid: "Код дійсний 15 хвилин.",
		enterCode: "Ввести код →",
		copyCode: "Скопіювати код",
	},
	resetPassword: {
		heading: "Новий пароль",
		emailLabel: "Email",
		codeLabel: "Код підтвердження",
		codePlaceholder: "6-значний код",
		newPasswordLabel: "Новий пароль",
		confirmLabel: "Підтвердити пароль",
		submitBtn: "Встановити пароль",
		loadingBtn: "Збереження…",
		backToLogin: "Назад до входу",
	},
	passwordStrength: {
		weak: "Слабкий",
		medium: "Середній",
		strong: "Надійний",
		ariaLabel: (level: string) => `Надійність пароля: ${level}`,
	},
	form: {
		showPassword: "Показати пароль",
		hidePassword: "Приховати пароль",
		googleLogin: "Увійти через Google",
		orDivider: "або",
		closeNotice: "Закрити повідомлення",
	},
	validation: {
		required: "Обов'язкове поле",
		invalidEmail: "Невірний формат email",
		emailTooLong: "Email занадто довгий",
		minNickname: "Мінімум 2 символи",
		maxNickname: "Максимум 32 символи",
		minPassword: "Мінімум 6 символів",
		latinOnly: "Лише латинські символи (англійська)",
		passwordUpper: "Потрібна хоча б одна велика літера",
		passwordDigit: "Потрібна хоча б одна цифра",
		rules: {
			minLength: "Мінімум 6 символів",
			latinOnly: "Лише латинські символи (англ)",
			upperCase: "Хоча б одна велика літера",
			digit: "Хоча б одна цифра",
		},
	},
	layout: {
		footerTitle: "© 2026 BUGLE PLANET",
		footerSub: "Калуш, Івано-Франківська обл. • Незалежне видання",
		city: "Калуш",
	},
	article: {
		back: "НАЗАД",
	},
	auth: {
		fill_all_fields: "Будь ласка, заповніть усі поля!",
		user_not_found: "Користувача не існує!",
		user_data_error: "Помилка даних користувача.",
		wrong_password: "Невірний пароль!",
		internal_error: "Внутрішня помилка. Спробуйте ще раз.",
		email_password_required: "Email та пароль є обов'язковими!",
		email_taken: "Цей email вже зайнятий!",
		user_not_found_update: "Користувача не знайдено.",
		update_data_error: "Помилка даних.",
		not_authorized: "Не авторизовано.",
		invalid_email_auth: "Невірний email.",
		account_not_found: "Акаунт з таким email не знайдено.",
		code_not_found: "Код не знайдено. Запросіть новий.",
		invalid_code: "Невірний код.",
		code_expired: "Код прострочено. Запросіть новий.",
		invalid_input: "Некоректні дані.",
		tooManyAttempts: (minutes: number) =>
			`Забагато спроб. Спробуйте через ${minutes} хв.`,
	},
};

/** All supported locale codes. */
export type Locale = "en" | "uk";

/** Map of locale → translation dictionary. */
export const TRANSLATIONS: Record<Locale, typeof en> = {en, uk};

/** The localStorage key used to persist the user's language choice. */
export const LOCALE_STORAGE_KEY = "bp_locale";

/** Default locale used when nothing is stored. */
export const DEFAULT_LOCALE: Locale = "uk";
