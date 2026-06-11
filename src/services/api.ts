/**
 * Shared Axios instance.
 *
 * Security middleware applied here (once) for all requests:
 * ─────────────────────────────────────────────────────────
 * 1. CSRF token header on every state-mutating request.
 * 2. Request timeout (10 s) — prevents hanging connections.
 * 3. Credentials: true — sends session cookies cross-origin when the backend
 *    sets CORS allow-credentials.
 *
 * Error normalisation:
 * ────────────────────
 * The response interceptor extracts a human-readable message from any API
 * error shape so callers never have to inspect axios internals.
 */
import axios, {type AxiosError, type InternalAxiosRequestConfig} from "axios";
import {getCsrfToken} from "../security/csrf";
import {logger} from "../utils/logger";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS", "TRACE"]);

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
	timeout: 10_000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

/** Attach CSRF token to every non-safe request. */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const method = (config.method ?? "GET").toUpperCase();
	if (!SAFE_METHODS.has(method)) {
		config.headers["X-CSRF-Token"] = getCsrfToken();
	}
	return config;
});

/** Normalise error responses into a plain Error with a readable message. */
api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<{message?: string}>) => {
		const message =
			error.response?.data?.message ?? error.message ?? "Unknown network error";

		logger.error(
			"API request failed",
			{
				url: error.config?.url,
				status: error.response?.status,
				message,
			},
			"api",
		);

		return Promise.reject(new Error(message));
	},
);
