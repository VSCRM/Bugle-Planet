/**
 * Structural tests for the translation dictionaries.
 *
 * Coverage:
 * a) Both locales contain identical key sets.
 * b) All string values are non-empty.
 * c) Function interpolations return strings with expected arguments.
 * d) Zod-aligned validation key names are present.
 */

import {describe, it, expect} from "vitest";
import {TRANSLATIONS} from "./translations";

const en = TRANSLATIONS.en;
const uk = TRANSLATIONS.uk;

describe("Translation dictionary structure", () => {
	it("en and uk have the same set of section keys", () => {
		expect(Object.keys(en).sort()).toEqual(Object.keys(uk).sort());
	});

	it("every en string value is non-empty", () => {
		const flatten = (obj: Record<string, unknown>, prefix = ""): string[] => {
			return Object.entries(obj).flatMap(([k, v]) =>
				typeof v === "string"
					? [`${prefix}${k}: "${v}"`]
					: typeof v === "function"
						? []
						: flatten(v as Record<string, unknown>, `${prefix}${k}.`),
			);
		};
		const empties = flatten(en as unknown as Record<string, unknown>).filter(
			(entry) => entry.endsWith('""'),
		);
		expect(empties).toEqual([]);
	});

	it("every uk string value is non-empty", () => {
		const flatten = (obj: Record<string, unknown>, prefix = ""): string[] =>
			Object.entries(obj).flatMap(([k, v]) =>
				typeof v === "string"
					? [`${prefix}${k}: "${v}"`]
					: typeof v === "function"
						? []
						: flatten(v as Record<string, unknown>, `${prefix}${k}.`),
			);
		const empties = flatten(uk as unknown as Record<string, unknown>).filter(
			(entry) => entry.endsWith('""'),
		);
		expect(empties).toEqual([]);
	});

	it("search.foundOf interpolates count and total", () => {
		expect(en.search.foundOf(3, 10)).toContain("3");
		expect(en.search.foundOf(3, 10)).toContain("10");
		expect(uk.search.foundOf(3, 10)).toContain("3");
	});

	it("profile.savedHeading interpolates article count", () => {
		expect(en.profile.savedHeading(5)).toContain("5");
		expect(uk.profile.savedHeading(5)).toContain("5");
	});

	it("profile.removeArticle interpolates article title", () => {
		expect(en.profile.removeArticle("Test Title")).toContain("Test Title");
		expect(uk.profile.removeArticle("Test Title")).toContain("Test Title");
	});

	it("forgotPassword.codeSentDesc interpolates email", () => {
		expect(en.forgotPassword.codeSentDesc("user@test.com")).toContain(
			"user@test.com",
		);
		expect(uk.forgotPassword.codeSentDesc("user@test.com")).toContain(
			"user@test.com",
		);
	});

	it("passwordStrength.ariaLabel interpolates level string", () => {
		expect(en.passwordStrength.ariaLabel("Strong")).toContain("Strong");
		expect(uk.passwordStrength.ariaLabel("Надійний")).toContain("Надійний");
	});

	it("validation keys align with the VALIDATORS map keys", () => {
		// required, invalidEmail, minPassword etc. should all exist
		const requiredKeys = [
			"required",
			"invalidEmail",
			"emailTooLong",
			"minNickname",
			"maxNickname",
			"minPassword",
			"latinOnly",
			"passwordUpper",
			"passwordDigit",
		] as const;
		for (const key of requiredKeys) {
			expect(typeof en.validation[key]).toBe("string");
			expect(typeof uk.validation[key]).toBe("string");
		}
	});
});
