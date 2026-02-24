// sidebarConfig.ts
import { LayoutDashboard, BarChart3, CheckCircle, Users, Settings, } from "lucide-react";

export const SIDEBAR_BY_ROLE: Record<string, any[]> = {
  "Admin": [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/", icon: BarChart3, label: "Control List" },
    { path: "/approval-workflow", icon: CheckCircle, label: "Approval Workflow" },
    { path: "/user-management", icon: Users, label: "User Management" },
    { path: "/sla-settings", icon: Settings, label: "Master Settings" },
  ],
  
  "User": [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/", icon: BarChart3, label: "Control List" },
    { path: "/approval-workflow", icon: CheckCircle, label: "Approval Workflow" },
  ],

  "CC/CG Admin": [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/", icon: BarChart3, label: "Control List" },
    { path: "/approval-workflow", icon: CheckCircle, label: "Approval Workflow" },
    { path: "/user-management", icon: Users, label: "User Management" },
    { path: "/sla-settings", icon: Settings, label: "Master Settings" },
   ],

  "Reviewer": [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/", icon: BarChart3, label: "Control List" },
    { path: "/approval-workflow", icon: CheckCircle, label: "Approval Workflow" },
    { path: "/user-management", icon: Users, label: "User Management" },
    { path: "/sla-settings", icon: Settings, label: "Master Settings" },
   ],

  "Manager": [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/", icon: BarChart3, label: "Control List" },
    { path: "/approval-workflow", icon: CheckCircle, label: "Approval Workflow" },
    { path: "/user-management", icon: Users, label: "User Management" },
    { path: "/sla-settings", icon: Settings, label: "Master Settings" },
   ],

  "Management User": [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/", icon: BarChart3, label: "Control List" },
    { path: "/approval-workflow", icon: CheckCircle, label: "Approval Workflow" },
    { path: "/user-management", icon: Users, label: "User Management" },
    { path: "/sla-settings", icon: Settings, label: "Master Settings" },
   ],

  Auditee: [

    ],
};
