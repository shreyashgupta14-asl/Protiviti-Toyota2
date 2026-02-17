import { useState } from "react";
import { Search, UserPlus, Edit, Shield } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Control Owner",
    department: "IT Security",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Approver",
    department: "Finance",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    role: "Reviewer",
    department: "Operations",
    status: "Active",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Control Owner",
    department: "Procurement",
    status: "Active",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@company.com",
    role: "IT Admin",
    department: "IT",
    status: "Active",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    role: "Business Admin",
    department: "Compliance",
    status: "Active",
  },
];

export function UserManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F4F5F7] min-h-screen space-y-6">
      {/* Header */}
      {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-700">
              User & Role Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage users, roles, and access permissions
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <UserPlus className="w-4 h-4" />
            Add New User
          </button>
        </div>
      </div> */}

      {/* Permission Matrix */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-gray-800">Permission Matrix</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Role-based access control for system features
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">
                  Feature / Permission
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                  IT Admin
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                  Business Admin
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                  Control Owner
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                  Reviewer
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                  Approver
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  feature: "User Management",
                  permissions: [true, false, false, false, false],
                },
                {
                  feature: "Control Configuration",
                  permissions: [true, true, false, false, false],
                },
                {
                  feature: "Execute Testing",
                  permissions: [true, true, true, false, false],
                },
                {
                  feature: "Review Testing",
                  permissions: [true, true, false, true, false],
                },
                {
                  feature: "Approve Controls",
                  permissions: [true, true, false, false, true],
                },
                {
                  feature: "Upload Evidence",
                  permissions: [true, true, true, true, true],
                },
                {
                  feature: "View Reports",
                  permissions: [true, true, true, true, true],
                },
                {
                  feature: "Master Configuration",
                  permissions: [true, true, false, false, false],
                },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs font-medium text-gray-800">
                    {row.feature}
                  </td>
                  {row.permissions.map((hasPermission, pIdx) => (
                    <td key={pIdx} className="px-5 py-3 text-center">
                      <div className="flex justify-center">
                        {hasPermission ? (
                          <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        ) : (
                          <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">—</span>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">System Users</h2>
              <p className="text-xs text-gray-500 mt-1">
                {mockUsers.length} active users in the system
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name, email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">
                  Department
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    {user.department}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        user.status === "Active"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                        <Edit className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
