import { useState } from 'react';
import { BarChart2, Download, FileText } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import { getDashboardStats, getCalibrationStatus } from '@/lib/deadlineUtils';
import { DEPARTMENTS } from '@/constants';
import { format } from 'date-fns';

const REPORTS = [
  { id: 'overdue', label: 'Overdue Calibration Report', desc: 'All instruments past calibration expiry date', category: 'Critical' },
  { id: 'due7', label: 'Due Within 7 Days Report', desc: 'Instruments expiring in the next 7 days', category: 'Upcoming' },
  { id: 'due30', label: 'Due Within 30 Days Report', desc: 'Instruments expiring in the next 30 days', category: 'Upcoming' },
  { id: 'monthly', label: 'Monthly Calibration Report', desc: 'Summary of calibrations for the current month', category: 'Periodic' },
  { id: 'dept', label: 'Department-wise Report', desc: 'Calibration status breakdown by department', category: 'Management' },
  { id: 'inspection', label: 'Inspection Status Report', desc: 'All instruments with inspection status', category: 'Inspection' },
  { id: 'compliance', label: 'Calibration Compliance KPI', desc: 'Compliance percentage and trend analysis', category: 'Management' },
  { id: 'audit', label: 'Audit Trail Report', desc: 'Complete audit log with user actions', category: 'Audit' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Critical: 'bg-red-50 text-red-700 border-red-200',
  Upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  Periodic: 'bg-blue-50 text-blue-700 border-blue-200',
  Management: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Inspection: 'bg-teal-50 text-teal-700 border-teal-200',
  Audit: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function Reports() {
  const { tools } = useTools();
  const stats = getDashboardStats(tools);
  const [generating, setGenerating] = useState<string | null>(null);
  const [dept, setDept] = useState('ALL');

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 1500);
  };

  const deptData = DEPARTMENTS.map((d) => {
    const dTools = tools.filter((t) => t.department === d);
    const overdue = dTools.filter((t) => getCalibrationStatus(t.expiryDate) === 'OVERDUE').length;
    const valid = dTools.filter((t) => getCalibrationStatus(t.expiryDate) === 'VALID').length;
    const compliance = dTools.length > 0 ? Math.round(((dTools.length - overdue) / dTools.length) * 100) : 100;
    return { dept: d, total: dTools.length, overdue, valid, compliance };
  }).filter((d) => d.total > 0);

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <BarChart2 size={22} className="text-primary" />
        <div>
          <h1 className="text-lg font-bold">Reports</h1>
          <p className="text-xs text-muted-foreground">Generate and export calibration and compliance reports</p>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="bg-card border border-border rounded p-4">
        <div className="section-header">Calibration Compliance KPI</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-3xl font-bold" style={{ color: stats.compliancePercent >= 95 ? 'hsl(142 60% 30%)' : 'hsl(38 92% 45%)' }}>
              {stats.compliancePercent}%
            </div>
            <div className="text-xs text-muted-foreground">Current Compliance</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Instruments</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-700">{stats.overdue}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">{stats.valid}</div>
            <div className="text-xs text-muted-foreground">Fully Valid</div>
          </div>
        </div>
      </div>

      {/* Department Table */}
      <div className="bg-card border border-border rounded p-4">
        <div className="section-header">Department-wise Compliance</div>
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Total</th>
              <th>Valid</th>
              <th>Overdue</th>
              <th>Compliance %</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {deptData.map((d) => (
              <tr key={d.dept}>
                <td className="font-medium text-sm">{d.dept}</td>
                <td><span className="text-sm">{d.total}</span></td>
                <td><span className="text-sm text-green-700 font-medium">{d.valid}</span></td>
                <td><span className={`text-sm font-medium ${d.overdue > 0 ? 'text-red-700' : 'text-muted-foreground'}`}>{d.overdue}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5 max-w-[80px]">
                      <div className="h-1.5 rounded-full" style={{ width: `${d.compliance}%`, background: d.compliance >= 95 ? 'hsl(142 60% 30%)' : 'hsl(38 92% 45%)' }} />
                    </div>
                    <span className={`text-xs font-bold ${d.compliance >= 95 ? 'text-green-700' : 'text-amber-700'}`}>{d.compliance}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Cards */}
      <div>
        <div className="section-header">Generate Reports</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REPORTS.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-muted mt-0.5"><FileText size={15} className="text-muted-foreground" /></div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{r.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                  <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded border ${CATEGORY_COLORS[r.category]}`}>{r.category}</span>
                </div>
              </div>
              <button
                onClick={() => handleGenerate(r.id)}
                disabled={generating === r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted flex-shrink-0 disabled:opacity-60"
              >
                <Download size={12} />
                {generating === r.id ? 'Generating...' : 'Export'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
