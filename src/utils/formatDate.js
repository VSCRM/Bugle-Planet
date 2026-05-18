const DAYS = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
const MONTHS = [
	'Січня', 'Лютого', 'Березня', 'Квітня', 'Травня', 'Червня',
	'Липня', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня',
];

export const formatDate = (date = new Date()) => {
	const d = date instanceof Date ? date : new Date(date);
	return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
