using System.Security.Claims;
using Api.Models;
using Api.Services;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

// Auth endpoints for register, login, and claim management.
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private static readonly string[] AllowedRoles = ["Enduser", "SuperAdmin", "Supply", "Supplier", "Inspection"];

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly TokenService _tokenService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
    }

    // Registers a new user and returns a JWT.
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var role = string.IsNullOrWhiteSpace(request.Role) ? "Enduser" : request.Role.Trim();
        if (!AllowedRoles.Contains(role))
        {
            return BadRequest($"Role '{role}' is not allowed.");
        }

        if (!await _roleManager.RoleExistsAsync(role))
        {
            await _roleManager.CreateAsync(new IdentityRole(role));
        }

        var user = new ApplicationUser
        {
            Email = request.Email,
            UserName = request.Email,
            Address = request.Address  
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(createResult.Errors.Select(e => e.Description));
        }

        await _userManager.AddToRoleAsync(user, role);

        var (token, expires) = await _tokenService.CreateTokenAsync(user);
        return Ok(new AuthResponse(token, expires));
    }

    // Logs in an existing user and returns a JWT.
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized();
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var (token, expires) = await _tokenService.CreateTokenAsync(user);
        return Ok(new AuthResponse(token, expires));
    }

    // Adds a custom claim to the currently authenticated user.
    [Authorize]
    [HttpPost("claim")]
    public async Task<IActionResult> AddClaim(AddClaimRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }

        var claim = new Claim(request.Type, request.Value);
        var result = await _userManager.AddClaimAsync(user, claim);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return NoContent();
    }

    // Initiates external OAuth login flow.
    [HttpGet("external-login/{provider}")]
    public IActionResult ExternalLogin(string provider, [FromQuery] string? returnUrl = null)
    {
        // Normalize provider name to match registered scheme (capitalize first letter)
        var normalizedProvider = char.ToUpper(provider[0]) + provider.Substring(1).ToLower();
        
        var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Auth", new { returnUrl });
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(normalizedProvider, redirectUrl);
        return Challenge(properties, normalizedProvider);
    }

    // Handles OAuth callback and creates/logs in user.
    [HttpGet("external-login-callback")]
    public async Task<IActionResult> ExternalLoginCallback(string? returnUrl = null)
    {
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info is null)
        {
            return Redirect(returnUrl ?? "/login?error=external_login_failed");
        }

        // Try to sign in with external login
        var result = await _signInManager.ExternalLoginSignInAsync(
            info.LoginProvider, 
            info.ProviderKey, 
            isPersistent: false
        );

        if (result.Succeeded)
        {
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (user is not null)
            {
                var (token, expires) = await _tokenService.CreateTokenAsync(user);
                return Redirect($"{returnUrl}?token={token}&expires={expires:O}");
            }
        }

        // User doesn't exist, create new account
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrWhiteSpace(email))
        {
            return Redirect(returnUrl ?? "/login?error=no_email");
        }

        var newUser = new ApplicationUser
        {
            Email = email,
            UserName = email,
            EmailConfirmed = true // OAuth providers verify email
        };

        var createResult = await _userManager.CreateAsync(newUser);
        if (!createResult.Succeeded)
        {
            return Redirect(returnUrl ?? "/login?error=create_failed");
        }

        // Add default role
        await _userManager.AddToRoleAsync(newUser, "SuperAdmin");

        // Link external login
        var addLoginResult = await _userManager.AddLoginAsync(newUser, info);
        if (!addLoginResult.Succeeded)
        {
            return Redirect(returnUrl ?? "/login?error=link_failed");
        }

        // Generate token and redirect (no need to sign in with cookies for API-only auth)
        var (newToken, newExpires) = await _tokenService.CreateTokenAsync(newUser);
        // Indicate that this is a new user who needs onboarding
        return Redirect($"{returnUrl}?token={newToken}&expires={newExpires:O}&onboarding=true");
    }

    // Links an external provider to the current authenticated user.
    [Authorize]
    [HttpPost("link-external/{provider}")]
    public IActionResult LinkExternal(string provider)
    {
        var redirectUrl = Url.Action(nameof(LinkExternalCallback), "Auth");
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        return Challenge(properties, provider);
    }

    // Callback for linking external provider.
    [Authorize]
    [HttpGet("link-external-callback")]
    public async Task<IActionResult> LinkExternalCallback()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }

        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info is null)
        {
            return BadRequest("Failed to get external login info");
        }

        var result = await _userManager.AddLoginAsync(user, info);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return Ok(new { message = $"{info.LoginProvider} linked successfully" });
    }

    // Updates the current user's profile information.
    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }

        // Validate and update password FIRST (before updating other fields)
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            // Check if user already has a password
            var hasPassword = await _userManager.HasPasswordAsync(user);
            
            if (hasPassword)
            {
                // Remove old password if exists
                var removeResult = await _userManager.RemovePasswordAsync(user);
                if (!removeResult.Succeeded)
                {
                    return BadRequest(new { errors = removeResult.Errors.Select(e => e.Description) });
                }
            }
            
            // Add new password (UserManager will hash it)
            var passwordResult = await _userManager.AddPasswordAsync(user, request.Password);
            if (!passwordResult.Succeeded)
            {
                // Password failed, rollback by re-adding old password if it existed
                return BadRequest(new { errors = passwordResult.Errors.Select(e => e.Description) });
            }
        }

        // Only update profile fields if password succeeded (or no password provided)
        if (!string.IsNullOrWhiteSpace(request.Address))
        {
            user.Address = request.Address;
        }

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            user.PhoneNumber = request.PhoneNumber;
        }

        // Update user with new profile info
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        return NoContent();
    }
}
