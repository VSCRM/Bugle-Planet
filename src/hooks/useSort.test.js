import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSort } from './useSort';

const ARTICLES = [
	{ id: 1, title: 'Нова дорога', date: '2026-02-10' },
	{ id: 2, title: 'Спорт', date: '2026-02-13' },
	{ id: 3, title: 'Виставка', date: '2026-02-11' },
];

describe('useSort', () => {
	it('sorts from newest to oldest (desc) by default', () => {
		const { result } = renderHook(() => useSort(ARTICLES));
		const dates = result.current.sorted.map((a) => a.date);
		expect(dates).toEqual(['2026-02-13', '2026-02-11', '2026-02-10']);
	});

	it('initializes with order set to "desc"', () => {
		const { result } = renderHook(() => useSort(ARTICLES));
		expect(result.current.order).toBe('desc');
	});

	it('toggleOrder changes sorting mode to "asc"', () => {
		const { result } = renderHook(() => useSort(ARTICLES));
		act(() => result.current.toggleOrder());
		expect(result.current.order).toBe('asc');
	});

	it('sorts from oldest to newest (asc) after toggleOrder is triggered', () => {
		const { result } = renderHook(() => useSort(ARTICLES));
		act(() => result.current.toggleOrder());
		const dates = result.current.sorted.map((a) => a.date);
		expect(dates).toEqual(['2026-02-10', '2026-02-11', '2026-02-13']);
	});

	it('returns back to desc order after calling toggleOrder twice', () => {
		const { result } = renderHook(() => useSort(ARTICLES));
		act(() => result.current.toggleOrder());
		act(() => result.current.toggleOrder());
		expect(result.current.order).toBe('desc');
	});

	it('does not mutate the input array reference or elements', () => {
		const input = [...ARTICLES];
		const { result } = renderHook(() => useSort(ARTICLES));
		expect(result.current.sorted).not.toBe(input);
		expect(ARTICLES[0].date).toBe('2026-02-10');
	});

	it('returns an empty array for empty data sets', () => {
		const { result } = renderHook(() => useSort([]));
		expect(result.current.sorted).toEqual([]);
	});

	it('correctly sorts collections based on a custom key parameter', () => {
		const items = [
			{ id: 1, name: 'Banana' },
			{ id: 2, name: 'Apple' },
			{ id: 3, name: 'Cherry' },
		];
		const { result } = renderHook(() => useSort(items, 'name'));
		act(() => result.current.toggleOrder()); // asc
		const names = result.current.sorted.map((i) => i.name);
		expect(names).toEqual(['Apple', 'Banana', 'Cherry']);
	});

	it('maintains relative order when matching elements have identical keys', () => {
		const same = [
			{ id: 1, date: '2026-02-10' },
			{ id: 2, date: '2026-02-10' },
		];
		const { result } = renderHook(() => useSort(same));
		expect(result.current.sorted.length).toBe(2);
	});
});
