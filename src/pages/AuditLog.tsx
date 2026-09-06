import { useState } from 'react';
import { Shield, Search } from 'lucide-react';
import { MOCK_AUDIT_LOG } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

const MODULE_COLORS: Record<string, string> = {
  'Tool Register': 'bg-blue-50 text-blue-700',
  'Notification Engine': 'bg-amber-50 text-amber-700',
  'Escalation Engine': 'bg-red-50 text-red-700',
  'Documents': 'bg-teal-50 text-teal-700',
  'Data Import': 'bg-indigo-50 text-indigo-700',
  'Calibration': 'bg-green-50 text-green-700',
  'Tasks': 'bg-purple-50 text-purple-700',
  'User Management': 'bg-slate-50 text-slate-700',
};

export default function AuditLog() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const navigate = useNavigate();

  const modules = [...new Set(MOCK_AUDIT_LOG.map((e) => e.module))];
  const filtered = MOCK_AUDIT_LOG.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.userName.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || (e.toolId || '').toLowerCase().includes(q);
    const matchModule = moduleFilter === 'ALL' || e.module === moduleFilter;
    return matchSearch && matchModule;
  });

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center gap-3">
        <Shield size={22} className="text-primary" />
        <div>
          <h1 className="text-lg font-bold">Audit Log</h1>
          <p className="text-xs text-muted-foreground">Complete read-only trail of all system actions and user modifications</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded px-4 py-2 text-xs text-amber-800 font-medium">
        Audit logs are read-only. All entries are system-generated and cannot be modified or deleted.
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, action, Tool ID..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded bg-background focus:outline-none" />
        </div>
        <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}
          className="px-2.5 py-2 text-xs border border-border rounded bg-background">
          <option value="ALL">All Modules</option>
          {modules.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="border border-border rounded overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Module</th>
              <th>Action</th>
              <th>Tool</th>
              <th>Previous Value</th>
              <th>New Value</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {filtered.map((entry) => (
              <tr key={entry.id}>
                <td><span className="text-xs font-mono text-muted-foreground">{entry.timestamp.replace('T', ' ').slice(0, 19)}</span></td>
                <td>
                  <div className="text-xs font-medium">{entry.userName}</div>
                  <div className="text-[10px] text-muted-foreground">{entry.userId}</div>
                </td>
                <td>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${MODULE_COLORS[entry.module] || 'bg-muted text-muted-foreground'}`}>
                    {entry.module}
                  </span>
                </td>
                <td><span className="text-xs">{entry.action}</span></td>
                <td>
                  {entry.toolId ? (
                    <button className="font-mono text-xs text-blue-700 hover:underline"
                      onClick={() => navigate(`/tools/${entry.toolId}`)}>
                      {entry.toolId}
                    </button>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
                <td><span className="text-xs text-muted-foreground">{entry.oldValue || '—'}</span></td>
                <td><span className="text-xs font-medium">{entry.newValue || '—'}</span></td>
                <td><span className="text-xs font-mono text-muted-foreground">{entry.ipAddress || 'System'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
