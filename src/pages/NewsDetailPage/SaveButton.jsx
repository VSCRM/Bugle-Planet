import { Bookmark, BookmarkCheck } from 'lucide-react';
import styles from './NewsDetailPage.module.css';

export const SaveButton = ({ isSaved, onSave }) => (
	<button
		className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ''}`}
		onClick={onSave}
	>
		{isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
		{isSaved ? 'ЗБЕРЕЖЕНО' : 'ЗБЕРЕГТИ'}
	</button>
);
