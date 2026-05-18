export const filterByCategory = (articles, cat) =>
	cat === 'Всі' ? articles : articles.filter((n) => n.category === cat);
