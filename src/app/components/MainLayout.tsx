import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { SIDEBAR_BY_ROLE } from "./sidebarConfig";

// const navItems = [
//   { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
//   { path: "/", icon: BarChart3, label: "Control List" },
//   { path: "/approval-workflow", icon: CheckCircle, label: "Approval Workflow" },
//   { path: "/user-management", icon: Users, label: "User Management" },
//   { path: "/sla-settings", icon: Settings, label: "Master Settings" },
// ];

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [navItems, setNavItems] = useState<any[]>([]);
  const [role, setRole] = useState("");


  useEffect(() => {
    const role = localStorage.getItem("userRole") || "Auditor";
    setNavItems(SIDEBAR_BY_ROLE[role] || []);
    setRole(role);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F4F5F7]">
  {/* Mobile Menu Button */}
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-600 text-white rounded-xl shadow-lg"
  >
    {mobileMenuOpen ? (
      <X className="w-5 h-5" />
    ) : (
      <Menu className="w-5 h-5" />
    )}
  </button>

  {/* Mobile Overlay */}
  {mobileMenuOpen && (
    <div
      className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
      onClick={closeMobileMenu}
    />
  )}

  {/* Sidebar */}
  <aside
    className={`bg-white border-r border-gray-100 shadow-xl transition-all duration-300 flex flex-col fixed lg:relative inset-y-0 left-0 z-40
    ${collapsed ? "w-20" : "w-64"}
    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
  >
    {/* Header / Logo */}
    <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
      {!collapsed && (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg 
                 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 "
            // style={{
            //   background:
            //     "linear-gradient(135deg,#6366f1,#8b5cf6)",
            // }}
          >
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800">
              CAGM
            </h1>
            <p className="text-xs text-gray-400">
              Compliance & Gov. Monitoring Tool
            </p>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 hidden lg:block transition"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>

    {/* Role Badge */}
    {!collapsed && (
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-700">
            {role}
          </span>
        </div>
      </div>
    )}

    {/* Navigation */}
    <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMobileMenu}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
              ${
                active
                  ? "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <Icon
              className={`w-4 h-4 ${
                active
                  ? "text-white"
                  : "text-gray-400 group-hover:text-gray-700"
              }`}
            />

            {!collapsed && (
              <>
                {item.label}
                {active && (
                  <ChevronRight className="w-3 h-3 ml-auto text-white/70" />
                )}
              </>
            )}
          </Link>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="px-4 py-4 border-t border-gray-100">
      <Link
        to="/login"
        onClick={closeMobileMenu}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
      >
        <LogOut className="w-4 h-4" />
        {!collapsed && <span>Logout</span>}
      </Link>
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 overflow-auto w-full">
    <Outlet />
  </main>
</div>

  );
}