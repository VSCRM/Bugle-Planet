import {z} from "zod";

/**
 * Runtime schema for a news article.
 * All optional fields default to undefined so partial API responses are tolerated.
 */
export const ArticleSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1),
	category: z.string().min(1),
	excerpt: z.string().min(1),
	/** Full article body — omitted in list endpoints. */
	content: z.string().optional(),
	author: z.string().optional(),
	/** ISO 8601 date string, e.g. "2026-02-13". */
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD date"),
	image: z.string().url().optional(),
	featured: z.boolean().optional(),
});

/** TypeScript type derived from ArticleSchema — the single source of truth. */
export type Article = z.infer<typeof ArticleSchema>;

/** Schema for a validated array of articles (used with API list responses). */
export const ArticlesArraySchema = z.array(ArticleSchema);
