# Database Schema Synchronization Guide

## Current Schema (Code-First)

Your API uses **Entity Framework Core** with a **code-first** approach:
1. Define entities in C# code
2. Generate migrations from code changes
3. Apply migrations to database

## Schema Files

### Authentication (ASP.NET Identity)
- **Location:** Built-in to ASP.NET Core Identity
- **Tables:** `AspNetUsers`, `AspNetRoles`, `AspNetUserRoles`, `AspNetUserClaims`, `AspNetUserLogins`, `AspNetUserTokens`, `AspNetRoleClaims`

### Inventory
- **Entity:** [Domain/Inventory/InventoryItem.cs](src/Domain/Inventory/InventoryItem.cs)
- **Configuration:** [Infrastructure/Persistence/AppDbContext.cs](src/Infrastructure/Persistence/AppDbContext.cs)
- **Table:** `inventory_items`

## Workflow: Code → Database (Normal)

### 1. Modify Entity (Code)

Edit entity file:
```csharp
// Domain/Inventory/InventoryItem.cs
public class InventoryItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; } // ← NEW FIELD
    public string OwnerId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### 2. Create Migration

```bash
cd src/Api
dotnet ef migrations add AddPriceToInventoryItem
```

This generates a migration file in `Infrastructure/Persistence/Migrations/`

### 3. Apply to Database

```bash
dotnet ef database update
```

This pushes the schema change to Supabase.

## Workflow: Database → Code (Reverse Engineering)

**If you make changes directly in Supabase and want to pull them:**

### Option 1: Scaffold Entire Database (Like Prisma Pull)

```bash
cd src/Api

# Scaffold from Supabase (creates new context + entities)
dotnet ef dbcontext scaffold \
  "User Id=postgres.kdkqzrdzxyycgzhdjhwi;Password=@Tonzxz111201;Server=aws-1-ap-southeast-1.pooler.supabase.com;Port=5432;Database=postgres" \
  Npgsql.EntityFrameworkCore.PostgreSQL \
  --output-dir ScaffoldedModels \
  --context-dir ScaffoldedContext
```

Then manually merge changes into your existing entities.

### Option 2: Create Migration from Current DB State

If you changed the DB directly:

```bash
# Create a migration that matches current DB state
dotnet ef migrations add SyncWithDatabase

# Review the generated migration file
# Edit it to only include intended changes

# Apply it
dotnet ef database update
```

### Option 3: Drop and Recreate (Development Only)

```bash
# Remove all migrations
rm -rf src/Infrastructure/Persistence/Migrations

# Drop database
dotnet ef database drop

# Create fresh migration from current code
dotnet ef migrations add InitialCreate

# Apply
dotnet ef database update
```

## Viewing Current Schema

### In Supabase Dashboard

1. Go to **Table Editor**
2. See all tables and columns
3. View relationships, indexes, constraints

### Using SQL (Supabase SQL Editor)

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Describe a table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'inventory_items';

-- View indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'inventory_items';
```

### Using EF Core Migrations

```bash
# Generate SQL script from migrations
dotnet ef migrations script

# This shows all SQL that would be executed
```

## Generate Schema Documentation

```bash
cd src/Api

# Install tool
dotnet tool install --global dotnet-ef-dbdoc

# Generate markdown docs
dotnet ef dbcontext info
```

## Best Practices

### ✅ DO:
- **Keep migrations in source control** - Track schema changes over time
- **Use code-first for local development** - Define entities in C#, generate migrations
- **Test migrations before production** - Apply to dev/staging first
- **Name migrations descriptively** - `AddPriceColumn` not `Update1`
- **Review generated migrations** - EF sometimes generates unexpected SQL

### ❌ DON'T:
- **Don't edit database directly in production** - Always use migrations
- **Don't delete migration files** - They're needed to rebuild DB from scratch
- **Don't modify applied migrations** - Create new migrations instead
- **Don't commit connection strings with passwords** - Use environment variables

## Useful Commands

```bash
# List all migrations
dotnet ef migrations list

# Remove last unapplied migration
dotnet ef migrations remove

# Generate SQL script without applying
dotnet ef migrations script

# Update to specific migration
dotnet ef database update MigrationName

# Revert all migrations (drop database)
dotnet ef database update 0

# Get help
dotnet ef --help
```

## Comparing with Prisma

| Feature | Prisma | EF Core |
|---------|--------|---------|
| Define schema | `schema.prisma` file | C# entity classes |
| Generate migrations | `prisma migrate dev` | `dotnet ef migrations add` |
| Apply migrations | `prisma migrate deploy` | `dotnet ef database update` |
| Pull from DB | `prisma db pull` | `dotnet ef dbcontext scaffold` |
| Push to DB | `prisma db push` | `dotnet ef database update` |
| View schema | `schema.prisma` file | Migration files + entities |
| Client generation | `prisma generate` | Built into EF Core |

## Current Entities

### ApplicationUser
```csharp
// Infrastructure/Identity/ApplicationUser.cs
public class ApplicationUser : IdentityUser
{
    // Inherits all ASP.NET Identity fields
    // Add custom fields here if needed
}
```

### InventoryItem
```csharp
// Domain/Inventory/InventoryItem.cs
public class InventoryItem
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public string OwnerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

## Next Steps

1. **Add new entities** by creating files in `Domain/`
2. **Configure relationships** in `AppDbContext.OnModelCreating()`
3. **Generate migration**: `dotnet ef migrations add <Name>`
4. **Apply to Supabase**: `dotnet ef database update`
5. **Commit migration files** to Git

Need to pull from Supabase? Use the scaffold command above.
