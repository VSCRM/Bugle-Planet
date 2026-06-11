# Bugle Planet — Production TypeScript Edition

A production-ready, fully bilingual (🇺🇦 UA / 🇬🇧 EN) local news portal for
Kalush, Ivano-Frankivsk region. Built in **strict TypeScript** with Zod runtime
validation, a custom i18n system, React 19 features, security hardening,
code-split bundle, and full test coverage.

**Live demo:** [vscrm.github.io/Bugle-Planet](https://vscrm.github.io/Bugle-Planet/)

---

## Table of Contents

1. [Pages & Routes](#pages--routes)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [Test Suite](#test-suite)
6. [Architecture](#architecture)
7. [i18n — UA / EN](#i18n--ua--en)
8. [Bilingual News Data](#bilingual-news-data)
9. [Zod Runtime Validation](#zod-runtime-validation)
10. [Security](#security)
11. [Performance & Optimisation](#performance--optimisation)
12. [CSS Architecture](#css-architecture)
13. [Project File Tree](#project-file-tree)
14. [Deployment — GitHub Pages](#deployment--github-pages)

---

## Pages & Routes

| Page            | Route              | Auth | Description                                               |
| --------------- | ------------------ | :--: | --------------------------------------------------------- |
| Home            | `/`                |  —   | Article grid · search · category filter · sort            |
| Search          | `/search`          |  —   | Full-text + date filter with live `useTransition`         |
| Article detail  | `/news/:id`        |  —   | Full article · optimistic save · unauthenticated redirect |
| Login           | `/login`           |  —   | Email + password sign-in · auto-saves pending article     |
| Register        | `/register`        |  —   | Account creation · real-time strength meter               |
| Forgot password | `/forgot-password` |  —   | Requests a 6-digit reset code by email                    |
| Reset password  | `/reset-password`  |  —   | Enter code + set new password                             |
| Profile         | `/profile`         |  ✅  | Saved articles · edit profile · sign out                  |

> **Navigation bar shows: Home · Search · Profile.**
> Login and Register are reachable via form footer links only — never shown in the nav bar.

---

## Tech Stack

| Library / Tool         | Version | Role                                                       |
| ---------------------- | ------- | ---------------------------------------------------------- |
| React                  | **19**  | UI — `useOptimistic`, `useTransition`, `StrictMode`        |
| TypeScript             | **6**   | Static typing (`strict: true`, `noUncheckedIndexedAccess`) |
| Vite                   | **8**   | Build tool + dev server with HMR                           |
| React Router           | **7**   | Client-side routing with `basename`                        |
| Zod                    | **3**   | Runtime validation + `z.infer` type derivation             |
| bcrypt-ts              | latest  | Client-side bcrypt (no `eval` in application code)         |
| Axios                  | 1       | HTTP client with CSRF interceptor + timeout                |
| Lucide React           | latest  | Icon set (tree-shaken per icon)                            |
| Vitest                 | 4       | Test runner (Vite-native)                                  |
| @testing-library/react | 16      | Component testing                                          |

---

## Quick Start

```bash
npm install            # install all dependencies
npm run dev            # → http://localhost:5173
npm run build          # production build → dist/
npm run preview        # preview at http://localhost:4173/Bugle-Planet/
npm run lint           # ESLint check
npm test               # run all tests once (CI mode)
npm run test:watch     # watch mode for development
npm run test:coverage  # V8 coverage report
npm run deploy         # build + push to GitHub Pages
```

---

## Environment Variables

| Variable                   | Dev (`.env`)            | Production (`.env.production`) |
| -------------------------- | ----------------------- | ------------------------------ |
| `VITE_API_URL`             | `http://localhost:3000` | your backend URL               |
| `VITE_USE_MOCK`            | `true`                  | `false`                        |
| `VITE_EMAILJS_SERVICE_ID`  | —                       | EmailJS service ID             |
| `VITE_EMAILJS_TEMPLATE_ID` | —                       | EmailJS template ID            |
| `VITE_EMAILJS_PUBLIC_KEY`  | —                       | EmailJS public key             |

Copy `.env.example` → `.env` to get started locally.

---

## Test Suite

**33 test files · 305 tests · stable across 3/3 consecutive runs**

```bash
npm test
```

| Test file                                         | Tests | Coverage area                                                |
| ------------------------------------------------- | :---: | ------------------------------------------------------------ |
| `schemas/schemas.test.ts`                         |  56   | Valid ✅ · invalid ❌ · edge cases per Zod schema            |
| `utils/validation.test.ts`                        |  25   | Validators return correct keys; strength levels              |
| `i18n/LocaleContext.test.tsx`                     |   8   | Provider · setLocale · localStorage · throws outside         |
| `i18n/translations.test.ts`                       |   9   | Key parity EN/UK · non-empty strings · interpolation         |
| `hooks/useValidation.test.tsx`                    |   8   | Key→locale resolution · isValid · clearErrors                |
| `hooks/useRegisterForm.test.tsx`                  |   6   | Real-time validation · isValid · authError                   |
| `hooks/useEditProfileForm.test.tsx`               |   7   | Optional password · onSave patch payload                     |
| `hooks/useLoginForm.test.tsx`                     |   5   | Email validation on change · submit · error code translation |
| `hooks/useSearch.test.ts`                         |   6   | Text filter · date filter · clear                            |
| `hooks/useSort.test.ts`                           |   5   | Asc/desc · toggle                                            |
| `hooks/useArticleActions.test.ts`                 |   6   | Save · unsave · redirect when unauthenticated                |
| `forms/shared/FormInput.test.tsx`                 |   5   | Label · value · error · aria-invalid                         |
| `forms/shared/PasswordInput.test.tsx`             |   6   | Show/hide Eye icon · error · aria-pressed                    |
| `forms/shared/PasswordStrengthHint.test.tsx`      |   7   | Weak/medium/strong bar · ✓/✗ rule checklist                  |
| `forms/LoginForm/LoginForm.test.tsx`              |   8   | Heading · inputs · 2-row footer · real-time validation       |
| `forms/RegisterForm/RegisterForm.test.tsx`        |   6   | Heading · disabled submit · strength hint                    |
| `forms/EditProfileForm/EditProfileForm.test.tsx`  |   6   | Prefill · password error · onCancel                          |
| `components/ErrorBoundary/ErrorBoundary.test.tsx` |   4   | Normal render · fallback · custom fallback · reset           |
| `components/ui/Spinner.test.tsx`                  |   3   | Default label · custom label · size                          |
| `components/NewsCard/NewsCard.test.tsx`           |   9   | Render · link · save button · CSS module class               |
| `components/SortControl/SortControl.test.tsx`     |   6   | Labels · aria-pressed · toggle                               |
| `components/Toast/Toast.test.tsx`                 |   6   | Message · onClose · no button without handler · variants     |
| `pages/HomePage/CategoryFilter.test.tsx`          |   5   | Buttons · aria-pressed · onChange                            |
| `pages/HomePage/homeHelpers.test.ts`              |   5   | filterByCategory locale sentinel logic                       |
| `pages/ProfilePage/ProfileInfo.test.tsx`          |   5   | Nickname · @username · avatar · edit callback                |
| `context/readLocalUser.test.ts`                   |   5   | Valid/invalid/missing localStorage user                      |
| `security/csrf.test.ts`                           |   3   | Token format · stability · reset                             |
| `security/inputGuard.test.ts`                     |   8   | XSS · SQLi · size limit · clean input                        |
| `security/rateLimiter.test.ts`                    |  14   | 5-attempt block · 15-min timeout · rate_limit code format    |
| `security/sessionGuard.test.ts`                   |   4   | Invalidate sessions > 24 h                                   |
| `utils/formatDate.test.ts`                        |   5   | Date formatting · EN locale · UK locale                      |
| `utils/hashPassword.test.ts`                      |   3   | SHA-256 determinism                                          |
| `utils/sanitize.test.ts`                          |   5   | Email trim · nickname strip                                  |

---

## Architecture

### Design principles

| Principle                 | Where                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Single Responsibility** | Every file does one thing: `useSaveArticle` saves, `useSearch` filters, `CardImage` renders an image |
| **Open/Closed**           | `NewsService` interface → swap mock ↔ real API without touching hooks                                |
| **Liskov Substitution**   | `mockNewsService` and `apiNewsService` are interchangeable `NewsService` implementations             |
| **Interface Segregation** | `AuthContextValue` exposes only what consumers need; storage reads only what `storage.ts` exposes    |
| **Dependency Inversion**  | Hooks depend on service interfaces; mock injected via `config.USE_MOCK`                              |
| **DRY**                   | Shared form primitives (`FormInput`, `PasswordInput`); single `useValidation` hook                   |
| **Atomic design**         | `Badge`, `Spinner`, `VisuallyHidden` are pure presentational atoms with no logic                     |

### React 19 features

| Feature           | File                              | Why                                                          |
| ----------------- | --------------------------------- | ------------------------------------------------------------ |
| `useOptimistic`   | `useSaveArticle.ts`               | Instant save feedback — wrapped in `startTransition` per R19 |
| `useTransition`   | `useSearch.ts`                    | Non-urgent filtering keeps input responsive                  |
| `lazy + Suspense` | `App.tsx`                         | Per-route code splitting — initial bundle ≈ 60 kB            |
| `StrictMode`      | `main.tsx`                        | Detects side-effects and deprecated patterns in development  |
| `ErrorBoundary`   | `App.tsx`                         | Resets on every navigation via `resetKey`                    |
| `AbortController` | `useNews.ts` · `useNewsDetail.ts` | Cancels stale requests on unmount, locale change             |

### Code-split bundle

```
vendor-react    ~140 kB  (react, react-dom, react-router)  — cached for months
vendor-utils     ~95 kB  (axios, zod)                      — cached for months
vendor-ui       ~215 kB  (lucide-react)                    — cached for months
vendor-crypto    ~48 kB  (bcrypt-ts)                       — cached for months
index            ~28 kB  (app shell, Header, AuthProvider)  — changes on deploy
HomePage          ~3 kB  (loaded only on /)
SearchPage        ~2 kB  (loaded only on /search)
… (one chunk per page)
```

First load downloads only `vendor-react` + `index` + the current page chunk.
Subsequent navigations are instant (already cached).

---

## i18n — UA / EN

```
src/i18n/
├── translations.ts      ← EN + UK dictionaries — single source of truth
├── LocaleContext.tsx    ← LocaleProvider + useLocale() hook
├── LocaleContext.test.tsx
└── translations.test.ts
```

### Usage

```tsx
// Wrap once in App.tsx (already done)
<LocaleProvider>…</LocaleProvider>

// Use anywhere in the tree
const { t, locale, setLocale } = useLocale();
<h1>{t.home.heading}</h1>
<button onClick={() => setLocale('en')}>EN</button>
```

### What is localised

Every user-visible string in the application uses `t.*` — there are no hardcoded
UI strings outside `translations.ts`. This includes:

| Area                               | Translation keys                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| Navigation links                   | `t.nav.*`                                                                         |
| Home page headings + empty         | `t.home.*`                                                                        |
| Search input, stats row            | `t.search.*`                                                                      |
| News card save/remove buttons      | `t.card.*`                                                                        |
| Article detail save / errors       | `t.detail.*` (incl. `notFound`, `loadError`)                                      |
| Profile headings, toast messages   | `t.profile.*`                                                                     |
| Edit profile form                  | `t.editProfile.*`                                                                 |
| Login / register forms             | `t.login.*` · `t.register.*`                                                      |
| Forgot / reset password            | `t.forgotPassword.*` · `t.resetPassword.*`                                        |
| Password strength + rules          | `t.passwordStrength.*` · `t.validation.rules.*`                                   |
| Shared form labels                 | `t.form.*`                                                                        |
| Validation error messages          | `t.validation.*`                                                                  |
| **Auth service error messages**    | `t.auth.*` — `user_not_found`, `wrong_password`, `email_taken`, `rate_limit` etc. |
| Footer, layout                     | `t.layout.*`                                                                      |
| **Article content and categories** | `MOCK_NEWS_BY_LOCALE[locale]` · `CATEGORIES_BY_LOCALE[locale]`                    |
| **Header date**                    | `formatDate(today, locale)` — `en-US` / `uk-UA`                                   |
| **Card & detail page dates**       | `formatDate(article.date, locale)`                                                |

### Key guarantees

- `uk: typeof en` — a missing translation key is a **compile-time error**.
- Locale is persisted in `localStorage` (`bp_locale`).
- Validation functions return keys (`'invalidEmail'`), not strings.
  `useValidation` resolves them via `t.validation[key]` — errors always appear in the active language.
- Switching UA ↔ EN **reloads the news list**, resets the active category to the
  locale-specific "All" sentinel, and re-formats all dates — no page reload required.

### Auth error codes

`authService` and `rateLimiter` never return hardcoded strings. They return **error codes**:

```
'user_not_found'  'wrong_password'  'email_taken'  'account_not_found'
'code_not_found'  'invalid_code'    'code_expired'  'invalid_input'
'rate_limit:N'   ← structured code with dynamic minutes value
```

The utility `src/utils/resolveAuthError.ts` decodes a code → active-locale string:

```ts
import {resolveAuthError} from "../utils/resolveAuthError";

// Inside a form hook that has useLocale():
const {t} = useLocale();
const msg = resolveAuthError(result.message, t);
// result.message = 'wrong_password' → msg = 'Невірний пароль!' (uk) / 'Incorrect password!' (en)
// result.message = 'rate_limit:5'  → msg = 'Забагато спроб. Спробуйте через 5 хв.' (uk)
```

Hooks that call `resolveAuthError`: `useLoginForm`, `useRegisterForm`,
`useForgotPasswordForm`, `useResetPasswordForm`, `useUpdateUser`.

The password strength widget shows a bar **and** an individual requirement list
that turns green (✓) as each rule is met:

```
✓  Minimum 6 characters          (t.validation.rules.minLength)
✗  Latin characters only          (t.validation.rules.latinOnly)
✗  At least one uppercase letter  (t.validation.rules.upperCase)
✗  At least one digit             (t.validation.rules.digit)
```

All four labels are translated and switch language instantly with the rest of the UI.

---

## Bilingual News Data

All 16 mock articles and all 9 category labels exist in both languages.

```
src/mock/newsData.ts

MOCK_NEWS_BY_LOCALE   = { uk: Article[16], en: Article[16] }
CATEGORIES_BY_LOCALE  = { uk: ['Всі','Місто',…], en: ['All','City',…] }
```

### How it flows

```
useLocale()  →  locale ('uk' | 'en')
     │
     ▼
useNews(locale)
     │  passes locale to
     ▼
newsService.getAll(signal, locale)
     │  mock: returns MOCK_NEWS_BY_LOCALE[locale]
     │  real: sends Accept-Language: locale header
     ▼
ArticlesArraySchema.parse(data)   ← Zod validates every article
     ▼
articles[]  →  HomePage / SearchPage
```

`useNewsDetail` follows the same pattern — switching language on a detail page
reloads the article in the active language.

The active category is **automatically reset** to the locale-specific "All" sentinel
(`'Всі'` / `'All'`) whenever the language is switched, preventing a stale Ukrainian
category name filtering an English article list.

### Pending save after redirect

When an unauthenticated user clicks **Save** on a card or detail page:

1. The article is serialised to `sessionStorage` under key `bp_pending_save`.
2. The user is redirected to `/login`.
3. After successful login **or** registration, `AuthProvider` calls
   `popPendingArticle()` which reads, Zod-validates, and removes the stored
   article, then saves it automatically.

---

## Zod Runtime Validation

Every piece of external data is validated before it enters application state.

```
src/schemas/
├── article.schema.ts   → ArticleSchema, ArticlesArraySchema, PendingArticleStorageSchema
├── auth.schema.ts      → AuthResultSchema, ResetRecordSchema
├── storage.schema.ts   → SavedArticlesStorageSchema
├── user.schema.ts      → UserSchema, StoredUserSchema (z.strictObject)
└── index.ts            → barrel export
```

All TypeScript types are derived via `z.infer` — the schema is the single source
of truth. Changing a schema updates both runtime validation and static types.

---

## Security

### Threat model and mitigations

| Attack                             | Mitigation                                                                                                                                                                                                            | File                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **XSS (reflected/stored)**         | CSP `script-src 'self' 'unsafe-inline' 'unsafe-eval'`. Zod strips unexpected fields. `sanitize.ts` strips HTML before storage.                                                                                        | `index.html`, `sanitize.ts`                            |
| **XSS via `javascript:` URIs**     | `inputGuard.ts` rejects dangerous patterns before they reach the API.                                                                                                                                                 | `security/inputGuard.ts`                               |
| **CSRF**                           | Double-Submit Cookie: `getCsrfToken()` stores a 32-byte random token in `sessionStorage`; Axios interceptor attaches `X-CSRF-Token` on every non-safe request.                                                        | `security/csrf.ts`, `services/api.ts`                  |
| **Brute-force login**              | `rateLimiter.ts` blocks after 5 failed attempts for 15 min. Returns structured code `rate_limit:N`; form hooks translate it via `resolveAuthError`.                                                                   | `security/rateLimiter.ts`                              |
| **Session hijacking**              | `sessionGuard.ts` invalidates sessions older than 24 hours.                                                                                                                                                           | `security/sessionGuard.ts`                             |
| **Password leaking**               | `StoredUserSchema` uses `z.strictObject` — any object with extra keys is rejected before entering the `User` type.                                                                                                    | `schemas/user.schema.ts`                               |
| **Plaintext passwords**            | Client-side SHA-256 pre-hash + bcrypt (10 rounds) via `bcrypt-ts`.                                                                                                                                                    | `utils/hashPassword.ts`, `services/authService.ts`     |
| **Information leakage via errors** | `authService` returns error codes (`'user_not_found'`, `'wrong_password'` …), not hardcoded strings. UI translation via `resolveAuthError(code, t)` in form hooks.                                                    | `services/authService.ts`, `utils/resolveAuthError.ts` |
| **Clickjacking**                   | `frame-ancestors 'none'` must be delivered as an **HTTP response header** (the CSP spec ignores it inside `<meta>`). Set `X-Frame-Options: DENY` and `Content-Security-Policy: frame-ancestors 'none'` on the server. | `index.html` (comment)                                 |
| **MIME-sniffing**                  | `X-Content-Type-Options: nosniff` meta header.                                                                                                                                                                        | `index.html`                                           |
| **Information leakage**            | `logger.ts` suppresses all output in `import.meta.env.PROD`.                                                                                                                                                          | `utils/logger.ts`                                      |
| **Large-payload DoS**              | `inputGuard.ts` rejects payloads > 4 096 bytes.                                                                                                                                                                       | `security/inputGuard.ts`                               |
| **SQL injection (probe)**          | `inputGuard.ts` rejects `UNION SELECT`, `DROP TABLE`, `OR 1=1` patterns.                                                                                                                                              | `security/inputGuard.ts`                               |
| **Stale CSRF tokens**              | `clearCsrfToken()` is called on logout, forcing a new token on next session.                                                                                                                                          | `security/csrf.ts`                                     |
| **Referrer leakage**               | `Referrer-Policy: strict-origin-when-cross-origin`.                                                                                                                                                                   | `index.html`                                           |
| **Permissions**                    | Camera, mic, geolocation, and payment APIs blocked via Permissions-Policy.                                                                                                                                            | `index.html`                                           |

#### Note on `'unsafe-eval'`

Zod 3 uses `Function()` internally for regex compilation, which is blocked by
strict CSP. `'unsafe-eval'` is added to `script-src` as a temporary measure.
Remove it once Zod ships a CSP-safe build or the project upgrades to Zod 4.

> **Important:** Client-side mitigations are defence-in-depth only. The backend
> **must** independently validate all inputs, enforce rate limits, and verify CSRF
> headers — never rely solely on the frontend.

---

## Performance & Optimisation

### Bundle

- **Code splitting** via `React.lazy` — one chunk per page, downloaded on demand.
- **Manual Rollup chunks** separate stable vendor libraries so they cache independently.
- **Tree-shaking** — Lucide icons are imported individually, never as a barrel.

### Images

- `loading="lazy"` + `decoding="async"` on every `<CardImage>` — browser-native.
- `aspect-ratio: 16/9` on the detail hero image prevents Cumulative Layout Shift.
- First-card `priority` prop enables `loading="eager"` for the LCP element.
- Broken images fall back to a placeholder automatically.

### Rendering

- `useTransition` in `useSearch` makes filtering non-blocking — input stays responsive.
- `useOptimistic` in `useSaveArticle` removes perceived latency; the optimistic update
  is wrapped in `startTransition` to satisfy React 19's transition requirement.
- `useMemo` in `useSearch` avoids re-filtering on unrelated re-renders.
- `Intl.DateTimeFormat` instances are **cached per locale** in `formatDate.ts` — a
  new formatter is never created unnecessarily.

### Network

- `<link rel="preconnect">` for Google Fonts eliminates 2–3 extra RTTs.
- `<link rel="dns-prefetch">` for API + image origins.
- Axios timeout of 10 s prevents hanging connections.
- `AbortController` cancels in-flight requests when the user navigates away or
  switches language.

### Accessibility / UX

- `@media (prefers-reduced-motion)` disables all animations globally.
- WCAG 2.5.5 touch targets: every interactive element has `min-height/width: 44px`.
- `safe-area-inset-*` padding for notched devices (iPhone X+).
- `-webkit-text-size-adjust: 100%` prevents iOS text resizing on orientation change.
- `:focus-visible` ring with `outline-offset` for keyboard users.
- Eye-icon toggle on password fields uses `aria-pressed` + `aria-label` from `t.form.showPassword / hidePassword`.
- OTP code input on Reset Password page has `autoComplete="one-time-code"` for SMS autofill.

---

## CSS Architecture

Two complementary layers, zero conflicts:

### 1. Global utility classes — `src/styles/global.css`

Imported once in `main.tsx`. Covers truly shared cross-component styles:

- Design tokens (`--color-*`, `--font-*`, `--space-*`, `--shadow-*`)
- CSS reset + base typography
- `.btn` variants (primary, ghost, full, saved)
- `.auth-page` / `.auth-card` shell (all 4 auth pages)
- `.form-input__*` (labels, fields, errors — shared by all forms)
- `.detail-article__*` (article detail layout)
- `@keyframes` animations
- `@media (prefers-reduced-motion)` global override
- Responsive breakpoints at 480 px and 600 px

### 2. CSS Modules — `*.module.css`

Component-scoped, hashed at build time.
**Never assert on hashed class names in tests** — use `aria-*`, `data-testid`,
or text content instead.

---

## Project File Tree

```
Bugle-Planet/
│
├── public/
│   ├── 404.html                                     # GitHub Pages SPA fallback
│   ├── favicon.svg
│   └── spa-404-handler.ts                           # Compiled browser redirect script
├── src/
│   ├── components/
│   │   ├── ArticleLayout/
│   │   │   ├── ArticleLayout.module.css
│   │   │   └── ArticleLayout.tsx                    # Back-button page wrapper
│   │   │
│   │   ├── AuthLayout/
│   │   │   ├── AuthLayout.module.css
│   │   │   └── AuthLayout.tsx                       # Centred card wrapper for all auth forms
│   │   │
│   │   ├── ErrorBoundary/
│   │   │   ├── ErrorBoundary.test.tsx
│   │   │   └── ErrorBoundary.tsx                    # Class-based; resetKey resets on navigation
│   │   │
│   │   ├── Header/
│   │   │   ├── Header.module.css
│   │   │   ├── Header.tsx                           # Locale-aware date via formatDate(today, locale)
│   │   │   ├── Logo.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── TopBar.tsx
│   │   │
│   │   ├── LanguageSwitcher/
│   │   │   └── LanguageSwitcher.tsx                 # UA / EN toggle; persists to localStorage
│   │   │
│   │   ├── Layout/
│   │   │   └── Layout.module.css
│   │   │
│   │   ├── NewsCard/
│   │   │   ├── CardActions.tsx                      # Save/unsave; hover → Trash2; all labels from t.card.*
│   │   │   ├── CardImage.tsx                        # lazy + async + CLS-safe aspect-ratio
│   │   │   ├── CardMeta.tsx                         # Badge + date; passes locale to formatDate
│   │   │   ├── CardTitle.tsx
│   │   │   ├── NewsCard.module.css
│   │   │   ├── NewsCard.test.tsx
│   │   │   └── NewsCard.tsx
│   │   │
│   │   ├── SortControl/
│   │   │   ├── SortControl.module.css
│   │   │   ├── SortControl.test.tsx
│   │   │   └── SortControl.tsx
│   │   │
│   │   ├── Toast/
│   │   │   ├── Toast.module.css                     # .toast .toastError .icon .closeBtn
│   │   │   ├── Toast.test.tsx
│   │   │   └── Toast.tsx                            # variant='success'|'error'; i18n close label
│   │   │
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Spinner.test.tsx
│   │       ├── Spinner.tsx
│   │       └── VisuallyHidden.tsx
│   │
│   ├── context/
│   │   ├── authContext.ts
│   │   ├── AuthProvider.tsx                         # Calls popPendingArticle() after login/register
│   │   ├── popPendingArticle.ts                     # Reads bp_pending_save; uses PENDING_SAVE_KEY constant
│   │   ├── readLocalUser.test.ts
│   │   ├── readLocalUser.ts
│   │   └── readSavedArticles.ts
│   │
│   ├── forms/
│   │   ├── EditProfileForm/
│   │   │   ├── EditProfileForm.module.css
│   │   │   ├── EditProfileForm.test.tsx
│   │   │   ├── EditProfileForm.tsx                  # Title from t.editProfile.title
│   │   │   ├── NicknameField.tsx
│   │   │   ├── ProfileFormActions.tsx
│   │   │   └── ProfilePasswordField.tsx
│   │   │
│   │   ├── ForgotPasswordForm/
│   │   │   ├── CodeSentNotice.tsx
│   │   │   ├── DevCodeNotice.tsx
│   │   │   ├── ForgotPasswordForm.module.css
│   │   │   └── ResetCodeDisplay.tsx
│   │   │
│   │   ├── LoginForm/
│   │   │   ├── LoginForm.module.css                 # .footer stacked column; .footerRow; .footerText
│   │   │   ├── LoginForm.test.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginFormFooter.tsx                  # 2 separate rows: forgotPasswordText + noAccountText/Link
│   │   │   └── ResetSuccessBanner.tsx               # Text from t.login.resetSuccessMsg
│   │   │
│   │   ├── RegisterForm/
│   │   │   ├── RegisterForm.test.tsx
│   │   │   └── RegisterForm.tsx                     # Footer: hasAccountText (p) + hasAccountLink (a)
│   │   │
│   │   ├── ResetPasswordForm/
│   │   │   └── ResetPasswordForm.module.css
│   │   │
│   │   └── shared/
│   │       ├── FormError.tsx
│   │       ├── FormInput.test.tsx
│   │       ├── FormInput.tsx
│   │       ├── forms.module.css                     # .eyeBtn flush right; .passwordWrap .input padding-right: 42px
│   │       ├── GoogleLoginButton.tsx
│   │       ├── PasswordInput.test.tsx
│   │       ├── PasswordInput.tsx                    # Eye/EyeOff lucide icons; flush-right via eyeBtn
│   │       ├── PasswordStrengthHint.module.css
│   │       ├── PasswordStrengthHint.test.tsx
│   │       ├── PasswordStrengthHint.tsx             # Bar + ✓/✗ rule checklist; all labels from t.validation.rules.
│   │       └── SubmitButton.tsx
│   │
│   ├── hooks/
│   │   ├── useArticleActions.test.ts
│   │   ├── useArticleActions.ts
│   │   ├── useAuth.ts
│   │   ├── useAuthSync.ts
│   │   ├── useEditProfileForm.test.tsx
│   │   ├── useEditProfileForm.ts
│   │   ├── useForgotPasswordForm.ts
│   │   ├── useLogin.ts
│   │   ├── useLoginForm.test.tsx
│   │   ├── useLoginForm.ts                          # resolveAuthError translates server error codes
│   │   ├── useNews.ts                               # Re-fetches on locale change; passes locale to service
│   │   ├── useNewsDetail.ts                         # Passes locale to getById; redirects unauth saves; t.detail.*
│   │   ├── useProfilePage.ts
│   │   ├── useRegister.ts
│   │   ├── useRegisterForm.test.tsx
│   │   ├── useRegisterForm.ts                       # resolveAuthError translates server error codes
│   │   ├── useResetPasswordForm.ts                  # resolveAuthError translates server error codes
│   │   ├── useSaveArticle.ts                        # PENDING_SAVE_KEY constant; startTransition wrapper
│   │   ├── useSearch.test.ts
│   │   ├── useSearch.ts
│   │   ├── useSort.test.ts
│   │   ├── useSort.ts
│   │   ├── useUpdateUser.ts                         # resolveAuthError translates server error codes
│   │   ├── useValidation.test.tsx
│   │   └── useValidation.ts                         # initialErrors memoised; isValid exported; stable deps
│   │
│   ├── i18n/
│   │   ├── LocaleContext.test.tsx
│   │   ├── LocaleContext.tsx
│   │   ├── translations.test.ts
│   │   └── translations.ts                          # Full EN + UK with validation.rules.* and all UI strings
│   │
│   ├── mock/
│   │   ├── mockDelay.ts
│   │   └── newsData.ts                              # MOCK_NEWS_BY_LOCALE · CATEGORIES_BY_LOCALE · 16 articles × 2 langs
│   │
│   ├── pages/
│   │   ├── ForgotPasswordPage/
│   │   │   └── ForgotPasswordPage.tsx
│   │   │
│   │   ├── HomePage/
│   │   │   ├── CategoryFilter.module.css
│   │   │   ├── CategoryFilter.test.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── HomeError.tsx
│   │   │   ├── HomeGrid.tsx
│   │   │   ├── homeHelpers.test.ts
│   │   │   ├── homeHelpers.ts                       # filterByCategory(articles, category, locale)
│   │   │   ├── HomeLoading.tsx                      # Uses t.home.loading
│   │   │   ├── HomePage.module.css
│   │   │   ├── HomePage.tsx                         # Resets activeCategory on locale switch
│   │   │   ├── HomeResultCount.tsx                  # Extracted sub-component: "Found X articles"
│   │   │   └── HomeSearchBar.tsx                    # Extracted sub-component: search + date + clear
│   │   │
│   │   ├── NewsDetailPage/
│   │   │   ├── ArticleMeta.tsx                      # Passes locale to formatDate
│   │   │   ├── DetailLoading.tsx
│   │   │   ├── DetailNotFound.tsx
│   │   │   ├── NewsDetailPage.module.css
│   │   │   ├── NewsDetailPage.tsx
│   │   │   └── SaveButton.tsx                       # t.detail.save / t.detail.saved; Bookmark icons
│   │   │
│   │   ├── ProfilePage/
│   │   │   ├── ProfileInfo.module.css
│   │   │   ├── ProfileInfo.test.tsx
│   │   │   ├── ProfileInfo.tsx
│   │   │   ├── ProfilePage.module.css
│   │   │   ├── ProfilePage.tsx                      # Toast messages from t.profile.toast[savedType]
│   │   │   ├── SavedArticleItem.tsx                 # aria-labels from t.profile.removeArticle / readArticle
│   │   │   ├── SavedArticlesEmpty.tsx               # t.profile.savedEmpty
│   │   │   ├── SavedArticlesList.module.css
│   │   │   └── SavedArticlesList.tsx
│   │   │
│   │   ├── ResetPasswordPage/
│   │   │   └── ResetPasswordPage.tsx                # autoComplete="one-time-code" on OTP field
│   │   │
│   │   └── SearchPage/
│   │       ├── SearchFilters.tsx                    # All labels from t.search.*
│   │       ├── SearchPage.module.css                # .stats display:flex; .statsIcon
│   │       ├── SearchPage.tsx
│   │       └── SearchResults.tsx                    # 🔍 emoji icon inline with foundOf(count, total)
│   │
│   ├── router/
│   │   └── PrivateRoute.tsx
│   │
│   ├── schemas/
│   │   ├── article.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── index.ts
│   │   ├── schemas.test.ts
│   │   ├── storage.schema.ts
│   │   └── user.schema.ts
│   │
│   ├── security/
│   │   ├── csrf.test.ts
│   │   ├── csrf.ts
│   │   ├── inputGuard.test.ts
│   │   ├── inputGuard.ts
│   │   ├── rateLimiter.test.ts
│   │   ├── rateLimiter.ts
│   │   ├── sessionGuard.test.ts
│   │   └── sessionGuard.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── emailService.ts
│   │   ├── newsService.ts                           # getAll/getById(signal, locale); Accept-Language header
│   │   ├── savedArticlesService.ts
│   │   └── storage.ts
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── tests/
│   │   ├── setup.ts
│   │   └── testHelpers.tsx
│   │
│   ├── utils/
│   │   ├── formatDate.test.ts
│   │   ├── formatDate.ts                            # Locale-aware; formatter cache per locale (en-US / uk-UA)
│   │   ├── hashPassword.test.ts
│   │   ├── hashPassword.ts
│   │   ├── logger.ts
│   │   ├── resolveAuthError.ts                      # Decodes authService/rateLimiter error codes → locale string
│   │   ├── sanitize.test.ts
│   │   ├── sanitize.ts
│   │   ├── validation.test.ts
│   │   └── validation.ts
│   │
│   ├── App.tsx                                      # Root: providers → routes; all pages lazy-loaded
│   ├── config.ts
│   ├── env.d.ts                                     # Vite env variable TypeScript declarations
│   └── main.tsx                                     # Entry point — CSRF init, StrictMode, createRoot
│
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html                                       # CSP: unsafe-eval for Zod; frame-ancestors in comment
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

## Deployment — GitHub Pages

```bash
# 1. Set the repo name in vite.config.ts
base: '/your-repo-name/',

# 2. Set the production backend URL in .env.production
VITE_API_URL=https://your-backend.onrender.com

# 3. Deploy
npm run deploy    # = npm run build && gh-pages -d dist
```

The SPA fallback uses `public/404.html` to encode the original URL as a query
string. The inline `<script>` in `index.html` decodes it via `history.replaceState`
before React Router mounts — no reload, no flash of the home page.

---

## License

[![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
