import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Search } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import { InspectionBadge } from '@/components/features/StatusBadge';
import { DEPARTMENTS } from '@/constants';

export default function Inspection() {
  const { tools } = useTools();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTools = tools.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.toolName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchDept = deptFilter === 'ALL' || t.department === deptFilter;
    const matchStatus = statusFilter === 'ALL' || t.inspectionStatus === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const stats = {
    total: tools.length,
    passed: tools.filter((t) => t.inspectionStatus === 'PASSED').length,
    due: tools.filter((t) => t.inspectionStatus === 'DUE').length,
    overdue: tools.filter((t) => t.inspectionStatus === 'OVERDUE').length,
    failed: tools.filter((t) => t.inspectionStatus === 'FAILED').length,
  };

  return (
    <div className="max-w-[1400px] space-y-4">
      <div className="flex items-center gap-3">
        <ClipboardCheck size={22} className="text-primary" />
        <div>
          <h1 className="text-lg font-bold">Inspection Management</h1>
          <p className="text-xs text-muted-foreground">Track inspection schedules and status for all instruments</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Passed', value: stats.passed, color: 'text-green-700' },
          { label: 'Due', value: stats.due, color: 'text-amber-700' },
          { label: 'Overdue', value: stats.overdue, color: 'text-red-700' },
          { label: 'Failed', value: stats.failed, color: 'text-red-700' },
        ].map((s) => (
          <div key={s.label} className="metric-card">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded bg-background focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-2 text-xs border border-border rounded bg-background">
          <option value="ALL">All Statuses</option>
          {['PASSED', 'DUE', 'OVERDUE', 'FAILED', 'PENDING'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
          className="px-2.5 py-2 text-xs border border-border rounded bg-background">
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="border border-border rounded overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Tool ID</th>
              <th>Tool Name</th>
              <th>Department</th>
              <th>Last Inspection</th>
              <th>Next Inspection</th>
              <th>Inspection Status</th>
              <th>Responsible Person</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {filteredTools.slice(0, 30).map((t) => (
              <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/tools/${t.id}`)}>
                <td><span className="font-mono text-xs font-semibold text-blue-700">{t.id}</span></td>
                <td><span className="text-sm font-medium">{t.toolName}</span></td>
                <td><span className="text-xs text-muted-foreground">{t.department}</span></td>
                <td><span className="text-xs">{t.inspectionDate || '—'}</span></td>
                <td><span className={`text-xs ${!t.nextInspectionDate ? 'text-red-600 font-medium' : 'text-foreground'}`}>{t.nextInspectionDate || 'NOT SET'}</span></td>
                <td><InspectionBadge status={t.inspectionStatus} /></td>
                <td><span className="text-xs">{t.responsiblePerson || '—'}</span></td>
                <td><span className="text-xs text-muted-foreground">{t.storageLocation || '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
