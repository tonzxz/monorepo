2# Authentication Documentation

## Overview

This API supports multiple authentication strategies:
1. **JWT Bearer Authentication** - Email/password with JWT tokens
2. **OAuth2/OIDC** - Social login via Google, Microsoft, and GitHub

---

## 📁 Configuration Files

### Main Configuration: `appsettings.json`

Located at: `/services/api/src/Api/appsettings.json`

Contains JWT and OAuth2/OIDC settings for all authentication providers.

### Development Override: `appsettings.Development.json`

Located at: `/services/api/src/Api/appsettings.Development.json`

Can override settings for local development.

---

## 🔐 JWT Authentication (Current)

### Configuration

```json
{
  "Jwt": {
    "Issuer": "psms",
    "Audience": "psms",
    "SigningKey": "CHANGE_ME_TO_A_LONG_RANDOM_SECRET",
    "ExpiryMinutes": 60
  }
}
```

### Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "role": "User"  // Optional: "User" or "Admin"
}

Response:
{
  "accessToken": "eyJhbGci...",
  "expiresAtUtc": "2026-01-30T10:00:00Z"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

Response:
{
  "accessToken": "eyJhbGci...",
  "expiresAtUtc": "2026-01-30T10:00:00Z"
}
```

#### Add Custom Claim (Authenticated)
```http
POST /api/auth/claim
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "department",
  "value": "engineering"
}

Response: 200 OK
```

### Security Features

- ✅ Password hashing via ASP.NET Identity
- ✅ HMAC-SHA256 token signing
- ✅ Token expiration validation
- ✅ Role-based authorization
- ✅ Custom claims support
- ✅ PostgreSQL user storage

---

## 🌐 OAuth2/OIDC Authentication (NEW)

### Configuration

Add to `appsettings.json`:

```json
{
  "Authentication": {
    "Google": {
      "ClientId": "your-google-client-id.apps.googleusercontent.com",
      "ClientSecret": "your-google-client-secret"
    },
    "Microsoft": {
      "ClientId": "your-microsoft-client-id",
      "ClientSecret": "your-microsoft-client-secret",
      "TenantId": "common"  // or your specific tenant ID
    },
    "GitHub": {
      "ClientId": "your-github-client-id",
      "ClientSecret": "your-github-client-secret"
    }
  }
}
```

### Setup Instructions

#### 1. Google OAuth2

**Create OAuth2 Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - `https://yourdomain.com/signin-google` (production)
   - `https://localhost:5001/signin-google` (development)

**Configuration:**
```json
{
  "Authentication": {
    "Google": {
      "ClientId": "123456789-abcdef.apps.googleusercontent.com",
      "ClientSecret": "GOCSPX-xxxxxxxxxxxx"
    }
  }
}
```

#### 2. Microsoft OAuth2

**Create App Registration:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Name: "PSMS API"
5. Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
6. Redirect URI: `https://yourdomain.com/signin-microsoft`
7. After creation, go to "Certificates & secrets" → "New client secret"

**Configuration:**
```json
{
  "Authentication": {
    "Microsoft": {
      "ClientId": "12345678-1234-1234-1234-123456789abc",
      "ClientSecret": "your-secret-value",
      "TenantId": "common"
    }
  }
}
```

#### 3. GitHub OAuth2

**Create OAuth App:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Application name: "PSMS API"
4. Homepage URL: `https://yourdomain.com`
5. Authorization callback URL: `https://yourdomain.com/signin-github`
6. Click "Register application"
7. Generate a new client secret

**Configuration:**
```json
{
  "Authentication": {
    "GitHub": {
      "ClientId": "Iv1.1234567890abcdef",
      "ClientSecret": "your-github-secret"
    }
  }
}
```

### Endpoints

#### External Login Initiation
```http
GET /api/auth/external-login/{provider}?returnUrl=/app

Providers: google, microsoft, github

Response: 302 Redirect to OAuth provider
```

#### External Login Callback
```http
GET /signin-{provider}

Handles OAuth callback and returns JWT

Response: Redirect to returnUrl with token in query or cookie
```

#### Link External Provider (Authenticated)
```http
POST /api/auth/link-external/{provider}
Authorization: Bearer {token}

Links an external provider to existing account

Response: 200 OK
```

---

## 🔧 Implementation Files

### Core Files

| File | Description |
|------|-------------|
| `Program.cs` | Authentication middleware configuration |
| `appsettings.json` | JWT and OAuth2/OIDC credentials |
| `Controllers/AuthController.cs` | Authentication endpoints |
| `Services/TokenService.cs` | JWT token generation |
| `Services/CurrentUser.cs` | Current user resolution |
| `Models/AuthModels.cs` | Request/response DTOs |
| `Infrastructure/Identity/ApplicationUser.cs` | User entity |
| `Infrastructure/Persistence/AppDbContext.cs` | Database context with Identity |

### Data Flow

```
User Request
    ↓
AuthController
    ↓
UserManager (ASP.NET Identity)
    ↓
AppDbContext (PostgreSQL)
    ↓
TokenService
    ↓
JWT Token Response
```

---

## 🚀 Usage Examples

### Frontend Integration (React/TypeScript)

#### JWT Login
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const { accessToken, expiresAtUtc } = await response.json();
  localStorage.setItem('token', accessToken);
  return accessToken;
};
```

#### OAuth2 Login
```typescript
const loginWithGoogle = () => {
  const returnUrl = encodeURIComponent(window.location.origin + '/app');
  window.location.href = `/api/auth/external-login/google?returnUrl=${returnUrl}`;
};
```

#### Authenticated Request
```typescript
const getInventory = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/inventory', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] Change `Jwt:SigningKey` to a strong random secret (min 32 characters)
- [ ] Use HTTPS for all endpoints
- [ ] Store OAuth secrets in environment variables or Azure Key Vault
- [ ] Enable CORS only for trusted origins
- [ ] Implement refresh tokens for long-lived sessions
- [ ] Add rate limiting to auth endpoints
- [ ] Enable MFA for admin accounts
- [ ] Log authentication attempts
- [ ] Implement account lockout after failed attempts
- [ ] Use secure cookies for OAuth flow
- [ ] Validate redirect URLs to prevent open redirects

### Environment Variables

Instead of `appsettings.json`, use environment variables:

```bash
# JWT
export Jwt__SigningKey="your-production-secret-key"

# Google OAuth
export Authentication__Google__ClientId="..."
export Authentication__Google__ClientSecret="..."

# Microsoft OAuth
export Authentication__Microsoft__ClientId="..."
export Authentication__Microsoft__ClientSecret="..."

# GitHub OAuth
export Authentication__GitHub__ClientId="..."
export Authentication__GitHub__ClientSecret="..."
```

---

## 🐛 Troubleshooting

### "Issuer validation failed"
- Ensure `Jwt:Issuer` matches in both token creation and validation
- Check that the issuer is not empty

### "The signature is invalid"
- Verify `Jwt:SigningKey` is the same in all environments
- Ensure key is at least 16 characters (recommend 32+)

### OAuth redirect fails
- Check redirect URIs match exactly in provider console
- Ensure HTTPS is used in production
- Verify provider is enabled in middleware

### User not found after OAuth login
- Check that `ApplicationUser` is properly created on external login
- Verify email claim is being read from provider

---

## 📚 Additional Resources

- [ASP.NET Core Identity Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [Google OAuth2 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
