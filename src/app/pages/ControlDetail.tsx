import { useState } from "react";
import { useParams, Link, useLocation } from "react-router";
import {
  ArrowLeft,
  Save,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  ListChecks,
  AlertCircle,
  Info,
  TrendingUp,
  Calculator,
  ChevronDown,
  ChevronUp,
  Send,
  Calendar,
  Target,
  FileText,
  ClipboardList,
  Sparkles,
  Shield,
  User,
  Mail,
  X,
  FileEdit,
  History,
  HelpCircle,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

interface AuditChange {
  field: string;
  oldValue: string;
  newValue: string;
}

interface AuditEntry {
  id: number;
  date: string;
  time: string;
  user: string;
  email: string;
  role: string;
  action: string;
  description: string;
  changes: AuditChange[];
  ipAddress: string;
  status: string;
}

// Matches the Control interface from Dashboard
interface Control {
  id: string;
  serialNo: number;
  department: string;
  process: string;
  controlId: string;
  controlDescription: string;
  testSteps: string;
  evidenceRequired: string;
  controlType: "Manual" | "Automatic" | null;
}

// Tab definition type
interface TabDefinition {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function ControlDetail() {
  const { id } = useParams();
  const location = useLocation();

  // Pull the control row passed via router state (may be undefined if navigated directly)
  const control = (location.state as { control?: Control } | null)?.control ?? null;

  // Determine tabs based on controlType
  const manualTabs: TabDefinition[] = [
    { value: "manual-testing", label: "Testing", icon: ListChecks },
    { value: "evidence-upload", label: "Evidence" },
    { value: "outcome", label: "Outcome" },
    { value: "approval", label: "Approval" },
    { value: "logs", label: "Logs" },
  ];

  const automaticTabs: TabDefinition[] = [
    { value: "manual-testing", label: "Testing", icon: ListChecks },
    { value: "evidence-upload", label: "Evidence" },
    { value: "analytics", label: "Analytics" },
    { value: "outcome", label: "Outcome" },
    { value: "exception-1", label: "Exception 1" },
    { value: "exception-2", label: "Exception 2" },
    { value: "exception-3", label: "Exception 3" },
    { value: "approval", label: "Approval" },
    { value: "logs", label: "Logs" },
  ];

  // If controlType is Automatic show all tabs, otherwise (Manual or null) show manual tabs
  const activeTabs: TabDefinition[] =
    control?.controlType === "Automatic" ? automaticTabs : manualTabs;

  const [activeTab, setActiveTab] = useState("manual-testing");
  const [showControlInfo, setShowControlInfo] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<AuditEntry | null>(null);
  const [testData, setTestData] = useState({
    populationCount: "",
    sampleCount: "",
    passCount: "",
    failCount: "",
    passPercentage: "0.0",
    retestRequired: "No",
    failureRate: "0.0",
    netResult: "N/A",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Mock audit data with detailed information
  const auditEntries: AuditEntry[] = [
    {
      id: 1,
      date: "Feb 5, 2026",
      time: "14:32 PM",
      user: "John Smith",
      email: "john.smith@company.com",
      role: "Control Tester",
      action: "Updated test data",
      description: "Modified population count from 1,200 to 1,250 and updated test results accordingly.",
      changes: [
        { field: "Population Count", oldValue: "1,200", newValue: "1,250" },
        { field: "Pass Count", oldValue: "115", newValue: "118" },
        { field: "Fail Count", oldValue: "10", newValue: "7" },
      ],
      ipAddress: "192.168.1.45",
      status: "Completed",
    },
    {
      id: 2,
      date: "Feb 3, 2026",
      time: "09:15 AM",
      user: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Control Owner",
      action: "Submitted for L2 approval",
      description: "Submitted control testing results to Level 2 approver for review and approval.",
      changes: [
        { field: "Approval Status", oldValue: "Draft", newValue: "L2 Pending" },
        { field: "Submitted By", oldValue: "-", newValue: "Sarah Johnson" },
      ],
      ipAddress: "192.168.1.78",
      status: "Completed",
    },
    {
      id: 3,
      date: "Feb 1, 2026",
      time: "16:45 PM",
      user: "Mike Wilson",
      email: "mike.wilson@company.com",
      role: "Compliance Analyst",
      action: "Uploaded evidence",
      description: "Uploaded 3 evidence documents including access control matrix and approval emails.",
      changes: [
        { field: "Evidence Files", oldValue: "0 files", newValue: "3 files" },
        { field: "Document Status", oldValue: "Incomplete", newValue: "Complete" },
      ],
      ipAddress: "192.168.1.92",
      status: "Completed",
    },
  ];

  // Validation
  const validateField = (name: string, value: string): string => {
    if (!value) return "";

    const numValue = parseInt(value) || 0;
    const populationNum = parseInt(testData.populationCount) || 0;
    const sampleNum = parseInt(testData.sampleCount) || 0;
    const passNum = name === "passCount" ? numValue : parseInt(testData.passCount) || 0;
    const failNum = name === "failCount" ? numValue : parseInt(testData.failCount) || 0;

    switch (name) {
      case "populationCount":
        if (numValue <= 0) return "Population must be greater than 0";
        if (sampleNum > 0 && numValue < sampleNum) return "Population must be greater than or equal to sample size";
        break;
      case "sampleCount":
        if (numValue <= 0) return "Sample size must be greater than 0";
        if (populationNum > 0 && numValue > populationNum) return "Sample size cannot exceed population";
        break;
      case "passCount":
        if (numValue < 0) return "Pass count cannot be negative";
        if (sampleNum > 0 && passNum + failNum > sampleNum) return "Pass + Fail cannot exceed sample size";
        break;
      case "failCount":
        if (numValue < 0) return "Fail count cannot be negative";
        if (sampleNum > 0 && passNum + failNum > sampleNum) return "Pass + Fail cannot exceed sample size";
        break;
    }
    return "";
  };

  const calculatePassPercentage = (pass: string, sample: string): string => {
    const passNum = parseInt(pass) || 0;
    const sampleNum = parseInt(sample) || 0;
    if (sampleNum === 0) return "0.0";
    return ((passNum / sampleNum) * 100).toFixed(1);
  };

  const calculateFailureRate = (fail: string, sample: string): string => {
    const failNum = parseInt(fail) || 0;
    const sampleNum = parseInt(sample) || 0;
    if (sampleNum === 0) return "0.0";
    return ((failNum / sampleNum) * 100).toFixed(1);
  };

  const handleInputChange = (name: string, value: string): void => {
    // Only allow digits
    if (value && !/^\d*$/.test(value)) return;

    let newData = { ...testData, [name]: value };

    // Recalculate metrics
    if (newData.passCount && newData.sampleCount) {
      newData.passPercentage = calculatePassPercentage(
        newData.passCount,
        newData.sampleCount
      );
    }

    if (newData.failCount && newData.sampleCount) {
      newData.failureRate = calculateFailureRate(
        newData.failCount,
        newData.sampleCount
      );
    }

    // Calculate final result
    const failRate = parseFloat(newData.failureRate);
    if (newData.sampleCount && (newData.passCount || newData.failCount)) {
      newData.netResult = failRate <= 5 ? "Pass" : "Fail";
      newData.retestRequired = failRate > 0 && failRate <= 5 ? "Yes" : failRate > 5 ? "Yes" : "No";
    } else {
      newData.netResult = "N/A";
      newData.retestRequired = "No";
    }

    setTestData(newData);

    // Validate
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleBlur = (name: string): void => {
    setTouched({ ...touched, [name]: true });

    // Validate all related fields when one is blurred
    const newErrors = { ...errors };
    if (name === "populationCount" || name === "sampleCount") {
      newErrors.populationCount = validateField("populationCount", testData.populationCount);
      newErrors.sampleCount = validateField("sampleCount", testData.sampleCount);
    }
    if (name === "passCount" || name === "failCount" || name === "sampleCount") {
      newErrors.passCount = validateField("passCount", testData.passCount);
      newErrors.failCount = validateField("failCount", testData.failCount);
    }
    setErrors(newErrors);
  };

  const isFormValid: boolean =
    !!testData.populationCount &&
    !!testData.sampleCount &&
    testData.passCount !== "" &&
    testData.failCount !== "" &&
    Object.values(errors).every((e) => !e);

  const filledFields: number = [
    testData.populationCount,
    testData.sampleCount,
    testData.passCount !== "",
    testData.failCount !== "",
  ].filter(Boolean).length;

  return (
    // ── Outermost shell: full viewport, no overflow ──────────────────────────
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">

      {/* ── Fixed Header ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm h-16">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Control {control ? control.controlId : `P-${id}`}
              </h1>
              <p className="text-xs text-gray-500">CTL-2026-{id}</p>
            </div>
          </div>
          <button className="px-6 py-3 mt-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* ── Scrollable Body ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 space-y-3">

          {/* ── Control Info Section ───────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Premium Header with Gradient */}
            <button
              onClick={() => setShowControlInfo(!showControlInfo)}
              className="w-full bg-gradient-to-br from-red-600 to-red-800 px-5 py-3.5 text-white flex items-center justify-between transition-all group relative overflow-hidden"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    Control Information
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </h2>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Compliance & Security Overview
                  </p>
                </div>
              </div>
              <div className="relative z-10">
                {showControlInfo ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {showControlInfo && (
              <div className="p-5 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {/* Control ID Card */}
                  <div className="bg-white rounded-lg p-3 border-l-4 border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <FileText className="w-3.5 h-3.5 text-gray-700" />
                      </div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Control ID
                      </label>
                    </div>
                    <p className="text-sm font-bold text-gray-700 ml-7">
                      {control ? control.controlId : `P-${id}`}
                    </p>
                  </div>

                  {/* Department Card */}
                  <div className="bg-white rounded-lg p-3 border-l-4 border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <Calendar className="w-3.5 h-3.5 text-gray-700" />
                      </div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Department
                      </label>
                    </div>
                    <p className="text-sm font-bold text-gray-700 ml-7">
                      {control ? control.department : "—"}
                    </p>
                  </div>

                  {/* Process / Area Card */}
                  <div className="bg-white rounded-lg p-3 border-l-4 border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <Target className="w-3.5 h-3.5 text-gray-700" />
                      </div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Process / Area
                      </label>
                    </div>
                    <p className="text-sm font-bold text-gray-700 ml-7">
                      {control ? control.process : "—"}
                    </p>
                  </div>

                  {/* Control Type Card */}
                  <div className="bg-white rounded-lg p-3 border-l-4 border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <Shield className="w-3.5 h-3.5 text-gray-700" />
                      </div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Control Type
                      </label>
                    </div>
                    <p className="text-sm font-bold text-gray-700 ml-7">
                      {control?.controlType ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Control Description Card with Internal Scroll */}
                  <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileCheck className="w-4 h-4 text-gray-700" />
                      </div>
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Control Description
                      </label>
                    </div>
                    <div className="pl-10">
                      <div className="max-h-24 overflow-y-auto pr-1">
                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                          {control
                            ? control.controlDescription
                            : "Review and validate user access permissions for critical systems on a quarterly basis to ensure compliance with security policies and regulatory requirements."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Test Steps Card with Internal Scroll */}
                  <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <ClipboardList className="w-4 h-4 text-gray-700" />
                      </div>
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Test Steps
                      </label>
                    </div>
                    <div className="pl-10">
                      <div className="max-h-24 overflow-y-auto pr-1">
                        {control ? (
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                            {control.testSteps}
                          </p>
                        ) : (
                          <ol className="text-xs text-gray-700 space-y-1.5">
                            {[
                              "Extract user access list from system",
                              "Select random sample based on population size",
                              "Verify against authorization matrix",
                              "Document exceptions and follow up",
                              "Obtain management approval",
                            ].map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-700 text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="flex-1">{step}</span>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Required with Bullet Points and Internal Scroll */}
                {control && (
                  <div className="mt-4 bg-white rounded-xl p-4 shadow-md border-l-4 border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-700" />
                      </div>
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Evidence Required
                      </label>
                    </div>
                    <div className="pl-10">
                      <div className="max-h-20 overflow-y-auto pr-1">
                        <ul className="text-xs text-gray-700 leading-relaxed space-y-1.5 list-disc list-inside">
                          {control.evidenceRequired.split('\n').filter(line => line.trim()).map((item, idx) => (
                            <li key={idx} className="pl-1">{item.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Important Instructions Banner */}
                <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-3 shadow-sm">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Info className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-amber-900 mb-1">
                        📌 Important Instructions
                      </p>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Ensure all testing is completed within{" "}
                        <span className="font-semibold bg-amber-200 px-1 rounded">
                          5 business days
                        </span>{" "}
                        of quarter end. Upload all supporting evidence to the
                        Evidence Upload tab before final submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Tabs Section ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Tabs.Root
              value={activeTab}
              onValueChange={(val) => {
                if (activeTabs.some((t) => t.value === val)) {
                  setActiveTab(val);
                }
              }}
            >
              {/* Tab List */}
              <Tabs.List className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto flex-shrink-0">
                {activeTabs.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
                  >
                    {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {/* ── Manual Testing Tab ──────────────────────────────────────── */}
              <Tabs.Content value="manual-testing">
                {/* Internal scroll container for the tab body */}
                <div className="overflow-y-auto max-h-[calc(100vh-20rem)] p-6">
                  <div className="max-w-4xl mx-auto space-y-6">

                    {/* Step 1: Define Test Scope */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Define Test Scope</h3>
                          <p className="text-xs text-gray-600">Enter the total population and sample size for testing</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pl-11">
                        {/* Population Count */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                            Total Population Count
                            <span className="text-red-500">*</span>
                            <button
                              type="button"
                              className="group relative"
                              title="Total number of items in the entire population"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-blue-600" />
                            </button>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={testData.populationCount}
                            onChange={(e) => handleInputChange("populationCount", e.target.value)}
                            onBlur={() => handleBlur("populationCount")}
                            placeholder="e.g., 1250"
                            className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg transition-all ${
                              touched.populationCount && errors.populationCount
                                ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                                : testData.populationCount && !errors.populationCount
                                ? "border-green-500 bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                : "border-gray-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            } focus:outline-none`}
                          />
                          {touched.populationCount && errors.populationCount && (
                            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{errors.populationCount}</span>
                            </div>
                          )}
                          {testData.populationCount && !errors.populationCount && (
                            <div className="flex items-center gap-1.5 text-xs text-green-700">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Valid population count</span>
                            </div>
                          )}
                        </div>

                        {/* Sample Count */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                            Sample Size
                            <span className="text-red-500">*</span>
                            <button
                              type="button"
                              className="group relative"
                              title="Number of items selected for testing from the population"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-blue-600" />
                            </button>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={testData.sampleCount}
                            onChange={(e) => handleInputChange("sampleCount", e.target.value)}
                            onBlur={() => handleBlur("sampleCount")}
                            placeholder="e.g., 125"
                            className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg transition-all ${
                              touched.sampleCount && errors.sampleCount
                                ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                                : testData.sampleCount && !errors.sampleCount
                                ? "border-green-500 bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                : "border-gray-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            } focus:outline-none`}
                          />
                          {touched.sampleCount && errors.sampleCount && (
                            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{errors.sampleCount}</span>
                            </div>
                          )}
                          {testData.sampleCount && !errors.sampleCount && (
                            <div className="flex items-center gap-1.5 text-xs text-green-700">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Valid sample size</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sample Ratio Info */}
                      {testData.populationCount && testData.sampleCount && !errors.populationCount && !errors.sampleCount && (
                        <div className="ml-11 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">Sample represents:</span>
                            <span className="font-bold text-blue-700">
                              {((parseInt(testData.sampleCount) / parseInt(testData.populationCount)) * 100).toFixed(1)}% of population
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Record Test Results */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          testData.populationCount && testData.sampleCount && !errors.populationCount && !errors.sampleCount
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}>
                          2
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Record Test Results</h3>
                          <p className="text-xs text-gray-600">Document how many items passed and failed testing</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pl-11">
                        {/* Pass Count */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Items Passed
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={testData.passCount}
                            onChange={(e) => handleInputChange("passCount", e.target.value)}
                            onBlur={() => handleBlur("passCount")}
                            placeholder="e.g., 118"
                            disabled={!testData.sampleCount}
                            className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg transition-all ${
                              !testData.sampleCount
                                ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400"
                                : touched.passCount && errors.passCount
                                ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                                : testData.passCount !== "" && !errors.passCount
                                ? "border-green-500 bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                : "border-gray-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            } focus:outline-none`}
                          />
                          {touched.passCount && errors.passCount && (
                            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{errors.passCount}</span>
                            </div>
                          )}
                        </div>

                        {/* Fail Count */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                            <XCircle className="w-4 h-4 text-red-600" />
                            Items Failed
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={testData.failCount}
                            onChange={(e) => handleInputChange("failCount", e.target.value)}
                            onBlur={() => handleBlur("failCount")}
                            placeholder="e.g., 7"
                            disabled={!testData.sampleCount}
                            className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg transition-all ${
                              !testData.sampleCount
                                ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400"
                                : touched.failCount && errors.failCount
                                ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                                : testData.failCount !== "" && !errors.failCount
                                ? "border-green-500 bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                : "border-gray-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            } focus:outline-none`}
                          />
                          {touched.failCount && errors.failCount && (
                            <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{errors.failCount}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Total Tested Validation */}
                      {testData.sampleCount && (testData.passCount !== "" || testData.failCount !== "") && (
                        <div className="ml-11">
                          {parseInt(testData.passCount || "0") + parseInt(testData.failCount || "0") === parseInt(testData.sampleCount) ? (
                            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md p-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>
                                Total matches sample size: {parseInt(testData.passCount || "0") + parseInt(testData.failCount || "0")} of {testData.sampleCount}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>
                                Total: {parseInt(testData.passCount || "0") + parseInt(testData.failCount || "0")} of {testData.sampleCount} (
                                {parseInt(testData.sampleCount) - (parseInt(testData.passCount || "0") + parseInt(testData.failCount || "0"))} remaining)
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step 3: Review Calculated Metrics */}
                    {(testData.passCount !== "" || testData.failCount !== "") && testData.sampleCount && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-100">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">
                            3
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">Review Calculated Metrics</h3>
                            <p className="text-xs text-gray-600">Automatically calculated based on your test results</p>
                          </div>
                        </div>

                        <div className="pl-11 grid grid-cols-2 gap-4">
                          {/* Pass Rate */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                              <h4 className="text-sm font-bold text-gray-900">Pass Rate</h4>
                            </div>
                            <div className="text-3xl font-bold text-green-700 mb-2">
                              {testData.passPercentage}%
                            </div>
                            <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(parseFloat(testData.passPercentage), 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              {testData.passCount} out of {testData.sampleCount} items passed
                            </p>
                          </div>

                          {/* Failure Rate */}
                          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle className="w-5 h-5 text-red-600" />
                              <h4 className="text-sm font-bold text-gray-900">Failure Rate</h4>
                            </div>
                            <div className="text-3xl font-bold text-red-700 mb-2">
                              {testData.failureRate}%
                            </div>
                            <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(parseFloat(testData.failureRate), 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              {testData.failCount} out of {testData.sampleCount} items failed
                            </p>
                          </div>

                          {/* Retest Required */}
                          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-gray-900 mb-3">Retest Required</h4>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${
                              testData.retestRequired === "Yes"
                                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                                : "bg-green-100 text-green-700 border-2 border-green-300"
                            }`}>
                              {testData.retestRequired === "Yes" ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              {testData.retestRequired}
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                              {testData.retestRequired === "Yes"
                                ? "Follow-up testing required for failed items"
                                : "No retesting needed"}
                            </p>
                          </div>

                          {/* Final Result */}
                          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-gray-900 mb-3">Final Result</h4>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg shadow-lg ${
                              testData.netResult === "Pass"
                                ? "bg-green-600 text-white"
                                : testData.netResult === "Fail"
                                ? "bg-red-600 text-white"
                                : "bg-gray-400 text-white"
                            }`}>
                              {testData.netResult === "Pass" ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : testData.netResult === "Fail" ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <Info className="w-5 h-5" />
                              )}
                              {testData.netResult}
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                              {testData.netResult === "Pass"
                                ? "Control operating effectively (≤5% failure rate)"
                                : testData.netResult === "Fail"
                                ? "Control deficiency identified (>5% failure rate)"
                                : "Complete testing to determine result"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Section */}
                    <div className={`border-2 rounded-xl p-5 transition-all ${
                      isFormValid
                        ? "bg-green-50 border-green-300 shadow-lg"
                        : "bg-gray-50 border-gray-300"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            isFormValid ? "bg-green-600" : "bg-gray-400"
                          }`}>
                            {isFormValid ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Info className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-base font-bold text-gray-900">
                              {isFormValid ? "✓ Ready to Submit" : "Complete Required Fields"}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {isFormValid
                                ? "All fields completed and validated successfully"
                                : `${filledFields} of 4 required fields completed`}
                            </p>
                            {!isFormValid && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex gap-1">
                                  {[0, 1, 2, 3].map((i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < filledFields ? "bg-blue-600" : "bg-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">Progress indicator</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          disabled={!isFormValid}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                            isFormValid
                              ? "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Send className="w-4 h-4" />
                          Submit Testing Data
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </Tabs.Content>

              {/* ── Evidence Tab ─────────────────────────────────────────────── */}
              <Tabs.Content value="evidence-upload" className="p-4">
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">
                    Evidence Documents
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    PDF, Excel, Word, Images
                  </p>
                  <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700">
                    Upload Evidence
                  </button>
                </div>
              </Tabs.Content>

              {/* ── Analytics Tab (Automatic only) ───────────────────────────── */}
              {control?.controlType === "Automatic" && (
                <Tabs.Content value="analytics" className="p-6">
                  <div className="text-center py-12 text-gray-500 text-sm">
                    Analytics Dashboard Content
                  </div>
                </Tabs.Content>
              )}

              {/* ── Outcome Tab ──────────────────────────────────────────────── */}
              <Tabs.Content value="outcome" className="p-4">
                <div className="text-center py-12 text-gray-500 text-sm">
                  Outcome Table Content
                </div>
              </Tabs.Content>

              {/* ── Exception Tabs (Automatic only) ──────────────────────────── */}
              {control?.controlType === "Automatic" && (
                <>
                  <Tabs.Content value="exception-1" className="p-4">
                    <div className="bg-gray-50 rounded-lg border p-3">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1">Exception Table 1 - Access Violations</h3>
                      <p className="text-xs text-gray-600">SQL output mock</p>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="exception-2" className="p-4">
                    <div className="bg-gray-50 rounded-lg border p-3">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1">Exception Table 2 - Permission Conflicts</h3>
                      <p className="text-xs text-gray-600">SQL output mock</p>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="exception-3" className="p-4">
                    <div className="bg-gray-50 rounded-lg border p-3">
                      <h3 className="text-xs font-semibold text-gray-900 mb-1">Exception Table 3 - Role Anomalies</h3>
                      <p className="text-xs text-gray-600">SQL output mock</p>
                    </div>
                  </Tabs.Content>
                </>
              )}

              {/* ── Approval Tab ─────────────────────────────────────────────── */}
              <Tabs.Content value="approval" className="p-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold">Approval Status</h3>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Level 2 Pending</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">L1 → L2 → L3</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">Submit</button>
                    <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">Approve</button>
                    <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">Reject</button>
                  </div>
                </div>
              </Tabs.Content>

              {/* ── Logs Tab ─────────────────────────────────────────────────── */}
              <Tabs.Content value="logs" className="p-4">
                <div className="space-y-2">
                  {auditEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedAudit(entry)}
                      className="w-full flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-600 mt-1.5 group-hover:scale-125 transition-transform" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-gray-800 group-hover:text-red-600 transition-colors">{entry.action}</p>
                          <History className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </div>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">{entry.user}</span> • {entry.date} at {entry.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>

      {/* ── Audit Detail Modal ──────────────────────────────────────────────── */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <History className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Logs Details</h2>
                  <p className="text-xs text-white mt-0.5">ID: AUD-{selectedAudit.id.toString().padStart(6, '0')}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAudit(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <FileEdit className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{selectedAudit.action}</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">{selectedAudit.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-red-600" />
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">User Information</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Name</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedAudit.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Email</p>
                      <p className="text-sm font-medium text-red-600">{selectedAudit.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Role</p>
                      <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">{selectedAudit.role}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Timestamp & Status</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Date</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedAudit.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Time</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedAudit.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Status</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        <CheckCircle className="w-3 h-3" />
                        {selectedAudit.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-100 to-gray-100 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900">Changes Made</h4>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {selectedAudit.changes.map((change, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs font-bold text-gray-700 mb-2">{change.field}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Previous Value</p>
                            <div className="bg-red-50 border border-red-200 rounded px-2 py-1.5">
                              <p className="text-xs font-semibold text-red-700 line-through">{change.oldValue}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">New Value</p>
                            <div className="bg-green-50 border border-green-200 rounded px-2 py-1.5">
                              <p className="text-xs font-semibold text-green-700">{change.newValue}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Technical Details</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">IP Address:</span>
                    <span className="ml-2 font-mono font-semibold text-gray-900">{selectedAudit.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Audit ID:</span>
                    <span className="ml-2 font-mono font-semibold text-gray-900">AUD-{selectedAudit.id.toString().padStart(6, '0')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button onClick={() => setSelectedAudit(null)} className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}