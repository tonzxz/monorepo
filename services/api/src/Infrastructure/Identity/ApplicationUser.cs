using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity;

/// <summary>
/// Application user entity - extends ASP.NET Core Identity
/// Add custom fields here to extend the AspNetUsers table
/// </summary>
public class ApplicationUser : IdentityUser
{
    // Custom fields:
    public string? Address { get; set; }
    
    // Uncomment more fields as needed:
    // public string? FirstName { get; set; }
    // public string? LastName { get; set; }
    // public string? Department { get; set; }
    // public string? Position { get; set; }
    // public DateTime? DateOfBirth { get; set; }
    // public string? ProfilePictureUrl { get; set; }
    // public bool IsActive { get; set; } = true;
    // public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties (relationships):
    // public virtual ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
}
