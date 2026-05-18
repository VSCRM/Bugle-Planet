import { useState } from 'react';
import { Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import styles from './NewsCard.module.css';

/**
 * Save / unsave button for a news card.
 * Stops click propagation so the card navigation handler is not triggered.
 * Shows a trash icon on hover when the article is already saved.
 */
export function CardActions({ isSaved, onSave }) {
	const [isHovering, setIsHovering] = useState(false);

	const btnClass = isSaved
		? `${styles.btnSave} ${styles.btnSaved}`
		: styles.btnSave;

	const handleClick = (event) => {
		// Prevent the card's onClick from firing and navigating away.
		event.stopPropagation();
		onSave(event);
	};

	return (
		<div className={styles.actions}>
			<button
				className={btnClass}
				onClick={handleClick}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				aria-label={isSaved ? 'Видалити зі збережених' : 'Зберегти статтю'}
			>
				{isSaved
					? isHovering ? <Trash2 size={18} /> : <BookmarkCheck size={18} />
					: <Bookmark size={18} />}
				{isSaved
					? isHovering ? 'Видалити' : 'Збережено'
					: 'Зберегти'}
			</button>
		</div>
	);
}
