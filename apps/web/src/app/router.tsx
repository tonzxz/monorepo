import { Navigate, createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import UserManagementPage from "../features/user-management/pages/UserManagementPage";
import DepartmentManagementPage from "../features/department-management/pages/DepartmentManagementPage";
import ApprovalSequencePage from "../features/approval-sequence/pages/ApprovalSequencePage";
import NotFoundPage from "../features/not-found/pages/NotFoundPage";
import { RequireAuth, RequireRole } from "./rbac/guard";
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
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "users",
        element: (
          <RequireRole roles={["Admin"]}>
            <UserManagementPage />
          </RequireRole>
        ),
      },
      {
        path: "departments",
        element: (
          <RequireRole roles={["Admin"]}>
            <DepartmentManagementPage />
          </RequireRole>
        ),
      },
      {
        path: "approval-sequence",
        element: (
          <RequireRole roles={["Admin"]}>
            <ApprovalSequencePage />
          </RequireRole>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
