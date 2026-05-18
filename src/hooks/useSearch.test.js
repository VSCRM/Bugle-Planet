import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';

const MOCK_ARTICLES = [
	{ id: 1, title: 'Kalush prepares for the holiday', excerpt: 'A wonderful event', date: '2026-02-13', category: 'City' },
	{ id: 2, title: 'Football in the city', excerpt: 'The match was successful', date: '2026-02-12', category: 'Sport' },
	{ id: 3, title: 'New roads', excerpt: 'Renovation is completed', date: '2026-02-11', category: 'Infrastructure' },
];

describe('useSearch', () => {
	it('returns all articles by default', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		expect(result.current.results.length).toBe(3);
	});

	it('filters by title (case-insensitive)', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		act(() => result.current.setQuery('football'));
		expect(result.current.results.length).toBe(1);
		expect(result.current.results[0].id).toBe(2);
	});

	it('filters by excerpt', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		act(() => result.current.setQuery('Renovation'));
		expect(result.current.results.length).toBe(1);
	});

	it('returns an empty array if no matches are found', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		act(() => result.current.setQuery('qwerty-xyz-999'));
		expect(result.current.results.length).toBe(0);
	});

	it('filters by date string', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		act(() => result.current.setDate('2026-02-12'));
		expect(result.current.results.length).toBe(1);
		expect(result.current.results[0].id).toBe(2);
	});

	it('resets all active filters after clearFilters is invoked', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		act(() => {
			result.current.setQuery('Kalush');
			result.current.setDate('2026-02-13');
		});
		act(() => result.current.clearFilters());
		expect(result.current.query).toBe('');
		expect(result.current.date).toBe('');
		expect(result.current.results.length).toBe(3);
	});

	it('combines text query and date filters simultaneously', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		act(() => {
			result.current.setQuery('holiday');
			result.current.setDate('2026-02-13');
		});
		expect(result.current.results.length).toBe(1);
	});

	it('returns an empty array if initial articles input is empty', () => {
		const { result } = renderHook(() => useSearch([]));
		expect(result.current.results.length).toBe(0);
	});

	it('initializes query and date states as empty strings', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		expect(result.current.query).toBe('');
		expect(result.current.date).toBe('');
	});

	it('does not mutate the original articles input array', () => {
		renderHook(() => useSearch(MOCK_ARTICLES));
		expect(MOCK_ARTICLES.length).toBe(3);
	});

	it('filters without case sensitivity inside the excerpt field', () => {
		const { result } = renderHook(() => useSearch(MOCK_ARTICLES));
		act(() => result.current.setQuery('WONDERFUL'));
		expect(result.current.results.length).toBe(1);
	});
});
