namespace Application.Common;

// Abstraction for accessing the currently authenticated user.
public interface ICurrentUser
{
    string? UserId { get; }
}
