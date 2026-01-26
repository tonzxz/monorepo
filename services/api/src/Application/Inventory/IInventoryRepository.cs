using Domain.Inventory;

namespace Application.Inventory;

// Repository contract for inventory persistence.
public interface IInventoryRepository
{
    Task<List<InventoryItem>> GetAllAsync(string ownerId, CancellationToken cancellationToken);
    Task<InventoryItem?> GetByIdAsync(Guid id, string ownerId, CancellationToken cancellationToken);
    Task AddAsync(InventoryItem item, CancellationToken cancellationToken);
    Task UpdateAsync(InventoryItem item, CancellationToken cancellationToken);
    Task DeleteAsync(InventoryItem item, CancellationToken cancellationToken);
}
