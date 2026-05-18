import { useState, useMemo } from 'react';

export function useSort(items, field = 'date') {
	const [order, setOrder] = useState('desc');

	const sorted = useMemo(() => {
		if (!items?.length) return items ?? [];
		return [...items].sort((a, b) => {
			const aVal = a[field] ?? '';
			const bVal = b[field] ?? '';
			if (aVal < bVal) return order === 'asc' ? -1 : 1;
			if (aVal > bVal) return order === 'asc' ? 1 : -1;
			return 0;
		});
	}, [items, field, order]);

	const toggleOrder = () => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

	return {
		sorted, order, toggleOrder
	};
}
