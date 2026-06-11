/**
 * News data service — locale-aware.
 *
 * Mock implementation serves the bilingual dataset from newsData.ts.
 * The real API implementation passes the locale as an Accept-Language header
 * so the server can respond in the requested language.
 */
import config from "../config";
import {api} from "./api";
import {ArticlesArraySchema, ArticleSchema} from "../schemas";
import type {Article} from "../schemas";
import type {Locale} from "../i18n/translations";
import {MOCK_NEWS_BY_LOCALE} from "../mock/newsData";

export interface NewsService {
	getAll(signal?: AbortSignal, locale?: Locale): Promise<Article[]>;
	getById(
		id: string | number,
		signal?: AbortSignal,
		locale?: Locale,
	): Promise<Article | null>;
}

// ─── Mock implementation ──────────────────────────────────────────────────────

const mockNewsService: NewsService = {
	async getAll(_signal, locale = "uk"): Promise<Article[]> {
		return ArticlesArraySchema.parse(MOCK_NEWS_BY_LOCALE[locale]);
	},
	async getById(id, _signal, locale = "uk"): Promise<Article | null> {
		const dataset = MOCK_NEWS_BY_LOCALE[locale];
		const found = dataset.find((a) => a.id === Number(id));
		return found ? ArticleSchema.parse(found) : null;
	},
};

// ─── Real API implementation ──────────────────────────────────────────────────

const apiNewsService: NewsService = {
	async getAll(signal, locale = "uk"): Promise<Article[]> {
		const {data} = await api.get<unknown>("/articles", {
			signal,
			headers: {"Accept-Language": locale},
		});
		return ArticlesArraySchema.parse(data);
	},
	async getById(id, signal, locale = "uk"): Promise<Article | null> {
		try {
			const {data} = await api.get<unknown>(`/articles/${id}`, {
				signal,
				headers: {"Accept-Language": locale},
			});
			return ArticleSchema.parse(data);
		} catch {
			return null;
		}
	},
};

export const newsService: NewsService = config.USE_MOCK
	? mockNewsService
	: apiNewsService;
