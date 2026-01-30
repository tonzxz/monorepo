# Frontend Login Setup Complete ✅

## What's Been Updated

### 1. Login Form Features
- ✅ **Login** - Email/password authentication
- ✅ **Register** - Create new account with email, password, and optional address
- ✅ **Google OAuth** - Sign in with Google account
- ✅ **Toggle Mode** - Switch between login and register modes

### 2. Files Modified

#### API Client (`/apps/web/src/lib/api/auth.ts`)
- Added `register()` function
- Added `loginWithGoogle()` function
- Added `RegisterRequest` type

#### Login Form (`/apps/web/src/components/login-form.tsx`)
- Added register mode state
- Added address field for registration
- Connected Google OAuth button
- Added toggle between login/register modes
- Improved error messages

#### Router (`/apps/web/src/app/router.tsx`)
- Added OAuth callback route: `/auth/callback`

#### New Files Created
- `/apps/web/src/features/auth/pages/OAuthCallbackPage.tsx` - Handles OAuth redirect
- `/apps/web/.env` - Frontend environment variables
- `/apps/web/.env.example` - Template for environment variables

## How to Use

### 1. Start Backend API
```bash
cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api
dotnet run
```

### 2. Start Frontend
```bash
cd /Users/tonzxzzz/apps/quanby/psms/apps/web
npm run dev
```

### 3. Test Features

#### Register New Account
1. Go to http://localhost:5173/login
2. Click "Sign up" link
3. Enter email, password, and optional address
4. Click "Create Account"

#### Login with Email/Password
1. Go to http://localhost:5173/login
2. Enter email and password
3. Click "Login"

#### Login with Google
1. Click "Login with Google" button
2. Select Google account
3. Redirected back to app after authentication

## Default Test Account

From backend seeding:
- **Email**: admin@psms.com
- **Password**: Admin@123456
- **Role**: Admin

## Important Notes

### Google OAuth Setup
Your Google OAuth credentials are configured in `/services/api/.env`:
- ClientId: `YOUR_GOOGLE_CLIENT_ID` (see .env file)
- ClientSecret: `YOUR_GOOGLE_CLIENT_SECRET` (see .env file)

**Update Google Console Redirect URIs**:
1. Go to https://console.cloud.google.com/apis/credentials
2. Edit your OAuth client
3. Add these authorized redirect URIs:
   - `https://localhost:5001/signin-google`
   - `http://localhost:5001/signin-google` (for development)

### Frontend Environment Variable
The `.env` file sets:
```
VITE_API_URL=https://localhost:5001
```

Change this to your production API URL when deploying.

### CORS Configuration
The backend already allows your frontend URL. If you change ports, update CORS in `/services/api/src/Api/Program.cs`.

## Troubleshooting

### "OAuth redirect mismatch"
- Ensure Google Console has `https://localhost:5001/signin-google` in redirect URIs
- Check if API is running on port 5001

### "Login failed"
- Verify backend API is running
- Check browser console for network errors
- Ensure `.env` file exists with `VITE_API_URL`

### "Registration failed"
- Email might already exist
- Password must be at least 6 characters with 1 digit

### OAuth returns error
- Check that Google OAuth credentials are valid
- Verify redirect URI matches exactly (no trailing slash)
- Ensure HTTPS is used for OAuth (localhost with HTTPS is allowed in dev)

## Next Steps

1. **Test Registration**: Create a new account
2. **Test Login**: Login with email/password
3. **Test Google OAuth**: Click Google button and complete flow
4. **Add More Providers**: Microsoft and GitHub OAuth already configured in backend, just need frontend buttons
5. **Customize**: Update styling, add forgot password, email verification, etc.

## API Endpoints Used

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/external-login/google` - Initiate Google OAuth
- `GET /api/auth/external-login-callback` - Handle OAuth redirect

All endpoints are documented in `/services/api/AUTHENTICATION.md`
