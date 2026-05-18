/**
 * emailService — delivers password-reset codes via EmailJS.
 *
 * When all three VITE_EMAILJS_* variables are set in .env the code is
 * sent to the user's inbox.  When they are absent (dev / CI) the service
 * returns the raw code so the UI can display it on-screen instead.
 *
 * EmailJS setup (free tier — 200 emails / month):
 *   1. Sign up at https://www.emailjs.com
 *   2. Create an Email Service and copy its Service ID.
 *   3. Create an Email Template that contains {{to_email}} and {{reset_code}}.
 *   4. Go to Account → API Keys and copy your Public Key.
 *   5. Paste the three values into .env (see .env.example).
 */

import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/** True when all three EmailJS credentials are provided. */
const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

/**
 * Sends a six-digit reset code to the given email address via EmailJS.
 *
 * @param {string} email - Recipient email address.
 * @param {string} code  - The six-digit reset code to include in the email.
 * @returns {Promise<{ sent: boolean, devCode?: string }>}
 *   `sent: true`  — email dispatched successfully.
 *   `sent: false` — EmailJS not configured; `devCode` contains the raw code
 *                   so the UI can display it during local development.
 */
export async function sendResetCode(email, code) {
	if (!isConfigured) {
		// Dev / preview mode: no real email is sent.
		return { sent: false, devCode: code };
	}

	await emailjs.send(
		SERVICE_ID,
		TEMPLATE_ID,
		{ to_email: email, reset_code: code },
		PUBLIC_KEY,
	);

	return {
		sent: true
	};
}
