import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, MessageSquare, Upload, Mail, X, Calendar, User, Tag, Layers } from "lucide-react";
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

// ── Level Progress Bar ──────────────────────────────────────────────────────
function LevelProgressBar({
  currentLevel,
  status,
}: {
  currentLevel: 1 | 2 | 3;
  status: "Pending" | "Approved" | "Rejected";
}) {
  const levels = ["L1", "L2", "L3"] as const;

  const getNodeStyle = (idx: number): string => {
    const levelNum = idx + 1;
    if (status === "Rejected") {
      if (levelNum < currentLevel) return "bg-green-500 text-white";
      if (levelNum === currentLevel) return "bg-red-500 text-white";
      return "bg-gray-200 text-gray-400";
    }
    if (status === "Approved") return "bg-green-500 text-white";
    if (levelNum < currentLevel) return "bg-green-500 text-white";
    if (levelNum === currentLevel) return "bg-orange-500 text-white";
    return "bg-gray-200 text-gray-400";
  };

  const getConnectorStyle = (idx: number): string => {
    const nextLevel = idx + 2;
    if (status === "Approved") return "bg-green-500";
    if (status === "Rejected" && nextLevel <= currentLevel) return "bg-green-500";
    if (nextLevel <= currentLevel && status === "Pending") return "bg-green-500";
    return "bg-gray-200";
  };

  return (
    <div className="flex items-center gap-0">
      {levels.map((label, idx) => (
        <div key={label} className="flex items-center">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm transition-all ${getNodeStyle(idx)}`}
          >
            {label}
          </div>
          {idx < 2 && (
            <div className={`w-6 h-1 rounded-full transition-all ${getConnectorStyle(idx)}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Priority Badge ─────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: ApprovalItem["priority"] }) {
  const styles = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${styles[priority]}`}>
      {priority}
    </span>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApprovalItem["status"] }) {
  const styles = {
    Pending: "bg-orange-100 text-orange-700 border-orange-200",
    Approved: "bg-green-100 text-green-700 border-green-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}

// ── Detail Modal ───────────────────────────────────────────────────────────
function DetailModal({
  item,
  onClose,
}: {
  item: ApprovalItem;
  onClose: () => void;
}) {
  const levelApprovers = ["Michael Chen", "Sarah Johnson", "James Director"];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-red-600 to-red-800 rounded-t-2xl px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-orange-100 text-xs font-medium uppercase tracking-widest mb-1">
              Control Detail
            </p>
            <h2 className="text-white text-xl font-bold">{item.controlId}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-800 leading-relaxed">{item.description}</p>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <User className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Submitted By</p>
                <p className="text-sm font-semibold text-gray-800">{item.submittedBy}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Calendar className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Submitted Date</p>
                <p className="text-sm font-semibold text-gray-800">{item.submittedDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Tag className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Priority</p>
                <div className="mt-1">
                  <PriorityBadge priority={item.priority} />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Layers className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Status</p>
                <div className="mt-1">
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Approval Workflow */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Approval Workflow</p>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                Current Level: L{item.currentLevel}
              </span>
            </div>

            <div className="space-y-3">
              {([1, 2, 3] as const).map((lvl) => {
                let nodeStyle = "bg-gray-200 text-gray-400";
                let label = `L${lvl}`;
                let statusText = "Not reached";
                let statusClass = "text-gray-400";

                if (item.status === "Approved") {
                  nodeStyle = "bg-green-500 text-white";
                  statusText = `Approved by ${levelApprovers[lvl - 1]}`;
                  statusClass = "text-green-600";
                  label = "✓";
                } else if (item.status === "Rejected" && lvl === item.currentLevel) {
                  nodeStyle = "bg-red-500 text-white";
                  statusText = `Rejected by ${levelApprovers[lvl - 1]}`;
                  statusClass = "text-red-600";
                } else if (lvl < item.currentLevel) {
                  nodeStyle = "bg-green-500 text-white";
                  statusText = `Approved by ${levelApprovers[lvl - 1]}`;
                  statusClass = "text-green-600";
                  label = "✓";
                } else if (lvl === item.currentLevel && item.status === "Pending") {
                  nodeStyle = "bg-orange-500 text-white";
                  statusText = `Awaiting ${levelApprovers[lvl - 1]}`;
                  statusClass = "text-orange-600";
                }

                return (
                  <div key={lvl} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0 ${nodeStyle}`}
                    >
                      {label}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-700">Level {lvl} — {levelApprovers[lvl - 1]}</p>
                      <p className={`text-xs ${statusClass}`}>{statusText}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attached Evidence */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Upload className="w-4 h-4 text-gray-500" />
              Attached Evidence
            </h3>
            <div className="space-y-2">
              {["User_Access_Report_Q1_2026.xlsx", "Exception_Analysis.pdf"].map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-sm text-gray-700">{file}</span>
                  <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Email Notifications */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Email Notifications</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span>Control owner will be notified upon approval/rejection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span>Next level approver will be notified upon approval</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span>Audit team will receive a copy of final decision</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

// ── Stage config ──────────────────────────────────────────────────────────
interface StageConfig {
  label: string;
  value: number;
  gradient: string;
  glowColor: string;
  connectorGradient: string;
}

// ── KPI Progress Bar ───────────────────────────────────────────────────────
function ApprovalProgressBar() {
  const pendingL1 = mockApprovals.filter((a) => a.currentLevel === 1 && a.status === "Pending").length;
  const pendingL2 = mockApprovals.filter((a) => a.currentLevel === 2 && a.status === "Pending").length;
  const pendingL3 = mockApprovals.filter((a) => a.currentLevel === 3 && a.status === "Pending").length;
  const approvedToday = mockApprovals.filter((a) => a.status === "Approved").length;

  const stages: StageConfig[] = [
    { label: "Pending L1", value: pendingL1, gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", glowColor: "#3b82f6", connectorGradient: "linear-gradient(90deg, #3b82f6, #f59e0b)" },
    { label: "Pending L2", value: pendingL2, gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", glowColor: "#f59e0b", connectorGradient: "linear-gradient(90deg, #f59e0b, #8b5cf6)" },
    { label: "Pending L3", value: pendingL3, gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", glowColor: "#8b5cf6", connectorGradient: "linear-gradient(90deg, #8b5cf6, #10b981)" },
    { label: "Approved Today", value: approvedToday, gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", glowColor: "#10b981", connectorGradient: "" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-center">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-14 h-14 rounded-full opacity-15 animate-pulse" style={{ background: `radial-gradient(circle, ${stage.glowColor}, transparent)` }} />
                <div className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white" style={{ background: stage.gradient }}>
                  <span className="text-base font-bold leading-none">{stage.value}</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-600 mt-2 text-center whitespace-nowrap">{stage.label}</p>
            </div>
            {i < stages.length - 1 && (
              <div className="w-16 mx-2 mb-5">
                <div className="h-0.5 w-full rounded-full" style={{ background: stage.connectorGradient }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function ApprovalWorkflow() {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [modalItem, setModalItem] = useState<ApprovalItem | null>(null);
  const [comment, setComment] = useState("");

  return (
    <div className="h-screen flex flex-col p-4 sm:p-6 gap-4 overflow-hidden">
      {/* Detail Modal */}
      {modalItem && (
        <DetailModal item={modalItem} onClose={() => setModalItem(null)} />
      )}

      {/* KPI Progress Bar */}
      <ApprovalProgressBar />

      {/* Approval Queue Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Pending Approvals</h2>
              <p className="text-xs text-gray-600 mt-1">
                {mockApprovals.filter((a) => a.status === "Pending").length} items awaiting review
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search approvals..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Control ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockApprovals.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gradient-to-r hover:from-orange-50/40 hover:to-amber-50/40 transition-all"
                >
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{item.controlId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.submittedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.submittedDate}</td>
                  <td className="px-6 py-4">
                    <LevelProgressBar currentLevel={item.currentLevel} status={item.status} />
                    <p className="text-[10px] text-gray-400 mt-1 ml-0.5">
                      {item.status === "Approved"
                        ? "All levels approved"
                        : item.status === "Rejected"
                        ? `Rejected at L${item.currentLevel}`
                        : `Awaiting L${item.currentLevel} approval`}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Eye icon → opens Detail Modal */}
                      <button
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row click
                          setModalItem(item);
                        }}
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Detail Panel (row click) */}
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

          {/* Workflow Progress */}
          <div className="mb-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-800">Workflow Progress</span>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                Current Level: L{selectedItem.currentLevel}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-md">✓</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Level 1 Approved</p>
                    <p className="text-xs text-gray-600">by Michael Chen</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${selectedItem.currentLevel >= 2 ? selectedItem.status === "Pending" ? "bg-orange-500 text-white" : "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                    {selectedItem.currentLevel >= 2 && selectedItem.status === "Approved" ? "✓" : "L2"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{selectedItem.currentLevel === 2 ? "Pending L2" : "Level 2"}</p>
                    <p className="text-xs text-gray-600">Awaiting Sarah Johnson</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${selectedItem.currentLevel >= 3 ? selectedItem.status === "Pending" ? "bg-orange-500 text-white" : "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>L3</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Level 3</p>
                    <p className="text-xs text-gray-600">Final Approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {selectedItem.status === "Pending" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                <CheckCircle className="w-5 h-5" />Approve
              </button>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                <XCircle className="w-5 h-5" />Reject
              </button>
              <Link to={`/control/${selectedItem.id}`} className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                <Eye className="w-5 h-5" />View Details
              </Link>
            </div>
          )}

          {/* Comment Box */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
              placeholder="Enter approval comments or reasons for rejection..."
            />
          </div>

          {/* Evidence Files */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <Upload className="w-4 h-4" />Attached Evidence
            </h3>
            <div className="space-y-2">
              {["User_Access_Report_Q1_2026.xlsx", "Exception_Analysis.pdf"].map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-700">{file}</span>
                  <button className="text-xs text-orange-600 hover:text-orange-700">Download</button>
                </div>
              ))}
            </div>
          </div>

          {/* Email Notifications */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm text-gray-700">Email Notifications</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span>Control owner will be notified upon approval/rejection</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span>Next level approver will be notified upon approval</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span>Audit team will receive a copy of final decision</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}