import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ControlDetail } from "./pages/ControlDetail";
import { ExecutiveSummary } from "./pages/ExecutiveSummary";
import { UserManagement } from "./pages/UserManagement";
import { SLASettings } from "./pages/SLASettings";
import { ApprovalWorkflow } from "./pages/ApprovalWorkflow";
import { MainLayout } from "./components/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "control/:id", Component: ControlDetail },
      { path: "dashboard", Component: ExecutiveSummary },
      { path: "user-management", Component: UserManagement },
      { path: "sla-settings", Component: SLASettings },
      { path: "approval-workflow", Component: ApprovalWorkflow },
    ],
  },
]);
