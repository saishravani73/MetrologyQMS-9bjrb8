import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Archive, QrCode, Download, Upload, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import { getCalibrationStatus, getDaysRemaining, getDaysRemainingLabel } from '@/lib/deadlineUtils';
import { CalibStatusBadge, ToolStatusBadge, InspectionBadge, PriorityBadge } from '@/components/features/StatusBadge';
import { getPriority } from '@/lib/deadlineUtils';
import { MOCK_CALIBRATION_HISTORY } from '@/lib/mockData';
import { format } from 'date-fns';

const MOCK_DOCS = [
  { id: 'd1', name: 'Calibration Certificate 2024', type: 'CALIBRATION_CERTIFICATE', uploadedBy: 'Priya Sharma', date: '2024-01-10', version: 'v1.0', size: '1.2 MB' },
  { id: 'd2', name: 'Inspection Report Q2-2024', type: 'INSPECTION_REPORT', uploadedBy: 'Rajesh Kumar', date: '2024-07-10', version: 'v1.0', size: '0.8 MB' },
];

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToolById } = useTools();
  const tool = getToolById(id || '');

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle size={40} className="text-muted-foreground mb-3" />
        <div className="text-lg font-semibold">Tool Not Found</div>
        <div className="text-sm text-muted-foreground mb-4">No instrument with ID "{id}" exists in the database.</div>
        <button onClick={() => navigate('/tools')} className="text-sm text-blue-600 hover:underline">
          ← Return to Tool Register
        </button>
      </div>
    );
  }

  const calibStatus = getCalibrationStatus(tool.expiryDate);
  const priority = getPriority(tool.expiryDate);
  const daysLabel = getDaysRemainingLabel(tool.expiryDate);
  const daysNum = getDaysRemaining(tool.expiryDate);
  const history = MOCK_CALIBRATION_HISTORY.filter((h) => h.toolId === id);

  const typeIcons: Record<string, React.ReactNode> = {
    CALIBRATION: <CheckCircle size={14} className="text-green-600" />,
    INSPECTION: <Clock size={14} className="text-blue-600" />,
    REMINDER: <AlertCircle size={14} className="text-amber-600" />,
    ESCALATION: <AlertCircle size={14} className="text-red-600" />,
    IMPORT: <Upload size={14} className="text-slate-600" />,
    NOTE: <Calendar size={14} className="text-slate-600" />,
  };

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded hover:bg-muted transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground">{tool.toolName}</h1>
              <CalibStatusBadge status={calibStatus} />
              <PriorityBadge priority={priority} />
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">{tool.id} · {tool.serialNumber}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted">
            <QrCode size={13} /> QR Code
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted">
            <Edit size={13} /> Edit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted text-red-600">
            <Archive size={13} /> Archive
          </button>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Instrument Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded p-4">
            <div className="section-header">Instrument Details</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: 'Tool ID', value: tool.id },
                { label: 'Tool Name', value: tool.toolName },
                { label: 'Category', value: tool.category },
                { label: 'Manufacturer', value: tool.manufacturer },
                { label: 'Model Number', value: tool.modelNumber || '—' },
                { label: 'Serial Number', value: tool.serialNumber },
                { label: 'Range', value: tool.range || '—' },
                { label: 'Accuracy', value: tool.accuracy || '—' },
                { label: 'Department', value: tool.department },
                { label: 'Storage Location', value: tool.storageLocation || '—' },
                { label: 'Responsible Person', value: tool.responsiblePerson || '—' },
                { label: 'Tool Status', value: <ToolStatusBadge status={tool.toolStatus} /> },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card border border-border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="section-header mb-0">Documents</div>
              <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                <Upload size={12} /> Upload Document
              </button>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Version</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {MOCK_DOCS.map((d) => (
                  <tr key={d.id}>
                    <td className="font-medium text-sm">{d.name}</td>
                    <td><span className="text-xs text-muted-foreground">{d.type.replace('_', ' ')}</span></td>
                    <td><span className="text-xs">{d.uploadedBy}</span></td>
                    <td><span className="text-xs text-muted-foreground">{d.date}</span></td>
                    <td><span className="text-xs bg-muted px-1.5 py-0.5 rounded">{d.version}</span></td>
                    <td>
                      <button className="p-1 hover:bg-muted rounded">
                        <Download size={13} className="text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Calibration Panel */}
          <div className={`border rounded p-4 ${calibStatus === 'OVERDUE' ? 'border-red-200 bg-red-50/50' : calibStatus === 'DUE_TODAY' ? 'border-orange-200 bg-orange-50/50' : 'bg-card border-border'}`}>
            <div className="section-header">Calibration Information</div>
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Last Calibration</div>
                <div className="text-sm font-medium">{tool.calibrationDate || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Calibration Expiry</div>
                <div className={`text-sm font-bold ${calibStatus === 'OVERDUE' ? 'text-red-700' : calibStatus === 'DUE_TODAY' ? 'text-orange-700' : 'text-foreground'}`}>
                  {tool.expiryDate || '—'}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Days Remaining</div>
                <div className={`text-base font-bold ${calibStatus === 'OVERDUE' ? 'text-red-700' : calibStatus === 'DUE_TODAY' ? 'text-orange-700' : 'text-foreground'}`}>
                  {daysLabel}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Frequency</div>
                <div className="text-sm">{tool.calibrationFrequencyMonths} months</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Calibration Agency</div>
                <div className="text-xs text-muted-foreground">{tool.calibrationAgency || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Certificate No.</div>
                <div className="text-xs font-mono">{tool.certificateNumber || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Last Result</div>
                <div className="text-sm font-medium text-green-700">{tool.lastCalibrationResult || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</div>
                <CalibStatusBadge status={calibStatus} />
              </div>
            </div>
          </div>

          {/* Inspection Panel */}
          <div className="bg-card border border-border rounded p-4">
            <div className="section-header">Inspection Information</div>
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Last Inspection</div>
                <div className="text-sm">{tool.inspectionDate || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Next Inspection</div>
                <div className="text-sm">{tool.nextInspectionDate || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Inspection Status</div>
                <InspectionBadge status={tool.inspectionStatus} />
              </div>
            </div>
          </div>

          {/* Risk */}
          <div className="bg-card border border-border rounded p-4">
            <div className="section-header">Risk Assessment</div>
            <div className={`text-2xl font-bold mb-1 ${tool.riskLevel === 'HIGH' ? 'text-red-600' : tool.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'}`}>
              {tool.riskLevel || 'LOW'}
            </div>
            <div className="text-xs text-muted-foreground">
              {tool.riskLevel === 'HIGH' ? 'High-value precision instrument with frequent use. Prioritize calibration.' :
               tool.riskLevel === 'MEDIUM' ? 'Moderate usage. Monitor calibration schedule closely.' :
               'Standard risk. Follow routine calibration schedule.'}
            </div>
          </div>
        </div>
      </div>

      {/* Calibration History Timeline */}
      <div className="bg-card border border-border rounded p-4">
        <div className="section-header">Calibration & Inspection History</div>
        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4 text-center">No history records available for this instrument.</div>
        ) : (
          <div className="relative pl-6 space-y-3">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
            {history.map((h) => (
              <div key={h.id} className="relative flex gap-3 items-start">
                <div className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-card z-10 flex items-center justify-center"
                  style={{ background: h.type === 'CALIBRATION' ? 'hsl(142 60% 30%)' : h.type === 'ESCALATION' ? 'hsl(0 72% 51%)' : h.type === 'REMINDER' ? 'hsl(38 92% 45%)' : 'hsl(214 60% 40%)' }} />
                <div className="flex gap-3 items-start flex-1">
                  <span className="text-xs font-mono text-muted-foreground w-24 flex-shrink-0 mt-0.5">{h.date}</span>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {typeIcons[h.type]}
                      <span className="text-xs font-semibold text-foreground">{h.type}</span>
                      {h.certificateRef && <span className="text-[10px] font-mono text-muted-foreground">{h.certificateRef}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{h.description}</div>
                    {h.performedBy && <div className="text-[10px] text-muted-foreground mt-0.5">By: {h.performedBy}</div>}
                    {h.result && <span className={`text-[10px] font-bold ${h.result === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>{h.result}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
