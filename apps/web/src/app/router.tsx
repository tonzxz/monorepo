import { Navigate, createBrowserRouter } from "react-router-dom";
import DashboardPage from "../features/enduser/app/dashboard/pages/DashboardPage";
import InventoryPage from "../features/enduser/ppmp/inventory/pages/InventoryPage";
import LoginPage from "../features/auth/pages/LoginPage";
import OAuthCallbackPage from "../features/auth/pages/OAuthCallbackPage";
import OnboardingPage from "../features/auth/pages/OnboardingPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import UserManagementPage from "../features/superadmin/user-management/pages/UserManagementPage";
import DepartmentManagementPage from "../features/superadmin/department-management/pages/DepartmentManagementPage";
import ApprovalSequencePage from "../features/superadmin/approval-sequence/pages/ApprovalSequencePage";
import PermissionsPage from "../features/superadmin/permissions/pages/PermissionsPage";
import NotFoundPage from "../features/not-found/pages/NotFoundPage";
import { RequireAuth, RequirePermission, RequireRole } from "./rbac/guard";
import { PERMISSIONS } from "./rbac/permissions";
import { useAuth } from "../hooks/useAuth";

function RootPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  return <LoginPage />;
}

export const router = createBrowserRouter([
  { path: "/", element: <RootPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/callback", element: <OAuthCallbackPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <RequirePermission permissions={[PERMISSIONS.DASHBOARD.READ]}>
          <DashboardPage />
        </RequirePermission>
      </RequireAuth>
    ),
  },
  {
    path: "/app/ppmp",
    element: (
      <RequireAuth>
        <RequirePermission permissions={[PERMISSIONS.PPMP.READ]}>
          <InventoryPage />
        </RequirePermission>
      </RequireAuth>
    ),
  },
  {
    path: "/app/users",
    element: (
      <RequireAuth>
        <RequirePermission permissions={[PERMISSIONS.USERS.READ]}>
          <UserManagementPage />
        </RequirePermission>
      </RequireAuth>
    ),
  },
  {
    path: "/app/permissions",
    element: (
      <RequireAuth>
        <RequireRole roles={["SuperAdmin"]}>
          <PermissionsPage />
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/app/departments",
    element: (
      <RequireAuth>
        <RequirePermission permissions={[PERMISSIONS.DEPARTMENTS.READ]}>
          <DepartmentManagementPage />
        </RequirePermission>
      </RequireAuth>
    ),
  },
  {
    path: "/app/approval-sequence",
    element: (
      <RequireAuth>
        <RequirePermission permissions={[PERMISSIONS.APPROVAL_SEQUENCE.READ]}>
          <ApprovalSequencePage />
        </RequirePermission>
      </RequireAuth>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);
