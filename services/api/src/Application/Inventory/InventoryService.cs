using Application.Common;
using Domain.Inventory;

namespace Application.Inventory;

// Use-case layer for inventory CRUD with ownership enforcement.
public class InventoryService
{
    private readonly IInventoryRepository _repository;
    private readonly ICurrentUser _currentUser;

    public InventoryService(IInventoryRepository repository, ICurrentUser currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<List<InventoryItemDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var ownerId = RequireUserId();
        var items = await _repository.GetAllAsync(ownerId, cancellationToken);
        return items.Select(ToDto).ToList();
    }

    public async Task<InventoryItemDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var ownerId = RequireUserId();
        var item = await _repository.GetByIdAsync(id, ownerId, cancellationToken);
        return item is null ? null : ToDto(item);
    }

    public async Task<InventoryItemDto> CreateAsync(CreateInventoryItemRequest request, CancellationToken cancellationToken)
    {
        var ownerId = RequireUserId();
        var item = new InventoryItem
        {
            Name = request.Name.Trim(),
            Quantity = request.Quantity,
            OwnerId = ownerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(item, cancellationToken);
        return ToDto(item);
    }

    public async Task<InventoryItemDto?> UpdateAsync(Guid id, UpdateInventoryItemRequest request, CancellationToken cancellationToken)
    {
        var ownerId = RequireUserId();
        var item = await _repository.GetByIdAsync(id, ownerId, cancellationToken);
        if (item is null)
        {
            return null;
        }

        item.Name = request.Name.Trim();
        item.Quantity = request.Quantity;
        item.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(item, cancellationToken);
        return ToDto(item);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var ownerId = RequireUserId();
        var item = await _repository.GetByIdAsync(id, ownerId, cancellationToken);
        if (item is null)
        {
            return false;
        }

        await _repository.DeleteAsync(item, cancellationToken);
        return true;
    }

    private string RequireUserId()
    {
        return _currentUser.UserId ?? throw new InvalidOperationException("User is not authenticated.");
    }

    private static InventoryItemDto ToDto(InventoryItem item)
    {
        return new InventoryItemDto(item.Id, item.Name, item.Quantity, item.CreatedAt, item.UpdatedAt);
    }
}
