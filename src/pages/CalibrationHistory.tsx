import { useState } from 'react';
import { Search, History } from 'lucide-react';
import { MOCK_CALIBRATION_HISTORY } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

const typeColors: Record<string, string> = {
  CALIBRATION: 'bg-green-100 text-green-700',
  INSPECTION: 'bg-blue-100 text-blue-700',
  REMINDER: 'bg-amber-100 text-amber-700',
  ESCALATION: 'bg-red-100 text-red-700',
  IMPORT: 'bg-slate-100 text-slate-700',
  NOTE: 'bg-slate-100 text-slate-600',
};

export default function CalibrationHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const navigate = useNavigate();

  const filtered = MOCK_CALIBRATION_HISTORY.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch = !q || h.toolId.toLowerCase().includes(q) || h.description.toLowerCase().includes(q);
    const matchType = typeFilter === 'ALL' || h.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <History size={22} className="text-primary" />
        <div>
          <h1 className="text-lg font-bold">Calibration History</h1>
          <p className="text-xs text-muted-foreground">Complete event log for all instruments</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Tool ID or description..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2.5 py-2 text-xs border border-border rounded bg-background focus:outline-none">
          <option value="ALL">All Events</option>
          {['CALIBRATION', 'INSPECTION', 'REMINDER', 'ESCALATION', 'IMPORT', 'NOTE'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Tool ID</th>
              <th>Event Type</th>
              <th>Description</th>
              <th>Performed By</th>
              <th>Result</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {filtered.map((h) => (
              <tr key={h.id} className="cursor-pointer" onClick={() => navigate(`/tools/${h.toolId}`)}>
                <td><span className="text-xs font-mono">{h.date}</span></td>
                <td><span className="text-xs font-mono font-semibold text-blue-700">{h.toolId}</span></td>
                <td><span className={`text-xs font-semibold px-2 py-0.5 rounded ${typeColors[h.type] || 'bg-slate-100 text-slate-600'}`}>{h.type}</span></td>
                <td><span className="text-xs text-muted-foreground">{h.description}</span></td>
                <td><span className="text-xs">{h.performedBy || '—'}</span></td>
                <td>
                  {h.result && (
                    <span className={`text-xs font-semibold ${h.result === 'PASSED' ? 'text-green-700' : 'text-red-700'}`}>{h.result}</span>
                  )}
                </td>
                <td><span className="text-xs font-mono text-muted-foreground">{h.certificateRef || '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
