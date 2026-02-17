import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, MessageSquare, Upload, Mail } from "lucide-react";
import { Link } from "react-router";

interface ApprovalItem {
  id: string;
  controlId: string;
  description: string;
  submittedBy: string;
  submittedDate: string;
  currentLevel: 1 | 2 | 3;
  status: "Pending" | "Approved" | "Rejected";
  priority: "High" | "Medium" | "Low";
}

const mockApprovals: ApprovalItem[] = [
  {
    id: "1",
    controlId: "A11-01",
    description: "Quarterly financial reconciliation and variance analysis",
    submittedBy: "Sarah Johnson",
    submittedDate: "2026-02-06",
    currentLevel: 2,
    status: "Pending",
    priority: "High",
  },
  {
    id: "2",
    controlId: "B11-01",
    description: "Vendor payment authorization and approval workflow",
    submittedBy: "Michael Chen",
    submittedDate: "2026-02-05",
    currentLevel: 1,
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "3",
    controlId: "B11-02",
    description: "Data backup verification and disaster recovery testing",
    submittedBy: "David Wilson",
    submittedDate: "2026-02-04",
    currentLevel: 3,
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "4",
    controlId: "B11-03",
    description: "Review and validate user access permissions for critical systems",
    submittedBy: "John Smith",
    submittedDate: "2026-02-03",
    currentLevel: 3,
    status: "Approved",
    priority: "Low",
  },
  {
    id: "5",
    controlId: "C11-01",
    description: "Security patch deployment verification for production servers",
    submittedBy: "Emily Rodriguez",
    submittedDate: "2026-02-10",
    currentLevel: 1,
    status: "Pending",
    priority: "High",
  },
  {
    id: "6",
    controlId: "C11-02",
    description: "Compliance audit preparation and documentation review",
    submittedBy: "James Anderson",
    submittedDate: "2026-02-09",
    currentLevel: 2,
    status: "Pending",
    priority: "High",
  },
  {
    id: "7",
    controlId: "D12-01",
    description: "IT asset inventory reconciliation and validation",
    submittedBy: "Lisa Martinez",
    submittedDate: "2026-02-08",
    currentLevel: 1,
    status: "Pending",
    priority: "Low",
  },
  {
    id: "8",
    controlId: "D12-02",
    description: "Network security assessment and vulnerability scan results",
    submittedBy: "Robert Taylor",
    submittedDate: "2026-02-07",
    currentLevel: 3,
    status: "Pending",
    priority: "High",
  },
  {
    id: "9",
    controlId: "F11-01",
    description: "Employee onboarding access provisioning review",
    submittedBy: "Jennifer Lee",
    submittedDate: "2026-02-06",
    currentLevel: 2,
    status: "Approved",
    priority: "Medium",
  },
  {
    id: "10",
    controlId: "F11-02",
    description: "Database backup integrity verification and restoration test",
    submittedBy: "Christopher Brown",
    submittedDate: "2026-02-05",
    currentLevel: 1,
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "11",
    controlId: "A11-01",
    description: "Segregation of duties conflict analysis for financial systems",
    submittedBy: "Amanda White",
    submittedDate: "2026-02-04",
    currentLevel: 2,
    status: "Pending",
    priority: "High",
  },
  {
    id: "12",
    controlId: "B11-01",
    description: "Third-party vendor risk assessment and due diligence",
    submittedBy: "Daniel Garcia",
    submittedDate: "2026-02-03",
    currentLevel: 1,
    status: "Rejected",
    priority: "Medium",
  },
  {
    id: "13",
    controlId: "C11-01",
    description: "Password policy compliance audit and remediation",
    submittedBy: "Michelle Thompson",
    submittedDate: "2026-02-02",
    currentLevel: 3,
    status: "Approved",
    priority: "Low",
  },
  {
    id: "14",
    controlId: "D12-01",
    description: "Change management approval workflow for production systems",
    submittedBy: "Kevin Martinez",
    submittedDate: "2026-02-01",
    currentLevel: 2,
    status: "Pending",
    priority: "High",
  },
  {
    id: "15",
    controlId: "F11-01",
    description: "Privileged access review for system administrators",
    submittedBy: "Nicole Davis",
    submittedDate: "2026-01-31",
    currentLevel: 1,
    status: "Pending",
    priority: "Medium",
  },
];

// Wave SVG matching the reference — stroke line + soft filled area beneath
function KpiWave({ color }: { color: string }) {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 300 56"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: "56px" }}
    >
      <defs>
        <linearGradient id={`waveGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Filled area beneath the wave line */}
      <path
        d="M0 32 C20 22, 38 42, 60 30 C78 20, 95 38, 115 28 C135 18, 152 40, 175 28 C195 18, 215 38, 238 26 C258 16, 278 36, 300 24 L300 56 L0 56 Z"
        fill={`url(#waveGrad-${color.replace("#", "")})`}
      />

      {/* Back wave line — thinner, more transparent */}
      <path
        d="M0 36 C20 26, 38 46, 60 34 C78 24, 95 42, 115 32 C135 22, 152 44, 175 32 C195 22, 215 42, 238 30 C258 20, 278 40, 300 28"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeOpacity="0.25"
        strokeLinecap="round"
      />

      {/* Front wave line — bolder, matches reference style */}
      <path
        d="M0 32 C20 22, 38 42, 60 30 C78 20, 95 38, 115 28 C135 18, 152 40, 175 28 C195 18, 215 38, 238 26 C258 16, 278 36, 300 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ApprovalWorkflow() {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [comment, setComment] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low":
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="h-screen flex flex-col p-4 sm:p-6 gap-4 overflow-hidden">
      {/* Approval Queue Stats - Enhanced with waves */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-5 border-l-4 border-orange-500 hover:shadow-lg transition-all relative overflow-hidden">
          <p className="text-xs font-semibold text-orange-700 mb-1 relative z-10">Pending L1</p>
          <p className="text-3xl font-bold text-orange-800 relative z-10">12</p>
          <KpiWave color="#f97316" />
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-all relative overflow-hidden">
          <p className="text-xs font-semibold text-blue-700 mb-1 relative z-10">Pending L2</p>
          <p className="text-3xl font-bold text-blue-800 relative z-10">8</p>
          <KpiWave color="#3b82f6" />
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-all relative overflow-hidden">
          <p className="text-xs font-semibold text-purple-700 mb-1 relative z-10">Pending L3</p>
          <p className="text-3xl font-bold text-purple-800 relative z-10">5</p>
          <KpiWave color="#a855f7" />
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-all relative overflow-hidden">
          <p className="text-xs font-semibold text-green-700 mb-1 relative z-10">Approved Today</p>
          <p className="text-3xl font-bold text-green-800 relative z-10">14</p>
          <KpiWave color="#22c55e" />
        </div>
      </div>

      {/* Approval Queue - Enhanced with Fixed Height and Internal Scroll */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Pending Approvals</h2>
              <p className="text-xs text-gray-600 mt-1">
                {mockApprovals.filter((a) => a.status === "Pending").length}{" "}
                items awaiting review
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search approvals..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Table Container with Fixed Height and Internal Scrolling */}
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">
                  Control ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockApprovals.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 cursor-pointer transition-all"
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">
                    {item.controlId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.submittedBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.submittedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                          item.currentLevel >= 1
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        L1
                      </div>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                          item.currentLevel >= 2
                            ? item.status === "Pending"
                              ? "bg-gray-300 text-gray-600"
                              : "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        L2
                      </div>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                          item.currentLevel >= 3
                            ? item.status === "Pending"
                              ? "bg-gray-300 text-gray-600"
                              : "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        L3
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs border font-semibold shadow-sm ${getPriorityColor(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs border font-semibold shadow-sm ${
                        item.status === "Approved"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : item.status === "Rejected"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/control/${item.id}`}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Detail Panel - Enhanced */}
      {selectedItem && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex-shrink-0 max-h-[50vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                Approval Review - {selectedItem.controlId}
              </h2>
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Workflow Progress - Enhanced */}
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-800">Workflow Progress</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Current Level: L{selectedItem.currentLevel}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Level 1 Approved</p>
                    <p className="text-xs text-gray-600">by Michael Chen</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                      selectedItem.currentLevel >= 2
                        ? selectedItem.status === "Pending"
                          ? "bg-blue-500 text-white"
                          : "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {selectedItem.currentLevel >= 2 &&
                    selectedItem.status === "Approved"
                      ? "✓"
                      : "L2"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {selectedItem.currentLevel === 2 ? "Pending L2" : "Level 2"}
                    </p>
                    <p className="text-xs text-gray-600">Awaiting Sarah Johnson</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                      selectedItem.currentLevel >= 3
                        ? selectedItem.status === "Pending"
                          ? "bg-blue-500 text-white"
                          : "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    L3
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Level 3</p>
                    <p className="text-xs text-gray-600">Final Approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Enhanced */}
          {selectedItem.status === "Pending" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <Link
                to={`/control/${selectedItem.id}`}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Eye className="w-5 h-5" />
                View Details
              </Link>
            </div>
          )}

          {/* Comment Box */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Enter approval comments or reasons for rejection..."
            />
          </div>

          {/* Evidence Files */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <Upload className="w-4 h-4" />
              Attached Evidence
            </h3>
            <div className="space-y-2">
              {[
                "User_Access_Report_Q1_2026.xlsx",
                "Exception_Analysis.pdf",
              ].map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <span className="text-sm text-gray-700">{file}</span>
                  <button className="text-xs text-red-600 hover:text-red-700">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Email Trigger Indicators */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm text-gray-700">Email Notifications</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Control owner will be notified upon approval/rejection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Next level approver will be notified upon approval</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Audit team will receive a copy of final decision</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}