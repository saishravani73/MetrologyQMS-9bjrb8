import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Download, Plus, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import { getCalibrationStatus } from '@/lib/deadlineUtils';
import { CalibStatusBadge, ToolStatusBadge } from '@/components/features/StatusBadge';
import { DEPARTMENTS, TOOL_CATEGORIES } from '@/constants';
import { CalibrationStatus } from '@/types';

const STATUS_OPTIONS: { value: CalibrationStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'DUE_TODAY', label: 'Due Today' },
  { value: 'DUE_TOMORROW', label: 'Due Tomorrow' },
  { value: 'DUE_WITHIN_7', label: 'Due ≤7 Days' },
  { value: 'DUE_WITHIN_30', label: 'Due ≤30 Days' },
  { value: 'VALID', label: 'Valid' },
];

export default function ToolRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    filteredTools, paginatedTools, totalPages, page, setPage,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    departmentFilter, setDepartmentFilter,
  } = useTools();

  useEffect(() => {
    const q = searchParams.get('q');
    const s = searchParams.get('status') as CalibrationStatus;
    if (q) setSearchQuery(q);
    if (s) setStatusFilter(s);
  }, []);

  const handleExport = () => {
    const rows = [
      ['Tool ID', 'Tool Name', 'Category', 'Department', 'Expiry Date', 'Status', 'Responsible Person', 'Location'],
      ...filteredTools.map((t) => [
        t.id, t.toolName, t.category, t.department, t.expiryDate,
        getCalibrationStatus(t.expiryDate), t.responsiblePerson, t.storageLocation,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `tool-register-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Tool Register</h1>
          <p className="text-xs text-muted-foreground">{filteredTools.length} instruments · Showing page {page} of {totalPages}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted transition-colors">
            <Download size={13} /> Export CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded text-white transition-colors"
            style={{ background: 'hsl(var(--primary))' }}>
            <Plus size={13} /> Add Tool
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search by Tool ID, Name, Serial No., Person, Department, Location..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <X size={13} className="text-muted-foreground" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as CalibrationStatus | 'ALL'); setPage(1); }}
          className="px-2.5 py-2 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
          className="px-2.5 py-2 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1"
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs border border-border rounded hover:bg-muted"
        >
          <Filter size={13} /> Filters
        </button>
        {(statusFilter !== 'ALL' || departmentFilter !== 'ALL' || searchQuery) && (
          <button
            onClick={() => { setStatusFilter('ALL'); setDepartmentFilter('ALL'); setSearchQuery(''); setPage(1); }}
            className="text-xs text-red-600 hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Tool ID</th>
                <th>Tool Name</th>
                <th>Category</th>
                <th>Department</th>
                <th>Serial No.</th>
                <th>Calibration Expiry</th>
                <th>Calib. Status</th>
                <th>Inspection</th>
                <th>Responsible</th>
                <th>Location</th>
                <th>Tool Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {paginatedTools.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-10 text-muted-foreground">
                    No instruments found matching the current filters.
                  </td>
                </tr>
              ) : (
                paginatedTools.map((tool) => {
                  const calibStatus = getCalibrationStatus(tool.expiryDate);
                  return (
                    <tr key={tool.id} className="cursor-pointer" onClick={() => navigate(`/tools/${tool.id}`)}>
                      <td>
                        <span className="font-mono text-xs font-semibold text-blue-700">{tool.id}</span>
                      </td>
                      <td>
                        <div className="font-medium text-sm text-foreground">{tool.toolName}</div>
                        <div className="text-[10px] text-muted-foreground">{tool.manufacturer}</div>
                      </td>
                      <td><span className="text-xs text-muted-foreground">{tool.category}</span></td>
                      <td><span className="text-xs">{tool.department}</span></td>
                      <td><span className="font-mono text-xs text-muted-foreground">{tool.serialNumber}</span></td>
                      <td>
                        <span className={`text-xs font-medium ${calibStatus === 'OVERDUE' ? 'text-red-700' : 'text-foreground'}`}>
                          {tool.expiryDate || '—'}
                        </span>
                      </td>
                      <td><CalibStatusBadge status={calibStatus} compact /></td>
                      <td>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                          tool.inspectionStatus === 'PASSED' ? 'bg-green-50 text-green-700' :
                          tool.inspectionStatus === 'FAILED' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>{tool.inspectionStatus}</span>
                      </td>
                      <td><span className="text-xs">{tool.responsiblePerson || '—'}</span></td>
                      <td><span className="text-xs text-muted-foreground">{tool.storageLocation || '—'}</span></td>
                      <td><ToolStatusBadge status={tool.toolStatus} /></td>
                      <td>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/tools/${tool.id}`); }}
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                        >
                          <Eye size={14} className="text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, filteredTools.length)} of {filteredTools.length} instruments
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="p-1.5 rounded border border-border hover:bg-muted disabled:opacity-40">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-2.5 py-1 text-xs rounded border ${p === page ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="p-1.5 rounded border border-border hover:bg-muted disabled:opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
