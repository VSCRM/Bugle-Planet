/**
 * Root application component.
 *
 * Architecture decisions
 * ──────────────────────
 * • All page components are loaded lazily (`React.lazy`) to split the bundle
 *   into per-route chunks.  The initial load only downloads the home page.
 *
 * • A single <Suspense> wraps all routes.  The fallback is an accessible
 *   centered spinner so navigation never shows a blank screen.
 *
 * • <ErrorBoundary> wraps the entire route tree and resets on every
 *   navigation change (`resetKey={location.pathname}`).  This prevents a
 *   render error on page A from permanently breaking pages B, C, …
 *
 * • LocaleProvider (i18n) wraps AuthProvider so translated strings are
 *   available inside AuthProvider's render logic if needed.
 *
 * • useLocation() is called inside the inner component (AppRoutes) so it
 *   triggers inside the BrowserRouter context.
 */
import {lazy, Suspense} from "react";
import {BrowserRouter, Routes, Route, useLocation} from "react-router";
import {LocaleProvider} from "./i18n/LocaleContext";
import {AuthProvider} from "./context/AuthProvider";
import {ErrorBoundary} from "./components/ErrorBoundary/ErrorBoundary";
import {Header} from "./components/Header/Header";
import {Spinner} from "./components/ui/Spinner";
import {PrivateRoute} from "./router/PrivateRoute";
import styles from "./components/Layout/Layout.module.css";

// ─── Lazy-loaded page components ─────────────────────────────────────────────
// Each import becomes a separate bundle chunk loaded only when that route is visited.
const HomePage = lazy(() =>
	import("./pages/HomePage/HomePage").then((m) => ({default: m.HomePage})),
);
const SearchPage = lazy(() =>
	import("./pages/SearchPage/SearchPage").then((m) => ({
		default: m.SearchPage,
	})),
);
const NewsDetailPage = lazy(() =>
	import("./pages/NewsDetailPage/NewsDetailPage").then((m) => ({
		default: m.NewsDetailPage,
	})),
);
const ProfilePage = lazy(() =>
	import("./pages/ProfilePage/ProfilePage").then((m) => ({
		default: m.ProfilePage,
	})),
);
const LoginForm = lazy(() =>
	import("./forms/LoginForm/LoginForm").then((m) => ({default: m.LoginForm})),
);
const RegisterForm = lazy(() =>
	import("./forms/RegisterForm/RegisterForm").then((m) => ({
		default: m.RegisterForm,
	})),
);
const ForgotPasswordPage = lazy(() =>
	import("./pages/ForgotPasswordPage/ForgotPasswordPage").then((m) => ({
		default: m.ForgotPasswordPage,
	})),
);
const ResetPasswordPage = lazy(() =>
	import("./pages/ResetPasswordPage/ResetPasswordPage").then((m) => ({
		default: m.ResetPasswordPage,
	})),
);

/** Full-screen loading fallback shown during code-split chunk download. */
function PageFallback(): React.ReactElement {
	// Rendered inside LocaleProvider — can use useLocale safely.
	const {t} = useLocale();
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "50vh",
			}}
			aria-live="polite">
			<Spinner size={36} label={t.detail.loading} />
		</div>
	);
}

/** Route declarations + ErrorBoundary that resets on navigation. */
function AppRoutes(): React.ReactElement {
	const {pathname} = useLocation();

	return (
		<ErrorBoundary resetKey={pathname}>
			<Suspense fallback={<PageFallback />}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/news/:id" element={<NewsDetailPage />} />
					<Route path="/login" element={<LoginForm />} />
					<Route path="/register" element={<RegisterForm />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route
						path="/profile"
						element={
							<PrivateRoute>
								<ProfilePage />
							</PrivateRoute>
						}
					/>
					<Route path="*" element={<HomePage />} />
				</Routes>
			</Suspense>
		</ErrorBoundary>
	);
}

const BASE = import.meta.env.BASE_URL;

export default function App(): React.ReactElement {
	return (
		<BrowserRouter basename={BASE}>
			<LocaleProvider>
				<AuthProvider>
					<div className={styles.wrapper}>
						<Header />
						<main className={styles.main}>
							<AppRoutes />
						</main>
						<Footer />
					</div>
				</AuthProvider>
			</LocaleProvider>
		</BrowserRouter>
	);
}

/** Footer extracted to its own function to keep App readable. */
import {useLocale} from "./i18n/LocaleContext";
function Footer(): React.ReactElement {
	const {t} = useLocale();
	return (
		<footer className={styles.footer}>
			<p className={styles.footerTitle}>{t.layout.footerTitle}</p>
			<p className={styles.footerSub}>{t.layout.footerSub}</p>
		</footer>
	);
}
