import {z} from "zod";
import {ArticleSchema} from "./article.schema";

/** Schema for the array of saved articles persisted per-user in localStorage. */
export const SavedArticlesStorageSchema = z.array(ArticleSchema);

/** Schema for the pending-save article written to sessionStorage before login. */
export const PendingArticleStorageSchema = ArticleSchema;

/** Schema for the rate-limiter record stored in localStorage per username. */
export const RateLimitRecordSchema = z.object({
	attempts: z.number().int().min(0),
	blockedUntil: z.number().int().min(0),
});

export type RateLimitRecord = z.infer<typeof RateLimitRecordSchema>;

/** Schema for a password-reset record stored in localStorage. */
export const ResetRecordSchema = z.object({
	code: z.string().length(6),
	expiry: z.number().int().positive(),
});

export type ResetRecord = z.infer<typeof ResetRecordSchema>;
