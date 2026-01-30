# Database Migration & Seeding Commands

## 📁 Important File Locations

### Migration Files
- **Location:** `/services/api/src/Infrastructure/Migrations/`
- **Current Migration:** `20260130025157_InitialCreate.cs`
- **Purpose:** Version control for database schema changes

### Entity Models (Schema Definitions)
- **Auth User:** `/services/api/src/Infrastructure/Identity/ApplicationUser.cs`
- **Inventory:** `/services/api/src/Domain/Inventory/InventoryItem.cs`

### Database Context
- **DbContext:** `/services/api/src/Infrastructure/Persistence/AppDbContext.cs`
- **Repository:** `/services/api/src/Infrastructure/Persistence/InventoryRepository.cs`

### Seed Data (Current)
- **Role Seeding:** `/services/api/src/Api/Program.cs` (line 145-158)

### Configuration
- **Connection String:** `/services/api/.env`
- **Settings:** `/services/api/src/Api/appsettings.json`

---

## 🚀 Common Commands

All commands should be run from: `/services/api/src/Api`

```bash
cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api
```

---

## 1. CREATE MIGRATION (after code changes)

### Create New Migration
```bash
# After modifying entities, create a migration
dotnet ef migrations add MigrationName --project ../Infrastructure

# Examples:
dotnet ef migrations add AddPriceToInventory --project ../Infrastructure
dotnet ef migrations add CreateDepartmentTable --project ../Infrastructure
```

**When to use:**
- Added/removed a property from an entity
- Created a new entity class
- Changed column type or constraints
- Added indexes or relationships

---

## 2. PUSH (Apply Migrations to Database)

### Push All Pending Migrations
```bash
# Apply all unapplied migrations to Supabase
dotnet ef database update
```

### Push to Specific Migration
```bash
# Update to a specific migration
dotnet ef database update MigrationName
```

### Preview SQL Without Applying
```bash
# Generate SQL script to see what will be executed
dotnet ef migrations script

# Generate SQL for specific range
dotnet ef migrations script FromMigration ToMigration

# Generate SQL for last migration only
dotnet ef migrations script --idempotent
```

---

## 3. RESET DATABASE

### Option A: Drop All Tables (Full Reset)
```bash
# Drop entire database
dotnet ef database drop

# Then recreate from scratch
dotnet ef database update
```

### Option B: Rollback to Beginning
```bash
# Revert all migrations (empties database)
dotnet ef database update 0

# Then reapply all migrations
dotnet ef database update
```

### Option C: Rollback to Specific Migration
```bash
# Rollback to a specific point
dotnet ef database update MigrationName

# Example: rollback to initial state
dotnet ef database update InitialCreate
```

### Option D: Remove Last Migration (not applied yet)
```bash
# Remove the last migration file (only if not applied to DB)
dotnet ef migrations remove --project ../Infrastructure
```

---

## 4. SEED DATA

### Current Seeding (Roles)

**Location:** `/services/api/src/Api/Program.cs` (lines 145-158)

```csharp
static async Task SeedRolesAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roles = new[] { "User", "Admin" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}
```

### Create a Data Seeder Class

**Step 1:** Create seeder file

**Location:** `/services/api/src/Infrastructure/Persistence/DbSeeder.cs`

```csharp
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Domain.Inventory;

namespace Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        // Seed Roles
        await SeedRolesAsync(roleManager);
        
        // Seed Admin User
        await SeedAdminUserAsync(userManager);
        
        // Seed Sample Inventory
        await SeedInventoryAsync(context);
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        var roles = new[] { "User", "Admin", "Manager" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private static async Task SeedAdminUserAsync(UserManager<ApplicationUser> userManager)
    {
        var adminEmail = "admin@psms.com";
        
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new ApplicationUser
            {
                Email = adminEmail,
                UserName = adminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, "Admin@123");
            
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }

    private static async Task SeedInventoryAsync(AppDbContext context)
    {
        if (!context.InventoryItems.Any())
        {
            var admin = context.Users.FirstOrDefault(u => u.Email == "admin@psms.com");
            
            if (admin != null)
            {
                var items = new[]
                {
                    new InventoryItem { Name = "Laptop", Quantity = 10, OwnerId = admin.Id },
                    new InventoryItem { Name = "Mouse", Quantity = 50, OwnerId = admin.Id },
                    new InventoryItem { Name = "Keyboard", Quantity = 30, OwnerId = admin.Id }
                };

                context.InventoryItems.AddRange(items);
                await context.SaveChangesAsync();
            }
        }
    }
}
```

**Step 2:** Update Program.cs

**Location:** `/services/api/src/Api/Program.cs`

Replace the `SeedRolesAsync` call with:

```csharp
// Before app.Run()
using (var scope = app.Services.CreateScope())
{
    await DbSeeder.SeedAsync(scope.ServiceProvider);
}

app.Run();
```

### Run Seeding

```bash
# Seeding runs automatically when you start the app
dotnet run

# Or if you want to seed manually, create a command
dotnet run --seed
```

### Create Custom Seed Command

**Create:** `/services/api/src/Api/Commands/SeedCommand.cs`

```csharp
public static class SeedCommand
{
    public static async Task ExecuteAsync(string[] args, WebApplication app)
    {
        if (args.Contains("--seed"))
        {
            Console.WriteLine("Seeding database...");
            using var scope = app.Services.CreateScope();
            await DbSeeder.SeedAsync(scope.ServiceProvider);
            Console.WriteLine("Seeding completed!");
            Environment.Exit(0);
        }
    }
}
```

Then in Program.cs:
```csharp
var app = builder.Build();

// Check for seed command
await SeedCommand.ExecuteAsync(args, app);

app.Run();
```

---

## 5. VIEW MIGRATION STATUS

### List All Migrations
```bash
# See all migrations and their status
dotnet ef migrations list
```

### Check Database Connection
```bash
# Test connection and show context info
dotnet ef dbcontext info
```

### View Current Schema
```bash
# Generate SQL script of current state
dotnet ef migrations script > schema.sql
```

---

## 6. COMMON WORKFLOWS

### Workflow 1: Add New Feature with Migration

```bash
# 1. Modify entity (e.g., add Price to InventoryItem)
# Edit: src/Domain/Inventory/InventoryItem.cs

# 2. Create migration
dotnet ef migrations add AddPriceToInventory --project ../Infrastructure

# 3. Review generated migration
# Check: src/Infrastructure/Migrations/[timestamp]_AddPriceToInventory.cs

# 4. Apply to database
dotnet ef database update

# 5. Run app to test
dotnet run
```

### Workflow 2: Reset and Reseed Database

```bash
# 1. Drop database
dotnet ef database drop --force

# 2. Recreate from migrations
dotnet ef database update

# 3. Seed data (runs automatically on app start)
dotnet run
```

### Workflow 3: Create New Table

```bash
# 1. Create entity
# Create: src/Domain/Department/Department.cs

# 2. Add to DbContext
# Edit: src/Infrastructure/Persistence/AppDbContext.cs
# Add: public DbSet<Department> Departments => Set<Department>();

# 3. Configure entity
# Edit: src/Infrastructure/Persistence/AppDbContext.cs
# Add configuration in OnModelCreating()

# 4. Create migration
dotnet ef migrations add CreateDepartmentTable --project ../Infrastructure

# 5. Apply migration
dotnet ef database update
```

### Workflow 4: Production Deployment

```bash
# 1. Generate SQL script (for review)
dotnet ef migrations script --idempotent --output migration.sql

# 2. Review the SQL script

# 3. Apply to production
dotnet ef database update --connection "YOUR_PRODUCTION_CONNECTION_STRING"

# Or apply SQL script manually in Supabase SQL Editor
```

---

## 7. TROUBLESHOOTING

### Migration Already Applied
```bash
# If you get "migration already applied" error
dotnet ef migrations remove --project ../Infrastructure

# Then recreate it
dotnet ef migrations add YourMigration --project ../Infrastructure
```

### Connection String Issues
```bash
# Check if .env is loaded
cat ../../.env | grep DATABASE_URL

# Test connection
dotnet ef dbcontext info
```

### Pending Model Changes
```bash
# Check what changes are pending
dotnet ef migrations add CheckChanges --project ../Infrastructure --dry-run
```

### Reset Migrations Completely
```bash
# 1. Delete all migration files
rm -rf ../Infrastructure/Migrations

# 2. Drop database
dotnet ef database drop --force

# 3. Create fresh initial migration
dotnet ef migrations add InitialCreate --project ../Infrastructure

# 4. Apply
dotnet ef database update
```

---

## 8. QUICK REFERENCE

| Task | Command |
|------|---------|
| Create migration | `dotnet ef migrations add Name --project ../Infrastructure` |
| Apply migrations | `dotnet ef database update` |
| List migrations | `dotnet ef migrations list` |
| Remove last migration | `dotnet ef migrations remove --project ../Infrastructure` |
| Drop database | `dotnet ef database drop` |
| Reset to migration | `dotnet ef database update MigrationName` |
| Reset completely | `dotnet ef database update 0` |
| Generate SQL | `dotnet ef migrations script` |
| Check context | `dotnet ef dbcontext info` |
| Seed data | Runs on `dotnet run` (automatic) |

---

## 9. FILE STRUCTURE

```
services/api/
├── .env                                    ← Connection string
├── src/
│   ├── Api/
│   │   ├── Program.cs                      ← Seeding logic (line 145-158)
│   │   └── appsettings.json                ← App settings
│   ├── Domain/
│   │   └── Inventory/
│   │       └── InventoryItem.cs            ← Entity definition
│   └── Infrastructure/
│       ├── Identity/
│       │   └── ApplicationUser.cs          ← User entity
│       ├── Persistence/
│       │   ├── AppDbContext.cs             ← Database context
│       │   ├── DbSeeder.cs                 ← Create this for seeding
│       │   └── InventoryRepository.cs      ← Data access
│       └── Migrations/
│           └── 20260130025157_InitialCreate.cs  ← Current migration
```

---

## 10. BEST PRACTICES

✅ **DO:**
- Always create descriptive migration names
- Review generated migrations before applying
- Test migrations in development first
- Keep migrations in source control
- Use seeding for required data only
- Create separate seeders for dev/prod data

❌ **DON'T:**
- Don't edit applied migrations
- Don't delete migration files from source control
- Don't apply migrations directly to production without review
- Don't hardcode production data in seeders
- Don't commit sensitive data in seed files

---

## Next Steps

1. **Create DbSeeder.cs** for organized seeding
2. **Add sample data** for development/testing
3. **Create separate Production seeder** with minimal data
4. **Add data validation** in seeders
5. **Document seed data requirements** for new developers
