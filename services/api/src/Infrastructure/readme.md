cd /Users/tonzxzzz/apps/quanby/psms/services/api/src/Api

# Create new migration
dotnet ef migrations add YourMigrationName --project ../Infrastructure

# Push to database
dotnet ef database update

# Reset database
dotnet ef database drop --force
dotnet ef database update

# Seed data (runs automatically)
dotnet run