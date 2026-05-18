# Bugle Planet

<div align="center">

**A React news-reader with authentication, article saving, and a full password-reset flow.**
Runs entirely in the browser using mock data — no backend required.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%E2%86%92%20GitHub%20Pages-1a1a1a?style=for-the-badge)](https://vscrm.github.io/Bugle-Planet/)
[![License: MIT](https://img.shields.io/badge/License-MIT-555?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

🌐 **[vscrm.github.io/Bugle-Planet](https://vscrm.github.io/Bugle-Planet/)**

</div>

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Password-reset emails (EmailJS)](#password-reset-emails-emailjs)
- [Switching to a real backend](#switching-to-a-real-backend)
- [Google OAuth (ready for backend)](#google-oauth-ready-for-backend)
- [Running tests](#running-tests)
- [Available scripts](#available-scripts)
- [License](#license)

---

## Features

| Area                  | Details                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| **Authentication**    | Register / login with email + password; HMAC-signed session key; rate limiter (5 attempts → 15 min block) |
| **Password reset**    | Forgot-password → 6-digit code via **EmailJS** → reset form with live strength indicator                  |
| **Profile editing**   | Change nickname and/or password; contextual toast per what was changed                                    |
| **Password strength** | Real-time requirement checklist + Weak / Medium / Strong bar                                              |
| **Article saving**    | Save / unsave articles; pending save survives login redirect; synced to API in real mode                  |
| **Google OAuth**      | `GoogleLoginButton` styled and ready — wire up `onLogin` when backend exists                              |
| **Mock ↔ API**        | `VITE_USE_MOCK` flag toggles between localStorage mock and real axios calls                               |
| **Security**          | Content Security Policy headers, XSS sanitisation, cross-tab session sync via BroadcastChannel            |

---

## Tech stack

| Layer            | Library / Tool                                             |
| ---------------- | ---------------------------------------------------------- |
| UI framework     | React 19, React Router 7                                   |
| Build tool       | Vite 8                                                     |
| HTTP client      | Axios                                                      |
| Styling          | CSS Modules                                                |
| Icons            | Lucide React                                               |
| Password hashing | `crypto-js` (SHA-256 pre-hash) + `bcryptjs` (mock storage) |
| Email delivery   | `@emailjs/browser`                                         |
| Tests            | Vitest + Testing Library                                   |
| Deploy           | `gh-pages` → GitHub Pages                                  |

---

## Project structure

```
Bugle-Planet/
├── public/
│   ├── 404.html                                    # GitHub Pages SPA fallback page
│   ├── favicon.svg                                 # Site favicon
│   ├── spa-404-handler.js                          # Redirects 404s back to index.html for client-side routing
│   └── spa-redirect.js                             # Injected into index.html; handles GitHub Pages routing
│
├── src/
│   │
│   ├── components/                                 # Reusable, page-agnostic UI components
│   │   ├── ArticleLayout/
│   │   │   ├── ArticleLayout.jsx                   # Full-width article page wrapper with back button
│   │   │   └── ArticleLayout.module.css
│   │   ├── AuthLayout/
│   │   │   ├── AuthLayout.jsx                      # Centered card wrapper for all auth forms
│   │   │   └── AuthLayout.module.css
│   │   ├── Header/
│   │   │   ├── Header.jsx                          # Top-level site header (Logo + Navigation + TopBar)
│   │   │   ├── Logo.jsx                            # Site logo with link to home
│   │   │   ├── Navigation.jsx                      # Primary nav links
│   │   │   ├── TopBar.jsx                          # Secondary top bar (user info)
│   │   │   └── Header.module.css
│   │   ├── Layout/
│   │   │   ├── Layout.jsx                          # Root page layout with header and footer
│   │   │   └── Layout.module.css
│   │   ├── NewsCard/
│   │   │   ├── NewsCard.jsx                        # Clickable article card (keyboard-accessible)
│   │   │   ├── CardImage.jsx                       # Article image with broken-image fallback
│   │   │   ├── CardMeta.jsx                        # Category badge + publication date
│   │   │   ├── CardTitle.jsx                       # Article headline (variable font size)
│   │   │   ├── CardActions.jsx                     # Save / unsave button with hover state
│   │   │   └── NewsCard.module.css
│   │   ├── SortControl/
│   │   │   ├── SortControl.jsx                     # Sort order dropdown (newest / oldest / A–Z)
│   │   │   └── SortControl.module.css
│   │   └── Toast/
│   │       ├── Toast.jsx                           # Slide-in success notification
│   │       └── Toast.module.css
│   │
│   ├── context/
│   │   ├── AuthProvider.jsx                        # Top-level auth context provider (user, savedArticles, login/logout)
│   │   ├── authContext.js                          # createContext + useAuth hook export
│   │   ├── readLocalUser.js                        # Reads and validates user object from localStorage
│   │   ├── readSavedArticles.js                    # Reads saved-article list for a given username
│   │   └── popPendingArticle.js                    # Pops the pending-save article from sessionStorage after login
│   │
│   ├── forms/
│   │   ├── shared/                                 # Shared form primitives used across all forms
│   │   │   ├── FormInput.jsx                       # Labelled text input with inline error display
│   │   │   ├── FormError.jsx                       # Full-width error banner (server / auth errors)
│   │   │   ├── PasswordInput.jsx                   # Password field with show/hide toggle
│   │   │   ├── PasswordStrengthHint.jsx            # Requirement checklist + strength bar
│   │   │   ├── SubmitButton.jsx                    # Submit button with loading spinner
│   │   │   ├── GoogleLoginButton.jsx               # Styled Google OAuth button (stub — ready to wire up)
│   │   │   ├── forms.module.css                    # Shared form styles
│   │   │   └── PasswordStrengthHint.module.css
│   │   ├── LoginForm/
│   │   │   ├── LoginForm.jsx                       # Login form (email + password + Google button)
│   │   │   ├── LoginFormFooter.jsx                 # "Forgot password?" and "Create account" links
│   │   │   ├── ResetSuccessBanner.jsx              # One-time success banner after password reset
│   │   │   └── LoginForm.module.css
│   │   ├── RegisterForm/
│   │   │   └── RegisterForm.jsx                    # Registration form (email + nickname + password)
│   │   ├── ForgotPasswordForm/
│   │   │   ├── ForgotPasswordForm.jsx              # Step 1: enter email → request reset code
│   │   │   ├── ResetCodeDisplay.jsx                # Step 2: confirmation screen (email sent / dev code)
│   │   │   ├── CodeSentNotice.jsx                  # "Check your inbox" message
│   │   │   ├── DevCodeNotice.jsx                   # Dev-mode: shows code on screen with copy hint
│   │   │   └── ForgotPasswordForm.module.css
│   │   ├── ResetPasswordForm/
│   │   │   ├── ResetPasswordForm.jsx               # Step 3: enter code + new password + confirm
│   │   │   ├── ResetEmailField.jsx                 # Read-only email display field
│   │   │   ├── ResetCodeField.jsx                  # 6-digit code input
│   │   │   └── ResetPasswordForm.module.css
│   │   └── EditProfileForm/
│   │       ├── EditProfileForm.jsx                 # Inline profile editor (nickname + optional password)
│   │       ├── NicknameField.jsx                   # Nickname text input
│   │       ├── ProfilePasswordField.jsx            # Password input with strength hint
│   │       ├── ProfileFormActions.jsx              # Save / Cancel buttons
│   │       └── EditProfileForm.module.css
│   │
│   ├── hooks/                                      # Custom React hooks — one concern each
│   │   ├── useAuth.js                              # Reads the AuthContext (throws if used outside provider)
│   │   ├── useAuthSync.js                          # Persists user state; syncs saved articles (localStorage in mock, API on mount in real)
│   │   ├── useLogin.js                             # Login action (mock or API) returned as a callback
│   │   ├── useRegister.js                          # Register action (mock or API) returned as a callback
│   │   ├── useUpdateUser.js                        # Profile update action (mock or API)
│   │   ├── useLoginForm.js                         # LoginForm state: email, password, submit handler
│   │   ├── useRegisterForm.js                      # RegisterForm state: field values, validation, submit
│   │   ├── useEditProfileForm.js                   # EditProfileForm state: changes, validation, submit
│   │   ├── useForgotPasswordForm.js                # ForgotPasswordForm state: email, submit, result
│   │   ├── useResetPasswordForm.js                 # ResetPasswordForm state: code, new password, submit
│   │   ├── useValidation.js                        # Generic per-field validation hook
│   │   ├── useNews.js                              # Fetches and caches the full article list
│   │   ├── useNewsDetail.js                        # Fetches a single article by ID
│   │   ├── useSearch.js                            # Client-side full-text + date filter over articles
│   │   ├── useSort.js                              # Sorts an array by newest / oldest / title
│   │   ├── useSaveArticle.js                       # Save / unsave a single article; redirects if unauthenticated
│   │   ├── useArticleActions.js                    # saveArticle / unsaveArticle — updates state + calls API in real mode
│   │   └── useProfilePage.js                       # ProfilePage orchestration: logout, editing toggle, save
│   │
│   ├── mock/
│   │   ├── newsData.js                             # Static array of 20 sample articles
│   │   └── mockDelay.js                            # Returns a Promise that resolves after VITE_MOCK_DELAY_MS
│   │
│   ├── pages/
│   │   ├── HomePage/
│   │   │   ├── HomePage.jsx                        # News grid page (fetch → sort → filter → render)
│   │   │   ├── HomeGrid.jsx                        # Responsive CSS grid of NewsCard components
│   │   │   ├── CategoryFilter.jsx                  # Horizontal category pill filter
│   │   │   ├── HomeLoading.jsx                     # Skeleton / spinner shown while fetching
│   │   │   ├── HomeError.jsx                       # Error state display
│   │   │   ├── homeHelpers.js                      # Pure helper: extract unique categories from articles
│   │   │   └── HomePage.module.css
│   │   ├── NewsDetailPage/
│   │   │   ├── NewsDetailPage.jsx                  # Full article page (hero image, body, save button)
│   │   │   ├── ArticleMeta.jsx                     # Category + date metadata row
│   │   │   ├── SaveButton.jsx                      # Save / unsave button on the detail page
│   │   │   ├── DetailLoading.jsx                   # Loading state for article fetch
│   │   │   ├── DetailNotFound.jsx                  # "Article not found" fallback
│   │   │   └── NewsDetailPage.module.css
│   │   ├── SearchPage/
│   │   │   ├── SearchPage.jsx                      # Search page shell (filters + results)
│   │   │   ├── SearchFilters.jsx                   # Text query input + date picker + clear button
│   │   │   ├── SearchResults.jsx                   # Results count + grid / empty state
│   │   │   └── SearchPage.module.css
│   │   └── ProfilePage/
│   │       ├── ProfilePage.jsx                     # Profile page (info card + saved articles + logout)
│   │       ├── ProfileInfo.jsx                     # Avatar initials + nickname + edit button
│   │       ├── SavedArticlesList.jsx               # List of saved article items
│   │       ├── SavedArticleItem.jsx                # Single saved article row with remove button
│   │       ├── SavedArticlesEmpty.jsx              # Empty state when no articles are saved
│   │       ├── ProfilePage.module.css
│   │       ├── ProfileInfo.module.css
│   │       └── SavedArticlesList.module.css
│   │
│   ├── router/
│   │   └── PrivateRoute.jsx                        # HOC that redirects unauthenticated users to /login
│   │
│   ├── security/
│   │   ├── sessionGuard.js                         # HMAC-signed session key; cross-tab sync via BroadcastChannel
│   │   └── rateLimiter.js                          # In-memory attempt counter with timed block (5 attempts / 15 min)
│   │
│   ├── services/
│   │   ├── api.js                                  # Axios instance with Authorization header interceptor
│   │   ├── authService.js                          # login / register / forgotPassword / resetPassword (mock + real)
│   │   ├── emailService.js                         # Sends reset codes via EmailJS (dev fallback: returns raw code)
│   │   ├── newsService.js                          # getArticles / getArticleById (mock + real)
│   │   ├── savedArticlesService.js                 # getAll / save / remove for saved articles (mock + real)
│   │   └── storage.js                              # localStorage helpers: getUser / setUser / getToken / clearAuth
│   │
│   ├── styles/
│   │   └── global.css                              # CSS custom properties (colors, fonts, spacing) + reset
│   │
│   ├── utils/
│   │   ├── validation.js                           # Pure validators: validateEmail, validatePassword, etc.
│   │   ├── sanitize.js                             # XSS-safe HTML sanitiser for article body content
│   │   ├── hashPassword.js                         # Client-side SHA-256 pre-hash before sending to server
│   │   └── formatDate.js                           # Locale-aware date formatter
│   │
│   ├── config.js                                   # Centralised env-variable accessors (VITE_USE_MOCK, etc.)
│   ├── App.jsx                                     # Root route table
│   └── main.jsx                                    # React entry point (AuthProvider wrapper)
│
├── .env                                            # Local secrets — never committed
├── .env.example                                    # Template with all required variable names
├── .gitignore
├── eslint.config.js                                # ESLint flat config (react-hooks + react-refresh)
├── index.html                                      # Vite entry HTML with CSP meta tags
├── LICENSE                                         # MIT License
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js                                  # Vite + Vitest configuration
```

---

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/vscrm/Bugle-Planet.git
cd Bugle-Planet

# 2. Install dependencies
npm install

# 3. Copy the example env file
cp .env.example .env

# 4. Start the dev server (mock mode by default)
npm run dev
```

The app opens at `http://localhost:5173/Bugle-Planet/`.

**Register a test account** at `/register`, then log in. All data is stored in
`localStorage` — nothing is sent to any server in mock mode.

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values you need.

| Variable                   | Default                     | Description                                    |
| -------------------------- | --------------------------- | ---------------------------------------------- |
| `VITE_USE_MOCK`            | `true`                      | `true` = localStorage mock, `false` = real API |
| `VITE_API_URL`             | `http://localhost:3001/api` | Base URL for the REST backend                  |
| `VITE_MOCK_DELAY_MS`       | `600`                       | Artificial delay for mock requests (ms)        |
| `VITE_EMAILJS_SERVICE_ID`  | _(empty)_                   | EmailJS service ID                             |
| `VITE_EMAILJS_TEMPLATE_ID` | _(empty)_                   | EmailJS template ID                            |
| `VITE_EMAILJS_PUBLIC_KEY`  | _(empty)_                   | EmailJS public key                             |

When the three `VITE_EMAILJS_*` variables are empty the app runs in **developer mode**: the six-digit code is displayed on-screen instead of being emailed.

---

## Password-reset emails (EmailJS)

### Setup (free — 200 emails / month)

1. Sign up at <https://www.emailjs.com>.
2. **Email Services** → Add a service (Gmail, Outlook, SMTP, …) → copy the **Service ID**.
3. **Email Templates** → Create a template. Set **To Email** to `{{to_email}}` and include `{{reset_code}}` in the body. Copy the **Template ID**.
4. **Account → API Keys** → copy your **Public Key**.
5. Paste the three values into `.env`:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
   ```
6. Restart the dev server.

---

## Switching to a real backend

1. Set `VITE_USE_MOCK=false` in `.env`.
2. Set `VITE_API_URL` to your backend's base URL.
3. Implement the following endpoints:

### Auth endpoints

| Method | Path                    | Body                                 | Response                               |
| ------ | ----------------------- | ------------------------------------ | -------------------------------------- |
| `POST` | `/auth/login`           | `{ email, passwordHash }`            | `{ success, user?, token?, message? }` |
| `POST` | `/auth/register`        | `{ email, passwordHash, nickname? }` | `{ success, user?, token?, message? }` |
| `PUT`  | `/users/:username`      | `{ nickname?, passwordHash? }`       | `{ success, user?, message? }`         |
| `POST` | `/auth/forgot-password` | `{ email }`                          | `{ success, message? }`                |
| `POST` | `/auth/reset-password`  | `{ email, code, passwordHash }`      | `{ success, message? }`                |

`user` shape: `{ username: string, nickname: string }`.

`token` must be a JWT. The frontend stores it in `localStorage` and attaches it automatically as `Authorization: Bearer <token>` on every subsequent request (`src/services/api.js`). On explicit logout or a `401` response the token is cleared.

`passwordHash` is a client-side **SHA-256 hex digest** of the raw password (see `src/utils/hashPassword.js`). Hash it again server-side (e.g. bcrypt) before storing — never store the raw SHA-256 digest.

### News endpoints

| Method | Path        | Body | Response    |
| ------ | ----------- | ---- | ----------- |
| `GET`  | `/news`     | —    | `Article[]` |
| `GET`  | `/news/:id` | —    | `Article`   |

### Saved-articles endpoints

| Method   | Path                                | Body      | Response    |
| -------- | ----------------------------------- | --------- | ----------- |
| `GET`    | `/users/:username/saved`            | —         | `Article[]` |
| `POST`   | `/users/:username/saved`            | `Article` | `201`       |
| `DELETE` | `/users/:username/saved/:articleId` | —         | `204`       |

All three endpoints require the `Authorization: Bearer <token>` header.

`Article` shape must match the objects in `src/mock/newsData.js` (`id`, `title`, `description`, `imageUrl`, `category`, `publishedAt`, `content`).

### Error response format

For any failure, return `{ success: false, message: "..." }` with an appropriate HTTP status (400, 401, 404, 409, etc.). The frontend reads `message` and displays it in the form error banner.

---

## Google OAuth (ready for backend)

`src/forms/shared/GoogleLoginButton.jsx` is fully styled and waiting. To activate:

1. Set up Google OAuth in your backend (Passport.js, next-auth, etc.).
2. In `LoginForm.jsx` replace `onLogin={null}` with your handler:
   ```jsx
   <GoogleLoginButton
   	onLogin={() => (window.location.href = "/api/auth/google")}
   />
   ```
   or with `@react-oauth/google`:
   ```jsx
   import {useGoogleLogin} from "@react-oauth/google";
   const googleLogin = useGoogleLogin({
   	onSuccess: (token) => sendTokenToBackend(token),
   });
   <GoogleLoginButton onLogin={googleLogin} />;
   ```

The button is disabled when `onLogin` is `null` — no styles break.

---

## Running tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch
```

Tests live **next to the files they test** (e.g. `validation.test.js` beside `validation.js`).

### What is tested

| Area                   | File                                             |
| ---------------------- | ------------------------------------------------ |
| Validation rules       | `utils/validation.test.js`                       |
| XSS sanitisation       | `utils/sanitize.test.js`                         |
| Password hashing       | `utils/hashPassword.test.js`                     |
| Date formatting        | `utils/formatDate.test.js`                       |
| Rate limiter           | `security/rateLimiter.test.js`                   |
| Session guard          | `security/sessionGuard.test.js`                  |
| Auth context helpers   | `context/readLocalUser.test.js`                  |
| Article actions hook   | `hooks/useArticleActions.test.js`                |
| Validation hook        | `hooks/useValidation.test.js`                    |
| Login form hook        | `hooks/useLoginForm.test.js`                     |
| Register form hook     | `hooks/useRegisterForm.test.js`                  |
| Edit profile hook      | `hooks/useEditProfileForm.test.js`               |
| Search hook            | `hooks/useSearch.test.js`                        |
| Sort hook              | `hooks/useSort.test.js`                          |
| Password strength hint | `forms/shared/PasswordStrengthHint.test.jsx`     |
| Password input         | `forms/shared/PasswordInput.test.jsx`            |
| Form input             | `forms/shared/FormInput.test.jsx`                |
| Login form             | `forms/LoginForm/LoginForm.test.jsx`             |
| Register form          | `forms/RegisterForm/RegisterForm.test.jsx`       |
| Edit profile form      | `forms/EditProfileForm/EditProfileForm.test.jsx` |
| Toast component        | `components/Toast/Toast.test.jsx`                |
| News card              | `components/NewsCard/NewsCard.test.jsx`          |
| Sort control           | `components/SortControl/SortControl.test.jsx`    |
| Category filter        | `pages/HomePage/CategoryFilter.test.jsx`         |
| Profile info           | `pages/ProfilePage/ProfileInfo.test.jsx`         |

---

## Available scripts

| Script               | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start Vite dev server            |
| `npm run build`      | Production build                 |
| `npm run preview`    | Preview production build locally |
| `npm test`           | Run all tests once               |
| `npm run test:watch` | Vitest in watch mode             |
| `npm run lint`       | ESLint                           |
| `npm run deploy`     | Build + publish to GitHub Pages  |

---

## License

This project is released under the [MIT License](./LICENSE).
