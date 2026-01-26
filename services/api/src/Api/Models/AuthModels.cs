namespace Api.Models;

// Request payload for user registration.
public sealed record RegisterRequest(string Email, string Password, string? Role);

// Request payload for user login.
public sealed record LoginRequest(string Email, string Password);

// Request payload for adding an arbitrary claim to the current user.
public sealed record AddClaimRequest(string Type, string Value);

// Response payload that returns a JWT and its expiry.
public sealed record AuthResponse(string AccessToken, DateTime ExpiresAtUtc);
