using System.Text;
using Api.Services;
using Application.Common;
using Application.Inventory;
using Infrastructure.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Load .env file
var root = Directory.GetCurrentDirectory();
var dotenvPath = Path.Combine(root, "../../.env");

if (File.Exists(dotenvPath))
{
    DotNetEnv.Env.Load(dotenvPath);
}

var builder = WebApplication.CreateBuilder(args);

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Core API services.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// HTTP context + current user abstraction.
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

// Application services.
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<TokenService>();

// JWT configuration.
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

// Database configuration.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
}

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Database connection string not configured.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ASP.NET Identity setup.
builder.Services.AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 6;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager();

// JWT auth setup.
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtOptions = jwtSection.Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwtOptions.SigningKey))
{
    throw new InvalidOperationException("Jwt:SigningKey is not configured.");
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = "Identity.External";
    })
    .AddCookie("Identity.Application", options =>
    {
        options.Cookie.Name = "Identity.Application";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    })
    .AddCookie("Identity.External", options =>
    {
        options.Cookie.Name = "Identity.External";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
        options.SlidingExpiration = false;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey))
        };
    });

// OAuth providers - only configure if credentials exist
var authBuilder = builder.Services.AddAuthentication();

var googleClientId = Environment.GetEnvironmentVariable("Authentication__Google__ClientId");
var googleClientSecret = Environment.GetEnvironmentVariable("Authentication__Google__ClientSecret");
if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
{
    authBuilder.AddGoogle(options =>
    {
        options.ClientId = googleClientId;
        options.ClientSecret = googleClientSecret;
        options.SaveTokens = true;
    });
}

var msClientId = Environment.GetEnvironmentVariable("Authentication__Microsoft__ClientId");
var msClientSecret = Environment.GetEnvironmentVariable("Authentication__Microsoft__ClientSecret");
if (!string.IsNullOrWhiteSpace(msClientId) && !string.IsNullOrWhiteSpace(msClientSecret))
{
    authBuilder.AddMicrosoftAccount(options =>
    {
        options.ClientId = msClientId;
        options.ClientSecret = msClientSecret;
        options.SaveTokens = true;
    });
}

var githubClientId = Environment.GetEnvironmentVariable("Authentication__GitHub__ClientId");
var githubClientSecret = Environment.GetEnvironmentVariable("Authentication__GitHub__ClientSecret");
if (!string.IsNullOrWhiteSpace(githubClientId) && !string.IsNullOrWhiteSpace(githubClientSecret))
{
    authBuilder.AddGitHub(options =>
    {
        options.ClientId = githubClientId;
        options.ClientSecret = githubClientSecret;
        options.SaveTokens = true;
        options.Scope.Add("user:email");
    });
}

builder.Services.AddAuthorization();

var app = builder.Build();

// Swagger in development.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Seed database with required data
using (var scope = app.Services.CreateScope())
{
    // Pass true to seed sample data in development, false in production
    await DbSeeder.SeedAsync(scope.ServiceProvider, app.Environment.IsDevelopment());
}

app.Run();
