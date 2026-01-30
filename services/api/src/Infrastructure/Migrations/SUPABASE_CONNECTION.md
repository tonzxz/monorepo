# Supabase Database Connection Guide

## 🎯 Quick Setup

Your API is **already configured** to work with Supabase! The `Program.cs` checks for `DATABASE_URL` environment variable automatically.

## 🔐 Connection String Format

Supabase provides this connection string:
```
postgresql://postgres:[YOUR-PASSWORD]@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres
```

## 📝 Setup Methods

### Method 1: Environment Variable (RECOMMENDED)

#### On macOS/Linux:

**Temporary (current terminal session only):**
```bash
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"
cd src/Api
dotnet run
```

**Permanent (add to `~/.zshrc` or `~/.bashrc`):**
```bash
echo 'export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"' >> ~/.zshrc
source ~/.zshrc
```

#### Using .env file (with dotenv package):

1. **Install DotNetEnv package:**
```bash
cd src/Api
dotnet add package DotNetEnv
```

2. **Update Program.cs** (add at the very top, before `var builder`):
```csharp
// Load .env file
DotNetEnv.Env.Load();
```

3. **Create/Edit `.env` file** (already created at `/services/api/.env`):
```bash
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres
```

4. **Run the API:**
```bash
dotnet run
```

### Method 2: appsettings.json (Development Only)

Already updated in [appsettings.json](src/Api/appsettings.json):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.iwhasfqljiyllfpzhkdt.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

**⚠️ WARNING:** Don't commit your password to Git!

### Method 3: User Secrets (Development)

```bash
cd src/Api

# Initialize user secrets
dotnet user-secrets init

# Set the connection string
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=db.iwhasfqljiyllfpzhkdt.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD"

# Or set DATABASE_URL
dotnet user-secrets set "DATABASE_URL" "postgresql://postgres:YOUR_PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"
```

## 🔍 How It Works

Your `Program.cs` (lines 32-34) checks in this order:

1. **First:** `ConnectionStrings:DefaultConnection` from appsettings.json
2. **Then:** `DATABASE_URL` environment variable (Supabase format)
3. **Throws error** if neither is found

```csharp
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["DATABASE_URL"];
```

This means you can use **either** format:
- Standard .NET format in appsettings
- PostgreSQL URL format in environment variable

## 🗄️ Get Your Supabase Password

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection String** section
5. Click **URI** tab
6. Copy the password or reset it

## 🧪 Test the Connection

```bash
# Set the environment variable
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"

# Navigate to Api project
cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api

# Run the API
dotnet run
```

**Expected output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**If connection fails, you'll see:**
```
System.InvalidOperationException: Database connection string not configured.
```
or
```
Npgsql.NpgsqlException: Connection refused
```

## 🚀 Production Deployment

### Railway / Render / Heroku
Set environment variable in dashboard:
```
DATABASE_URL=postgresql://postgres:PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres
```

### Azure App Service
```bash
az webapp config appsettings set \
  --name your-app-name \
  --resource-group your-rg \
  --settings DATABASE_URL="postgresql://postgres:PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"
```

### Docker
```dockerfile
ENV DATABASE_URL="postgresql://postgres:PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"
```

Or use docker-compose:
```yaml
services:
  api:
    environment:
      - DATABASE_URL=postgresql://postgres:PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres
```

## 🔒 Security Best Practices

✅ **DO:**
- Use environment variables for passwords
- Use `.env` files locally (already gitignored)
- Use user secrets for development
- Use Azure Key Vault / AWS Secrets Manager for production

❌ **DON'T:**
- Commit passwords to Git
- Share `.env` files
- Use the same password for dev and production
- Hardcode connection strings

## 🗃️ Database Migrations

After connecting, run migrations:

```bash
cd src/Api

# Create a migration
dotnet ef migrations add InitialCreate

# Apply migrations to Supabase
dotnet ef database update
```

## 🐛 Troubleshooting

### "No connection could be made"
- Check if Supabase project is running
- Verify the host: `db.iwhasfqljiyllfpzhkdt.supabase.co`
- Check firewall/network settings

### "Password authentication failed"
- Verify password is correct
- Check for special characters (may need URL encoding)
- Reset password in Supabase dashboard

### "Database does not exist"
- Database name should be `postgres` (default Supabase database)
- Don't create a new database, use the default one

### Environment variable not loaded
```bash
# Check if variable is set
echo $DATABASE_URL

# If empty, set it again
export DATABASE_URL="postgresql://postgres:PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"
```

## 📁 Files Created/Modified

- ✅ `.env` - Your local environment variables (gitignored)
- ✅ `.env.example` - Template for team members
- ✅ `.gitignore` - Protects sensitive files
- ✅ `appsettings.json` - Updated with Supabase connection

## 🔗 Related Files

- [Program.cs](src/Api/Program.cs#L32-L34) - Connection string resolution
- [appsettings.json](src/Api/appsettings.json) - Configuration file
- [AppDbContext.cs](src/Infrastructure/Persistence/AppDbContext.cs) - Database context

## ✅ Next Steps

1. **Get your password** from Supabase dashboard
2. **Set environment variable:**
   ```bash
   export DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.iwhasfqljiyllfpzhkdt.supabase.co:5432/postgres"
   ```
3. **Run migrations:**
   ```bash
   cd src/Api
   dotnet ef database update
   ```
4. **Start the API:**
   ```bash
   dotnet run
   ```
5. **Test authentication** endpoints from your frontend

---

**Need help?** Check the [AUTHENTICATION.md](./AUTHENTICATION.md) for API usage.
