# Authentication Implementation (Access Token + Refresh Token)

This document explains how authentication is currently implemented in this project and how backend and frontend work together.

## 1) Overview

The app uses **two-token authentication**:

- **Access Token (JWT)**
  - Lifetime: **10 minutes**
  - Sent by frontend in `authtoken` header
  - Used to authorize API calls
- **Refresh Token (JWT)**
  - Lifetime: **7 days**
  - Stored as **httpOnly cookie** (`refreshToken`)
  - Used only to issue a new access token

### Security Goal
A stolen access token alone is not enough to use protected APIs. The backend also validates the refresh-session state.

---

## 2) Backend Design

## 2.1 Token creation and storage

Implemented in `backend/services/auth.service.js`.

- Access token is signed with `ACCESS_TOKEN_SECRET` and `expiresIn: '10m'`.
- Refresh token is signed with `REFRESH_TOKEN_SECRET` and `expiresIn: '7d'`.
- Refresh token is hashed with SHA-256 before storing:
  - `refreshTokenHash`
  - `refreshTokenExpires`
- These fields are stored in the user document.

This means raw refresh tokens are not persisted in DB.

## 2.2 Login / signup response behavior

Implemented in `backend/controller/auth.controller.js`.

On successful `createuser` and `login`:

- Backend sets `refreshToken` as cookie using:
  - `httpOnly: true`
  - `sameSite: 'lax'` (dev), `'none'` (prod)
  - `secure: true` in production
  - `maxAge: 7 days`
- Backend returns JSON with the access token as `authtoken`.

## 2.3 Refresh endpoint

Route: `POST /api/auth/refresh-token` (in `backend/routes/auth.js`)

Flow:

1. Read `refreshToken` from cookie.
2. Verify refresh JWT signature + payload.
3. Find user and compare hashed cookie token with stored `refreshTokenHash`.
4. Validate stored expiry (`refreshTokenExpires`).
5. If valid, rotate tokens:
   - Issue new access token (10m)
   - Issue new refresh token (7d)
   - Update DB hash + expiry
   - Set new refresh cookie
6. Return new access token.

If invalid/expired, backend clears cookie and returns 401.

## 2.4 Protected route validation

Implemented in `backend/middleware/fetchuser.js`.

Every protected request must pass both checks:

1. `authtoken` header contains valid access token.
2. `refreshToken` cookie exists and matches active stored refresh session.

If either fails, request is rejected with 401.

This is the core protection that prevents access-token-only misuse.

## 2.5 Logout

Route: `POST /api/auth/logout`

- Backend revokes current session by clearing stored refresh hash/expiry.
- Backend clears refresh cookie.

## 2.6 Password reset interaction

On password reset, backend clears `refreshTokenHash` and `refreshTokenExpires`.

Result: all active sessions become invalid and user must login again.

---

## 3) Frontend Design

## 3.1 Access token storage

- Access token is stored in `localStorage` key: `token`.
- Set on successful login/signup response.

## 3.2 Automatic refresh + retry

Implemented in `frontend/src/utils/authUtils.js`.

Main helper: `authenticatedFetch(url, options, navigate)`

Behavior:

1. Send request with:
   - `authtoken` header from localStorage
   - `credentials: 'include'` (so refresh cookie is sent)
2. If response is not 401, return it.
3. If 401, call `POST /api/auth/refresh-token`.
4. If refresh succeeds:
   - Save new access token in localStorage
   - Retry original request once with new token
5. If refresh fails:
   - Clear local token
   - Redirect user to login

## 3.3 Where it is used

Protected API calls now use `authenticatedFetch` in:

- Notes state/API calls (`frontend/src/context/notes/NoteState.js`)
- AI chat API call (`frontend/src/components/AiChat.js`)

Login/signup include `credentials: 'include'` so browser can receive refresh cookie.
Logout calls backend logout route and clears local state.

---

## 4) End-to-End Flows

## 4.1 Login flow

1. User logs in.
2. Backend validates credentials.
3. Backend issues access + refresh.
4. Backend sets refresh cookie + returns access token.
5. Frontend stores access token in localStorage.

## 4.2 Normal authenticated request

1. Frontend sends access token + cookie.
2. Backend validates access token and refresh-session match.
3. If both valid, request is processed.

## 4.3 Access token expired

1. Protected request returns 401.
2. Frontend calls refresh endpoint using cookie.
3. Backend validates and rotates tokens.
4. Frontend retries original request automatically.

## 4.4 Session theft scenarios

- **Only access token stolen**: attacker fails on protected routes (no valid refresh cookie/session).
- **Refresh token replay**: DB stores only hash and rotates refresh token, reducing replay window.
- **Password reset**: all refresh sessions revoked.

---

## 5) Required Local Environment Variables

## Backend (`backend/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/inotebook
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=replace_with_strong_access_secret
REFRESH_TOKEN_SECRET=replace_with_strong_refresh_secret
JWT_SECRET=replace_with_legacy_jwt_secret
GOOGLE_AI_API_KEY=replace_with_google_ai_api_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Frontend (`frontend/.env`)

```env
REACT_APP_API_BASE_URL=http://localhost:5000
NODE_ENV=development
```

---

## 6) Important Notes

- `JWT_SECRET` is kept as legacy fallback. New auth uses `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.
- For production, use strong random secrets and HTTPS.
- For cross-site frontend/backend in production, keep `SameSite=None` + `Secure=true` cookie policy.
