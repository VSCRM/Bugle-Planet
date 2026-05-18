import { Routes, Route } from 'react-router';
import { PrivateRoute } from './router/PrivateRoute';
import { HomePage } from './pages/HomePage/HomePage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { NewsDetailPage } from './pages/NewsDetailPage/NewsDetailPage';
import { LoginForm } from './forms/LoginForm/LoginForm';
import { RegisterForm } from './forms/RegisterForm/RegisterForm';
import { ForgotPasswordForm } from './forms/ForgotPasswordForm/ForgotPasswordForm';
import { ResetPasswordForm } from './forms/ResetPasswordForm/ResetPasswordForm';

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/search" element={<SearchPage />} />
			<Route path="/news/:id" element={<NewsDetailPage />} />
			<Route path="/login" element={<LoginForm />} />
			<Route path="/register" element={<RegisterForm />} />
			<Route path="/forgot-password" element={<ForgotPasswordForm />} />
			<Route path="/reset-password" element={<ResetPasswordForm />} />

			<Route
				path="/profile"
				element={
					<PrivateRoute>
						<ProfilePage />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

export default App;
