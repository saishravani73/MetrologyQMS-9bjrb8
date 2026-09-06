import { useNavigate } from 'react-router-dom';
import { Tool } from '@/types';
import { getCalibrationStatus, getDaysRemainingLabel, getPriority } from '@/lib/deadlineUtils';
import { CalibStatusBadge, PriorityBadge } from '@/components/features/StatusBadge';
import { ExternalLink, Eye } from 'lucide-react';

interface DeadlineTableProps {
  tools: Tool[];
  title?: string;
  maxRows?: number;
  showAll?: boolean;
}

export default function DeadlineTable({ tools, title = 'Upcoming Calibration Deadlines', maxRows = 10, showAll }: DeadlineTableProps) {
  const navigate = useNavigate();

  const critical = tools
    .filter((t) => {
      const s = getCalibrationStatus(t.expiryDate);
      return s !== 'VALID' && s !== 'UNDER_CALIBRATION';
    })
    .sort((a, b) => {
      const pa = ['OVERDUE', 'DUE_TODAY', 'DUE_TOMORROW', 'DUE_WITHIN_7', 'DUE_WITHIN_30'].indexOf(getCalibrationStatus(a.expiryDate));
      const pb = ['OVERDUE', 'DUE_TODAY', 'DUE_TOMORROW', 'DUE_WITHIN_7', 'DUE_WITHIN_30'].indexOf(getCalibrationStatus(b.expiryDate));
      return pa - pb;
    });

  const displayed = showAll ? critical : critical.slice(0, maxRows);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="section-header mb-0">{title}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{critical.length} items requiring attention</span>
          {!showAll && critical.length > maxRows && (
            <button
              onClick={() => navigate('/calibration/upcoming')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              View All <ExternalLink size={11} />
            </button>
          )}
        </div>
      </div>

      <div className="border border-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Tool ID</th>
                <th>Tool Name</th>
                <th>Department</th>
                <th>Due Date</th>
                <th>Days Remaining</th>
                <th>Responsible Person</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-muted-foreground text-sm">
                    No pending calibration deadlines. All tools are valid.
                  </td>
                </tr>
              ) : (
                displayed.map((tool) => {
                  const status = getCalibrationStatus(tool.expiryDate);
                  const priority = getPriority(tool.expiryDate);
                  const daysLabel = getDaysRemainingLabel(tool.expiryDate);
                  const isOverdue = status === 'OVERDUE';
                  return (
                    <tr
                      key={tool.id}
                      className={`cursor-pointer ${isOverdue ? 'bg-red-50/40' : status === 'DUE_TODAY' ? 'bg-orange-50/30' : ''}`}
                      onClick={() => navigate(`/tools/${tool.id}`)}
                    >
                      <td><PriorityBadge priority={priority} /></td>
                      <td>
                        <span className="font-mono text-xs font-semibold text-blue-700">{tool.id}</span>
                      </td>
                      <td>
                        <span className="text-sm font-medium text-foreground">{tool.toolName}</span>
                      </td>
                      <td><span className="text-xs text-muted-foreground">{tool.department}</span></td>
                      <td>
                        <span className={`text-xs font-semibold ${isOverdue ? 'text-red-700' : status === 'DUE_TODAY' ? 'text-orange-700' : 'text-foreground'}`}>
                          {tool.expiryDate || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs font-bold ${isOverdue ? 'text-red-700' : status === 'DUE_TODAY' ? 'text-orange-700' : status === 'DUE_TOMORROW' ? 'text-amber-700' : 'text-blue-700'}`}>
                          {daysLabel}
                        </span>
                      </td>
                      <td><span className="text-xs">{tool.responsiblePerson || '—'}</span></td>
                      <td><span className="text-xs text-muted-foreground">{tool.storageLocation || '—'}</span></td>
                      <td><CalibStatusBadge status={status} compact /></td>
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
    </div>
  );
}
