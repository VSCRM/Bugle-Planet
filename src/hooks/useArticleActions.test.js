import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useArticleActions } from './useArticleActions';

const ARTICLE_1 = { id: 1, title: 'Новина 1', date: '2026-02-13' };
const ARTICLE_2 = { id: 2, title: 'Новина 2', date: '2026-02-12' };

describe('useArticleActions', () => {
	describe('saveArticle', () => {
		it('returns "redirect" if user === null', () => {
			const setSaved = vi.fn();
			const { result } = renderHook(() => useArticleActions(null, setSaved));
			expect(result.current.saveArticle(ARTICLE_1)).toBe('redirect');
			expect(setSaved).not.toHaveBeenCalled();
		});

		it('returns "saved" and updates the list if user is present', () => {
			const setSaved = vi.fn();
			const user = { username: 'Admin' };
			const { result } = renderHook(() => useArticleActions(user, setSaved));
			const res = result.current.saveArticle(ARTICLE_1);
			expect(res).toBe('saved');
			expect(setSaved).toHaveBeenCalledTimes(1);
		});

		it('does not add a duplicate entry if the article is already saved', () => {
			let list = [ARTICLE_1];
			const setSaved = vi.fn((updater) => {
				list = updater(list);
			});
			const user = { username: 'Admin' };
			const { result } = renderHook(() => useArticleActions(user, setSaved));
			result.current.saveArticle(ARTICLE_1);
			expect(list.length).toBe(1);
		});

		it('adds a new article if it is missing from the list', () => {
			let list = [ARTICLE_1];
			const setSaved = vi.fn((updater) => {
				list = updater(list);
			});
			const user = { username: 'Admin' };
			const { result } = renderHook(() => useArticleActions(user, setSaved));
			result.current.saveArticle(ARTICLE_2);
			expect(list.length).toBe(2);
		});
	});

	describe('unsaveArticle', () => {
		it('removes an article by its unique id', () => {
			let list = [ARTICLE_1, ARTICLE_2];
			const setSaved = vi.fn((updater) => {
				list = updater(list);
			});
			const user = { username: 'Admin' };
			const { result } = renderHook(() => useArticleActions(user, setSaved));
			act(() => result.current.unsaveArticle(1));
			expect(list.length).toBe(1);
			expect(list[0].id).toBe(2);
		});

		it('keeps the list unchanged if the id is not found', () => {
			let list = [ARTICLE_1];
			const setSaved = vi.fn((updater) => {
				list = updater(list);
			});
			const user = { username: 'Admin' };
			const { result } = renderHook(() => useArticleActions(user, setSaved));
			act(() => result.current.unsaveArticle(999));
			expect(list.length).toBe(1);
		});
	});
});
