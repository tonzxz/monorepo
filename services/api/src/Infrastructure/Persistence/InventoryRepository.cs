using Application.Inventory;
using Domain.Inventory;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

// EF Core implementation of inventory persistence.
public class InventoryRepository : IInventoryRepository
{
    private readonly AppDbContext _db;

    public InventoryRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<InventoryItem>> GetAllAsync(string ownerId, CancellationToken cancellationToken)
    {
        return await _db.InventoryItems
            .Where(x => x.OwnerId == ownerId)
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<InventoryItem?> GetByIdAsync(Guid id, string ownerId, CancellationToken cancellationToken)
    {
        return await _db.InventoryItems
            .FirstOrDefaultAsync(x => x.Id == id && x.OwnerId == ownerId, cancellationToken);
    }

    public async Task AddAsync(InventoryItem item, CancellationToken cancellationToken)
    {
        _db.InventoryItems.Add(item);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(InventoryItem item, CancellationToken cancellationToken)
    {
        _db.InventoryItems.Update(item);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(InventoryItem item, CancellationToken cancellationToken)
    {
        _db.InventoryItems.Remove(item);
        await _db.SaveChangesAsync(cancellationToken);
    }
}
