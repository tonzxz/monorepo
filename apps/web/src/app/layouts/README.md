# Layouts Folder

## 📁 Purpose
Contains layout components that provide consistent structure and UI wrapper for different sections of the application.

## 📋 Files
- `AppLayout.tsx` - Main application layout wrapper

## 🏗️ AppLayout.tsx
The main layout component that wraps authenticated application pages. It provides the common structure that all authenticated pages share.

### Usage
```tsx
// Used in router for authenticated routes
{
  path: "/app",
  element: (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  ),
  children: [
    // All authenticated routes render inside AppLayout
  ]
}
```

### Features
- Provides consistent header/navigation
- Manages authenticated page structure
- Handles common layout logic
- Responsive design wrapper

### Example Structure
```tsx
export default function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}
```

## 🎯 When to Use
- Creating new layout variations (e.g., `AuthLayout.tsx`, `DashboardLayout.tsx`)
- Adding common UI elements that appear across multiple pages
- Managing responsive breakpoints and layout switching

## 🔧 Extending
To add a new layout:
1. Create new layout component (e.g., `PublicLayout.tsx`)
2. Use in router for specific route groups
3. Follow consistent naming pattern

```tsx
// Example: PublicLayout.tsx for marketing/public pages
export default function PublicLayout() {
  return (
    <div className="public-layout">
      <PublicHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```