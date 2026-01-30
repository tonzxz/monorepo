# Providers Folder

## 📁 Purpose
Contains React Context providers that manage global application state and provide shared functionality across the entire application.

## 📋 Files
- `AuthProvider.tsx` - Authentication state management
- `AppProviders.tsx` - Combines all application providers

## 🔐 AuthProvider.tsx
Manages user authentication state, login/logout functionality, and provides user information throughout the app.

### Context Value
```tsx
type AuthContextValue = {
  token: string | null;
  roles: string[];
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};
```

### User Object Structure
```tsx
interface User {
  id: string;
  email: string;
  role: Role; // 'Admin' | 'Manager' | 'User'
  permissions?: Permission[];
}
```

### Usage Example
```tsx
import { useAuth } from "@/hooks/useAuth"

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }
  
  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Key Features
- JWT token management
- Automatic token persistence
- User role extraction from token
- Login/logout state management
- Integration with RBAC system

## 🔧 AppProviders.tsx
Combines all context providers in the correct order to wrap the entire application.

### Structure
```tsx
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  )
}
```

### Usage
```tsx
// In main.tsx or App.tsx
<AppProviders>
  <RouterProvider router={router} />
</AppProviders>
```

## 🎯 When to Add New Providers
- Theme management (light/dark mode)
- Notification/toast system
- Shopping cart state
- WebSocket connections
- Global loading states
- Feature flags

## 🔧 Adding New Providers

### Step 1: Create Provider
```tsx
// providers/ThemeProvider.tsx
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Step 2: Create Hook
```tsx
// hooks/useTheme.ts
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### Step 3: Add to AppProviders
```tsx
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <ThemeProvider> {/* Add new provider */}
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}
```

## 🚀 Best Practices
1. **Provider Order**: Authentication should be outer-most, followed by data providers, then UI providers
2. **Context Splitting**: Don't put unrelated state in the same context
3. **Performance**: Use `useMemo` for context values to prevent unnecessary re-renders
4. **Error Boundaries**: Wrap providers in error boundaries for better error handling
5. **TypeScript**: Always type your context values properly

## 🐛 Common Issues
- **Context not found**: Make sure component is wrapped in the provider
- **Re-render issues**: Context value reference changes cause re-renders
- **Provider order**: Wrong order can cause dependency issues

## 🔗 Related
- `src/hooks/useAuth.ts` - Hook to consume AuthProvider
- `src/app/rbac/` - Role-based access control that uses auth state
- `src/app/router.tsx` - Router that depends on authentication state