import { LogOut, Bookmark } from 'lucide-react';
import { useProfilePage } from '../../hooks/useProfilePage';
import { ProfileInfo } from './ProfileInfo';
import { EditProfileForm } from '../../forms/EditProfileForm/EditProfileForm';
import { SavedArticlesList } from './SavedArticlesList';
import { Toast } from '../../components/Toast/Toast';
import styles from './ProfilePage.module.css';

/** Human-readable labels for each change combination. */
const SAVE_MESSAGES = {
	nickname: 'Нікнейм успішно змінено',
	password: 'Пароль успішно змінено',
	both: 'Нікнейм та пароль успішно змінено',
};

export const ProfilePage = () => {
	const {
		user,
		loading,
		savedArticles,
		unsaveArticle,
		editing,
		savedType,
		handleLogout,
		handleSave,
		toggleEditing,
		closeEditing,
	} = useProfilePage();

	return (
		<>
			{/* Toast is rendered at page level so it survives EditProfileForm unmount. */}
			{savedType && (
				<Toast message={SAVE_MESSAGES[savedType]} onClose={() => { }} />
			)}

			<div className={styles.card}>
				<ProfileInfo user={user} onEdit={toggleEditing} />

				{editing && (
					<EditProfileForm
						user={user}
						onSave={handleSave}
						onCancel={closeEditing}
						loading={loading}
					/>
				)}

				<button className={styles.logoutBtn} onClick={handleLogout}>
					<LogOut size={16} aria-hidden="true" /> Вийти
				</button>
			</div>

			<div className={styles.savedSection}>
				<h3 className={styles.savedTitle}>
					<Bookmark size={18} aria-hidden="true" />
					Збережені статті ({savedArticles.length})
				</h3>
				<SavedArticlesList articles={savedArticles} onRemove={unsaveArticle} />
			</div>
		</>
	);
};
