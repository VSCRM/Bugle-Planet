import {describe, it, expect, beforeEach, vi} from "vitest";
import {createSession, verifySession, clearSession} from "./sessionGuard";

const USER = "test@example.com";

beforeEach(() => {
	localStorage.clear();
	sessionStorage.clear();
	vi.restoreAllMocks();
});

describe("createSession", () => {
	it("writes a session key to sessionStorage", () => {
		createSession(USER);
		expect(sessionStorage.getItem("bp_sk")).not.toBeNull();
	});

	it("writes a signature to localStorage", () => {
		createSession(USER);
		expect(localStorage.getItem("bp_as")).not.toBeNull();
	});

	it("creates unique session keys on each call", () => {
		createSession(USER);
		const key1 = sessionStorage.getItem("bp_sk");
		sessionStorage.clear();
		createSession(USER);
		const key2 = sessionStorage.getItem("bp_sk");
		expect(key1).not.toBe(key2);
	});
});

describe("verifySession", () => {
	it("returns true immediately after createSession", () => {
		createSession(USER);
		expect(verifySession(USER)).toBe(true);
	});

	it("returns false when no session has been created", () => {
		expect(verifySession(USER)).toBe(false);
	});

	it("returns false when the username does not match", () => {
		createSession(USER);
		expect(verifySession("other@example.com")).toBe(false);
	});

	it("returns false after the session key has been tampered with", () => {
		createSession(USER);
		sessionStorage.setItem("bp_sk", "tampered-key");
		expect(verifySession(USER)).toBe(false);
	});

	it("returns false after the signature has been tampered with", () => {
		createSession(USER);
		localStorage.setItem("bp_as", "tampered-sig");
		expect(verifySession(USER)).toBe(false);
	});

	it("returns false for an empty username", () => {
		createSession(USER);
		expect(verifySession("")).toBe(false);
	});
});

describe("clearSession", () => {
	it("removes the session key from sessionStorage", () => {
		createSession(USER);
		clearSession();
		expect(sessionStorage.getItem("bp_sk")).toBeNull();
	});

	it("removes the signature from localStorage", () => {
		createSession(USER);
		clearSession();
		expect(localStorage.getItem("bp_as")).toBeNull();
	});

	it("causes verifySession to return false", () => {
		createSession(USER);
		clearSession();
		expect(verifySession(USER)).toBe(false);
	});

	it("is safe to call when no session exists", () => {
		expect(() => clearSession()).not.toThrow();
	});
});
