import styles from "./HomePage.module.css"

export const HomeError = ({ message }) => (
	<div className={styles.error}>Помилка: {message}</div>
);
