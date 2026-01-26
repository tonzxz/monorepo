namespace Application.Inventory;

// DTO returned to API clients.
public sealed record InventoryItemDto(
    Guid Id,
    string Name,
    int Quantity,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// Request payload for creating an item.
public sealed record CreateInventoryItemRequest(string Name, int Quantity);

// Request payload for updating an item.
public sealed record UpdateInventoryItemRequest(string Name, int Quantity);
