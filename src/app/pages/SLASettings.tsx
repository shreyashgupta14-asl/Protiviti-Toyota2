import { useState, useRef } from "react";
import {
  Database, Bell, Calendar, ChevronDown, ChevronUp,
  Upload, FileSpreadsheet, X, Send, CheckCircle,
  AlertCircle, Clock, Users, Shield, ArrowLeft,
  Edit2, Save, XCircle, Plus,
} from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SLANotificationConfig {
  controlOwner: boolean;
  approver: boolean;
}
interface SLAMasterState {
  alertBeforeDue: number;
  alertOnDue: boolean;
  alertAfterDue: number;
  beforeDue: SLANotificationConfig;
  onDue: SLANotificationConfig;
  afterDue: SLANotificationConfig;
}
interface SLADurationItem {
  label: string;
  days: number;
  icon: React.ReactNode;
}
interface ExcelRow {
  Department: string;
  "Process/Area": string;
  "Control ID": string;
  "Control Description": string;
  "Test Steps": string;
  "Evidence Required": string;
  "Control Type": string;
}
interface SendConfirmationPopupProps { onClose: () => void; }
interface BulkUploadPopupProps { onClose: () => void; onUpload: (rows: ExcelRow[]) => void; }
interface EditRowPopupProps {
  row: ExcelRow; index: number; columns: (keyof ExcelRow)[];
  onSave: (updated: ExcelRow) => void; onClose: () => void;
}
interface AddRowPopupProps {
  onSave: (row: ExcelRow) => void;
  onClose: () => void;
}

// ─── Gradient helpers ─────────────────────────────────────────────────────────
const G = "bg-gradient-to-br from-gray-500 to-gray-700";
const GH = "hover:from-gray-600 hover:to-gray-800";
const RED_G = "bg-gradient-to-r from-red-600 to-red-500";
const RED_GH = "hover:from-red-700 hover:to-red-600";

// ─── Outline-button helper (gray, for main/SLA pages) ────────────────────────
function GradientOutlineButton({
  onClick,
  className = "",
  children,
  disabled = false,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      className={`bg-gradient-to-br from-gray-400 to-gray-600 p-px rounded-xl inline-flex ${disabled ? "opacity-50" : ""}`}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[11px] text-xs font-semibold bg-white text-gray-600 hover:bg-gray-50 transition-all w-full ${className}`}
      >
        {children}
      </button>
    </div>
  );
}

// ─── Red Outline Button (for Control Master page actions) ─────────────────────
function RedOutlineButton({
  onClick,
  className = "",
  children,
  disabled = false,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      className={`p-px rounded-xl inline-flex ${disabled ? "opacity-50" : ""}`}
      style={{ background: "linear-gradient(135deg, #f87171, #dc2626)" }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[11px] text-xs font-semibold transition-all w-full ${className}`}
        style={{ background: "#fff5f5", color: "#dc2626" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5";
        }}
      >
        {children}
      </button>
    </div>
  );
}

// ─── Darker Red Outline Button (Add Data only) ────────────────────────────────
function DarkRedOutlineButton({
  onClick,
  className = "",
  children,
  disabled = false,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div
      className={`p-[1.5px] rounded-xl inline-flex ${disabled ? "opacity-50" : ""}`}
      style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[11px] text-xs font-bold transition-all w-full ${className}`}
        style={{ background: "#fff1f1", color: "#b91c1c" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fecaca";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff1f1";
        }}
      >
        {children}
      </button>
    </div>
  );
}

// ─── Red Filled Button (for Save Changes when dirty) ──────────────────────────
function RedFilledButton({
  onClick,
  className = "",
  children,
  disabled = false,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all ${disabled ? "opacity-50" : ""} ${className}`}
      style={{
        background: "linear-gradient(135deg, #ef4444, #dc2626)",
        boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #dc2626, #b91c1c)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
      }}
    >
      {children}
    </button>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const EXCEL_COLUMNS: (keyof ExcelRow)[] = [
  "Department", "Process/Area", "Control ID", "Control Description",
  "Test Steps", "Evidence Required", "Control Type",
];

const INITIAL_ROWS: ExcelRow[] = [
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "A11-01",
    "Control Description": "TMC Control:\nThe written inventory management policies and procedures (raw materials, WIP, finished goods) exist and are properly followed.\n\nTKM - Control In Place:\nInventory Management policies exist for:\n1. Inventory valuation\n2. Inventory write off and disposal\n3. Inventory physical verification",
    "Test Steps": "Check the policy is adequate and process performed as per policy\nTraining is provided to new members in the team",
    "Evidence Required": "1. Inventory Valuation Policy\n2. SOP for receipt of goods\n3. Training Manuals and documents",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "B11-01",
    "Control Description": "TMC Control:\nThe following duties are performed independently:\n- production planning,\n- purchase order,\n- receipt and inspection of materials,\n- recording to the inventory sub-ledger.",
    "Test Steps": "A. Confirm activities are performed independently.\nB. Confirm no common access for PO and GRN creation.",
    "Evidence Required": "1. Authorization Matrix\n2. SAP Access Rights Report\n3. Organization Chart\n4. Production Plan\n5. Purchase Order\n6. GRN",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "B11-02",
    "Control Description": "TMC Control:\nFunctions for restricted access are installed in related inventory systems to assist segregation of duties. Password is used for identification.",
    "Test Steps": "A. Confirm each team member has unique user ID and password for SAP access.",
    "Evidence Required": "1. SAP Access Login Screenshot\n2. Authorization Matrix\n3. SAP Access Rights Report",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "B11-03",
    "Control Description": "TMC Control:\nAuthority to access is registered consistent with the job function and is periodically confirmed.",
    "Test Steps": "A. Confirm SAP access is per job profile with HOD approval.\nB. Confirm periodic review.",
    "Evidence Required": "1. SAP Access Login Screenshot\n2. Authorization Matrix\n3. SAP Access Rights Report",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "C11-01",
    "Control Description": "TMC Control:\nA detailed manual that instructs documentation procedures in receiving activities is in place.",
    "Test Steps": "A. Confirm SOP exists for receiving activities.\nB. Confirm GRN are sequentially numbered.",
    "Evidence Required": "1. SOP for receipt of goods\n2. Training manuals for GRN\n3. SAP Screenshots",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "C11-02",
    "Control Description": "TMC Control:\nPolicies and procedures for accepting refunds, sending alternative and recording are designed and in operations.",
    "Test Steps": "To be tested for design adequacy",
    "Evidence Required": "1. RTV Screen shot\n2. Debit note screenshots\n3. TKM Quality Rule",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "D12-01",
    "Control Description": "TMC Control:\nShipping documents such as invoice are automatically output from shipping order data.",
    "Test Steps": "A. Confirm SAL system data is automatically used by SAP to generate Tax Invoice.",
    "Evidence Required": "1. Screenshot of SAP-SAL interface\n2. Fund Receipt Report\n3. Invoice",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "D12-02",
    "Control Description": "TMC Control:\nShipment is confirmed with purchase order or shipping order data. Any deviations are explained to the dealer.",
    "Test Steps": "A. Confirm shipment via fund receipt report cross-checking chassis number before loading.",
    "Evidence Required": "1. Fund receipt report summary\n2. Customer Acknowledgment\n3. Invoice\n4. Consignment Note",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "F11-01",
    "Control Description": "TMC Control:\nSlow-moving, obsolete, scrapped or damaged inventories have been adequately identified and physically segregated.",
    "Test Steps": "A. Confirm items to be scrapped are identified, segregated, and approved before scrapping.",
    "Evidence Required": "1. Inventory Valuation Policy\n2. Inventory write-off / Disposal approval",
    "Control Type": "",
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "F11-02",
    "Control Description": "TMC Control:\nInventories at all locations are agreed with the records by performing periodic full counts.",
    "Test Steps": "A. Confirm semi-annual physical stock count.\nB. Confirm book stock replaced with physical count.",
    "Evidence Required": "1. Inventory Tags\n2. Inventory Valuation Report\n3. Inventory Valuation Summary\n4. Inventory Valuation Policy",
    "Control Type": "",
  },
];

// ─── Notification Toggle Row ──────────────────────────────────────────────────
function NotificationRow({ icon, label, sublabel, checked, onChange }: {
  icon: React.ReactNode; label: string; sublabel: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${checked ? "border-2" : "border"}`}
      style={{
        background: "#FFFFFF",
        borderColor: checked ? "#6B7280" : "#D0D0D0",
        borderStyle: "solid",
      }}
    >
      <div className="flex items-center gap-2">
        <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${G}`}>
          <span className="text-white">{icon}</span>
        </div>
        <div>
          <p className="text-[11px] font-semibold" style={{ color: "#303030" }}>{label}</p>
          <p className="text-[10px]" style={{ color: "#909090" }}>{sublabel}</p>
        </div>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={`rounded-full cursor-pointer flex-shrink-0 transition-all focus:outline-none ${checked ? G : ""}`}
        style={{ background: checked ? undefined : "#C0C0C0", width: "36px", height: "20px" }}
      >
        <Switch.Thumb className="block w-3.5 h-3.5 bg-white rounded-full transition-transform transform data-[state=checked]:translate-x-4 translate-x-0.5 shadow-md" />
      </Switch.Root>
    </div>
  );
}

// ─── SLA Timeline Card ─────────────────────────────────────────────────────────
function SLATimelineCard({
  title, icon, borderColor, inputValue, inputLabel, description,
  config, onInputChange, onToggle, isToggle, toggleChecked, onToggleChange,
}: {
  title: string; icon: React.ReactNode; borderColor: string;
  inputValue?: number; inputLabel?: string; description: string;
  config: SLANotificationConfig; onInputChange?: (v: number) => void;
  onToggle?: (cfg: SLANotificationConfig) => void; isToggle?: boolean;
  toggleChecked?: boolean; onToggleChange?: (v: boolean) => void;
}) {
  return (
    <div className="p-3 rounded-xl flex flex-col gap-2.5" style={{ background: "#FFFFFF", border: `2px solid ${borderColor}` }}>
      <div className="flex items-center gap-2">
        <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${G}`}>
          <span className="text-white">{icon}</span>
        </div>
        <span className="text-xs font-bold" style={{ color: "#303030" }}>{title}</span>
      </div>

      {isToggle ? (
        <div className="flex items-center gap-3">
          <button
            role="switch" aria-checked={toggleChecked}
            onClick={() => onToggleChange?.(!toggleChecked)}
            className={`relative flex-shrink-0 rounded-full transition-all focus:outline-none ${toggleChecked ? G : ""}`}
            style={{ width: "40px", height: "22px", background: toggleChecked ? undefined : "#C0C0C0", transition: "background 0.25s" }}
          >
            <span
              className="absolute top-0.5 rounded-full bg-white flex items-center justify-center"
              style={{ width: "18px", height: "18px", left: toggleChecked ? "calc(100% - 20px)" : "2px", transition: "left 0.2s cubic-bezier(.4,0,.2,1)", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}
            >
              <Bell style={{ width: "9px", height: "9px", color: toggleChecked ? "#374151" : "#B0B0B0" }} />
            </span>
          </button>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${toggleChecked ? `${G} text-white` : "text-gray-500"}`}
            style={{ background: toggleChecked ? undefined : "#E0E0E0" }}>
            {toggleChecked ? "ENABLED" : "DISABLED"}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number" value={inputValue} min={0}
            onChange={(e) => onInputChange?.(parseInt(e.target.value) || 0)}
            className="w-14 px-2 py-1 rounded-lg text-sm font-bold text-center focus:outline-none"
            style={{ border: "1px solid #C0C0C0", background: "#FFFFFF", color: "#303030" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#6B7280")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#C0C0C0")}
          />
          <span className="text-xs font-medium" style={{ color: "#707070" }}>{inputLabel}</span>
        </div>
      )}

      <p className="text-[10px]" style={{ color: "#707070" }}>{description}</p>
      <div style={{ borderTop: "1px solid #F0F0F0" }} />

      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#B0B0B0" }}>Notify</p>
        <div className="flex flex-col gap-1.5">
          <NotificationRow icon={<Users className="w-3 h-3" />} label="Control Owner" sublabel="Notify the assigned user" checked={config.controlOwner} onChange={(v) => onToggle?.({ ...config, controlOwner: v })} />
          <NotificationRow icon={<Shield className="w-3 h-3" />} label="Approver" sublabel="Escalate to approvers" checked={config.approver} onChange={(v) => onToggle?.({ ...config, approver: v })} />
        </div>
      </div>
    </div>
  );
}

// ─── Expandable Cell ───────────────────────────────────────────────────────────
function ExpandableCell({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!value) return <span className="italic text-xs" style={{ color: "#B0B0B0" }}>—</span>;
  const isLong = value.length > 80 || value.split("\n").filter(Boolean).length > 2;
  if (!isLong) return <span className="text-xs whitespace-pre-line leading-relaxed" style={{ color: "#404040" }}>{value}</span>;
  return (
    <div>
      <p className={`text-xs whitespace-pre-line leading-relaxed ${expanded ? "" : "line-clamp-2"}`} style={{ color: "#404040" }}>{value}</p>
      <button onClick={() => setExpanded(!expanded)} className="mt-1 text-[10px] font-semibold" style={{ color: "#6B7280" }}>
        {expanded ? "Show less ▲" : "Show more ▼"}
      </button>
    </div>
  );
}

// ─── Shared field label + textarea row config ──────────────────────────────────
const FIELD_LABELS: Partial<Record<keyof ExcelRow, string>> = {
  Department: "Department",
  "Process/Area": "Process / Area",
  "Control ID": "Control ID",
  "Control Description": "Control Description",
  "Test Steps": "Test Steps",
  "Evidence Required": "Evidence Required",
  "Control Type": "Control Type",
};

const TEXTAREA_ROWS: Partial<Record<keyof ExcelRow, number>> = {
  "Control Description": 5,
  "Test Steps": 4,
  "Evidence Required": 4,
};

// ─── Edit Row Popup ────────────────────────────────────────────────────────────
function EditRowPopup({ row, index, onSave, onClose }: EditRowPopupProps) {
  const [draft, setDraft] = useState<ExcelRow>({ ...row });
  const isDirty = JSON.stringify(draft) !== JSON.stringify(row);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#FFFFFF", border: "1px solid #D0D0D0", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", maxHeight: "90vh" }}>

        <div className={`h-1 w-full flex-shrink-0 ${G}`} />

        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #E8E8E8", background: "#F7F7F7" }}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${G}`}>
              <Edit2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "#303030" }}>Edit Record</h3>
              <p className="text-[11px]" style={{ color: "#707070" }}>Row #{index + 1} · {row["Control ID"] || "—"}</p>
            </div>
          </div>
          <GradientOutlineButton onClick={onClose} className="!p-0 w-7 h-7 !rounded-full">
            <X className="w-3.5 h-3.5" />
          </GradientOutlineButton>
        </div>

        <div className="overflow-y-auto p-5 space-y-3 flex-1">
          <div className="grid grid-cols-3 gap-3">
            {(["Department", "Process/Area", "Control ID"] as (keyof ExcelRow)[]).map((col) => (
              <div key={col}>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#909090" }}>{FIELD_LABELS[col]}</label>
                <input type="text" value={draft[col]} onChange={(e) => setDraft({ ...draft, [col]: e.target.value })}
                  className="w-full text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                  style={{ border: "1px solid #D0D0D0", background: "#FAFAFA", color: "#303030" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6B7280")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D0D0D0")} />
              </div>
            ))}
          </div>
          {(["Control Description", "Test Steps", "Evidence Required", "Control Type(Manual/Automatic)"] as (keyof ExcelRow)[]).map((col) => (
            <div key={col}>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#909090" }}>{FIELD_LABELS[col]}</label>
              <textarea value={draft[col]} onChange={(e) => setDraft({ ...draft, [col]: e.target.value })}
                rows={TEXTAREA_ROWS[col] ?? 2} className="w-full text-xs rounded-lg px-2.5 py-2 resize-none focus:outline-none"
                style={{ border: "1px solid #D0D0D0", background: "#FAFAFA", color: "#303030" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6B7280")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D0D0D0")} />
            </div>
          ))}
        </div>

        <div className="flex gap-3 px-5 py-3 flex-shrink-0" style={{ borderTop: "1px solid #E8E8E8", background: "#F7F7F7" }}>
          <GradientOutlineButton onClick={onClose} className="flex-1 py-2.5">
            <XCircle className="w-3.5 h-3.5" />
            Cancel
          </GradientOutlineButton>
          {/* Save Changes: red filled when dirty, gray outline when clean */}
          {isDirty ? (
            <RedFilledButton
              onClick={() => { onSave(draft); onClose(); }}
              className="flex-1 py-2.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </RedFilledButton>
          ) : (
            <GradientOutlineButton onClick={() => { onSave(draft); onClose(); }} className="flex-1 py-2.5 font-bold">
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </GradientOutlineButton>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Row Popup ─────────────────────────────────────────────────────────────
function AddRowPopup({ onSave, onClose }: AddRowPopupProps) {
  const [draft, setDraft] = useState<ExcelRow>({
    Department: "",
    "Process/Area": "",
    "Control ID": "",
    "Control Description": "",
    "Test Steps": "",
    "Evidence Required": "",
    "Control Type": "",
  });

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "#FFFFFF",
          border: "1px solid #D0D0D0",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          maxHeight: "90vh",
        }}
      >
        <div className={`h-1 w-full flex-shrink-0 ${G}`} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #E8E8E8", background: "#F7F7F7" }}
        >
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${G}`}>
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "#303030" }}>Add Master Data</h3>
              <p className="text-[11px]" style={{ color: "#707070" }}>Fill in the details to add a new record</p>
            </div>
          </div>
          <GradientOutlineButton onClick={onClose} className="!p-0 w-7 h-7 !rounded-full">
            <X className="w-3.5 h-3.5" />
          </GradientOutlineButton>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-3 flex-1">
          <div className="grid grid-cols-3 gap-3">
            {(["Department", "Process/Area", "Control ID"] as (keyof ExcelRow)[]).map((col) => (
              <div key={col}>
                <label
                  className="block text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "#909090" }}
                >
                  {FIELD_LABELS[col]}
                </label>
                <input
                  type="text"
                  value={draft[col]}
                  placeholder={`Enter ${FIELD_LABELS[col]}`}
                  onChange={(e) => setDraft({ ...draft, [col]: e.target.value })}
                  className="w-full text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                  style={{ border: "1px solid #D0D0D0", background: "#FAFAFA", color: "#303030" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6B7280")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D0D0D0")}
                />
              </div>
            ))}
          </div>

          {(
            [
              "Control Description",
              "Test Steps",
              "Evidence Required",
              "Control Type(Manual/Automatic)",
            ] as (keyof ExcelRow)[]
          ).map((col) => (
            <div key={col}>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: "#909090" }}
              >
                {FIELD_LABELS[col]}
              </label>
              <textarea
                value={draft[col]}
                placeholder={`Enter ${FIELD_LABELS[col]}`}
                onChange={(e) => setDraft({ ...draft, [col]: e.target.value })}
                rows={TEXTAREA_ROWS[col] ?? 2}
                className="w-full text-xs rounded-lg px-2.5 py-2 resize-none focus:outline-none"
                style={{ border: "1px solid #D0D0D0", background: "#FAFAFA", color: "#303030" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6B7280")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D0D0D0")}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-5 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid #E8E8E8", background: "#F7F7F7" }}
        >
          <GradientOutlineButton onClick={onClose} className="flex-1 py-2.5">
            <XCircle className="w-3.5 h-3.5" />
            Cancel
          </GradientOutlineButton>
          {/* Add Record — red outline */}
          <RedOutlineButton onClick={handleSave} className="flex-1 py-2.5 font-bold">
            <Save className="w-3.5 h-3.5" />
            Add Record
          </RedOutlineButton>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Upload Popup ─────────────────────────────────────────────────────────
function BulkUploadPopup({ onClose, onUpload }: BulkUploadPopupProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["xlsx", "xls", "csv"].includes(ext)) { setError("Unsupported file type. Please upload .xlsx, .xls, or .csv."); return; }
    setError(""); setFile(f);
  };
  const handleProcess = () => {
    if (!file) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); setTimeout(() => { onUpload(INITIAL_ROWS); onClose(); }, 1500); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ background: "#FFFFFF", border: "1px solid #D0D0D0", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div className={`h-1 w-full ${G}`} />
        <div className="p-5">
          {!done ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${G}`}>
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "#303030" }}>Bulk Upload</h3>
                  <p className="text-xs" style={{ color: "#707070" }}>Upload an Excel file to update all records</p>
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed py-7 cursor-pointer transition-all"
                style={{ borderColor: isDragging ? "#6B7280" : "#C0C0C0", background: isDragging ? "#F3F4F6" : "#FAFAFA" }}
              >
                <Upload className="w-7 h-7" style={{ color: isDragging ? "#374151" : "#C0C0C0" }} />
                {file ? (
                  <div className="text-center">
                    <p className="text-xs font-bold" style={{ color: "#303030" }}>{file.name}</p>
                    <p className="text-[11px]" style={{ color: "#707070" }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: "#303030" }}>Drop your file here</p>
                    <p className="text-[11px]" style={{ color: "#909090" }}>or <span className="underline" style={{ color: "#6B7280" }}>browse</span></p>
                    <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      {[".xlsx", ".xls", ".csv"].map((ext) => (
                        <span key={ext} className={`px-1.5 py-0.5 rounded font-mono text-[10px] text-white ${G}`}>{ext}</span>
                      ))}
                    </div>
                  </div>
                )}
                <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
              </div>

              {error && (
                <div className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#FFF0F0", border: "1px solid #E06070" }}>
                  <AlertCircle className="w-4 h-4" style={{ color: "#E00010" }} />
                  <p className="text-xs" style={{ color: "#E00010" }}>{error}</p>
                </div>
              )}
              {processing && (
                <div className="mt-2.5 flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "#F0F0F0" }}>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#6B7280", borderTopColor: "transparent" }} />
                  <p className="text-xs" style={{ color: "#505050" }}>Processing file…</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <GradientOutlineButton onClick={onClose} className="flex-1 py-2">
                  Cancel
                </GradientOutlineButton>
                {/* Upload & Process — red outline (only active after file selected) */}
                <RedOutlineButton onClick={handleProcess} disabled={!file || processing} className="flex-1 py-2 font-semibold">
                  <Upload className="w-3.5 h-3.5" />
                  Upload & Process
                </RedOutlineButton>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl mx-auto mb-3 ${G}`}>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: "#303030" }}>Upload Successful!</h3>
              <p className="text-xs" style={{ color: "#707070" }}>Records have been updated from the uploaded file.</p>
            </div>
          )}
        </div>
        {!done && (
          <div className="absolute top-4 right-4">
            <GradientOutlineButton onClick={onClose} className="!p-0 w-7 h-7 !rounded-full">
              <X className="w-3.5 h-3.5" />
            </GradientOutlineButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Control Master Page ───────────────────────────────────────────────────────
function ControlMasterPage({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<ExcelRow[]>(INITIAL_ROWS);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);

  const colWidths: Partial<Record<keyof ExcelRow, string>> = {
    Department: "min-w-[7rem]", "Process/Area": "min-w-[6rem]", "Control ID": "min-w-[6rem]",
    "Control Description": "min-w-[18rem]", "Test Steps": "min-w-[16rem]",
    "Evidence Required": "min-w-[13rem]", "Control Type": "min-w-[7rem]",
  };

  const handleSave = (index: number, updated: ExcelRow) => {
    const newRows = [...rows]; newRows[index] = updated; setRows(newRows); setEditingIndex(null);
  };

  const handleAddRow = (newRow: ExcelRow) => {
    setRows([...rows, newRow]);
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "#F4F5F7" }}>

      {/* ── Top Bar ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-2.5 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${G} ${GH} transition-all`}>
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-800">Control Master</h1>
              <p className="text-xs text-gray-500">{rows.length} records · {EXCEL_COLUMNS.length} columns</p>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="pr-2 flex items-center gap-2">
          <DarkRedOutlineButton onClick={() => setShowAddRow(true)} className="px-4 py-2 font-bold">
            <Plus className="w-3.5 h-3.5" />
            Add Data
          </DarkRedOutlineButton>
          <GradientOutlineButton onClick={() => setShowBulkUpload(true)} className="px-4 py-2 font-bold">
            <Upload className="w-3.5 h-3.5" />
            Bulk Upload
          </GradientOutlineButton>
        </div>
      </div>

      {/* ── Table Content ── */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="overflow-auto flex-1">
            <table className="w-full text-xs border-collapse">

              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-3 py-3.5 text-center text-xs font-semibold text-gray-700 w-10 sticky left-0 z-20 bg-gradient-to-r from-gray-50 to-gray-100"
                    style={{ borderRight: "1px solid #E5E7EB" }}
                  >
                    #
                  </th>
                  {EXCEL_COLUMNS.map((col, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap ${colWidths[col] ?? "min-w-[8rem]"}`}
                      style={{ borderRight: i < EXCEL_COLUMNS.length - 1 ? "1px solid #E5E7EB" : "none" }}
                    >
                      {col}
                    </th>
                  ))}
                  <th
                    className="px-4 py-3.5 text-center text-xs font-semibold text-gray-700 w-20 whitespace-nowrap"
                    style={{ borderLeft: "1px solid #E5E7EB" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="align-top hover:bg-gray-50 transition-colors"
                    style={{ background: ri % 2 === 0 ? "#FFFFFF" : "#F8F8F8" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#EEF0F3")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = ri % 2 === 0 ? "#FFFFFF" : "#F8F8F8")}
                  >
                    <td
                      className="px-3 py-2.5 text-center sticky left-0 z-10"
                      style={{ borderRight: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", background: "inherit" }}
                    >
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white ${G}`}>
                        {ri + 1}
                      </span>
                    </td>

                    {EXCEL_COLUMNS.map((col, ci) => (
                      <td
                        key={ci}
                        className="px-4 py-2.5 align-top"
                        style={{
                          borderRight: ci < EXCEL_COLUMNS.length - 1 ? "1px solid #E5E7EB" : "none",
                          borderBottom: "1px solid #E5E7EB",
                        }}
                      >
                        {col === "Control ID" ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] text-white ${G}`}>
                            {row[col]}
                          </span>
                        ) : col === "Department" || col === "Process/Area" ? (
                          <span className="text-xs font-medium" style={{ color: "#505050" }}>{row[col] ?? "—"}</span>
                        ) : (
                          <ExpandableCell value={row[col]} />
                        )}
                      </td>
                    ))}

                    {/* ── Edit Button — red outline ── */}
                    <td
                      className="px-4 py-2.5 text-center align-top"
                      style={{ borderLeft: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}
                    >
                      <GradientOutlineButton onClick={() => setEditingIndex(ri)} className="px-2.5 py-1.5 font-semibold">
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </GradientOutlineButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="flex-shrink-0 px-5 py-2.5 flex items-center justify-between"
            style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}
          >
            <span className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{rows.length}</span> records ·{" "}
              <span className="font-semibold text-gray-700">{EXCEL_COLUMNS.length}</span> columns
            </span>
            <span className="text-[10px] text-gray-400">Demo.xlsx · Sheet1</span>
          </div>
        </div>
      </div>

      {/* ── Popups ── */}
      {editingIndex !== null && (
        <EditRowPopup
          row={rows[editingIndex]} index={editingIndex} columns={EXCEL_COLUMNS}
          onSave={(updated) => handleSave(editingIndex, updated)}
          onClose={() => setEditingIndex(null)}
        />
      )}
      {showBulkUpload && (
        <BulkUploadPopup
          onClose={() => setShowBulkUpload(false)}
          onUpload={(newRows) => { setRows(newRows); setShowBulkUpload(false); }}
        />
      )}
      {showAddRow && (
        <AddRowPopup
          onSave={handleAddRow}
          onClose={() => setShowAddRow(false)}
        />
      )}
    </div>
  );
}

// ─── Send Confirmation Popup ───────────────────────────────────────────────────
function SendConfirmationPopup({ onClose }: SendConfirmationPopupProps) {
  const [sent, setSent] = useState(false);
  const handleSend = () => { setSent(true); setTimeout(onClose, 1800); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ background: "#FFFFFF", border: "1px solid #D0D0D0", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div className={`h-1 w-full ${G}`} />
        <div className="p-5">
          {!sent ? (
            <>
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl mx-auto mb-3 ${G}`}>
                <Send className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-center mb-1" style={{ color: "#303030" }}>Send SLA Notifications</h3>
              <p className="text-xs text-center mb-4" style={{ color: "#707070" }}>
                This will immediately dispatch alerts to all configured recipients.
              </p>
              <div className="space-y-1.5 mb-5">
                {[
                  { icon: <Bell className="w-3 h-3" />, text: "SLA reminders dispatched immediately" },
                  { icon: <Users className="w-3 h-3" />, text: "All enabled recipients will be notified" },
                  { icon: <Shield className="w-3 h-3" />, text: "Audit trail will be logged for this action" },
                  { icon: <AlertCircle className="w-3 h-3" />, text: "This action cannot be undone" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: "#F5F5F5", border: "1px solid #E8E8E8" }}>
                    <span className={`flex items-center justify-center w-5 h-5 rounded flex-shrink-0 text-white ${G}`}>{icon}</span>
                    <span className="text-xs" style={{ color: "#404040" }}>{text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <GradientOutlineButton onClick={onClose} className="flex-1 py-2">
                  Cancel
                </GradientOutlineButton>
                <button
                  onClick={handleSend}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all ${RED_G} ${RED_GH}`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Confirm & Send
                </button>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl mx-auto mb-3 ${G}`}>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: "#303030" }}>Sent Successfully!</h3>
              <p className="text-xs" style={{ color: "#707070" }}>All SLA notifications have been dispatched.</p>
            </div>
          )}
        </div>
        {!sent && (
          <div className="absolute top-4 right-4">
            <GradientOutlineButton onClick={onClose} className="!p-0 w-7 h-7 !rounded-full">
              <X className="w-3.5 h-3.5" />
            </GradientOutlineButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function SLASettings() {
  const [currentPage, setCurrentPage] = useState<"main" | "controlMaster">("main");
  const [slaMaster, setSlaMaster] = useState<SLAMasterState>({
    alertBeforeDue: 3, alertOnDue: true, alertAfterDue: 1,
    beforeDue: { controlOwner: true, approver: false },
    onDue: { controlOwner: true, approver: true },
    afterDue: { controlOwner: true, approver: true },
  });
  const [isSLAMasterOpen, setIsSLAMasterOpen] = useState(true);
  const [showSendPopup, setShowSendPopup] = useState(false);

  const slaDurations: SLADurationItem[] = [
    { label: "Testing Completion", days: 5, icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { label: "Review Turnaround",  days: 2, icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "Approval Turnaround",days: 3, icon: <Shield className="w-3.5 h-3.5" /> },
    { label: "Evidence Upload",    days: 1, icon: <Upload className="w-3.5 h-3.5" /> },
  ];

  if (currentPage === "controlMaster") return <ControlMasterPage onBack={() => setCurrentPage("main")} />;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#F4F5F7" }}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

        {/* ── Control Master Card ── */}
        <button
          type="button"
          onClick={() => setCurrentPage("controlMaster")}
          className="w-full bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:from-gray-600 group-hover:to-gray-800 transition-all ${G}`}>
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">Control Master</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Master data table · {INITIAL_ROWS.length} records · {EXCEL_COLUMNS.length} columns
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-700 transition-colors">
              <span className="text-xs font-medium hidden sm:inline">View Table</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="px-6 pb-5 flex items-center gap-2 flex-wrap">
            {EXCEL_COLUMNS.map((col) => (
              <span
                key={col}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 group-hover:bg-gray-200 transition-colors"
              >
                {col}
              </span>
            ))}
          </div>
        </button>

        {/* ── SLA Master ── */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid #D0D0D0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

          <div className="p-4 cursor-pointer flex items-center justify-between transition-colors"
            style={{ borderBottom: "1px solid #E8E8E8", background: "#F0F0F0" }}
            onClick={() => setIsSLAMasterOpen(!isSLAMasterOpen)}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${RED_G}`}>
                <Database className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: "#303030" }}>SLA Master</h2>
                <p className="text-xs mt-0.5" style={{ color: "#707070" }}>Configure SLA alert timelines and notification recipients</p>
              </div>
            </div>
            {isSLAMasterOpen
              ? <ChevronUp className="w-4 h-4" style={{ color: "#909090" }} />
              : <ChevronDown className="w-4 h-4" style={{ color: "#909090" }} />}
          </div>

          {isSLAMasterOpen && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "#A0A0A0" }}>
                  Alert Timeline & Notification Settings
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <SLATimelineCard title="Before Due Date" icon={<Clock className="w-3.5 h-3.5" />}
                    borderColor="#9CA3AF" inputValue={slaMaster.alertBeforeDue} inputLabel="days prior"
                    description="Send early reminder to assignee" config={slaMaster.beforeDue}
                    onInputChange={(v) => setSlaMaster({ ...slaMaster, alertBeforeDue: v })}
                    onToggle={(cfg) => setSlaMaster({ ...slaMaster, beforeDue: cfg })} />
                  <SLATimelineCard title="On Due Date" icon={<Calendar className="w-3.5 h-3.5" />}
                    borderColor={slaMaster.alertOnDue ? "#9CA3AF" : "#D0D0D0"}
                    description="Alert on the exact deadline day" config={slaMaster.onDue}
                    isToggle toggleChecked={slaMaster.alertOnDue}
                    onToggleChange={(v) => setSlaMaster({ ...slaMaster, alertOnDue: v })}
                    onToggle={(cfg) => setSlaMaster({ ...slaMaster, onDue: cfg })} />
                  <SLATimelineCard title="After Due Date" icon={<AlertCircle className="w-3.5 h-3.5" />}
                    borderColor="#9CA3AF" inputValue={slaMaster.alertAfterDue} inputLabel="days overdue"
                    description="Escalation reminder after overdue" config={slaMaster.afterDue}
                    onInputChange={(v) => setSlaMaster({ ...slaMaster, alertAfterDue: v })}
                    onToggle={(cfg) => setSlaMaster({ ...slaMaster, afterDue: cfg })} />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E8E8E8" }} />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "#A0A0A0" }}>SLA Durations</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {slaDurations.map((sla) => (
                    <div key={sla.label} className="p-3 rounded-xl"
                      style={{ background: "#FFFFFF", border: "1px solid #D0D0D0" }}>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-md flex-shrink-0 text-white ${G}`}>
                          {sla.icon}
                        </div>
                        <label className="text-[10px] font-semibold leading-tight" style={{ color: "#404040" }}>{sla.label}</label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input type="number" defaultValue={sla.days} min={1}
                          className="w-12 px-2 py-1 rounded-lg text-sm font-bold text-center focus:outline-none"
                          style={{ border: "1px solid #C0C0C0", background: "#FFFFFF", color: "#303030" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#6B7280")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "#C0C0C0")} />
                        <span className="text-xs" style={{ color: "#707070" }}>days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E8E8E8" }} />

              <div className="flex justify-end">
                <button onClick={() => setShowSendPopup(true)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white active:scale-95 transition-all ${RED_G} ${RED_GH}`}
                  style={{ boxShadow: "0 2px 8px rgba(220,38,38,0.3)" }}>
                  <Send className="w-3.5 h-3.5" />
                  Send Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSendPopup && <SendConfirmationPopup onClose={() => setShowSendPopup(false)} />}
    </div>
  );
}