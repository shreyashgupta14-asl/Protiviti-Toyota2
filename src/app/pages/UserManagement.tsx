import { useState } from "react";
import { Search, Edit, Shield, X, Check, Users, ChevronDown, ChevronUp } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
}

const ROLES = [
  "IT Admin",
  "Business Admin",
  "Control Owner",
  "Reviewer",
  "Approver",
];

const DEPARTMENTS = [
  "IT Security",
  "Finance",
  "Operations",
  "Procurement",
  "IT",
  "Compliance",
  "HR",
  "Legal",
];

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

// ─── Single Edit Modal ──────────────────────────────────────────────────────

interface EditModalProps {
  user: User;
  onClose: () => void;
  onSave: (updated: User) => void;
}

function EditModal({ user, onClose, onSave }: EditModalProps) {
  const [role, setRole] = useState(user.role);
  const [department, setDepartment] = useState(user.department);

  const handleSave = () => {
    onSave({ ...user, role, department });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-sm font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Edit User</h3>
              <p className="text-xs text-gray-500">{user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-400 bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-400 bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
              <input
                type="text"
                value={user.status}
                disabled
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-400 bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              Editable Fields
            </p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Edit Modal ─────────────────────────────────────────────────────────

interface BulkEditModalProps {
  users: User[];
  onClose: () => void;
  onSave: (updatedUsers: User[]) => void;
}

function BulkEditModal({ users, onClose, onSave }: BulkEditModalProps) {
  const [edits, setEdits] = useState<
    Record<string, { role: string; department: string }>
  >(
    Object.fromEntries(
      users.map((u) => [u.id, { role: u.role, department: u.department }])
    )
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkRole, setBulkRole] = useState("");
  const [bulkDept, setBulkDept] = useState("");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.size === users.length ? new Set() : new Set(users.map((u) => u.id))
    );
  };

  const applyBulk = () => {
    if (!bulkRole && !bulkDept) return;
    setEdits((prev) => {
      const next = { ...prev };
      selectedIds.forEach((id) => {
        next[id] = {
          role: bulkRole || next[id].role,
          department: bulkDept || next[id].department,
        };
      });
      return next;
    });
  };

  const handleSave = () => {
    const updatedUsers = users.map((u) => ({
      ...u,
      role: edits[u.id].role,
      department: edits[u.id].department,
    }));
    onSave(updatedUsers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Bulk Edit Users</h3>
              <p className="text-xs text-gray-500">
                Select users and apply changes to Role &amp; Department
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 bg-red-50 border-b border-red-100 shrink-0">
          <p className="text-xs font-semibold text-red-700 mb-3">
            Quick Apply to Selected ({selectedIds.size} selected)
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-medium text-red-700 mb-1">Set Role</label>
              <select
                value={bulkRole}
                onChange={(e) => setBulkRole(e.target.value)}
                className="w-full px-3 py-2 border border-red-200 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">— No change —</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-medium text-red-700 mb-1">Set Department</label>
              <select
                value={bulkDept}
                onChange={(e) => setBulkDept(e.target.value)}
                className="w-full px-3 py-2 border border-red-200 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">— No change —</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button
              onClick={applyBulk}
              disabled={selectedIds.size === 0 || (!bulkRole && !bulkDept)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md"
            >
              Apply to Selected
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3.5 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === users.length && users.length > 0}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 accent-red-600 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">Role</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors ${
                    selectedIds.has(user.id) ? "bg-red-50/60" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="w-3.5 h-3.5 accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={edits[user.id].role}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [user.id]: { ...prev[user.id], role: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={edits[user.id].department}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [user.id]: { ...prev[user.id], department: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Collapsible state — both open by default
  const [isMatrixOpen, setIsMatrixOpen] = useState(true);
  const [isUsersOpen, setIsUsersOpen] = useState(true);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSingleSave = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleBulkSave = (updatedUsers: User[]) => {
    const map = new Map(updatedUsers.map((u) => [u.id, u]));
    setUsers((prev) => prev.map((u) => map.get(u.id) ?? u));
  };

  return (
    // h-screen + overflow-hidden = no page-level scroll; sections share the full height
    <div className="flex flex-col h-screen overflow-hidden bg-[#F4F5F7] p-4 sm:p-6 gap-4">

      {/* ── Permission Matrix ── */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all duration-300"
        style={{ flex: isMatrixOpen ? "1 1 0" : "0 0 auto" }}
      >
        {/* Clickable header */}
        <button
          type="button"
          onClick={() => setIsMatrixOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors text-left shrink-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Permission Matrix</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Role-based access control for system features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isMatrixOpen && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                Collapsed
              </span>
            )}
            {isMatrixOpen
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </div>
        </button>

        {/* Internal scrollable table — only rendered when open */}
        {isMatrixOpen && (
          <div className="overflow-auto flex-1">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">
                    Feature / Permission
                  </th>
                  {["IT Admin", "Business Admin", "Control Owner", "Reviewer", "Approver"].map(
                    (role) => (
                      <th
                        key={role}
                        className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700"
                      >
                        {role}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: "User Management",       permissions: [true,  false, false, false, false] },
                  { feature: "Control Configuration", permissions: [true,  true,  false, false, false] },
                  { feature: "Execute Testing",       permissions: [true,  true,  true,  false, false] },
                  { feature: "Review Testing",        permissions: [true,  true,  false, true,  false] },
                  { feature: "Approve Controls",      permissions: [true,  true,  false, false, true]  },
                  { feature: "Upload Evidence",       permissions: [true,  true,  true,  true,  true]  },
                  { feature: "View Reports",          permissions: [true,  true,  true,  true,  true]  },
                  { feature: "Master Configuration",  permissions: [true,  true,  false, false, false] },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-medium text-gray-800">{row.feature}</td>
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
        )}
      </div>

      {/* ── System Users ── */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all duration-300"
        style={{ flex: isUsersOpen ? "1 1 0" : "0 0 auto" }}
      >
        {/* Clickable header */}
        <button
          type="button"
          onClick={() => setIsUsersOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left shrink-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">System Users</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {users.length} active users in the system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isUsersOpen && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                Collapsed
              </span>
            )}
            {isUsersOpen
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </div>
        </button>

        {/* Body — only rendered when open */}
        {isUsersOpen && (
          <>
            {/* Toolbar — sits outside the toggle button so clicks don't collapse */}
            <div className="px-6 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkEdit(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-red-300 hover:border-red-400 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                >
                  <Users className="w-3.5 h-3.5 text-red-600" />
                  Bulk Edit
                </button>
              </div>
            </div>

            {/* Internal scrollable table */}
            <div className="overflow-auto flex-1">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                  <tr>
                    {["Name", "Email", "Role", "Department", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-xs font-semibold">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-xs font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">{user.department}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            user.status === "Active"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-400"
                              : "bg-gray-100 text-gray-600 border-gray-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingUser(user)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-xs text-gray-400">
                        No users match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Single Edit Modal */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSingleSave}
        />
      )}

      {/* Bulk Edit Modal */}
      {showBulkEdit && (
        <BulkEditModal
          users={users}
          onClose={() => setShowBulkEdit(false)}
          onSave={handleBulkSave}
        />
      )}
    </div>
  );
}