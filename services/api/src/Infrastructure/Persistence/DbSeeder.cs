using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Domain.Inventory;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Persistence;

/// <summary>
/// Database seeder for development and production data
/// </summary>
public static class DbSeeder
{
    /// <summary>
    /// Seeds all required data
    /// </summary>
    public static async Task SeedAsync(IServiceProvider services, bool seedSampleData = true)
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        // Seed Roles (required)
        await SeedRolesAsync(roleManager);
        
        // Seed Admin User (required)
        await SeedAdminUserAsync(userManager);
        
        // Seed Sample Inventory (optional - only if requested)
        if (seedSampleData)
        {
            await SeedInventoryAsync(context);
        }
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        var roles = new[] { "User", "Admin", "Manager" };
        
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                Console.WriteLine($"Created role: {role}");
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
                EmailConfirmed = true,
                Address = "123 Admin Street, City, Country"  

            };

            var result = await userManager.CreateAsync(admin, "Admin@123456");
            
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
                Console.WriteLine($"Created admin user: {adminEmail}");
            }
            else
            {
                Console.WriteLine($"Failed to create admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
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
                    new InventoryItem 
                    { 
                        Name = "Laptop - Dell XPS 15", 
                        Quantity = 10, 
                        OwnerId = admin.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new InventoryItem 
                    { 
                        Name = "Wireless Mouse", 
                        Quantity = 50, 
                        OwnerId = admin.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new InventoryItem 
                    { 
                        Name = "Mechanical Keyboard", 
                        Quantity = 30, 
                        OwnerId = admin.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new InventoryItem 
                    { 
                        Name = "Monitor - 27 inch", 
                        Quantity = 15, 
                        OwnerId = admin.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new InventoryItem 
                    { 
                        Name = "USB-C Hub", 
                        Quantity = 25, 
                        OwnerId = admin.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                context.InventoryItems.AddRange(items);
                await context.SaveChangesAsync();
                Console.WriteLine($"Seeded {items.Length} inventory items");
            }
        }
    }
}
