# API (ASP.NET Core)

Backend service for the PSMS monorepo. This API uses:
- **ASP.NET Core** for the HTTP host
- **JWT** for auth
- **ASP.NET Identity** for users/roles/claims
- **Postgres** as database

## Structure (and purpose)

```
services/api/
  src/
    Api/                         # ASP.NET Core host project
      Controllers/               # HTTP endpoints
        AuthController.cs        # Register/Login + claims
        InventoryController.cs   # Inventory CRUD (auth required)
      Models/                    # Request/response models
        AuthModels.cs            # Register/Login/Claim DTOs + auth response
      Services/                  # Auth helpers (JWT + current user)
        CurrentUser.cs           # Reads user id from JWT claims
        TokenService.cs          # JWT creation (roles + claims)
      Program.cs                 # DI, middleware, auth, swagger
      appsettings*.json          # API config
    Application/                 # Use cases and interfaces
      Common/ICurrentUser.cs      # Current user abstraction
      Inventory/                 # Inventory DTOs + service + repository interface
    Domain/                      # Pure domain entities
      Inventory/InventoryItem.cs # Inventory entity
    Infrastructure/              # Data access + Identity + EF Core
      Identity/ApplicationUser.cs
      Persistence/AppDbContext.cs
      Persistence/InventoryRepository.cs
```




## How It Connects

- Serves HTTP endpoints consumed by `apps/web`.
- Validates JWTs issued by this API.
- Connects to Postgres via `DATABASE_URL` or `ConnectionStrings:DefaultConnection`.

## Run Locally

```
npm run api
```

## Migrations (EF Core)

Create a migration:

```
dotnet ef migrations add InitialCreate \
  --project services/api/src/Infrastructure \
  --startup-project services/api/src/Api
```

Apply to the database:

```
dotnet ef database update \
  --project services/api/src/Infrastructure \
  --startup-project services/api/src/Api
```

Typical workflow:
1) Update Domain entity + DbContext mapping.
2) Add migration.
3) Apply migration.

## Seeding (EF Core)

You can seed data in two common ways:

### Option A: Model-based seed (HasData)
Add seed data in `AppDbContext.OnModelCreating`:

```csharp
builder.Entity<InventoryItem>().HasData(new InventoryItem
{
    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
    Name = "Sample Item",
    Quantity = 10,
    OwnerId = "seed-user-id",
    CreatedAt = DateTime.UtcNow,
    UpdatedAt = DateTime.UtcNow
});
```

Then create/apply a migration so EF Core writes the seed rows:

```
dotnet ef migrations add SeedInventory \
  --project services/api/src/Infrastructure \
  --startup-project services/api/src/Api

dotnet ef database update \
  --project services/api/src/Infrastructure \
  --startup-project services/api/src/Api
```

### Option B: Runtime seeding (recommended for dev)
Create a seeder class like `services/api/src/Infrastructure/Persistence/SeedData.cs`:

```csharp
public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (!db.InventoryItems.Any())
        {
            db.InventoryItems.Add(new InventoryItem
            {
                Name = "Sample Item",
                Quantity = 10,
                OwnerId = "seed-user-id"
            });
            await db.SaveChangesAsync();
        }
    }
}
```

Then call it in `Program.cs` after `app` is built:

```csharp
await SeedData.InitializeAsync(app.Services);
```

## Environment Variables

```
DATABASE_URL=postgresql://...
JWT__ISSUER=psms
JWT__AUDIENCE=psms
JWT__SIGNINGKEY=CHANGE_ME
```
