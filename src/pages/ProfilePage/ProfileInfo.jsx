import { Pencil } from 'lucide-react';
import styles from './ProfileInfo.module.css';

export const ProfileInfo = ({ user, onEdit }) => (
	<div className={styles.wrap}>
		<div className={styles.avatar}>
			{user?.nickname?.[0] ?? user?.username?.[0] ?? '?'}
		</div>

		<div className={styles.details}>
			<h2 className={styles.nickname}>{user?.nickname ?? user?.username}</h2>
			<p className={styles.username}>@{user?.username}</p>
		</div>

		<button className={styles.editBtn} onClick={onEdit}>
			<Pencil size={14} /> Редагувати
		</button>
	</div>
);
