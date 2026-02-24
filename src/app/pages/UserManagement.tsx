import { useState } from "react";
import {
  Search, Edit, Shield, X, Check, Users,
  ChevronDown, ChevronUp, ArrowLeft, Plus, UserPlus, Database,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
}

interface ADUser {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface EditModalProps {
  user: User;
  onClose: () => void;
  onSave: (updated: User) => void;
}

interface BulkEditModalProps {
  users: User[];
  onClose: () => void;
  onSave: (updatedUsers: User[]) => void;
}

interface AddUserModalProps {
  onClose: () => void;
  onSave: (newUser: User) => void;
}

interface PermissionMatrixPageProps {
  onBack: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES: string[] = [
  "IT Admin",
  "CC/CG Admin",
  "Auditer",
  "Management User",
  "Reviewer",
  "Manager",
  "Auditee",
];

const DEPARTMENTS: string[] = [
  "IT Security",
  "Finance",
  "Operations",
  "Procurement",
  "IT",
  "Compliance",
  "HR",
  "Legal",
];

const PERMISSION_ROLES: string[] = [
  "IT Admin",
  "CC/CG Admin",
  "Auditer",
  "Management User",
  "Reviewer",
  "Manager",
  "Auditee",
];

interface PermissionRow {
  feature: string;
  permissions: boolean[];
}

const PERMISSION_MATRIX: PermissionRow[] = [
  { feature: "User Management",       permissions: [true,  true,  false, false, false, false, false] },
  { feature: "Control Configuration", permissions: [true,  true,  false, false, false, true,  false] },
  { feature: "Execute Testing",       permissions: [true,  true,  true,  false, false, false, false] },
  { feature: "Review Testing",        permissions: [true,  true,  false, false, true,  true,  false] },
  { feature: "Approve Controls",      permissions: [true,  true,  false, false, false, true,  false] },
  { feature: "Upload Evidence",       permissions: [true,  true,  true,  true,  true,  true,  true]  },
  { feature: "View Reports",          permissions: [true,  true,  true,  true,  true,  true,  true]  },
  { feature: "Master Configuration",  permissions: [true,  true,  false, false, false, false, false] },
  { feature: "Audit Trail Access",    permissions: [true,  false, true,  false, false, false, false] },
  { feature: "Management Dashboard",  permissions: [true,  true,  false, true,  false, true,  false] },
];

const mockUsers: User[] = [
  { id: "1", name: "John Smith",    email: "john.smith@company.com",    role: "IT Admin",    department: "IT Security", status: "Active" },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Manager",     department: "Finance",     status: "Active" },
  { id: "3", name: "Michael Chen",  email: "michael.chen@company.com",  role: "Reviewer",    department: "Operations",  status: "Active" },
  { id: "4", name: "Emily Davis",   email: "emily.davis@company.com",   role: "Auditee",     department: "Procurement", status: "Active" },
  { id: "5", name: "David Wilson",  email: "david.wilson@company.com",  role: "IT Admin",    department: "IT",          status: "Active" },
  { id: "6", name: "Lisa Anderson", email: "lisa.anderson@company.com", role: "CC/CG Admin", department: "Compliance",  status: "Active" },
];

const mockADUsers: ADUser[] = [
  { id: "ad1", name: "Robert Brown",   email: "r.brown@corp.company.com",    department: "Finance"    },
  { id: "ad2", name: "Anna Williams",  email: "a.williams@corp.company.com", department: "Legal"      },
  { id: "ad3", name: "James Martinez", email: "j.martinez@corp.company.com", department: "HR"         },
  { id: "ad4", name: "Priya Patel",    email: "p.patel@corp.company.com",    department: "IT"         },
  { id: "ad5", name: "Tom Clarke",     email: "t.clarke@corp.company.com",   department: "Compliance" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("");
}

// ─── Permission Matrix Full Page ──────────────────────────────────────────────

function PermissionMatrixPage({ onBack }: PermissionMatrixPageProps) {
  return (
    // Full viewport — no page scroll at all
    <div className="flex flex-col h-screen overflow-hidden bg-[#F4F5F7]">

      {/* Fixed top bar */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-2.5 py-2.5 flex items-center gap-4 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-sm">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-800">Permission Matrix</h1>
            <p className="text-xs text-gray-500">Role-based access control for system features</p>
          </div>
        </div>
      </div>

      {/* Content area — fills remaining height, padding creates visual spacing */}
      <div className="flex-1 overflow-hidden p-6">
        {/* White card that fills the padded area and scrolls internally */}
        <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {/* Internal scroll lives here only */}
          <div className="overflow-auto flex-1">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-700 w-52">
                    Feature / Permission
                  </th>
                  {PERMISSION_ROLES.map((role) => (
                    <th
                      key={role}
                      className="px-4 py-4 text-center text-xs font-semibold text-gray-700 min-w-[120px]"
                    >
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PERMISSION_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-xs font-medium text-gray-800">{row.feature}</td>
                    {row.permissions.map((hasPermission, pIdx) => (
                      <td key={pIdx} className="px-4 py-4 text-center">
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
      </div>
    </div>
  );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────

type AddMode = null | "manual" | "ad";

interface ManualForm {
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
}

function AddUserModal({ onClose, onSave }: AddUserModalProps) {
  const [mode, setMode] = useState<AddMode>(null);
  const [form, setForm] = useState<ManualForm>({
    name: "",
    email: "",
    role: ROLES[0],
    department: DEPARTMENTS[0],
    status: "Active",
  });
  const [adSearch, setAdSearch] = useState<string>("");
  const [selectedADUser, setSelectedADUser] = useState<ADUser | null>(null);
  const [adRole, setAdRole] = useState<string>(ROLES[0]);

  const filteredADUsers: ADUser[] = mockADUsers.filter(
    (u) =>
      !adSearch ||
      u.name.toLowerCase().includes(adSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(adSearch.toLowerCase())
  );

  const handleManualSave = (): void => {
    if (!form.name || !form.email) return;
    onSave({ id: String(Date.now()), ...form });
    onClose();
  };

  const handleADSave = (): void => {
    if (!selectedADUser) return;
    onSave({
      id: String(Date.now()),
      name: selectedADUser.name,
      email: selectedADUser.email,
      department: selectedADUser.department,
      role: adRole,
      status: "Active",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Add User</h3>
              <p className="text-xs text-gray-500">
                {mode === null
                  ? "Choose how to add a user"
                  : mode === "manual"
                  ? "Enter user details manually"
                  : "Import from Active Directory"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Mode Selection */}
        {mode === null && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => setMode("manual")}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-xl transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 group-hover:from-red-500 group-hover:to-red-600 flex items-center justify-center transition-all">
                <UserPlus className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Add Manually</p>
                <p className="text-xs text-gray-500 mt-0.5">Enter name, email, role, and department by hand</p>
              </div>
            </button>

            <button
              onClick={() => setMode("ad")}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-500 group-hover:to-blue-600 flex items-center justify-center transition-all">
                <Database className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Import from Active Directory</p>
                <p className="text-xs text-gray-500 mt-0.5">Search and import users from your organization's AD</p>
              </div>
            </button>
          </div>
        )}

        {/* Manual Form */}
        {mode === "manual" && (
          <>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setMode(null)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                ← Back
              </button>
              <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleManualSave}
                  disabled={!form.name || !form.email}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Add User
                </button>
              </div>
            </div>
          </>
        )}

        {/* Active Directory */}
        {mode === "ad" && (
          <>
            <div className="p-6 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Active Directory..."
                  value={adSearch}
                  onChange={(e) => setAdSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredADUsers.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">No users found</p>
                )}
                {filteredADUsers.map((u) => (
                  <label
                    key={u.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedADUser?.id === u.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="adUser"
                      checked={selectedADUser?.id === u.id}
                      onChange={() => setSelectedADUser(u)}
                      className="accent-blue-600"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {initials(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md shrink-0">
                      {u.department}
                    </span>
                  </label>
                ))}
              </div>

              {selectedADUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs font-medium text-blue-700 mb-2">
                    Assign Role for {selectedADUser.name}
                  </p>
                  <select
                    value={adRole}
                    onChange={(e) => setAdRole(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setMode(null)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                ← Back
              </button>
              <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleADSave}
                  disabled={!selectedADUser}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Import User
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Single Edit Modal ────────────────────────────────────────────────────────

function EditModal({ user, onClose, onSave }: EditModalProps) {
  const [role, setRole] = useState<string>(user.role);
  const [department, setDepartment] = useState<string>(user.department);

  const handleSave = (): void => {
    onSave({ ...user, role, department });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-sm font-semibold">
              {initials(user.name)}
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
            {([["Name", user.name], ["Email", user.email], ["Status", user.status]] as [string, string][]).map(
              ([label, val]) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={val}
                    disabled
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-400 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              )
            )}
          </div>
          <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Editable Fields</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md"
          >
            <Check className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Edit Modal ──────────────────────────────────────────────────────────

type EditMap = Record<string, { role: string; department: string }>;

function BulkEditModal({ users, onClose, onSave }: BulkEditModalProps) {
  const [edits, setEdits] = useState<EditMap>(
    Object.fromEntries(users.map((u) => [u.id, { role: u.role, department: u.department }]))
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkRole, setBulkRole] = useState<string>("");
  const [bulkDept, setBulkDept] = useState<string>("");

  const toggleSelect = (id: string): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (): void => {
    setSelectedIds((prev) =>
      prev.size === users.length ? new Set() : new Set(users.map((u) => u.id))
    );
  };

  const applyBulk = (): void => {
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

  const handleSave = (): void => {
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Bulk Edit Users</h3>
              <p className="text-xs text-gray-500">Select users and apply changes to Role &amp; Department</p>
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
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all shadow-sm"
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
                {["Name", "Email", "Role", "Department"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors ${selectedIds.has(user.id) ? "bg-red-50/60" : "hover:bg-gray-50"}`}
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
                        {initials(user.name)}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={edits[user.id].role}
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [user.id]: { ...prev[user.id], role: e.target.value } }))
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
                        setEdits((prev) => ({ ...prev, [user.id]: { ...prev[user.id], department: e.target.value } }))
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
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md"
          >
            <Check className="w-3.5 h-3.5" /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showBulkEdit, setShowBulkEdit] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [showMatrixPage, setShowMatrixPage] = useState<boolean>(false);
  const [isUsersOpen, setIsUsersOpen] = useState<boolean>(true);

  // Swap to full-page matrix view (no scroll on that page)
  if (showMatrixPage) {
    return <PermissionMatrixPage onBack={() => setShowMatrixPage(false)} />;
  }

  const filteredUsers: User[] = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSingleSave = (updated: User): void => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleBulkSave = (updatedUsers: User[]): void => {
    const map = new Map(updatedUsers.map((u) => [u.id, u]));
    setUsers((prev) => prev.map((u) => map.get(u.id) ?? u));
  };

  const handleAddUser = (newUser: User): void => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F4F5F7] p-4 sm:p-6 gap-4">

      {/* ── Permission Matrix — clickable card, no collapse toggle ── */}
      <button
        type="button"
        onClick={() => setShowMatrixPage(true)}
        className="shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 text-left group cursor-pointer"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-sm group-hover:from-gray-600 group-hover:to-gray-800 transition-all">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Permission Matrix</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Role-based access control · {PERMISSION_ROLES.length} roles · {PERMISSION_MATRIX.length} features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-700 transition-colors">
            <span className="text-xs font-medium hidden sm:inline">View Matrix</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Role badge preview strip */}
        <div className="px-6 pb-5 flex items-center gap-2 flex-wrap">
          {PERMISSION_ROLES.map((role) => (
            <span
              key={role}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 group-hover:bg-gray-200 transition-colors"
            >
              {role}
            </span>
          ))}
        </div>
      </button>

      {/* ── System Users ── */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all duration-300"
        style={{ flex: isUsersOpen ? "1 1 0" : "0 0 auto" }}
      >
        {/* Section header — collapsible */}
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
              <p className="text-xs text-gray-500 mt-0.5">{users.length} active users in the system</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isUsersOpen && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-medium">Collapsed</span>
            )}
            {isUsersOpen
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {isUsersOpen && (
          <>
            {/* Toolbar */}
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
                <button
                  type="button"
                  onClick={() => setShowAddUser(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add User
                </button>
              </div>
            </div>

            {/* Internally scrollable table */}
            <div className="overflow-auto flex-1">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                  <tr>
                    {["Name", "Email", "Role", "Department", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                    <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-xs font-semibold">
                            {initials(user.name)}
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
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          user.status === "Active"
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-400"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}>
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

      {/* Modals */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSingleSave}
        />
      )}
      {showBulkEdit && (
        <BulkEditModal
          users={users}
          onClose={() => setShowBulkEdit(false)}
          onSave={handleBulkSave}
        />
      )}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  );
}