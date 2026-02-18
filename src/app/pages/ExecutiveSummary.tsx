import { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronDown,
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
type Process = "All" | "Inventory" | "Financial Reporting" | "Accounts Receivable" | "Costing" | "Control Environment" | "ABAC";
type TrendPeriod = "Monthly" | "Quarterly" | "Yearly";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Process List ─────────────────────────────────────────────────────────────
const PROCESSES: Process[] = [
  "All", "Inventory", "Financial Reporting", "Accounts Receivable",
  "Costing", "Control Environment", "ABAC",
];

// ─── KPI base data per process ────────────────────────────────────────────────
const processBaseData: Record<string, {
  total: number; automated: number; manual: number;
  pass: number; fail: number; passRate: number; activeTests: number; exceptions: number;
}> = {
  "All":                  { total: 346, automated: 198, manual: 148, pass: 324, fail: 22, passRate: 93.6, activeTests: 128, exceptions: 24 },
  "Inventory":            { total: 56,  automated: 30,  manual: 26,  pass: 51,  fail: 5,  passRate: 91.1, activeTests: 18,  exceptions: 5  },
  "Financial Reporting":  { total: 72,  automated: 45,  manual: 27,  pass: 68,  fail: 4,  passRate: 94.4, activeTests: 24,  exceptions: 4  },
  "Accounts Receivable":  { total: 61,  automated: 38,  manual: 23,  pass: 58,  fail: 3,  passRate: 95.1, activeTests: 20,  exceptions: 3  },
  "Costing":              { total: 48,  automated: 28,  manual: 20,  pass: 44,  fail: 4,  passRate: 91.7, activeTests: 16,  exceptions: 4  },
  "Control Environment":  { total: 42,  automated: 22,  manual: 20,  pass: 39,  fail: 3,  passRate: 92.9, activeTests: 14,  exceptions: 3  },
  "ABAC":                 { total: 67,  automated: 35,  manual: 32,  pass: 64,  fail: 3,  passRate: 95.5, activeTests: 22,  exceptions: 3  },
};

// ─── Trend data (a/b/c drive the area chart exactly like original) ─────────────
const monthlyTrendData: Record<string, { x: string; pass: number; fail: number; a: number; b: number; c: number }[]> = {
  "All": [
    { x: "Jan", pass: 280, fail: 18, a: 380, b: 220, c: 140 },
    { x: "Feb", pass: 295, fail: 20, a: 290, b: 180, c: 90  },
    { x: "Mar", pass: 310, fail: 17, a: 420, b: 260, c: 170 },
    { x: "Apr", pass: 330, fail: 19, a: 330, b: 190, c: 110 },
    { x: "May", pass: 355, fail: 21, a: 460, b: 290, c: 200 },
    { x: "Jun", pass: 390, fail: 22, a: 350, b: 200, c: 130 },
    { x: "Jul", pass: 410, fail: 24, a: 510, b: 320, c: 180 },
  ],
  "Inventory": [
    { x: "Jan", pass: 42, fail: 4, a: 60, b: 38, c: 22 },
    { x: "Feb", pass: 44, fail: 5, a: 55, b: 34, c: 19 },
    { x: "Mar", pass: 47, fail: 3, a: 68, b: 42, c: 26 },
    { x: "Apr", pass: 49, fail: 4, a: 62, b: 38, c: 22 },
    { x: "May", pass: 51, fail: 5, a: 72, b: 44, c: 28 },
    { x: "Jun", pass: 53, fail: 4, a: 66, b: 40, c: 24 },
    { x: "Jul", pass: 51, fail: 5, a: 74, b: 46, c: 30 },
  ],
  "Financial Reporting": [
    { x: "Jan", pass: 58, fail: 3, a: 80, b: 50, c: 30 },
    { x: "Feb", pass: 61, fail: 4, a: 75, b: 46, c: 28 },
    { x: "Mar", pass: 63, fail: 3, a: 88, b: 54, c: 34 },
    { x: "Apr", pass: 66, fail: 4, a: 82, b: 50, c: 32 },
    { x: "May", pass: 68, fail: 4, a: 92, b: 58, c: 36 },
    { x: "Jun", pass: 70, fail: 3, a: 86, b: 54, c: 34 },
    { x: "Jul", pass: 68, fail: 4, a: 96, b: 60, c: 38 },
  ],
  "Accounts Receivable": [
    { x: "Jan", pass: 48, fail: 2, a: 66, b: 40, c: 24 },
    { x: "Feb", pass: 51, fail: 3, a: 62, b: 38, c: 22 },
    { x: "Mar", pass: 54, fail: 2, a: 72, b: 44, c: 28 },
    { x: "Apr", pass: 56, fail: 3, a: 68, b: 42, c: 26 },
    { x: "May", pass: 58, fail: 3, a: 78, b: 48, c: 30 },
    { x: "Jun", pass: 60, fail: 2, a: 72, b: 44, c: 28 },
    { x: "Jul", pass: 58, fail: 3, a: 82, b: 50, c: 32 },
  ],
  "Costing": [
    { x: "Jan", pass: 36, fail: 4, a: 52, b: 32, c: 18 },
    { x: "Feb", pass: 38, fail: 3, a: 48, b: 30, c: 16 },
    { x: "Mar", pass: 40, fail: 4, a: 58, b: 34, c: 20 },
    { x: "Apr", pass: 42, fail: 4, a: 54, b: 32, c: 18 },
    { x: "May", pass: 44, fail: 4, a: 62, b: 38, c: 22 },
    { x: "Jun", pass: 46, fail: 3, a: 58, b: 36, c: 20 },
    { x: "Jul", pass: 44, fail: 4, a: 66, b: 40, c: 24 },
  ],
  "Control Environment": [
    { x: "Jan", pass: 32, fail: 3, a: 46, b: 28, c: 16 },
    { x: "Feb", pass: 34, fail: 3, a: 42, b: 26, c: 14 },
    { x: "Mar", pass: 36, fail: 2, a: 52, b: 30, c: 18 },
    { x: "Apr", pass: 38, fail: 3, a: 48, b: 28, c: 16 },
    { x: "May", pass: 39, fail: 3, a: 56, b: 34, c: 20 },
    { x: "Jun", pass: 41, fail: 2, a: 52, b: 32, c: 18 },
    { x: "Jul", pass: 39, fail: 3, a: 58, b: 36, c: 20 },
  ],
  "ABAC": [
    { x: "Jan", pass: 55, fail: 2, a: 76, b: 46, c: 28 },
    { x: "Feb", pass: 58, fail: 3, a: 72, b: 44, c: 26 },
    { x: "Mar", pass: 60, fail: 2, a: 84, b: 52, c: 32 },
    { x: "Apr", pass: 63, fail: 2, a: 78, b: 48, c: 30 },
    { x: "May", pass: 65, fail: 2, a: 90, b: 56, c: 34 },
    { x: "Jun", pass: 67, fail: 3, a: 84, b: 52, c: 32 },
    { x: "Jul", pass: 64, fail: 3, a: 94, b: 58, c: 36 },
  ],
};

const quarterlyTrendData: Record<string, { x: string; pass: number; fail: number; a: number; b: number; c: number }[]> = {
  "All": [
    { x: "Q1 25", pass: 885, fail: 55, a: 900, b: 560, c: 340 },
    { x: "Q2 25", pass: 1075, fail: 62, a: 1100, b: 680, c: 420 },
    { x: "Q3 25", pass: 1150, fail: 58, a: 1180, b: 720, c: 450 },
    { x: "Q4 25", pass: 1230, fail: 66, a: 1260, b: 780, c: 480 },
    { x: "Q1 26", pass: 1310, fail: 63, a: 1340, b: 820, c: 510 },
  ],
  "Inventory":           [
    { x: "Q1 25", pass: 126, fail: 12, a: 140, b: 86, c: 52 },
    { x: "Q2 25", pass: 148, fail: 13, a: 165, b: 100, c: 62 },
    { x: "Q3 25", pass: 152, fail: 14, a: 170, b: 104, c: 64 },
    { x: "Q4 25", pass: 154, fail: 14, a: 172, b: 106, c: 66 },
    { x: "Q1 26", pass: 153, fail: 14, a: 172, b: 106, c: 66 },
  ],
  "Financial Reporting": [
    { x: "Q1 25", pass: 174, fail: 10, a: 190, b: 116, c: 72 },
    { x: "Q2 25", pass: 198, fail: 11, a: 218, b: 134, c: 82 },
    { x: "Q3 25", pass: 204, fail: 10, a: 224, b: 138, c: 84 },
    { x: "Q4 25", pass: 210, fail: 11, a: 232, b: 142, c: 88 },
    { x: "Q1 26", pass: 204, fail: 11, a: 226, b: 138, c: 86 },
  ],
  "Accounts Receivable": [
    { x: "Q1 25", pass: 144, fail: 7, a: 158, b: 96, c: 60 },
    { x: "Q2 25", pass: 162, fail: 8, a: 178, b: 110, c: 68 },
    { x: "Q3 25", pass: 168, fail: 7, a: 184, b: 114, c: 70 },
    { x: "Q4 25", pass: 174, fail: 8, a: 190, b: 118, c: 72 },
    { x: "Q1 26", pass: 174, fail: 8, a: 190, b: 116, c: 72 },
  ],
  "Costing":             [
    { x: "Q1 25", pass: 108, fail: 11, a: 122, b: 74, c: 46 },
    { x: "Q2 25", pass: 126, fail: 12, a: 142, b: 86, c: 54 },
    { x: "Q3 25", pass: 132, fail: 11, a: 148, b: 90, c: 56 },
    { x: "Q4 25", pass: 138, fail: 11, a: 154, b: 94, c: 58 },
    { x: "Q1 26", pass: 132, fail: 12, a: 148, b: 90, c: 56 },
  ],
  "Control Environment": [
    { x: "Q1 25", pass: 96, fail: 9, a: 108, b: 66, c: 40 },
    { x: "Q2 25", pass: 114, fail: 8, a: 126, b: 78, c: 48 },
    { x: "Q3 25", pass: 117, fail: 8, a: 130, b: 80, c: 50 },
    { x: "Q4 25", pass: 120, fail: 8, a: 134, b: 82, c: 50 },
    { x: "Q1 26", pass: 117, fail: 8, a: 130, b: 80, c: 50 },
  ],
  "ABAC":                [
    { x: "Q1 25", pass: 165, fail: 6, a: 180, b: 110, c: 68 },
    { x: "Q2 25", pass: 192, fail: 7, a: 208, b: 128, c: 78 },
    { x: "Q3 25", pass: 198, fail: 6, a: 214, b: 132, c: 82 },
    { x: "Q4 25", pass: 204, fail: 6, a: 220, b: 136, c: 84 },
    { x: "Q1 26", pass: 192, fail: 7, a: 208, b: 128, c: 80 },
  ],
};

const yearlyTrendData: Record<string, { x: string; pass: number; fail: number; a: number; b: number; c: number }[]> = {
  "All": [
    { x: "2022", pass: 2800, fail: 210, a: 3100, b: 1900, c: 1180 },
    { x: "2023", pass: 3400, fail: 240, a: 3750, b: 2300, c: 1420 },
    { x: "2024", pass: 4200, fail: 260, a: 4600, b: 2820, c: 1760 },
    { x: "2025", pass: 4700, fail: 290, a: 5100, b: 3140, c: 1950 },
  ],
  "Inventory": [
    { x: "2022", pass: 380, fail: 42, a: 430, b: 264, c: 164 },
    { x: "2023", pass: 450, fail: 48, a: 508, b: 312, c: 194 },
    { x: "2024", pass: 560, fail: 52, a: 626, b: 384, c: 238 },
    { x: "2025", pass: 610, fail: 56, a: 682, b: 418, c: 260 },
  ],
  "Financial Reporting": [
    { x: "2022", pass: 560, fail: 38, a: 614, b: 376, c: 234 },
    { x: "2023", pass: 660, fail: 42, a: 718, b: 440, c: 274 },
    { x: "2024", pass: 780, fail: 44, a: 842, b: 516, c: 322 },
    { x: "2025", pass: 840, fail: 46, a: 904, b: 554, c: 344 },
  ],
  "Accounts Receivable": [
    { x: "2022", pass: 460, fail: 28, a: 500, b: 306, c: 190 },
    { x: "2023", pass: 550, fail: 32, a: 596, b: 366, c: 226 },
    { x: "2024", pass: 650, fail: 34, a: 700, b: 430, c: 268 },
    { x: "2025", pass: 700, fail: 36, a: 750, b: 460, c: 286 },
  ],
  "Costing": [
    { x: "2022", pass: 360, fail: 44, a: 414, b: 254, c: 158 },
    { x: "2023", pass: 430, fail: 48, a: 490, b: 300, c: 186 },
    { x: "2024", pass: 510, fail: 50, a: 572, b: 352, c: 218 },
    { x: "2025", pass: 550, fail: 54, a: 616, b: 378, c: 234 },
  ],
  "Control Environment": [
    { x: "2022", pass: 320, fail: 34, a: 364, b: 224, c: 138 },
    { x: "2023", pass: 380, fail: 36, a: 428, b: 262, c: 164 },
    { x: "2024", pass: 450, fail: 38, a: 500, b: 308, c: 190 },
    { x: "2025", pass: 480, fail: 40, a: 534, b: 328, c: 204 },
  ],
  "ABAC": [
    { x: "2022", pass: 540, fail: 24, a: 576, b: 354, c: 220 },
    { x: "2023", pass: 640, fail: 26, a: 682, b: 418, c: 260 },
    { x: "2024", pass: 760, fail: 28, a: 800, b: 492, c: 306 },
    { x: "2025", pass: 820, fail: 30, a: 860, b: 528, c: 328 },
  ],
};

// ─── Status Radar data per process ───────────────────────────────────────────
const statusRadarData: Record<string, { status: string; value: number; fullMark: number }[]> = {
  "All": [
    { status: "Not Init.",      value: 42,  fullMark: 150 },
    { status: "Initiated",      value: 58,  fullMark: 150 },
    { status: "Pend.Auditee",   value: 35,  fullMark: 150 },
    { status: "Pend.Reviewer",  value: 28,  fullMark: 150 },
    { status: "Pend.Manager",   value: 16,  fullMark: 150 },
    { status: "Completed",      value: 146, fullMark: 150 },
  ],
  "Inventory": [
    { status: "Not Init.",      value: 6,  fullMark: 50 },
    { status: "Initiated",      value: 8,  fullMark: 50 },
    { status: "Pend.Auditee",   value: 5,  fullMark: 50 },
    { status: "Pend.Reviewer",  value: 4,  fullMark: 50 },
    { status: "Pend.Manager",   value: 2,  fullMark: 50 },
    { status: "Completed",      value: 31, fullMark: 50 },
  ],
  "Financial Reporting": [
    { status: "Not Init.",      value: 7,  fullMark: 60 },
    { status: "Initiated",      value: 10, fullMark: 60 },
    { status: "Pend.Auditee",   value: 6,  fullMark: 60 },
    { status: "Pend.Reviewer",  value: 5,  fullMark: 60 },
    { status: "Pend.Manager",   value: 3,  fullMark: 60 },
    { status: "Completed",      value: 41, fullMark: 60 },
  ],
  "Accounts Receivable": [
    { status: "Not Init.",      value: 5,  fullMark: 55 },
    { status: "Initiated",      value: 8,  fullMark: 55 },
    { status: "Pend.Auditee",   value: 5,  fullMark: 55 },
    { status: "Pend.Reviewer",  value: 4,  fullMark: 55 },
    { status: "Pend.Manager",   value: 2,  fullMark: 55 },
    { status: "Completed",      value: 37, fullMark: 55 },
  ],
  "Costing": [
    { status: "Not Init.",      value: 5,  fullMark: 45 },
    { status: "Initiated",      value: 7,  fullMark: 45 },
    { status: "Pend.Auditee",   value: 5,  fullMark: 45 },
    { status: "Pend.Reviewer",  value: 3,  fullMark: 45 },
    { status: "Pend.Manager",   value: 2,  fullMark: 45 },
    { status: "Completed",      value: 26, fullMark: 45 },
  ],
  "Control Environment": [
    { status: "Not Init.",      value: 5,  fullMark: 40 },
    { status: "Initiated",      value: 6,  fullMark: 40 },
    { status: "Pend.Auditee",   value: 4,  fullMark: 40 },
    { status: "Pend.Reviewer",  value: 3,  fullMark: 40 },
    { status: "Pend.Manager",   value: 2,  fullMark: 40 },
    { status: "Completed",      value: 22, fullMark: 40 },
  ],
  "ABAC": [
    { status: "Not Init.",      value: 8,  fullMark: 60 },
    { status: "Initiated",      value: 10, fullMark: 60 },
    { status: "Pend.Auditee",   value: 7,  fullMark: 60 },
    { status: "Pend.Reviewer",  value: 5,  fullMark: 60 },
    { status: "Pend.Manager",   value: 3,  fullMark: 60 },
    { status: "Completed",      value: 34, fullMark: 60 },
  ],
};

// Status legend data per process — matches new statuses
const statusLegendMap: Record<string, { g: string; lbl: string; val: number }[]> = {
  "All": [
    { g: "from-slate-400 to-slate-500",    lbl: "Not Init.",     val: 42  },
    { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated",     val: 58  },
    { g: "from-yellow-500 to-yellow-600",  lbl: "Pend. Auditee", val: 35  },
    { g: "from-purple-500 to-purple-600",  lbl: "Pend. Reviewer",val: 28  },
    { g: "from-pink-500 to-pink-600",      lbl: "Pend. Manager", val: 16  },
    { g: "from-green-500 to-emerald-600",  lbl: "Comp. Pass",    val: 124 },
    { g: "from-red-500 to-red-600",        lbl: "Comp. Fail",    val: 22  },
  ],
  "Inventory": [
    { g: "from-slate-400 to-slate-500",    lbl: "Not Init.",     val: 6  },
    { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated",     val: 8  },
    { g: "from-yellow-500 to-yellow-600",  lbl: "Pend. Auditee", val: 5  },
    { g: "from-purple-500 to-purple-600",  lbl: "Pend. Reviewer",val: 4  },
    { g: "from-pink-500 to-pink-600",      lbl: "Pend. Manager", val: 2  },
    { g: "from-green-500 to-emerald-600",  lbl: "Comp. Pass",    val: 26 },
    { g: "from-red-500 to-red-600",        lbl: "Comp. Fail",    val: 5  },
  ],
  "Financial Reporting": [
    { g: "from-slate-400 to-slate-500",    lbl: "Not Init.",     val: 7  },
    { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated",     val: 10 },
    { g: "from-yellow-500 to-yellow-600",  lbl: "Pend. Auditee", val: 6  },
    { g: "from-purple-500 to-purple-600",  lbl: "Pend. Reviewer",val: 5  },
    { g: "from-pink-500 to-pink-600",      lbl: "Pend. Manager", val: 3  },
    { g: "from-green-500 to-emerald-600",  lbl: "Comp. Pass",    val: 37 },
    { g: "from-red-500 to-red-600",        lbl: "Comp. Fail",    val: 4  },
  ],
  "Accounts Receivable": [
    { g: "from-slate-400 to-slate-500",    lbl: "Not Init.",     val: 5  },
    { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated",     val: 8  },
    { g: "from-yellow-500 to-yellow-600",  lbl: "Pend. Auditee", val: 5  },
    { g: "from-purple-500 to-purple-600",  lbl: "Pend. Reviewer",val: 4  },
    { g: "from-pink-500 to-pink-600",      lbl: "Pend. Manager", val: 2  },
    { g: "from-green-500 to-emerald-600",  lbl: "Comp. Pass",    val: 34 },
    { g: "from-red-500 to-red-600",        lbl: "Comp. Fail",    val: 3  },
  ],
  "Costing": [
    { g: "from-slate-400 to-slate-500",    lbl: "Not Init.",     val: 5  },
    { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated",     val: 7  },
    { g: "from-yellow-500 to-yellow-600",  lbl: "Pend. Auditee", val: 5  },
    { g: "from-purple-500 to-purple-600",  lbl: "Pend. Reviewer",val: 3  },
    { g: "from-pink-500 to-pink-600",      lbl: "Pend. Manager", val: 2  },
    { g: "from-green-500 to-emerald-600",  lbl: "Comp. Pass",    val: 22 },
    { g: "from-red-500 to-red-600",        lbl: "Comp. Fail",    val: 4  },
  ],
  "Control Environment": [
    { g: "from-slate-400 to-slate-500",    lbl: "Not Init.",     val: 5  },
    { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated",     val: 6  },
    { g: "from-yellow-500 to-yellow-600",  lbl: "Pend. Auditee", val: 4  },
    { g: "from-purple-500 to-purple-600",  lbl: "Pend. Reviewer",val: 3  },
    { g: "from-pink-500 to-pink-600",      lbl: "Pend. Manager", val: 2  },
    { g: "from-green-500 to-emerald-600",  lbl: "Comp. Pass",    val: 19 },
    { g: "from-red-500 to-red-600",        lbl: "Comp. Fail",    val: 3  },
  ],
  "ABAC": [
    { g: "from-slate-400 to-slate-500",    lbl: "Not Init.",     val: 8  },
    { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated",     val: 10 },
    { g: "from-yellow-500 to-yellow-600",  lbl: "Pend. Auditee", val: 7  },
    { g: "from-purple-500 to-purple-600",  lbl: "Pend. Reviewer",val: 5  },
    { g: "from-pink-500 to-pink-600",      lbl: "Pend. Manager", val: 3  },
    { g: "from-green-500 to-emerald-600",  lbl: "Comp. Pass",    val: 31 },
    { g: "from-red-500 to-red-600",        lbl: "Comp. Fail",    val: 3  },
  ],
};

// ─── Aging data (X = aging buckets, stacks = statuses excl. Completed) ────────
type AgingRow = { month: string; notInit: number; initiated: number; pendAuditee: number; pendReviewer: number; pendManager: number };

const agingData: Record<string, AgingRow[]> = {
  "All": [
    { month: "0–10d",  notInit: 8, initiated: 12, pendAuditee: 7, pendReviewer: 5, pendManager: 3 },
    { month: "10–20d", notInit: 7, initiated: 10, pendAuditee: 6, pendReviewer: 4, pendManager: 2 },
    { month: "20–30d", notInit: 6, initiated: 9,  pendAuditee: 5, pendReviewer: 4, pendManager: 2 },
    { month: "30–40d", notInit: 5, initiated: 8,  pendAuditee: 5, pendReviewer: 4, pendManager: 2 },
    { month: "1–2mo",  notInit: 6, initiated: 8,  pendAuditee: 5, pendReviewer: 4, pendManager: 2 },
    { month: "2–3mo",  notInit: 5, initiated: 6,  pendAuditee: 4, pendReviewer: 4, pendManager: 2 },
    { month: ">3mo",   notInit: 5, initiated: 5,  pendAuditee: 3, pendReviewer: 3, pendManager: 3 },
  ],
  "Inventory": [
    { month: "0–10d",  notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "10–20d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "20–30d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "30–40d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 1 },
    { month: "1–2mo",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: "2–3mo",  notInit: 1, initiated: 1, pendAuditee: 0, pendReviewer: 0, pendManager: 0 },
    { month: ">3mo",   notInit: 0, initiated: 1, pendAuditee: 0, pendReviewer: 0, pendManager: 1 },
  ],
  "Financial Reporting": [
    { month: "0–10d",  notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 1 },
    { month: "10–20d", notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "20–30d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "30–40d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "1–2mo",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "2–3mo",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: ">3mo",   notInit: 1, initiated: 1, pendAuditee: 0, pendReviewer: 0, pendManager: 0 },
  ],
  "Accounts Receivable": [
    { month: "0–10d",  notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "10–20d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "20–30d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: "30–40d", notInit: 0, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "1–2mo",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: "2–3mo",  notInit: 0, initiated: 1, pendAuditee: 0, pendReviewer: 1, pendManager: 0 },
    { month: ">3mo",   notInit: 1, initiated: 0, pendAuditee: 1, pendReviewer: 0, pendManager: 1 },
  ],
  "Costing": [
    { month: "0–10d",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "10–20d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 1 },
    { month: "20–30d", notInit: 1, initiated: 1, pendAuditee: 0, pendReviewer: 1, pendManager: 0 },
    { month: "30–40d", notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: "1–2mo",  notInit: 0, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "2–3mo",  notInit: 1, initiated: 0, pendAuditee: 1, pendReviewer: 0, pendManager: 1 },
    { month: ">3mo",   notInit: 1, initiated: 1, pendAuditee: 0, pendReviewer: 0, pendManager: 0 },
  ],
  "Control Environment": [
    { month: "0–10d",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: "10–20d", notInit: 1, initiated: 1, pendAuditee: 0, pendReviewer: 1, pendManager: 0 },
    { month: "20–30d", notInit: 0, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: "30–40d", notInit: 1, initiated: 1, pendAuditee: 0, pendReviewer: 1, pendManager: 0 },
    { month: "1–2mo",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 0, pendManager: 0 },
    { month: "2–3mo",  notInit: 0, initiated: 1, pendAuditee: 0, pendReviewer: 1, pendManager: 0 },
    { month: ">3mo",   notInit: 1, initiated: 0, pendAuditee: 1, pendReviewer: 0, pendManager: 1 },
  ],
  "ABAC": [
    { month: "0–10d",  notInit: 2, initiated: 2, pendAuditee: 2, pendReviewer: 1, pendManager: 1 },
    { month: "10–20d", notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 1 },
    { month: "20–30d", notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 1 },
    { month: "30–40d", notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: "1–2mo",  notInit: 1, initiated: 2, pendAuditee: 1, pendReviewer: 1, pendManager: 1 },
    { month: "2–3mo",  notInit: 1, initiated: 1, pendAuditee: 1, pendReviewer: 1, pendManager: 0 },
    { month: ">3mo",   notInit: 1, initiated: 1, pendAuditee: 0, pendReviewer: 1, pendManager: 0 },
  ],
};

// ─── Process performance bars ─────────────────────────────────────────────────
const processPerformanceData = [
  { process: "Inventory",           value: 91.1, color: "#6366f1" },
  { process: "Financial Reporting", value: 94.4, color: "#8b5cf6" },
  { process: "Accounts Receivable", value: 95.1, color: "#ec4899" },
  { process: "Costing",             value: 91.7, color: "#06b6d4" },
  { process: "Control Environment", value: 92.9, color: "#f59e0b" },
  { process: "ABAC",                value: 95.5, color: "#8b5cf4" },
];

// ─── Table data per process ───────────────────────────────────────────────────
const tableDataMap: Record<string, { controlId: string; kpi: string; attr: string; period: string; population: number; exceptions: number; exceptionPct: string }[]> = {
  "All": [
    { controlId: "P-0", kpi: "User Access Review",       attr: "Unauthorized Access",   period: "Q1 2026", population: 1250, exceptions: 7, exceptionPct: "0.56%" },
    { controlId: "P-1", kpi: "Financial Reconciliation", attr: "Balance Mismatch",      period: "Q1 2026", population: 850,  exceptions: 3, exceptionPct: "0.35%" },
    { controlId: "P-2", kpi: "Vendor Approval",          attr: "Missing Authorization", period: "Q1 2026", population: 420,  exceptions: 2, exceptionPct: "0.48%" },
    { controlId: "P-3", kpi: "Data Backup Verification", attr: "Backup Integrity",      period: "Q1 2026", population: 680,  exceptions: 1, exceptionPct: "0.15%" },
  ],
  "Inventory": [
    { controlId: "I-0", kpi: "Stock Count Accuracy",  attr: "Count Variance",   period: "Q1 2026", population: 340, exceptions: 2, exceptionPct: "0.59%" },
    { controlId: "I-1", kpi: "Reorder Level Check",   attr: "Below Threshold",  period: "Q1 2026", population: 210, exceptions: 1, exceptionPct: "0.48%" },
    { controlId: "I-2", kpi: "Obsolete Stock Review",  attr: "Aging Inventory", period: "Q1 2026", population: 180, exceptions: 1, exceptionPct: "0.56%" },
  ],
  "Financial Reporting": [
    { controlId: "F-0", kpi: "GL Reconciliation", attr: "Unreconciled Items", period: "Q1 2026", population: 520, exceptions: 2, exceptionPct: "0.38%" },
    { controlId: "F-1", kpi: "Month-End Close",   attr: "Late Posting",       period: "Q1 2026", population: 310, exceptions: 1, exceptionPct: "0.32%" },
    { controlId: "F-2", kpi: "Financial Statements", attr: "Disclosure Gap",  period: "Q1 2026", population: 240, exceptions: 1, exceptionPct: "0.42%" },
  ],
  "Accounts Receivable": [
    { controlId: "A-0", kpi: "Invoice Approval",  attr: "Missing Sign-off", period: "Q1 2026", population: 460, exceptions: 2, exceptionPct: "0.43%" },
    { controlId: "A-1", kpi: "Credit Limit Check", attr: "Limit Breach",    period: "Q1 2026", population: 280, exceptions: 1, exceptionPct: "0.36%" },
  ],
  "Costing": [
    { controlId: "C-0", kpi: "Cost Allocation Review", attr: "Misallocation",   period: "Q1 2026", population: 390, exceptions: 3, exceptionPct: "0.77%" },
    { controlId: "C-1", kpi: "Standard Cost Update",   attr: "Outdated Rates",  period: "Q1 2026", population: 230, exceptions: 1, exceptionPct: "0.43%" },
  ],
  "Control Environment": [
    { controlId: "CE-0", kpi: "Policy Compliance",   attr: "Policy Breach",        period: "Q1 2026", population: 310, exceptions: 2, exceptionPct: "0.65%" },
    { controlId: "CE-1", kpi: "Training Completion", attr: "Incomplete Training",  period: "Q1 2026", population: 195, exceptions: 1, exceptionPct: "0.51%" },
  ],
  "ABAC": [
    { controlId: "AB-0", kpi: "User Access Review",    attr: "Unauthorized Access", period: "Q1 2026", population: 580, exceptions: 2, exceptionPct: "0.34%" },
    { controlId: "AB-1", kpi: "Role Assignment Audit", attr: "Excess Privileges",   period: "Q1 2026", population: 340, exceptions: 1, exceptionPct: "0.29%" },
  ],
};

// ─── Shared tooltip style ─────────────────────────────────────────────────────
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
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 ${className}`} style={style}>
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2 flex-shrink-0">
      <h3 className="text-xs font-bold text-gray-800 leading-tight">{title}</h3>
      {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Process Filter Dropdown ──────────────────────────────────────────────────
function ProcessFilter({ selected, onChange }: { selected: Process; onChange: (p: Process) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-[11px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200"
        style={{ minWidth: 170 }}
      >
        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
        <span className="flex-1 text-left truncate">{selected === "All" ? "All Processes" : selected}</span>
        <ChevronDown
          className="w-3 h-3 text-gray-400 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          style={{ minWidth: 185, animation: "ddFade 0.15s ease-out" }}
        >
          <div className="py-1">
            {PROCESSES.map((p) => (
              <button
                key={p}
                onClick={() => { onChange(p); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  selected === p ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p === "All" ? "All Processes" : p}
              </button>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes ddFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ExecutiveSummary() {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [selectedProcess, setSelectedProcess] = useState<Process>("All");
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("Monthly");

  const kpi = useMemo(() => processBaseData[selectedProcess] ?? processBaseData["All"], [selectedProcess]);

  const trendChartData = useMemo(() => {
    const map = trendPeriod === "Monthly" ? monthlyTrendData
      : trendPeriod === "Quarterly" ? quarterlyTrendData
      : yearlyTrendData;
    return map[selectedProcess] ?? map["All"];
  }, [selectedProcess, trendPeriod]);

  const currentRadarData   = useMemo(() => statusRadarData[selectedProcess] ?? statusRadarData["All"],   [selectedProcess]);
  const currentLegendData  = useMemo(() => statusLegendMap[selectedProcess] ?? statusLegendMap["All"],   [selectedProcess]);
  const currentAgingData   = useMemo(() => agingData[selectedProcess] ?? agingData["All"],               [selectedProcess]);
  const currentTableData   = useMemo(() => tableDataMap[selectedProcess] ?? tableDataMap["All"],         [selectedProcess]);

  const agingTotals = useMemo(() => ({
    notInit:      currentAgingData.reduce((s, r) => s + r.notInit,      0),
    initiated:    currentAgingData.reduce((s, r) => s + r.initiated,    0),
    pendAuditee:  currentAgingData.reduce((s, r) => s + r.pendAuditee,  0),
  }), [currentAgingData]);

  // KPI donut — Automated vs Manual breakdown
  const kpiDonutData = [
    { name: "Automated Controls", value: kpi.automated },
    { name: "Manual Controls",    value: kpi.manual    },
  ];

  const kpiLegend = [
    { label: "Automated", value: kpi.automated, color: "#10b981" },
    { label: "Manual",    value: kpi.manual,    color: "#f59e0b" },
  ];

  return (
    <div
      className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* ── Thin global filter strip ── */}
      <div
        className="flex items-center justify-between px-3 flex-shrink-0"
        style={{ height: 34, paddingTop: 6 }}
      >
        <span className="text-[11px] font-semibold text-gray-400 tracking-wide">
          Filter by Process
        </span>
        <ProcessFilter selected={selectedProcess} onChange={setSelectedProcess} />
      </div>

      {/* ── 2-row grid ── */}
      <div
        className="w-full overflow-hidden"
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr",
          gap: "10px",
          padding: "6px 12px 12px",
          boxSizing: "border-box",
          height: "calc(100vh - 34px)",
        }}
      >
        {/* ════════════ ROW 1 ════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 min-h-0">

          {/* ── KPI Overview — Automated vs Manual donut only ── */}
          <Card className="sm:col-span-1 xl:col-span-3 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="KPI Overview" subtitle="Key metrics" />

            {/* Donut — Automated vs Manual */}
            <div className="flex items-center justify-center flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpiDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius="42%"
                    outerRadius="72%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-gray-100 flex-shrink-0">
              {kpiLegend.map((kp) => (
                <div key={kp.label} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: kp.color }} />
                    <span className="text-[11px] font-medium text-gray-700">{kp.label} Controls</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-900">{kp.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Control Testing Trend — original area chart + period toggle added ── */}
          <Card className="sm:col-span-2 xl:col-span-6 p-3 flex flex-col min-h-0 overflow-hidden">
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
              <div className="flex items-center gap-1.5 flex-wrap">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                </button>
                {/* Period filter — NEW */}
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  {(["Monthly", "Quarterly", "Yearly"] as TrendPeriod[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setTrendPeriod(p)}
                      className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${
                        trendPeriod === p ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {p === "Monthly" ? "Mo" : p === "Quarterly" ? "Qtr" : "Yr"}
                    </button>
                  ))}
                </div>
                {/* Chart / Table toggle — original */}
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  {(["chart", "table"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all duration-200 ${
                        viewMode === m ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {m === "chart" ? "Chart" : "Table"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              {viewMode === "chart" ? (
                /* ── Original area chart, data driven by process + period ── */
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendChartData} margin={{ top: 6, right: 8, left: 8, bottom: 6 }}>
                    <defs>
                      <linearGradient id="gaA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gaB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="gaC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#93c5fd" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="x" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={32} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="c" name="Band C"    stroke="#93c5fd" fill="url(#gaC)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="b" name="Band B"    stroke="#14b8a6" fill="url(#gaB)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="a" name="Controls"  stroke="#6366f1" fill="url(#gaA)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                /* ── Table view — now shows pass/fail per period ── */
                <div className="rounded-lg border border-gray-200 h-full overflow-auto">
                  <table className="w-full text-[10px] min-w-[480px]">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 sticky top-0">
                      <tr>
                        {["Period", "Total Tested", "Passed", "Failed", "% Pass Rate"].map((h) => (
                          <th key={h} className="px-2 py-2 text-left font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {trendChartData.map((row) => {
                        const total = row.pass + row.fail;
                        const rate  = ((row.pass / total) * 100).toFixed(1) + "%";
                        return (
                          <tr key={row.x} className="hover:bg-indigo-50/40 transition-colors">
                            <td className="px-2 py-2 font-bold text-indigo-600">{row.x}</td>
                            <td className="px-2 py-2 text-right font-medium text-gray-800">{total}</td>
                            <td className="px-2 py-2 text-right">
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">{row.pass}</span>
                            </td>
                            <td className="px-2 py-2 text-right">
                              <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold">{row.fail}</span>
                            </td>
                            <td className="px-2 py-2 text-right font-bold text-red-600">{rate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Legend — original */}
            <div className="flex items-center justify-center gap-5 mt-2 pt-2 border-t border-gray-100 flex-shrink-0 flex-wrap">
              {[
                { c: "from-indigo-500 to-purple-600", lbl: "Controls" },
                { c: "from-blue-500 to-blue-600",     lbl: "Tests"    },
              ].map((it) => (
                <div key={it.lbl} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${it.c} shadow-sm flex-shrink-0`} />
                  <span className="text-[11px] font-semibold text-gray-600">{it.lbl}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Status Distribution — original radar, updated status data ── */}
          <Card className="sm:col-span-1 xl:col-span-3 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Status Distribution" subtitle="Real-time breakdown" />

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={currentRadarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="status"
                    tick={{ fontSize: 8, fill: "#6b7280", fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, "dataMax"]}
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

            {/* Legend — updated statuses, same grid style as original */}
            <div className="pt-2 border-t border-gray-100 flex-shrink-0">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {currentLegendData.map((item) => (
                  <div
                    key={item.lbl}
                    className="flex items-center justify-between hover:bg-gray-50 rounded px-1.5 py-1 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${item.g} flex-shrink-0`} />
                      <span className="text-[10px] font-medium text-gray-700">{item.lbl}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-900">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ════════════ ROW 2 ════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 min-h-0">

          {/* ── Process Performance — original bars, dim non-selected ── */}
          <Card className="sm:col-span-1 xl:col-span-4 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Process Performance" subtitle="Completion rates" />
            <div className="flex flex-col justify-between flex-1 gap-1.5 min-h-0">
              {processPerformanceData.map((item) => (
                <div
                  key={item.process}
                  className="flex-shrink-0 transition-opacity duration-300"
                  style={{ opacity: selectedProcess !== "All" && selectedProcess !== item.process ? 0.25 : 1 }}
                >
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

          {/* ── Control Aging Analysis — aging buckets on X, 5 status stacks, no Completed ── */}
          <Card className="sm:col-span-1 xl:col-span-4 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Control Aging Analysis" subtitle="By aging bucket (excl. Completed)" />
            <div className="flex flex-1 min-h-0 gap-2">
              {/* Desktop legend — same style as original */}
              <div className="hidden sm:flex flex-col justify-center gap-2 flex-shrink-0 min-w-[76px]">
                {[
                  { g: "from-slate-400 to-slate-500",   val: agingTotals.notInit,     lbl: "Not Init." },
                  { g: "from-indigo-500 to-indigo-600",  val: agingTotals.initiated,   lbl: "Initiated" },
                  { g: "from-yellow-500 to-yellow-600",  val: agingTotals.pendAuditee, lbl: "Pend.Aud." },
                  { g: "from-purple-500 to-purple-600",  val: 0,                        lbl: "Pend.Rev." },
                  { g: "from-pink-500 to-pink-600",      val: 0,                        lbl: "Pend.Mgr." },
                ].map((it) => (
                  <div key={it.lbl} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded bg-gradient-to-br ${it.g} shadow-sm flex-shrink-0`} />
                    <span className="text-[10px] font-medium text-gray-700">{it.lbl}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1 min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentAgingData}
                    barSize={10}
                    margin={{ top: 6, right: 4, left: -18, bottom: 6 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      tick={{ fontSize: 8 }}
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
                    <Bar dataKey="notInit"      name="Not Init."   stackId="a" fill="#94a3b8" />
                    <Bar dataKey="initiated"    name="Initiated"   stackId="a" fill="#6366f1" />
                    <Bar dataKey="pendAuditee"  name="Pend.Aud."   stackId="a" fill="#f59e0b" />
                    <Bar dataKey="pendReviewer" name="Pend.Rev."   stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="pendManager"  name="Pend.Mgr."   stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mobile legend */}
            <div className="sm:hidden flex items-center justify-center gap-3 pt-2 border-t border-gray-100 flex-shrink-0 flex-wrap">
              {[
                { g: "from-slate-400 to-slate-500",   lbl: "Not Init." },
                { g: "from-indigo-500 to-indigo-600",  lbl: "Initiated" },
                { g: "from-yellow-500 to-yellow-600",  lbl: "Pend.Aud." },
                { g: "from-purple-500 to-purple-600",  lbl: "Pend.Rev." },
                { g: "from-pink-500 to-pink-600",      lbl: "Pend.Mgr." },
              ].map((it) => (
                <div key={it.lbl} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded bg-gradient-to-br ${it.g} shadow-sm flex-shrink-0`} />
                  <span className="text-[10px] font-medium text-gray-700">{it.lbl}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Exception Trend — untouched original ── */}
          <Card className="sm:col-span-2 xl:col-span-4 p-3 flex flex-col min-h-0 overflow-hidden">
            <SectionTitle title="Exception Trend" subtitle="Last 6 months by severity" />

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: "Jul", critical: 3, high: 5, medium: 9,  low: 14 },
                    { month: "Aug", critical: 4, high: 6, medium: 11, low: 16 },
                    { month: "Sep", critical: 2, high: 5, medium: 8,  low: 13 },
                    { month: "Oct", critical: 3, high: 6, medium: 10, low: 15 },
                    { month: "Nov", critical: 2, high: 4, medium: 7,  low: 12 },
                    { month: "Dec", critical: 3, high: 5, medium: 9,  low: 14 },
                  ]}
                  margin={{ top: 6, right: 8, left: 0, bottom: 6 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  {(
                    [
                      { key: "critical", color: "#ef4444" },
                      { key: "high",     color: "#f97316" },
                      { key: "medium",   color: "#eab308" },
                      { key: "low",      color: "#3b82f6" },
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
                { g: "from-red-500 to-red-600",       lbl: "Critical" },
                { g: "from-orange-500 to-orange-600", lbl: "High"     },
                { g: "from-yellow-500 to-yellow-600", lbl: "Medium"   },
                { g: "from-blue-500 to-blue-600",     lbl: "Low"      },
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