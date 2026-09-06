import { useState } from 'react';
import { FileText, Upload, Download, Search } from 'lucide-react';
import { useTools } from '@/hooks/useTools';

const MOCK_ALL_DOCS = [
  { id: 'd001', toolId: 'HAL-QM-001', toolName: 'Digital Vernier Caliper 150mm', name: 'Calibration Certificate 2024', type: 'CALIBRATION_CERTIFICATE', uploadedBy: 'Priya Sharma', date: '2024-01-10', version: 'v1.0', size: '1.2 MB' },
  { id: 'd002', toolId: 'HAL-QM-001', toolName: 'Digital Vernier Caliper 150mm', name: 'Inspection Report Q2-2024', type: 'INSPECTION_REPORT', uploadedBy: 'Rajesh Kumar', date: '2024-07-10', version: 'v1.0', size: '0.8 MB' },
  { id: 'd003', toolId: 'HAL-QM-007', toolName: 'Height Gauge Digital 300mm', name: 'Calibration Certificate 2024', type: 'CALIBRATION_CERTIFICATE', uploadedBy: 'Rajesh Kumar', date: '2024-01-15', version: 'v2.0', size: '0.9 MB' },
  { id: 'd004', toolId: 'HAL-QM-003', toolName: 'Pressure Gauge 0-100 Bar', name: 'Service Record 2024', type: 'MAINTENANCE_RECORD', uploadedBy: 'Anil Verma', date: '2024-03-01', version: 'v1.0', size: '0.5 MB' },
  { id: 'd005', toolId: 'HAL-QM-010', toolName: 'CMM Touch Probe', name: 'Manufacturer Specification Sheet', type: 'MANUFACTURER_SPEC', uploadedBy: 'Kavitha Rajan', date: '2023-05-01', version: 'v1.0', size: '2.4 MB' },
  { id: 'd006', toolId: 'HAL-QM-002', toolName: 'Outside Micrometer 0-25mm', name: 'Calibration Certificate 2024-REV1', type: 'CALIBRATION_CERTIFICATE', uploadedBy: 'Priya Sharma', date: '2024-08-05', version: 'v1.1', size: '1.1 MB' },
];

const TYPE_LABELS: Record<string, string> = {
  CALIBRATION_CERTIFICATE: 'Calibration Certificate',
  INSPECTION_REPORT: 'Inspection Report',
  MAINTENANCE_RECORD: 'Maintenance Record',
  REPAIR_REPORT: 'Repair Report',
  PURCHASE_DOCUMENT: 'Purchase Document',
  MANUFACTURER_SPEC: 'Manufacturer Spec',
};

export default function Documents() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = MOCK_ALL_DOCS.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.toolId.toLowerCase().includes(q) || d.toolName.toLowerCase().includes(q);
    const matchType = typeFilter === 'ALL' || d.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={22} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold">Document Management</h1>
            <p className="text-xs text-muted-foreground">Calibration certificates, inspection reports, and controlled documents</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded text-white"
          style={{ background: 'hsl(var(--primary))' }}>
          <Upload size={13} /> Upload Document
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents, tool ID..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded bg-background focus:outline-none" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2.5 py-2 text-xs border border-border rounded bg-background">
          <option value="ALL">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="border border-border rounded overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Type</th>
              <th>Tool ID</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Version</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {filtered.map((d) => (
              <tr key={d.id}>
                <td className="font-medium text-sm">{d.name}</td>
                <td><span className="text-xs bg-muted px-1.5 py-0.5 rounded">{TYPE_LABELS[d.type] || d.type}</span></td>
                <td><span className="font-mono text-xs text-blue-700">{d.toolId}</span></td>
                <td><span className="text-xs">{d.uploadedBy}</span></td>
                <td><span className="text-xs text-muted-foreground">{d.date}</span></td>
                <td><span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{d.version}</span></td>
                <td><span className="text-xs text-muted-foreground">{d.size}</span></td>
                <td>
                  <button className="p-1 hover:bg-muted rounded text-blue-600">
                    <Download size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
