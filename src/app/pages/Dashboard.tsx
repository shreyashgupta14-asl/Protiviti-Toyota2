import { useState } from "react";
import { useNavigate } from "react-router";
import { Filter, Search } from "lucide-react";

type ControlType = "Manual" | "Automatic" | null;

interface Control {
  id: string;
  serialNo: number;
  department: string;
  process: string;
  controlId: string;
  controlDescription: string;
  testSteps: string;
  evidenceRequired: string;
  controlType: ControlType;
}

export function Dashboard() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    domain: "All",
    process: "All",
    subProcess: "All",
    outcome: "All",
    period: "All",
  });

  const [controls, setControls] = useState<Control[]>([
    {
      id: "001",
      serialNo: 1,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "A11-01",
      controlDescription:
        "TMC Control:\nThe written inventory management policies and procedures (raw materials, WIP, finished goods, and supplies and other) exist and are properly followed.\n\nTKM - Control In Place:\nActual Control in Place\nInventory Management policies exist for :\n1. Inventory valuation\n2. Inventory write off and disposal\n3. Inventory physical verification\n\nReceiving member perform according to SOP (standard operation procedure). All receiving members are trained according to SOP by group leader before he is put into that operation.",
      testSteps:
        "Check the policy is adequate and process performed as per policy\nTraining is provided to new members in the team",
      evidenceRequired:
        "1. Inventory Valuation Policy\n2. SOP for receipt of goods - Imports and Local parts\n3. Training Manuals and documents",
      controlType: null,
    },
    {
      id: "002",
      serialNo: 2,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "B11-01",
      controlDescription:
        "TMC Control:\nThe following duties are performed by a personnel independently, and approved by the managements;\n- production planning,\n- purchase order,\n- receipt and inspection of materials,\n- recording to the inventory sub-ledger, and\n- correction of the records.\n\nTKM - Control In Place:\n1. Production Planning is done by Production planning department of PPC&I Division.\n2. Purchase Orders are raised by Purchase Division.\n3. Material is received by CLE Division.",
      testSteps:
        "A. Confirm that following activities are performed by a personnel independently, and approved by the respective managements;\n- production planning,\n- purchase order,\n- receipt and inspection of materials,\n- recording to the inventory sub-ledger, and\n- correction of the records.\n\nB. Confirm that there is no common access provided to personnel who does PO/ BPO and personnel who perform GRN creation.",
      evidenceRequired:
        "1. Authorization Matrix - CLED, Impex and Purchase\n2. System Generated SAP Access Rights Report\n3. Organization Chart -Purchase and CLED\n4. Production Plan\n5. Purchase Order\n6. GRN",
      controlType: null,
    },
    {
      id: "003",
      serialNo: 3,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "B11-02",
      controlDescription:
        "TMC Control:\nFunctions for restricted access are installed in related inventory systems to assist segregation of duties.\n-Password is used for identification and secured by changing it periodically.\n-Input or operation result which might be used in fraudulence is output and checked.\n\nTKM - Control In Place:\n\nEach Team Member is registered as user with unique user ID and the SAP access is provided as per the job profile.",
      testSteps:
        "A. Confirm that each team member having SAP access is registered as user with specific profile and their access is secured through unique user ID and password.",
      evidenceRequired:
        "1. SAP Access Login Screenshot\n2. Authorization Matrix - Purchase and CLED\n3. System Generated SAP Access Rights Report\n4. Organization Chart- Purchase division, CLED and Impex",
      controlType: null,
    },
    {
      id: "004",
      serialNo: 4,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "B11-03",
      controlDescription:
        "TMC Control:\nAuthority to access is registered as to be consistent with the job role and responsibility of the relevant personnel.\n\nTKM - Control In Place:\nSAP access is provided as per the job profile based on authorization matrix.",
      testSteps:
        "A. Confirm that the SAP EBS access provided to each team member is as per their job profile based on authorization matrix.",
      evidenceRequired:
        "1. SAP Access Login Screenshot\n2. Authorization Matrix - CLED.\n3. System Generated SAP Access Rights Report\n4. Organization Chart- CLED",
      controlType: null,
    },
    {
      id: "005",
      serialNo: 5,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "C11-01",
      controlDescription:
        "TMC Control:\nA detailed manual that instructs documentation procedures in receiving is maintained, and procedures are carried out according to the manual.\n\nTKM - Control In Place:\nSOP and training manuals exist for GRN creation for GPS, Imports and Local parts.",
      testSteps:
        "A. Confirm there are manual and SOP in place which provides detailed guideline on receiving and documentation procedures.",
      evidenceRequired:
        "1. SOP for receipt of GPS, Imports and Local parts\n2. Training manuals for GRN 3. Training Records",
      controlType: null,
    },
    {
      id: "006",
      serialNo: 6,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "C11-02",
      controlDescription:
        "TMC Control:\nPolicies and procedures for accepting refunds, sending alternative goods or issuing a credit note are established and followed.\n\nTKM - Control In Place:\nReturn to vendor (RTV) procedure is in place.",
      testSteps: "To be tested for design adequacy",
      evidenceRequired:
        "1. RTV Screen shot\n2. Debit note screenshots\n3. SAP Screenshot of vendor account",
      controlType: null,
    },
    {
      id: "007",
      serialNo: 7,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "D12-01",
      controlDescription:
        "TMC Control:\nShipping documents such as invoice are automatically output from shipping system (SAL system), which are linked to the accounting system (SAP).\n\nTKM - Control In Place:\nSAL and SAP are integrated. Vehicle dispatch data from SAL is used by SAP to automatically create AR invoices.",
      testSteps:
        "A. Confirm that the shipping data from SAL system is automatically used by SAP to create AR invoice.",
      evidenceRequired:
        "1. Screenshot of interface between SAP and SAL\n2. Fund Receipt Report Summary for the period",
      controlType: null,
    },
    {
      id: "008",
      serialNo: 8,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "D12-02",
      controlDescription:
        "TMC Control:\nShipment is confirmed with purchase order or shipping order data. Approved shipping data is automatically transferred to shipping system.\n\nTKM - Control In Place:\nVehicle receipt at dealer end is confirmed through system (New Vehicle Receipt Report - NVRR).",
      testSteps:
        "A. Confirm that the shipment is confirmed with purchase order or shipping order data.",
      evidenceRequired:
        "1. Fund receipt report summary\n2. Customer Acknowledgment (New Vehicle receipt Report - NVRR)",
      controlType: null,
    },
    {
      id: "009",
      serialNo: 9,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "F11-01",
      controlDescription:
        "TMC Control:\nSlow-moving, obsolete, scrapped or damaged inventories have been adequately identified, valued and disclosed in financial statements.\n\nTKM - Control In Place:\nPAD identifies and segregates the scrap material and Inventory write-off policy exists.",
      testSteps:
        "A. Confirm that PAD identifies, segregates and prepares list of items to be scrapped and the disposal is approved by management.",
      evidenceRequired:
        "1.Inventory Valuation Policy\n2. Inventory write-off / Disposal approval",
      controlType: null,
    },
    {
      id: "010",
      serialNo: 10,
      department: "Corporate Governence",
      process: "Inventory",
      controlId: "F11-02",
      controlDescription:
        "TMC Control:\nInventories at all locations are agreed with the records by performing physical count.\n\nTKM - Control In Place:\nPhysical stock count is performed on a periodic basis.",
      testSteps:
        "A. Confirm that physical stock count of inventories at all locations are carried out periodically.",
      evidenceRequired:
        "1.Inventory Tags\n2.Inventory System valuation Report\n3.Inventory Valuation Summary",
      controlType: null,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Toggles the control type AND navigates to detail with the updated state
  const handleControlTypeToggle = (
    id: string,
    type: ControlType,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setControls((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? { ...c, controlType: c.controlType === type ? null : type }
          : c
      );

      // Navigate with the already-updated control so detail page sees the new controlType
      const updatedControl = updated.find((c) => c.id === id);
      if (updatedControl) {
        navigate(`/control/${id}`, { state: { control: updatedControl } });
      }

      return updated;
    });
  };

  const filteredControls = controls.filter((control) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      control.controlId.toLowerCase().includes(q) ||
      control.controlDescription.toLowerCase().includes(q) ||
      control.process.toLowerCase().includes(q) ||
      control.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-screen overflow-hidden flex flex-col p-4 sm:p-5 gap-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Domain
            </label>
            <select
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
            >
              <option>All</option>
              <option>IT</option>
              <option>Finance</option>
              <option>Operations</option>
              <option>Compliance</option>
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Process
            </label>
            <select
              value={filters.process}
              onChange={(e) => setFilters({ ...filters, process: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
            >
              <option>All</option>
              <option>IT Security</option>
              <option>Finance</option>
              <option>Procurement</option>
              <option>IT Operations</option>
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Sub-Process
            </label>
            <select
              value={filters.subProcess}
              onChange={(e) =>
                setFilters({ ...filters, subProcess: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
            >
              <option>All</option>
              <option>Access Management</option>
              <option>Financial Reporting</option>
              <option>Vendor Management</option>
              <option>Data Management</option>
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Outcome
            </label>
            <select
              value={filters.outcome}
              onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
            >
              <option>All</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Not Started</option>
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Period
            </label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
            >
              <option>All</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg">
              Submit
            </button>
            <button
              onClick={() =>
                setFilters({
                  domain: "All",
                  process: "All",
                  subProcess: "All",
                  outcome: "All",
                  period: "All",
                })
              }
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Controls Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col flex-1 min-h-0">
        <div className="p-5 rounded-t-xl border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Controls</h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {filteredControls.length} total controls
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto flex-1 min-h-0 rounded-xl">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-12">
                  Sr. No
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-32">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-24">
                  Process / Area
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-24">
                  Control ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">
                  Control Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">
                  Test Steps
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">
                  Evidence Required
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-44">
                  Control Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredControls.map((control, index) => {
                const assignedType: ControlType =
                  index % 2 === 0 ? "Manual" : "Automatic";

                return (
                  <tr
                    key={control.id}
                    className="hover:bg-gradient-to-r hover:from-red-50/50 hover:to-orange-50/50 transition-all align-top"
                  >
                    {/* Sr. No */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 font-medium">
                        {control.serialNo}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-700">
                        {control.department}
                      </span>
                    </td>

                    {/* Process / Area */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-700">
                        {control.process}
                      </span>
                    </td>

                    {/* Control ID */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-gray-800">
                        {control.controlId}
                      </span>
                    </td>

                    {/* Control Description */}
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-xs text-gray-700 whitespace-pre-line line-clamp-4">
                        {control.controlDescription}
                      </span>
                    </td>

                    {/* Test Steps */}
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-xs text-gray-700 whitespace-pre-line line-clamp-4">
                        {control.testSteps}
                      </span>
                    </td>

                    {/* Evidence Required */}
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-xs text-gray-700 whitespace-pre-line line-clamp-4">
                        {control.evidenceRequired}
                      </span>
                    </td>

                    {/* Control Type */}
                    <td className="px-4 py-3">
                      {assignedType === "Manual" ? (
                        <button
                          onClick={(e) =>
                            handleControlTypeToggle(control.id, "Manual", e)
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-sm bg-gradient-to-r from-red-600 to-red-500 text-white border-red-600${
                            control.controlType === "Manual"
                              ? "bg-gradient-to-r from-red-600 to-red-500 text-white border-red-600 shadow-md"
                              : ""
                          }`}
                        >
                          Manual
                        </button>
                      ) : (
                        <button
                          onClick={(e) =>
                            handleControlTypeToggle(control.id, "Automatic", e)
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-sm bg-gray-700  text-white shadow-md${
                            control.controlType === "Automatic"
                              ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white border-orange-500 shadow-md"
                              : ""
                          }`}
                        >
                          Automatic
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}