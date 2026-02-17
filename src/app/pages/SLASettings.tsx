import { useState, useRef, useCallback } from "react";
import {
  Database, Bell, Calendar, ChevronDown, ChevronUp,
  Upload, FileSpreadsheet, X, Send, CheckCircle,
  AlertCircle, Clock, Users, Shield,
} from "lucide-react";
import * as Switch from "@radix-ui/react-switch";

// ─── Brand Color Tokens ────────────────────────────────────────────────────────
// Primary Red:     #E00010
// Bright Red:      #E02030
// Soft Red:        #E06070
// Charcoal:        #303030
// Dark Gray:       #404040
// Medium Dark:     #505050
// Light Gray:      #D0D0D0
// Very Light Gray: #E0E0E0
// Off White:       #F0F0F0
// Silver Gray:     #C0C0C0
// Medium Gray:     #B0B0B0
// Cool Gray:       #A0A0A0
// Muted Gray:      #909090
// Gray:            #707070
// Light Blue Gray: #C0D0E0
// Soft Blue Gray:  #D0D0E0
// Pale Cyan Gray:  #D0E0E0
// Muted Blue Gray: #C0D0D0

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SLAMasterState {
  alertBeforeDue: number;
  alertOnDue: boolean;
  alertAfterDue: number;
  sendToUser: boolean;
  sendToApprover: boolean;
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
  "Control Type(Manual/Automatic)": string | null;
}

interface SendConfirmationPopupProps {
  onClose: () => void;
}

declare global {
  interface Window {
    XLSX: {
      read: (data: Uint8Array, opts: { type: string }) => {
        SheetNames: string[];
        Sheets: Record<string, unknown>;
      };
      utils: {
        sheet_to_json: <T>(sheet: unknown, opts?: { defval?: string }) => T[];
      };
    };
  }
}

// ─── Hardcoded Excel Data (from Demo.xlsx) ─────────────────────────────────────
const EXCEL_COLUMNS: (keyof ExcelRow)[] = [
  "Department", "Process/Area", "Control ID",
  "Control Description", "Test Steps",
  "Evidence Required", "Control Type(Manual/Automatic)",
];

const EXCEL_ROWS: ExcelRow[] = [
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "A11-01",
    "Control Description": "TMC Control:\nThe written inventory management policies and procedures (raw materials, WIP, finished goods, and supplies and other) exist and are properly followed.\n\nTKM - Control In Place:\nActual Control in Place\nInventory Management policies exist for :\n1. Inventory valuation\n2. Inventory write off and disposal\n3. Inventory physical verification\n\nReceiving member perform according to SOP (standard operation procedure). All receiving members are trained according to SOP by group leader before he is put into that operation.",
    "Test Steps": "Check the policy is adequate and process performed as per policy\nTraining is provided to new members in the team",
    "Evidence Required": "1. Inventory Valuation Policy\n2. SOP for receipt of goods - Imports and Local parts\n3. Training Manuals and documents",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "B11-01",
    "Control Description": "TMC Control:\nThe following duties are performed by a personnel independently, and approved by the managements;\n- production planning,\n- purchase order,\n- receipt and inspection of materials,\n- recording to the inventory sub-ledger, and\n- correction of the records.\n\nTKM - Control In Place:\n1. Production Planning is done by Production planning department of PPC&I Division.\n2. Purchase Orders are raised by Purchase Division.\n3. Material is received by CLE Division.",
    "Test Steps": "A. Confirm that following activities are performed by a personnel independently, and approved by the respective managements;\n- production planning,\n- purchase order,\n- receipt and inspection of materials,\n- recording to the inventory sub-ledger, and\n- correction of the records.\n\nB. Confirm that there is no common access provided to personnel who does PO/ BPO and personnel who perform GRN creation.",
    "Evidence Required": "1. Authorization Matrix - CLED, Impex and Purchase\n2. System Generated SAP Access Rights Report\n3. Organization Chart -Purchase and CLED\n4. Production Plan\n5. Purchase Order\n6. GRN",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "B11-02",
    "Control Description": "TMC Control:\nFunctions for restricted access are installed in related inventory systems to assist segregation of duties.\n-Password is used for identification and secured by changing it periodically.\n-Input or operation result which might be used in fraudulence is output and checked.\n\nTKM - Control In Place:\n\nEach Team Member is registered as user with unique user ID and the SAP access is provided as per the job profile.",
    "Test Steps": "A. Confirm that each team member having SAP access is registered as user with specific profile and their access is secured through unique user ID and password.",
    "Evidence Required": "1. SAP Access Login Screenshot\n2. Authorization Matrix - Purchase and CLED\n3. System Generated SAP Access Rights Report\n4. Organization Chart- Purchase division, CLED and Impex",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "B11-03",
    "Control Description": "TMC Control:\nAuthority to access is registered as to be consistent with the job function and is periodically confirmed.\n\nTKM - Control In Place:\nEach Team Member is registered as separate user with unique user ID and the SAP access is provided as per the job profile, with prior approval from the Head of Department (in TOPS). The access provided would be also approved by division head through physical sign off.",
    "Test Steps": "A. Confirm that the SAP EBS access provided to each team member is as per their job profile, with prior approval form the HOD.\nB. Confirm that access provided as per job profile are reviewed periodically.",
    "Evidence Required": "1. SAP Access Login Screenshot\n2. Authorization Matrix - CLED.\n3. System Generated SAP Access Rights Report\n4. Organization Chart -Purchase, CLED and Impex",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "C11-01",
    "Control Description": "TMC Control:\nA detailed manual that instructs documentation procedures in receiving activities is in place, which includes:\n- an inventory record is prepared per receipt of goods,\n- receiving report and inventory records are timely prepared,\n- receiving report and inventory records have sufficient information,\n- receiving report and inventory records are properly approved, and\n- all transactions are recorded based on the approved receiving report and inventory records.\nAll receiving department employees understand the standard procedures and follow them.\n\nTKM - Control In Place:\nAll the items received, must be recorded in SAP using Goods Received Note (GRN). These are serially and sequentially numbered by the system automatically. There is no manual intervention in numbering GRN.",
    "Test Steps": "A. Confirm there are manual and SOP in place which provides detailed guideline over receiving activities of goods (GRN).\n\nB. Confirm that GRN are sequentially numbered.\n\nC. Confirm that in case of local parts the Invoice is reconcilied with the number of goods dispatched and GRN is created in SAP against existing PO.\n\nConfirm that in case of Import parts GRN is created in SAP against an existing PO on the basis of the Bill of Entry uploaded in SAP by the IMPEX Team after Import Duty Payment.",
    "Evidence Required": "1. SOP for receipt of GPS, Imports and Local parts\n2. Training manuals for GRN\n3. SAP Receiving Options(MFG) Screenshot\n4. Purchase Order\n5. Invoice\n6. GRN\n7. Bill Of Entry.",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "C11-02",
    "Control Description": "TMC Control:\nPolicies and procedures for accepting refunds, sending alternative and recording are designed and in operations.\n\nTKM - Control In Place:\nPolicies and procedures for accepting refunds, sending alternative and recording are designed and in operations.",
    "Test Steps": "To be tested for design adequacy",
    "Evidence Required": "1. RTV Screen shot\n2. Debit note screenshots\n3. SAP Screenshot of vendor account for debit note accounting\n4. TKM Quality Rule\n5. RTV manual and SOP\n6. QPR Report\n7. Parts rejection Acceptance form",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "D12-01",
    "Control Description": "TMC Control:\nShipping documents such as invoice are automatically output from shipping order data.\n\nTKM - Control In Place:\nSales Orders are created in SAP automatically through an Interface from SAL. Outbound delivery is automatically created and PGI is posted manually. Post PGI invoices are generated automatically.",
    "Test Steps": "A. Confirm that the shipping data from SAL system is automatically used by SAP to generate shipping data such as Tax Invoice.\nB. Confirm that the FR against orders are automatically converted into Invoice",
    "Evidence Required": "1. Screenshot of interface between SAP and SAL\n2. Fund Receipt Report Summary for Invoice\n3. Invoice\n4. PGI creation in SAP",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "D12-02",
    "Control Description": "TMC Control:\nShipment is confirmed with purchase order or shipping order data. Any deviations are explained to the dealer.\n\nTKM - Control In Place:\nFund Receipt report is used to cross check chassis number before loading.\nCustomer acknowledgement and GRN are also received.",
    "Test Steps": "A. Confirm that the shipment is confirmed with purchase order or shipping order data by using fund receipt report to cross check chassis number before loading.\nB. Confirm that signed receipts are obtained from third party carriers or truck drivers by Sr.Officer / Officer Vehicle Logistics Dept. are signed, obtained, filed as per established conventions",
    "Evidence Required": "1. Fund receipt report summary\n2. Customer Acknowledgment (New Vehicle receipt Report)\n3. Invoice\n4. Consignment Note",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "F11-01",
    "Control Description": "TMC Control:\nSlow-moving, obsolete, scrapped or damaged inventories have been adequately identified and physically segregated.\n\nTKM - Control In Place:\nCLED identifies, segregates and prepares list of items to be scrapped and it will be considered as scrap in the inventory after obtaining the necessary approval.",
    "Test Steps": "A. Confirm that PAD identifies, segregates and prepares list of items to be scrapped and the identified inventory are scrapped after obtaining the necessary approval.\n\nSince this is Annually updated, the control needs to be tested at the end of the year",
    "Evidence Required": "1. Inventory Valuation Policy\n2. Inventory write-off / Disposal approval",
    "Control Type(Manual/Automatic)": null,
  },
  {
    Department: "Corporate Governence", "Process/Area": "Inventory", "Control ID": "F11-02",
    "Control Description": "TMC Control:\nInventories at all locations are agreed with the records by performing periodic full counts.\n\nTKM - Control In Place:\nTwice a year the physical stock is taken as per Inventory policy and then based on the physical stock inventory value is calculated and reflected in books of accounts.",
    "Test Steps": "A. Confirm that physical stock count of inventories at all locations are carried out on semi annual basis.\nB. Confirmed that the book stock is replaced with physical stock on the basis of physical verification\nC. Examine whether the screenshot of financial hyperion tallies with the inventory valuation report and further verify whether the same is reflected in the books of accounts.\n\nSince this is Annually updated, the control needs to be tested at the end of the year",
    "Evidence Required": "1. Inventory Tags\n2. Inventory System valuation Report\n3. Inventory Valuation Summary\n4. Inventory Valuation Policy",
    "Control Type(Manual/Automatic)": null,
  },
];

// ─── Expandable Cell ───────────────────────────────────────────────────────────
function ExpandableCell({ value }: { value: string | null }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  if (!value) return <span style={{ color: "#B0B0B0" }} className="italic text-xs">—</span>;
  const isLong = value.length > 80 || value.split("\n").filter(Boolean).length > 2;
  if (!isLong) return <span className="text-xs whitespace-pre-line leading-relaxed" style={{ color: "#404040" }}>{value}</span>;
  return (
    <div>
      <p className={`text-xs whitespace-pre-line leading-relaxed ${expanded ? "" : "line-clamp-2"}`} style={{ color: "#404040" }}>
        {value}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-[10px] font-semibold transition-colors"
        style={{ color: "#E00010" }}
      >
        {expanded ? "Show less ▲" : "Show more ▼"}
      </button>
    </div>
  );
}

// ─── Excel Data Table ──────────────────────────────────────────────────────────
function ExcelDataTable({ columns, rows }: { columns: (keyof ExcelRow)[]; rows: ExcelRow[] }) {
  const colWidths: Partial<Record<keyof ExcelRow, string>> = {
    Department: "min-w-[7rem]",
    "Process/Area": "min-w-[6rem]",
    "Control ID": "min-w-[6rem]",
    "Control Description": "min-w-[18rem]",
    "Test Steps": "min-w-[16rem]",
    "Evidence Required": "min-w-[13rem]",
    "Control Type(Manual/Automatic)": "min-w-[7rem]",
  };

  return (
    <div className="mt-5 rounded-xl overflow-hidden" style={{ border: "1px solid #D0D0D0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th
                className="px-3 py-3 text-center font-semibold w-10 sticky left-0 z-10"
                style={{ background: "#303030", color: "#F0F0F0", borderRight: "1px solid #505050" }}
              >
                #
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-3 py-3 text-left font-semibold whitespace-nowrap ${colWidths[col] ?? "min-w-[8rem]"}`}
                  style={{
                    background: "#303030",
                    color: "#F0F0F0",
                    borderRight: i < columns.length - 1 ? "1px solid #505050" : "none",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="align-top transition-colors"
                style={{ background: ri % 2 === 0 ? "#FFFFFF" : "#F0F0F0" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = ri % 2 === 0 ? "#FFFFFF" : "#F0F0F0")}
              >
                <td
                  className="px-3 py-3 text-center sticky left-0 z-10"
                  style={{ borderRight: "1px solid #E0E0E0", borderBottom: "1px solid #E0E0E0", background: "inherit" }}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                    style={{ background: "#E0E0E0", color: "#505050" }}
                  >
                    {ri + 1}
                  </span>
                </td>
                {columns.map((col, ci) => (
                  <td
                    key={ci}
                    className="px-3 py-3 align-top"
                    style={{
                      borderRight: ci < columns.length - 1 ? "1px solid #E0E0E0" : "none",
                      borderBottom: "1px solid #E0E0E0",
                    }}
                  >
                    {col === "Control ID" ? (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px]"
                        style={{ background: "#303030", color: "#F0F0F0" }}
                      >
                        {row[col]}
                      </span>
                    ) : col === "Department" || col === "Process/Area" ? (
                      <span className="text-xs font-medium" style={{ color: "#505050" }}>{row[col] ?? "—"}</span>
                    ) : (
                      <ExpandableCell value={row[col]} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: "#F0F0F0", borderTop: "1px solid #D0D0D0" }}
      >
        <span className="text-xs" style={{ color: "#707070" }}>
          Showing <span className="font-semibold" style={{ color: "#303030" }}>{rows.length}</span> records ·{" "}
          <span className="font-semibold" style={{ color: "#303030" }}>{columns.length}</span> columns
        </span>
        <span className="text-[10px]" style={{ color: "#A0A0A0" }}>Demo.xlsx · Sheet1</span>
      </div>
    </div>
  );
}

// ─── Send Confirmation Popup ───────────────────────────────────────────────────
function SendConfirmationPopup({ onClose }: SendConfirmationPopupProps) {
  const [sent, setSent] = useState<boolean>(false);

  const handleSend = (): void => {
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ background: "#FFFFFF", border: "1px solid #D0D0D0", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: "#E00010" }} />

        <div className="p-6">
          {!sent ? (
            <>
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-4"
                style={{ background: "#F0F0F0" }}
              >
                <Send className="w-6 h-6" style={{ color: "#E00010" }} />
              </div>
              <h3 className="text-base font-bold text-center mb-1" style={{ color: "#303030" }}>
                Send SLA Notifications
              </h3>
              <p className="text-xs text-center mb-5" style={{ color: "#707070" }}>
                This will immediately dispatch alerts to all configured recipients.
              </p>

              <div className="space-y-2 mb-6">
                {[
                  { icon: <Bell className="w-3.5 h-3.5" />, text: "SLA reminders dispatched immediately" },
                  { icon: <Users className="w-3.5 h-3.5" />, text: "All enabled recipients will be notified" },
                  { icon: <Shield className="w-3.5 h-3.5" />, text: "Audit trail will be logged for this action" },
                  { icon: <AlertCircle className="w-3.5 h-3.5" />, text: "This action cannot be undone" },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    style={{ background: "#F0F0F0", border: "1px solid #E0E0E0" }}
                  >
                    <span style={{ color: "#E00010" }}>{icon}</span>
                    <span className="text-xs" style={{ color: "#404040" }}>{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                  style={{ border: "1px solid #D0D0D0", color: "#505050", background: "#FFFFFF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F0F0F0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{ background: "#E00010" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#E02030")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#E00010")}
                >
                  <Send className="w-3.5 h-3.5" />
                  Confirm & Send
                </button>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-4"
                style={{ background: "#F0F0F0" }}
              >
                <CheckCircle className="w-7 h-7" style={{ color: "#E00010" }} />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: "#303030" }}>Sent Successfully!</h3>
              <p className="text-xs" style={{ color: "#707070" }}>All SLA notifications have been dispatched.</p>
            </div>
          )}
        </div>

        {!sent && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
            style={{ background: "#F0F0F0" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F0F0F0")}
          >
            <X className="w-3.5 h-3.5" style={{ color: "#505050" }} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── On Due Date Toggle Card ───────────────────────────────────────────────────
function OnDueDateToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div
      className="p-4 rounded-xl h-full flex flex-col"
      style={{
        background: checked ? "#303030" : "#F0F0F0",
        border: `1px solid ${checked ? "#E00010" : "#D0D0D0"}`,
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ background: checked ? "#E00010" : "#E0E0E0" }}
        >
          <Calendar className="w-3.5 h-3.5" style={{ color: checked ? "#FFFFFF" : "#909090" }} />
        </div>
        <span
          className="text-xs font-semibold"
          style={{ color: checked ? "#F0F0F0" : "#404040" }}
        >
          On Due Date
        </span>
      </div>

      {/* Toggle row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Custom pill toggle */}
        <button
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className="relative flex-shrink-0 rounded-full transition-all focus:outline-none"
          style={{
            width: "44px",
            height: "24px",
            background: checked ? "#E00010" : "#C0C0C0",
            transition: "background 0.25s",
            boxShadow: checked ? "0 0 0 3px rgba(224,0,16,0.15)" : "none",
          }}
        >
          {/* Thumb */}
          <span
            className="absolute top-0.5 rounded-full bg-white flex items-center justify-center"
            style={{
              width: "20px",
              height: "20px",
              left: checked ? "calc(100% - 22px)" : "2px",
              transition: "left 0.2s cubic-bezier(.4,0,.2,1)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
            }}
          >
            <Bell
              style={{
                width: "10px",
                height: "10px",
                color: checked ? "#E00010" : "#B0B0B0",
                transition: "color 0.2s",
              }}
            />
          </span>
        </button>

        {/* Status badge */}
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
          style={{
            background: checked ? "#E00010" : "#E0E0E0",
            color: checked ? "#FFFFFF" : "#909090",
            transition: "background 0.25s, color 0.25s",
          }}
        >
          {checked ? "ENABLED" : "DISABLED"}
        </span>
      </div>

      <p
        className="text-[11px] mt-auto"
        style={{ color: checked ? "#C0C0C0" : "#909090" }}
      >
        Alert on the exact deadline day
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function SLASettings() {
  const [slaMaster, setSlaMaster] = useState<SLAMasterState>({
    alertBeforeDue: 3,
    alertOnDue: true,
    alertAfterDue: 1,
    sendToUser: true,
    sendToApprover: true,
  });

  const [isControlMasterOpen, setIsControlMasterOpen] = useState<boolean>(true);
  const [isSLAMasterOpen, setIsSLAMasterOpen] = useState<boolean>(true);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [showSendPopup, setShowSendPopup] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const slaDurations: SLADurationItem[] = [
    { label: "Testing Completion", days: 5, icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { label: "Review Turnaround", days: 2, icon: <Clock className="w-3.5 h-3.5" /> },
    { label: "Approval Turnaround", days: 3, icon: <Shield className="w-3.5 h-3.5" /> },
    { label: "Evidence Upload", days: 1, icon: <Upload className="w-3.5 h-3.5" /> },
  ];

  const processFile = useCallback((file: File): void => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setUploadError("Unsupported file type. Please upload .xlsx, .xls, or .csv.");
      return;
    }
    setUploadError("");
    setIsProcessing(true);
    setShowTable(false);
    setTimeout(() => { setIsProcessing(false); setShowTable(true); }, 900);
  }, []);

  const handleFileSelect = (file: File): void => { setUploadedFile(file); processFile(file); };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileSelect(f); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => { e.preventDefault(); setIsDragging(true); };
  const handleRemoveFile = (): void => { setUploadedFile(null); setShowTable(false); setUploadError(""); if (fileInputRef.current) fileInputRef.current.value = ""; };

  // ── Shared section header styles ─────────────────────────────────────────────
  const sectionLabel = "text-[10px] font-bold uppercase tracking-widest mb-3";

  return (
    <div className="p-4 sm:p-6 min-h-screen space-y-5" style={{ background: "#F0F0F0" }}>

      {/* ══ Control Master ═══════════════════════════════════════════════════════ */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #D0D0D0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Collapsible header */}
        <div
          className="p-5 cursor-pointer flex items-center justify-between transition-colors"
          style={{ borderBottom: "1px solid #E0E0E0", background: "#F0F0F0" }}
          onClick={() => setIsControlMasterOpen(!isControlMasterOpen)}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#F0F0F0")}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "#303030" }}>
              <FileSpreadsheet className="w-4 h-4" style={{ color: "#F0F0F0" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#303030" }}>Control Master</h2>
              <p className="text-xs mt-0.5" style={{ color: "#707070" }}>Upload an Excel file to populate the control table</p>
            </div>
          </div>
          {isControlMasterOpen
            ? <ChevronUp className="w-5 h-5" style={{ color: "#909090" }} />
            : <ChevronDown className="w-5 h-5" style={{ color: "#909090" }} />}
        </div>

        {isControlMasterOpen && (
          <div className="p-5">

            {/* Drop zone */}
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-12 px-6 cursor-pointer transition-all duration-200"
                style={{
                  borderColor: isDragging ? "#E00010" : "#C0C0C0",
                  background: isDragging ? "#F0F0F0" : "#FAFAFA",
                  transform: isDragging ? "scale(1.005)" : "scale(1)",
                }}
                onMouseEnter={(e) => { if (!isDragging) e.currentTarget.style.borderColor = "#909090"; }}
                onMouseLeave={(e) => { if (!isDragging) e.currentTarget.style.borderColor = "#C0C0C0"; }}
              >
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl"
                  style={{ background: "#F0F0F0" }}
                >
                  <Upload className="w-7 h-7" style={{ color: isDragging ? "#E00010" : "#707070" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: "#303030" }}>Drop your Excel file here</p>
                  <p className="text-xs mt-1" style={{ color: "#707070" }}>
                    or{" "}
                    <span className="font-semibold underline underline-offset-2" style={{ color: "#E00010" }}>
                      browse to upload
                    </span>
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {[".xlsx", ".xls", ".csv"].map((ext) => (
                      <span key={ext} className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ background: "#E0E0E0", color: "#505050" }}>
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleInputChange} className="hidden" />
              </div>
            ) : (
              /* File info pill */
              <div
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                style={{ background: "#F0F0F0", border: "1px solid #D0D0D0" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0" style={{ background: "#303030" }}>
                    <FileSpreadsheet className="w-4 h-4" style={{ color: "#F0F0F0" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: "#303030" }}>{uploadedFile.name}</p>
                    <p className="text-xs" style={{ color: "#707070" }}>
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                      {showTable && (
                        <span className="ml-1.5 font-medium" style={{ color: "#E00010" }}>
                          · {EXCEL_COLUMNS.length} columns · {EXCEL_ROWS.length} rows loaded
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-colors flex-shrink-0"
                  style={{ background: "#FFFFFF", border: "1px solid #D0D0D0" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#E00010"; (e.currentTarget.querySelector("svg") as SVGElement)?.setAttribute("color", "#FFFFFF"); }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; (e.currentTarget.querySelector("svg") as SVGElement)?.setAttribute("color", "#505050"); }}
                >
                  <X className="w-3.5 h-3.5" style={{ color: "#505050" }} />
                </button>
              </div>
            )}

            {/* Error */}
            {uploadError && (
              <div className="mt-3 flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: "#FFF0F0", border: "1px solid #E06070" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#E00010" }} />
                <p className="text-xs" style={{ color: "#E00010" }}>{uploadError}</p>
              </div>
            )}

            {/* Processing */}
            {isProcessing && (
              <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "#F0F0F0", border: "1px solid #D0D0D0" }}>
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin flex-shrink-0" style={{ borderColor: "#E00010", borderTopColor: "transparent" }} />
                <p className="text-xs font-medium" style={{ color: "#505050" }}>Parsing file and extracting columns…</p>
              </div>
            )}

            {/* Table */}
            {showTable && !isProcessing && (
              <ExcelDataTable columns={EXCEL_COLUMNS} rows={EXCEL_ROWS} />
            )}
          </div>
        )}
      </div>

      {/* ══ SLA Master ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #D0D0D0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Collapsible header */}
        <div
          className="p-5 cursor-pointer flex items-center justify-between transition-colors"
          style={{ borderBottom: "1px solid #E0E0E0", background: "#F0F0F0" }}
          onClick={() => setIsSLAMasterOpen(!isSLAMasterOpen)}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#F0F0F0")}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "#E00010" }}>
              <Database className="w-4 h-4" style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#303030" }}>SLA Master</h2>
              <p className="text-xs mt-0.5" style={{ color: "#707070" }}>Configure service level agreement and alert settings</p>
            </div>
          </div>
          {isSLAMasterOpen
            ? <ChevronUp className="w-5 h-5" style={{ color: "#909090" }} />
            : <ChevronDown className="w-5 h-5" style={{ color: "#909090" }} />}
        </div>

        {isSLAMasterOpen && (
          <div className="p-5 space-y-6">

            {/* ── Alert Timeline ──────────────────────────────────────────────── */}
            <div>
              <p className={sectionLabel} style={{ color: "#A0A0A0" }}>Alert Timeline</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                {/* Before Due */}
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "#F0F0F0", border: "1px solid #D0D0D0" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "#E0E0E0" }}>
                      <Clock className="w-3.5 h-3.5" style={{ color: "#505050" }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "#404040" }}>Before Due Date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={slaMaster.alertBeforeDue}
                      min={0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSlaMaster({ ...slaMaster, alertBeforeDue: parseInt(e.target.value) || 0 })
                      }
                      className="w-20 px-3 py-2 rounded-lg text-sm font-bold text-center focus:outline-none"
                      style={{
                        border: "1px solid #C0C0C0",
                        background: "#FFFFFF",
                        color: "#303030",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#E00010")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#C0C0C0")}
                    />
                    <span className="text-xs font-medium" style={{ color: "#707070" }}>days prior</span>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "#909090" }}>Send early reminder to assignee</p>
                </div>

                {/* On Due Date — improved toggle card */}
                <OnDueDateToggle
                  checked={slaMaster.alertOnDue}
                  onChange={(val) => setSlaMaster({ ...slaMaster, alertOnDue: val })}
                />

                {/* After Due */}
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "#F0F0F0", border: "1px solid #D0D0D0" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "#E0E0E0" }}>
                      <AlertCircle className="w-3.5 h-3.5" style={{ color: "#505050" }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "#404040" }}>After Due Date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={slaMaster.alertAfterDue}
                      min={0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSlaMaster({ ...slaMaster, alertAfterDue: parseInt(e.target.value) || 0 })
                      }
                      className="w-20 px-3 py-2 rounded-lg text-sm font-bold text-center focus:outline-none"
                      style={{
                        border: "1px solid #C0C0C0",
                        background: "#FFFFFF",
                        color: "#303030",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#E00010")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#C0C0C0")}
                    />
                    <span className="text-xs font-medium" style={{ color: "#707070" }}>days overdue</span>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "#909090" }}>Escalation reminder after overdue</p>
                </div>

              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #E0E0E0" }} />

            {/* ── Notification Recipients ─────────────────────────────────────── */}
            <div>
              <p className={sectionLabel} style={{ color: "#A0A0A0" }}>Notification Recipients</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Control Owner */}
                <div
                  className="flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{ background: "#FFFFFF", border: `2px solid ${slaMaster.sendToUser ? "#303030" : "#E0E0E0"}` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ background: slaMaster.sendToUser ? "#303030" : "#E0E0E0" }}
                    >
                      <Users className="w-4 h-4" style={{ color: slaMaster.sendToUser ? "#F0F0F0" : "#909090" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#303030" }}>Control Owner</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#909090" }}>Notify the assigned user</p>
                    </div>
                  </div>
                  <Switch.Root
                    checked={slaMaster.sendToUser}
                    onCheckedChange={(checked: boolean) => setSlaMaster({ ...slaMaster, sendToUser: checked })}
                    className="w-11 h-6 rounded-full cursor-pointer flex-shrink-0 transition-all focus:outline-none"
                    style={{ background: slaMaster.sendToUser ? "#303030" : "#C0C0C0" }}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform transform data-[state=checked]:translate-x-5 translate-x-0.5 shadow-md" />
                  </Switch.Root>
                </div>

                {/* Approver */}
                <div
                  className="flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{ background: "#FFFFFF", border: `2px solid ${slaMaster.sendToApprover ? "#E00010" : "#E0E0E0"}` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ background: slaMaster.sendToApprover ? "#E00010" : "#E0E0E0" }}
                    >
                      <Shield className="w-4 h-4" style={{ color: slaMaster.sendToApprover ? "#FFFFFF" : "#909090" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#303030" }}>Approver</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#909090" }}>Escalate to approvers</p>
                    </div>
                  </div>
                  <Switch.Root
                    checked={slaMaster.sendToApprover}
                    onCheckedChange={(checked: boolean) => setSlaMaster({ ...slaMaster, sendToApprover: checked })}
                    className="w-11 h-6 rounded-full cursor-pointer flex-shrink-0 transition-all focus:outline-none"
                    style={{ background: slaMaster.sendToApprover ? "#E00010" : "#C0C0C0" }}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform transform data-[state=checked]:translate-x-5 translate-x-0.5 shadow-md" />
                  </Switch.Root>
                </div>

              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #E0E0E0" }} />

            {/* ── SLA Durations ───────────────────────────────────────────────── */}
            <div>
              <p className={sectionLabel} style={{ color: "#A0A0A0" }}>SLA Durations</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {slaDurations.map((sla, i) => (
                  <div
                    key={sla.label}
                    className="p-4 rounded-xl"
                    style={{
                      background: "#F0F0F0",
                      border: "1px solid #D0D0D0",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0"
                        style={{ background: i === 0 ? "#303030" : i === 1 ? "#404040" : i === 2 ? "#E00010" : "#505050" }}
                      >
                        <span style={{ color: "#FFFFFF" }}>{sla.icon}</span>
                      </div>
                      <label className="text-[11px] font-semibold leading-tight" style={{ color: "#404040" }}>
                        {sla.label}
                      </label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        defaultValue={sla.days}
                        min={1}
                        className="w-14 px-2 py-1.5 rounded-lg text-sm font-bold text-center focus:outline-none"
                        style={{ border: "1px solid #C0C0C0", background: "#FFFFFF", color: "#303030" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#E00010")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#C0C0C0")}
                      />
                      <span className="text-xs" style={{ color: "#707070" }}>days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #E0E0E0" }} />

            {/* ── Send button ─────────────────────────────────────────────────── */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowSendPopup(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                style={{ background: "#E00010", boxShadow: "0 2px 8px rgba(224,0,16,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E02030")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#E00010")}
              >
                <Send className="w-3.5 h-3.5" />
                Send Notifications
              </button>
            </div>

          </div>
        )}
      </div>

      {showSendPopup && <SendConfirmationPopup onClose={() => setShowSendPopup(false)} />}
    </div>
  );
}