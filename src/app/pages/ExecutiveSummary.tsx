import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrendDataPoint {
  month: string;
  controls: number;
  tests: number;
}

interface BigAreaDataPoint {
  x: string;
  a: number;
  b: number;
  c: number;
}

interface RadarDataPoint {
  status: string;
  value: number;
  fullMark: number;
}

interface ProcessDataPoint {
  process: string;
  value: number;
  color: string;
}

interface MonthlyTestDataPoint {
  month: string;
  current: number;
  recent: number;
  aging: number;
}

interface ExceptionDataPoint {
  month: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface TableRow {
  controlId: string;
  kpi: string;
  attr: string;
  period: string;
  population: number;
  exceptions: number;
  exceptionPct: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
const trendData: TrendDataPoint[] = [
  { month: "Jan", controls: 320, tests: 280 },
  { month: "Feb", controls: 335, tests: 295 },
  { month: "Mar", controls: 340, tests: 310 },
  { month: "Apr", controls: 365, tests: 330 },
  { month: "May", controls: 380, tests: 355 },
  { month: "Jun", controls: 420, tests: 390 },
  { month: "Jul", controls: 445, tests: 410 },
];

const bigAreaData: BigAreaDataPoint[] = [
  { x: "01", a: 380, b: 220, c: 140 }, { x: "02", a: 290, b: 180, c: 90 },
  { x: "03", a: 420, b: 260, c: 170 }, { x: "04", a: 330, b: 190, c: 110 },
  { x: "05", a: 460, b: 290, c: 200 }, { x: "06", a: 350, b: 200, c: 130 },
  { x: "07", a: 510, b: 320, c: 180 }, { x: "08", a: 280, b: 160, c: 80 },
  { x: "09", a: 440, b: 270, c: 160 }, { x: "10", a: 370, b: 210, c: 120 },
  { x: "11", a: 490, b: 300, c: 190 }, { x: "12", a: 320, b: 185, c: 100 },
  { x: "13", a: 430, b: 265, c: 155 }, { x: "14", a: 360, b: 205, c: 115 },
  { x: "15", a: 500, b: 310, c: 185 },
];

const radarStatusData: RadarDataPoint[] = [
  { status: "Pass", value: 124, fullMark: 150 },
  { status: "Progress", value: 98, fullMark: 150 },
  { status: "Fail", value: 24, fullMark: 150 },
  { status: "Pending", value: 56, fullMark: 150 },
  { status: "Completed", value: 138, fullMark: 150 },
];

const processData: ProcessDataPoint[] = [
  { process: "Inventory", value: 36, color: "#6366f1" },
  { process: "Financial Reporting", value: 44, color: "#8b5cf6" },
  { process: "Accounts Receivable", value: 47, color: "#ec4899" },
  { process: "Costing", value: 44, color: "#06b6d4" },
  { process: "HR Control Environment", value: 30, color: "#f59e0b" },
  { process: "ABAC", value: 97, color: "#8b5cf4" },
];

const monthlyTests: MonthlyTestDataPoint[] = [
  { month: "1", current: 45, recent: 92, aging: 61 },
  { month: "2", current: 38, recent: 105, aging: 68 },
  { month: "3", current: 52, recent: 88, aging: 54 },
  { month: "4", current: 41, recent: 98, aging: 72 },
  { month: "5", current: 48, recent: 94, aging: 65 },
  { month: "6", current: 55, recent: 102, aging: 58 },
  { month: "7", current: 43, recent: 89, aging: 69 },
  { month: "8", current: 50, recent: 96, aging: 63 },
  { month: "9", current: 46, recent: 100, aging: 66 },
];

const exceptionTrendData: ExceptionDataPoint[] = [
  { month: "Jul", critical: 3, high: 5, medium: 9, low: 14 },
  { month: "Aug", critical: 4, high: 6, medium: 11, low: 16 },
  { month: "Sep", critical: 2, high: 5, medium: 8, low: 13 },
  { month: "Oct", critical: 3, high: 6, medium: 10, low: 15 },
  { month: "Nov", critical: 2, high: 4, medium: 7, low: 12 },
  { month: "Dec", critical: 3, high: 5, medium: 9, low: 14 },
];

const tableData: TableRow[] = [
  { controlId: "P-0", kpi: "User Access Review", attr: "Unauthorized Access", period: "Q1 2026", population: 1250, exceptions: 7, exceptionPct: "0.56%" },
  { controlId: "P-1", kpi: "Financial Reconciliation", attr: "Balance Mismatch", period: "Q1 2026", population: 850, exceptions: 3, exceptionPct: "0.35%" },
  { controlId: "P-2", kpi: "Vendor Approval", attr: "Missing Authorization", period: "Q1 2026", population: 420, exceptions: 2, exceptionPct: "0.48%" },
  { controlId: "P-3", kpi: "Data Backup Verification", attr: "Backup Integrity", period: "Q1 2026", population: 680, exceptions: 1, exceptionPct: "0.15%" },
];

// ─── Tooltip style ────────────────────────────────────────────────────────────
const tooltipStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.97)",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08)",
  fontSize: "11px",
  padding: "8px 12px",
};

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = "", style = {} }: CardProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2 flex-shrink-0">
      <h3 className="text-xs font-bold text-gray-800 leading-tight">{title}</h3>
      {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ExecutiveSummary() {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [userRole, setUserRole] = useState<string>("Auditor");

  useEffect(() => {
    const role = localStorage.getItem("userRole") ?? "Auditor";
    setUserRole(role);
  }, []);

  const currentTotal = monthlyTests.reduce((s, i) => s + i.current, 0);
  const recentTotal = monthlyTests.reduce((s, i) => s + i.recent, 0);
  const agingTotal = monthlyTests.reduce((s, i) => s + i.aging, 0);

  const kpiLegend = [
    { label: "Controls", value: userRole === "Auditor" ? 67 : 346, color: "#6366f1" },
    { label: "Pass Rate", value: "94.2%", color: "#10b981" },
    { label: "Tests", value: 128, color: "#8b5cf6" },
    { label: "Exceptions", value: 24, color: "#f59e0b" },
  ];

  return (
    /*
     * KEY FIX: The outermost wrapper uses `h-screen overflow-hidden` so the
     * page itself never scrolls.  Everything inside is laid out with flexbox /
     * CSS-grid using fractional / percentage heights so every card fills its
     * share of the available space rather than pushing content off-screen.
     */
    <div
      className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* ── Inner scroller: fills 100% of the viewport height ── */}
      <div
        className="w-full h-full overflow-hidden"
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr",
          gap: "12px",
          padding: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* ════════════════════════════════════════════════════════════════
            ROW 1: KPI Overview  |  Control Testing Trend  |  Status Dist.
            3-col on xl, 2-col on sm, 1-col on mobile (each row is 50vh)
        ═════════════════════════════════════════════════════════════════= */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 min-h-0"
        >
          {/* ── KPI Overview ─────────────────────────────────────────── */}
          <Card className="sm:col-span-1 xl:col-span-3 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="KPI Overview" subtitle="Key metrics" />

            {/* Donut */}
            <div className="flex items-center justify-center flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Total Controls", value: userRole === "Auditor" ? 67 : 346 },
                      { name: "Pass Rate", value: 94.2 },
                      { name: "Active Tests", value: 128 },
                      { name: "Exceptions", value: 24 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="42%"
                    outerRadius="72%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#10b981" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-gray-100 flex-shrink-0">
              {kpiLegend.map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: kpi.color }} />
                    <span className="text-[11px] font-medium text-gray-700">{kpi.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-900">{kpi.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Control Testing Trend ───────────────────────────────── */}
          <Card className="sm:col-span-2 xl:col-span-6 p-3 flex flex-col min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-1 mb-2 flex-shrink-0">
              <div>
                <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 flex-wrap">
                  Control Testing Trend
                  <span className="px-1.5 py-0.5 text-[9px] font-medium bg-blue-100 text-blue-700 rounded-full">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Monthly performance overview</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  {(["chart", "table"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${
                        viewMode === m
                          ? "bg-white text-gray-900 shadow"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {m === "chart" ? "Chart" : "Table"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stat badges */}
            <div className="flex gap-4 mb-2 flex-shrink-0">
              {[
                { v: "425", lbl: "perferendis" },
                { v: "365", lbl: "consectetur" },
                { v: "268", lbl: "adipiscing" },
              ].map((s) => (
                <div key={s.v}>
                  <span className="text-sm font-extrabold text-gray-900">{s.v}</span>
                  <div className="text-[9px] text-gray-400 mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* Chart / Table */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {viewMode === "chart" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bigAreaData} margin={{ top: 6, right: 8, left: 0, bottom: 6 }}>
                    <defs>
                      <linearGradient id="gaA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gaB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gaC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="x" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="c" stroke="#93c5fd" fill="url(#gaC)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="b" stroke="#14b8a6" fill="url(#gaB)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="a" stroke="#6366f1" fill="url(#gaA)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="rounded-lg border border-gray-200 h-full overflow-auto">
                  <table className="w-full text-[10px] min-w-[480px]">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 sticky top-0">
                      <tr>
                        {["Control ID", "KPI Name", "Attribute", "Period", "Population", "Exceptions", "Exception %"].map((h) => (
                          <th
                            key={h}
                            className="px-2 py-2 text-left font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {tableData.map((row) => (
                        <tr key={row.controlId} className="hover:bg-indigo-50/40 transition-colors">
                          <td className="px-2 py-2 font-bold text-indigo-600">{row.controlId}</td>
                          <td className="px-2 py-2 font-medium text-gray-800 whitespace-nowrap">{row.kpi}</td>
                          <td className="px-2 py-2 text-gray-500 whitespace-nowrap">{row.attr}</td>
                          <td className="px-2 py-2 text-gray-500">{row.period}</td>
                          <td className="px-2 py-2 text-right font-medium text-gray-800">{row.population.toLocaleString()}</td>
                          <td className="px-2 py-2 text-right">
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold">
                              {row.exceptions}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-right font-bold text-red-600">{row.exceptionPct}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-2 pt-2 border-t border-gray-100 flex-shrink-0 flex-wrap">
              {[
                { c: "from-indigo-500 to-purple-600", lbl: `Controls (${trendData[trendData.length - 1].controls})` },
                { c: "from-blue-500 to-blue-600", lbl: `Tests (${trendData[trendData.length - 1].tests})` },
              ].map((it) => (
                <div key={it.lbl} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${it.c} shadow-sm flex-shrink-0`} />
                  <span className="text-[11px] font-semibold text-gray-600">{it.lbl}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Status Distribution ───────────────────────────────────── */}
          <Card className="sm:col-span-1 xl:col-span-3 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Status Distribution" subtitle="Real-time breakdown" />

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarStatusData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="status"
                    tick={{ fontSize: 9, fill: "#6b7280", fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 150]}
                    tick={{ fontSize: 8, fill: "#9ca3af" }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.65}
                    strokeWidth={2}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-gray-100 flex-shrink-0">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {[
                  { g: "from-green-500 to-emerald-600", lbl: "Pass", val: 124 },
                  { g: "from-yellow-500 to-yellow-600", lbl: "Pending", val: 56 },
                  { g: "from-blue-500 to-blue-600", lbl: "Progress", val: 98 },
                  { g: "from-purple-500 to-purple-600", lbl: "Complete", val: 138 },
                  { g: "from-red-500 to-red-600", lbl: "Fail", val: 24 },
                ].map((item) => (
                  <div
                    key={item.lbl}
                    className="flex items-center justify-between hover:bg-gray-50 rounded px-1.5 py-1 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${item.g} flex-shrink-0`} />
                      <span className="text-[11px] font-medium text-gray-700">{item.lbl}</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-900">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ROW 2: Process Performance  |  Control Aging  |  Exception Trend
        ═════════════════════════════════════════════════════════════════= */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 min-h-0"
        >
          {/* ── Process Performance ───────────────────────────────────── */}
          <Card className="sm:col-span-1 xl:col-span-4 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Process Performance" subtitle="Completion rates" />
            <div className="flex flex-col justify-between flex-1 gap-1.5 min-h-0">
              {processData.map((item) => (
                <div key={item.process} className="flex-shrink-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-gray-700 truncate pr-2 max-w-[78%]">
                      {item.process}
                    </span>
                    <span className="text-[11px] font-bold text-gray-900 flex-shrink-0">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${item.value}%`,
                        background: `linear-gradient(90deg,${item.color},${item.color}cc)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Control Aging Analysis ────────────────────────────────── */}
          <Card className="sm:col-span-1 xl:col-span-4 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Control Aging Analysis" subtitle="Controls by last test date" />
            <div className="flex flex-1 min-h-0 gap-2">
              {/* Legend */}
              <div className="hidden sm:flex flex-col justify-center gap-2 flex-shrink-0 min-w-[76px]">
                {[
                  { g: "from-blue-500 to-blue-600", val: currentTotal, lbl: "Current" },
                  { g: "from-teal-500 to-teal-600", val: recentTotal, lbl: "Recent" },
                  { g: "from-yellow-500 to-yellow-600", val: agingTotal, lbl: "Aging" },
                ].map((it) => (
                  <div key={it.lbl} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded bg-gradient-to-br ${it.g} shadow-sm flex-shrink-0`} />
                    <span className="text-[10px] font-medium text-gray-700">{it.lbl}</span>
                    <span className="text-[10px] font-bold text-gray-900">{it.val}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1 min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyTests}
                    barSize={10}
                    margin={{ top: 6, right: 4, left: -18, bottom: 6 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      tick={{ fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      tick={{ fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                    <Bar dataKey="current" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="recent" stackId="a" fill="#14b8a6" />
                    <Bar dataKey="aging" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mobile legend */}
            <div className="sm:hidden flex items-center justify-center gap-3 pt-2 border-t border-gray-100 flex-shrink-0 flex-wrap">
              {[
                { g: "from-blue-500 to-blue-600", val: currentTotal, lbl: "Current" },
                { g: "from-teal-500 to-teal-600", val: recentTotal, lbl: "Recent" },
                { g: "from-yellow-500 to-yellow-600", val: agingTotal, lbl: "Aging" },
              ].map((it) => (
                <div key={it.lbl} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded bg-gradient-to-br ${it.g} shadow-sm flex-shrink-0`} />
                  <span className="text-[10px] font-medium text-gray-700">{it.lbl}</span>
                  <span className="text-[10px] font-bold text-gray-900">{it.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Exception Trend ───────────────────────────────────────── */}
          <Card className="sm:col-span-2 xl:col-span-4 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Exception Trend" subtitle="Last 6 months by severity" />

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={exceptionTrendData}
                  margin={{ top: 6, right: 8, left: 0, bottom: 6 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 9, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  {(
                    [
                      { key: "critical", color: "#ef4444" },
                      { key: "high", color: "#f97316" },
                      { key: "medium", color: "#eab308" },
                      { key: "low", color: "#3b82f6" },
                    ] as const
                  ).map(({ key, color }) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      dot={{ fill: color, r: 2.5, strokeWidth: 1.5, stroke: "#fff" }}
                      activeDot={{ r: 4 }}
                      name={key.charAt(0).toUpperCase() + key.slice(1)}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-100 flex-shrink-0 flex-wrap">
              {[
                { g: "from-red-500 to-red-600", lbl: "Critical" },
                { g: "from-orange-500 to-orange-600", lbl: "High" },
                { g: "from-yellow-500 to-yellow-600", lbl: "Medium" },
                { g: "from-blue-500 to-blue-600", lbl: "Low" },
              ].map((it) => (
                <div key={it.lbl} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${it.g} shadow-sm flex-shrink-0`} />
                  <span className="text-[11px] font-medium text-gray-700">{it.lbl}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}