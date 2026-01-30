# OAuth2/OIDC Quick Setup Guide

## 📦 Installation

The OAuth packages are already added to `Api.csproj`:

```bash
cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api
dotnet restore
```

## 🔧 Configuration Steps

### 1. Update `appsettings.json`

The file already has the OAuth structure. Fill in your credentials:

**Location:** `/services/api/src/Api/appsettings.json`

```json
{
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
    },
    "Microsoft": {
      "ClientId": "YOUR_MICROSOFT_CLIENT_ID",
      "ClientSecret": "YOUR_MICROSOFT_CLIENT_SECRET",
      "TenantId": "common"
    },
    "GitHub": {
      "ClientId": "YOUR_GITHUB_CLIENT_ID",
      "ClientSecret": "YOUR_GITHUB_CLIENT_SECRET"
    }
  }
}
```

### 2. Provider Setup URLs

#### Google
- Console: https://console.cloud.google.com/apis/credentials
- Redirect URI: `https://localhost:5001/signin-google`

#### Microsoft  
- Console: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
- Redirect URI: `https://localhost:5001/signin-microsoft`

#### GitHub
- Console: https://github.com/settings/developers
- Redirect URI: `https://localhost:5001/signin-github`

## 🚀 Usage

### Frontend Implementation

```typescript
// Redirect to Google login
const loginWithGoogle = () => {
  const returnUrl = encodeURIComponent('http://localhost:5173/app');
  window.location.href = `https://localhost:5001/api/auth/external-login/google?returnUrl=${returnUrl}`;
};

// Redirect to Microsoft login
const loginWithMicrosoft = () => {
  const returnUrl = encodeURIComponent('http://localhost:5173/app');
  window.location.href = `https://localhost:5001/api/auth/external-login/microsoft?returnUrl=${returnUrl}`;
};

// Redirect to GitHub login
const loginWithGitHub = () => {
  const returnUrl = encodeURIComponent('http://localhost:5173/app');
  window.location.href = `https://localhost:5001/api/auth/external-login/github?returnUrl=${returnUrl}`;
};

// Handle callback (extract token from URL)
const handleOAuthCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const expires = params.get('expires');
  
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', expires || '');
    // Redirect to app
    window.location.href = '/app';
  }
};
```

### React Component Example

```tsx
// LoginPage.tsx
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const handleGoogleLogin = () => {
    const returnUrl = encodeURIComponent(window.location.origin + '/app');
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/external-login/google?returnUrl=${returnUrl}`;
  };

  const handleMicrosoftLogin = () => {
    const returnUrl = encodeURIComponent(window.location.origin + '/app');
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/external-login/microsoft?returnUrl=${returnUrl}`;
  };

  const handleGitHubLogin = () => {
    const returnUrl = encodeURIComponent(window.location.origin + '/app');
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/external-login/github?returnUrl=${returnUrl}`;
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
        <svg className="w-5 h-5 mr-2">...</svg>
        Continue with Google
      </Button>
      
      <Button onClick={handleMicrosoftLogin} variant="outline" className="w-full">
        <svg className="w-5 h-5 mr-2">...</svg>
        Continue with Microsoft
      </Button>
      
      <Button onClick={handleGitHubLogin} variant="outline" className="w-full">
        <svg className="w-5 h-5 mr-2">...</svg>
        Continue with GitHub
      </Button>
    </div>
  );
}
```

## 🔍 Testing

### Test OAuth Flow

1. Start your API:
   ```bash
   cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api
   dotnet run
   ```

2. Navigate to:
   ```
   https://localhost:5001/api/auth/external-login/google?returnUrl=https://localhost:5001
   ```

3. You should be redirected to Google OAuth consent screen

4. After approval, you'll be redirected back with a token in the URL

### Test Endpoints

```bash
# Google Login
curl -L "https://localhost:5001/api/auth/external-login/google?returnUrl=http://localhost:5173/app"

# Microsoft Login
curl -L "https://localhost:5001/api/auth/external-login/microsoft?returnUrl=http://localhost:5173/app"

# GitHub Login
curl -L "https://localhost:5001/api/auth/external-login/github?returnUrl=http://localhost:5173/app"
```

## 🐛 Common Issues

### "Redirect URI mismatch"
- Ensure the redirect URI in provider console exactly matches: `https://localhost:5001/signin-{provider}`
- No trailing slashes
- Check protocol (http vs https)

### "Client credentials not configured"
- Verify `appsettings.json` has valid ClientId and ClientSecret
- Restart the API after config changes

### "Email claim not found"
- Some providers require additional scopes to access email
- GitHub: Already configured with `user:email` scope
- Google/Microsoft: Should work by default

### CORS issues
- Add your frontend URL to CORS policy in `Program.cs`
- Example: `builder.Services.AddCors(options => ...)`

## 📝 Files Modified

- ✅ `appsettings.json` - OAuth credentials configuration
- ✅ `Api.csproj` - NuGet packages added
- ✅ `Program.cs` - OAuth middleware configured
- ✅ `Controllers/AuthController.cs` - OAuth endpoints added
- ✅ `Models/AuthModels.cs` - OAuth models added

## 🔐 Security Notes

**For Production:**

1. **Never commit secrets to Git**
   ```bash
   # Use environment variables instead
   export Authentication__Google__ClientSecret="..."
   ```

2. **Update redirect URIs** to production domain
   ```
   https://yourdomain.com/signin-google
   ```

3. **Enable HTTPS** - OAuth requires secure connections

4. **Restrict OAuth app access** in provider consoles

5. **Use Azure Key Vault** or similar for secret management

## 📚 Next Steps

1. Configure OAuth apps in provider consoles
2. Add credentials to `appsettings.json`
3. Test each provider
4. Update frontend login page with OAuth buttons
5. Handle OAuth callback in frontend
6. Add user profile sync from OAuth providers
7. Implement account linking for existing users

## 🆘 Need Help?

See full documentation: [AUTHENTICATION.md](./AUTHENTICATION.md)
