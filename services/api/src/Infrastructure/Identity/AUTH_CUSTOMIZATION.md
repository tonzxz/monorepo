# Customizing Authentication Schema

## 📋 Overview

The authentication tables (AspNetUsers, AspNetRoles, etc.) are managed by **ASP.NET Core Identity**. You can customize them by extending the `ApplicationUser` class.

## 🔧 How to Modify Auth Schema

### Step 1: Edit ApplicationUser

**File:** `/services/api/src/Infrastructure/Identity/ApplicationUser.cs`

```csharp
public class ApplicationUser : IdentityUser
{
    // Add your custom fields here
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Department { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### Step 2: Create Migration

```bash
cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api

# Create migration for auth changes
dotnet ef migrations add AddCustomFieldsToUser --project ../Infrastructure
```

### Step 3: Apply to Database

```bash
# Push changes to Supabase
dotnet ef database update
```

### Step 4: Update Seeder (Optional)

**File:** `/services/api/src/Infrastructure/Persistence/DbSeeder.cs`

```csharp
var admin = new ApplicationUser
{
    Email = adminEmail,
    UserName = adminEmail,
    EmailConfirmed = true,
    FirstName = "Admin",      // ← New field
    LastName = "User",        // ← New field
    Department = "IT"         // ← New field
};
```

---

## 📊 Built-in Identity Fields

**AspNetUsers** table already includes:

```csharp
// From IdentityUser base class:
public string Id { get; set; }                    // Primary key
public string UserName { get; set; }              // Username
public string NormalizedUserName { get; set; }    // For searches
public string Email { get; set; }                 // Email
public string NormalizedEmail { get; set; }       // For searches
public bool EmailConfirmed { get; set; }          // Email verified
public string PasswordHash { get; set; }          // Hashed password
public string SecurityStamp { get; set; }         // Security token
public string ConcurrencyStamp { get; set; }      // Concurrency
public string PhoneNumber { get; set; }           // Phone
public bool PhoneNumberConfirmed { get; set; }    // Phone verified
public bool TwoFactorEnabled { get; set; }        // 2FA enabled
public DateTimeOffset? LockoutEnd { get; set; }   // Account lockout
public bool LockoutEnabled { get; set; }          // Lockout allowed
public int AccessFailedCount { get; set; }        // Failed attempts
```

**You don't need to add these - they're already there!**

---

## 🎯 Common Customizations

### Example 1: Add Profile Information

```csharp
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public DateTime? DateOfBirth { get; set; }
    
    // Computed property
    public string FullName => $"{FirstName} {LastName}".Trim();
}
```

**Migration:**
```bash
dotnet ef migrations add AddUserProfile --project ../Infrastructure
dotnet ef database update
```

### Example 2: Add Organization Fields

```csharp
public class ApplicationUser : IdentityUser
{
    public string? Department { get; set; }
    public string? Position { get; set; }
    public string? EmployeeId { get; set; }
    public DateTime? HireDate { get; set; }
    public bool IsActive { get; set; } = true;
}
```

**Migration:**
```bash
dotnet ef migrations add AddOrganizationFields --project ../Infrastructure
dotnet ef database update
```

### Example 3: Add Relationships

```csharp
using Domain.Inventory;

public class ApplicationUser : IdentityUser
{
    // Navigation property - one user has many inventory items
    public virtual ICollection<InventoryItem> InventoryItems { get; set; } 
        = new List<InventoryItem>();
}
```

**Then configure in AppDbContext:**

```csharp
// In AppDbContext.OnModelCreating()
builder.Entity<ApplicationUser>()
    .HasMany(u => u.InventoryItems)
    .WithOne()
    .HasForeignKey(i => i.OwnerId)
    .OnDelete(DeleteBehavior.Cascade);
```

**Migration:**
```bash
dotnet ef migrations add AddUserInventoryRelationship --project ../Infrastructure
dotnet ef database update
```

### Example 4: Add Audit Fields

```csharp
public class ApplicationUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
}
```

**Migration:**
```bash
dotnet ef migrations add AddAuditFields --project ../Infrastructure
dotnet ef database update
```

---

## 🔒 Customizing Roles

You can also extend roles if needed:

**Create:** `/services/api/src/Infrastructure/Identity/ApplicationRole.cs`

```csharp
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity;

public class ApplicationRole : IdentityRole
{
    public string? Description { get; set; }
    public int Priority { get; set; }
    public bool IsSystemRole { get; set; }
}
```

**Update AppDbContext:**

```csharp
public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    // ...
}
```

**Update Program.cs:**

```csharp
builder.Services.AddIdentityCore<ApplicationUser>(options => { ... })
    .AddRoles<ApplicationRole>()  // ← Changed
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager();
```

**Migration:**
```bash
dotnet ef migrations add CustomizeRoles --project ../Infrastructure
dotnet ef database update
```

---

## 🚫 What You CANNOT Modify

You **cannot** change the core Identity table structure:
- Table names (AspNetUsers, AspNetRoles, etc.)
- Core Identity columns (Id, UserName, Email, PasswordHash, etc.)
- Foreign key relationships between Identity tables

**You CAN:**
- Add new columns to existing Identity tables
- Add new tables with relationships to Identity tables
- Customize validation rules
- Extend authentication logic

---

## 📝 Full Example Workflow

### 1. Add Custom Fields

```csharp
// Infrastructure/Identity/ApplicationUser.cs
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### 2. Configure in DbContext (Optional)

```csharp
// Infrastructure/Persistence/AppDbContext.cs
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);

    builder.Entity<ApplicationUser>(entity =>
    {
        entity.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
        entity.Property(u => u.LastName).HasMaxLength(100).IsRequired();
        entity.Property(u => u.Department).HasMaxLength(200);
        entity.HasIndex(u => u.Department);
    });
    
    // ... other configurations
}
```

### 3. Create Migration

```bash
cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api
dotnet ef migrations add AddUserProfile --project ../Infrastructure
```

### 4. Review Migration

Check the generated file in `/Infrastructure/Migrations/`

```csharp
migrationBuilder.AddColumn<string>(
    name: "FirstName",
    table: "AspNetUsers",
    type: "character varying(100)",
    maxLength: 100,
    nullable: false,
    defaultValue: "");
```

### 5. Apply to Database

```bash
dotnet ef database update
```

### 6. Update Registration Endpoint

```csharp
// Api/Controllers/AuthController.cs
var user = new ApplicationUser
{
    Email = request.Email,
    UserName = request.Email,
    FirstName = request.FirstName,    // ← Use new fields
    LastName = request.LastName,      // ← Use new fields
    Department = request.Department   // ← Use new fields
};
```

### 7. Update Models

```csharp
// Api/Models/AuthModels.cs
public sealed record RegisterRequest(
    string Email, 
    string Password, 
    string FirstName,    // ← Add
    string LastName,     // ← Add
    string? Department,  // ← Add
    string? Role
);
```

---

## 🎯 Practical Example: Add Full Name Support

Let's add first name and last name to users:

```bash
# 1. Uncomment fields in ApplicationUser.cs
# 2. Run migration
cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api
dotnet ef migrations add AddUserNames --project ../Infrastructure
dotnet ef database update

# 3. Update seeder
# Edit: Infrastructure/Persistence/DbSeeder.cs
var admin = new ApplicationUser
{
    Email = adminEmail,
    UserName = adminEmail,
    EmailConfirmed = true,
    FirstName = "System",
    LastName = "Administrator"
};

# 4. Run app
dotnet run
```

---

## 📁 Key Files

| Purpose | File Location |
|---------|--------------|
| User entity | `/services/api/src/Infrastructure/Identity/ApplicationUser.cs` |
| DbContext | `/services/api/src/Infrastructure/Persistence/AppDbContext.cs` |
| Auth controller | `/services/api/src/Api/Controllers/AuthController.cs` |
| Auth models | `/services/api/src/Api/Models/AuthModels.cs` |
| Migrations | `/services/api/src/Infrastructure/Migrations/` |
| Seeder | `/services/api/src/Infrastructure/Persistence/DbSeeder.cs` |

---

## 💡 Quick Tips

1. **Always create migrations** after modifying ApplicationUser
2. **Test migrations** in development before production
3. **Add defaults** for required fields to avoid migration issues
4. **Use nullable types** (`string?`) for optional fields
5. **Index frequently queried fields** (Department, Position, etc.)
6. **Don't store sensitive data** in plain text (use encryption)
7. **Use computed properties** for derived values (FullName, etc.)

---

## 🔍 View Your Auth Schema in Supabase

After applying migrations, check Supabase:
1. Go to **Table Editor**
2. Find **AspNetUsers** table
3. You'll see your custom columns added!

---

Need help with a specific customization? Just uncomment the fields you need in `ApplicationUser.cs` and create a migration!
