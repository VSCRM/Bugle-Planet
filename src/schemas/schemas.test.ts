import {describe, it, expect} from "vitest";
import {
	ArticleSchema,
	ArticlesArraySchema,
	UserSchema,
	StoredUserSchema,
	AuthResultSchema,
	AuthSuccessSchema,
	AuthFailureSchema,
	ForgotPasswordResultSchema,
	SavedArticlesStorageSchema,
	PendingArticleStorageSchema,
	RateLimitRecordSchema,
	ResetRecordSchema,
	SortOrderSchema,
} from "./index";

// ─── Article schema ───────────────────────────────────────────────────────────

describe("ArticleSchema", () => {
	const valid = {
		id: 1,
		title: "Test",
		category: "Місто",
		excerpt: "Short description",
		date: "2026-02-13",
	};

	it("accepts a minimal valid article", () => {
		expect(ArticleSchema.safeParse(valid).success).toBe(true);
	});

	it("accepts an article with all optional fields", () => {
		const full = {
			...valid,
			content: "Full body text",
			author: "Jane",
			image: "https://example.com/img.jpg",
			featured: true,
		};
		expect(ArticleSchema.safeParse(full).success).toBe(true);
	});

	it("rejects a missing required field (title)", () => {
		const {title: _t, ...noTitle} = valid;
		expect(ArticleSchema.safeParse(noTitle).success).toBe(false);
	});

	it("rejects a non-integer id", () => {
		expect(ArticleSchema.safeParse({...valid, id: 1.5}).success).toBe(false);
	});

	it("rejects id <= 0", () => {
		expect(ArticleSchema.safeParse({...valid, id: 0}).success).toBe(false);
	});

	it("rejects an invalid date format (DD-MM-YYYY)", () => {
		expect(
			ArticleSchema.safeParse({...valid, date: "13-02-2026"}).success,
		).toBe(false);
	});

	it("rejects a non-URL image string", () => {
		expect(
			ArticleSchema.safeParse({...valid, image: "not-a-url"}).success,
		).toBe(false);
	});

	it("rejects an empty title", () => {
		expect(ArticleSchema.safeParse({...valid, title: ""}).success).toBe(false);
	});
});

describe("ArticlesArraySchema", () => {
	it("parses an empty array", () => {
		expect(ArticlesArraySchema.safeParse([]).success).toBe(true);
	});

	it("rejects non-array input", () => {
		expect(ArticlesArraySchema.safeParse(null).success).toBe(false);
		expect(ArticlesArraySchema.safeParse({}).success).toBe(false);
	});

	it("rejects an array with one invalid item", () => {
		const bad = [
			{
				id: "not-a-number",
				title: "T",
				category: "C",
				excerpt: "E",
				date: "2026-01-01",
			},
		];
		expect(ArticlesArraySchema.safeParse(bad).success).toBe(false);
	});
});

// ─── User schema ──────────────────────────────────────────────────────────────

describe("UserSchema", () => {
	it("accepts a user with only a username", () => {
		expect(UserSchema.safeParse({username: "user@example.com"}).success).toBe(
			true,
		);
	});

	it("accepts a user with an optional nickname", () => {
		expect(
			UserSchema.safeParse({username: "u@x.com", nickname: "Alice"}).success,
		).toBe(true);
	});

	it("rejects a missing username", () => {
		expect(UserSchema.safeParse({nickname: "Alice"}).success).toBe(false);
	});

	it("rejects an empty username", () => {
		expect(UserSchema.safeParse({username: ""}).success).toBe(false);
	});
});

describe("StoredUserSchema (strict)", () => {
	it("rejects extra keys such as bcryptHash", () => {
		const withHash = {username: "u@x.com", bcryptHash: "secret"};
		expect(StoredUserSchema.safeParse(withHash).success).toBe(false);
	});

	it("accepts only the allowed keys", () => {
		expect(
			StoredUserSchema.safeParse({username: "u@x.com", nickname: "Alice"})
				.success,
		).toBe(true);
	});
});

// ─── Auth result schema ───────────────────────────────────────────────────────

describe("AuthResultSchema (discriminated union)", () => {
	it("parses a success response", () => {
		const ok = {success: true, user: {username: "u@x.com"}};
		const result = AuthResultSchema.safeParse(ok);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.success).toBe(true);
	});

	it("parses a failure response", () => {
		const fail = {success: false, message: "Невірний пароль!"};
		const result = AuthResultSchema.safeParse(fail);
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.success).toBe(false);
	});

	it("rejects a success response missing the user field", () => {
		expect(AuthResultSchema.safeParse({success: true}).success).toBe(false);
	});

	it("rejects a failure response missing the message field", () => {
		expect(AuthResultSchema.safeParse({success: false}).success).toBe(false);
	});

	it("rejects completely unknown shapes", () => {
		expect(AuthResultSchema.safeParse({foo: "bar"}).success).toBe(false);
	});
});

describe("AuthSuccessSchema", () => {
	it("enforces success literal true", () => {
		expect(
			AuthSuccessSchema.safeParse({success: false, user: {username: "u"}})
				.success,
		).toBe(false);
	});
});

describe("AuthFailureSchema", () => {
	it("enforces success literal false", () => {
		expect(
			AuthFailureSchema.safeParse({success: true, message: "x"}).success,
		).toBe(false);
	});
});

describe("ForgotPasswordResultSchema", () => {
	it("accepts a valid dev-mode result", () => {
		const data = {
			success: true,
			email: "a@b.com",
			sent: false,
			devCode: "123456",
		};
		expect(ForgotPasswordResultSchema.safeParse(data).success).toBe(true);
	});

	it("accepts a result without devCode", () => {
		const data = {success: true, email: "a@b.com", sent: true};
		expect(ForgotPasswordResultSchema.safeParse(data).success).toBe(true);
	});

	it("rejects a non-email address", () => {
		const data = {success: true, email: "not-email", sent: false};
		expect(ForgotPasswordResultSchema.safeParse(data).success).toBe(false);
	});
});

// ─── Storage schemas ──────────────────────────────────────────────────────────

describe("SavedArticlesStorageSchema", () => {
	const validArticle = {
		id: 1,
		title: "T",
		category: "C",
		excerpt: "E",
		date: "2026-01-01",
	};

	it("accepts a valid array of articles", () => {
		expect(SavedArticlesStorageSchema.safeParse([validArticle]).success).toBe(
			true,
		);
	});

	it("rejects null", () => {
		expect(SavedArticlesStorageSchema.safeParse(null).success).toBe(false);
	});
});

describe("PendingArticleStorageSchema", () => {
	it("accepts a valid article", () => {
		const a = {
			id: 3,
			title: "T",
			category: "C",
			excerpt: "E",
			date: "2026-03-01",
		};
		expect(PendingArticleStorageSchema.safeParse(a).success).toBe(true);
	});
});

describe("RateLimitRecordSchema", () => {
	it("accepts valid attempts/blockedUntil", () => {
		expect(
			RateLimitRecordSchema.safeParse({attempts: 2, blockedUntil: 0}).success,
		).toBe(true);
	});

	it("rejects negative attempts", () => {
		expect(
			RateLimitRecordSchema.safeParse({attempts: -1, blockedUntil: 0}).success,
		).toBe(false);
	});
});

describe("ResetRecordSchema", () => {
	it("accepts a valid reset record", () => {
		expect(
			ResetRecordSchema.safeParse({code: "123456", expiry: 9999999999}).success,
		).toBe(true);
	});

	it("rejects a code that is not exactly 6 characters", () => {
		expect(
			ResetRecordSchema.safeParse({code: "12345", expiry: 9999999999}).success,
		).toBe(false);
	});

	it("rejects a non-positive expiry", () => {
		expect(
			ResetRecordSchema.safeParse({code: "123456", expiry: 0}).success,
		).toBe(false);
	});
});

describe("SortOrderSchema", () => {
	it('accepts "asc" and "desc"', () => {
		expect(SortOrderSchema.safeParse("asc").success).toBe(true);
		expect(SortOrderSchema.safeParse("desc").success).toBe(true);
	});

	it("rejects unknown values", () => {
		expect(SortOrderSchema.safeParse("random").success).toBe(false);
		expect(SortOrderSchema.safeParse("").success).toBe(false);
	});
});
