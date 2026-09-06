import { CalibrationStatus, Priority, InspectionStatus, ToolStatus, TaskStatus } from '@/types';

interface CalibStatusProps { status: CalibrationStatus; compact?: boolean; }
export function CalibStatusBadge({ status, compact }: CalibStatusProps) {
  const map: Record<CalibrationStatus, { cls: string; label: string }> = {
    OVERDUE: { cls: 'status-overdue', label: 'Overdue' },
    DUE_TODAY: { cls: 'status-due-today', label: 'Due Today' },
    DUE_TOMORROW: { cls: 'status-due-tomorrow', label: 'Due Tomorrow' },
    DUE_WITHIN_7: { cls: 'status-due-week', label: compact ? '≤7 Days' : 'Due ≤7 Days' },
    DUE_WITHIN_30: { cls: 'status-due-week', label: compact ? '≤30 Days' : 'Due ≤30 Days' },
    VALID: { cls: 'status-valid', label: 'Valid' },
    UNDER_CALIBRATION: { cls: 'status-due-week', label: 'Under Calib.' },
  };
  const { cls, label } = map[status] || { cls: 'status-valid', label: status };
  return <span className={cls}>{label}</span>;
}

interface PriorityProps { priority: Priority; }
export function PriorityBadge({ priority }: PriorityProps) {
  const cls: Record<Priority, string> = {
    CRITICAL: 'priority-critical',
    HIGH: 'priority-high',
    MEDIUM: 'priority-medium',
    NORMAL: 'priority-normal',
    LOW: 'priority-low',
  };
  return <span className={cls[priority]}>{priority}</span>;
}

interface InspectionProps { status: InspectionStatus; }
export function InspectionBadge({ status }: InspectionProps) {
  const map: Record<InspectionStatus, { bg: string; text: string; label: string }> = {
    PASSED: { bg: 'bg-green-50', text: 'text-green-700', label: 'Passed' },
    FAILED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Failed' },
    PENDING: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Pending' },
    DUE: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Due' },
    OVERDUE: { bg: 'bg-red-50', text: 'text-red-700', label: 'Overdue' },
  };
  const { bg, text, label } = map[status] || map.PENDING;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${bg} ${text}`}
      style={{ borderColor: 'currentColor', borderOpacity: 0.3 }}>
      {label}
    </span>
  );
}

interface ToolStatusProps { status: ToolStatus; }
export function ToolStatusBadge({ status }: ToolStatusProps) {
  const map: Record<ToolStatus, { bg: string; text: string; label: string }> = {
    ACTIVE: { bg: 'bg-green-50', text: 'text-green-700', label: 'Active' },
    INACTIVE: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Inactive' },
    UNDER_REPAIR: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Under Repair' },
    RETIRED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Retired' },
    UNDER_CALIBRATION: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Under Calibration' },
  };
  const { bg, text, label } = map[status] || map.ACTIVE;
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded ${bg} ${text}`}>{label}</span>;
}

interface TaskStatusProps { status: TaskStatus; }
export function TaskStatusBadge({ status }: TaskStatusProps) {
  const map: Record<TaskStatus, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Pending' },
    IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Progress' },
    SENT_FOR_CALIBRATION: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Sent for Calib.' },
    CALIBRATION_COMPLETED: { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Calib. Completed' },
    VERIFIED: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Verified' },
    CLOSED: { bg: 'bg-green-50', text: 'text-green-700', label: 'Closed' },
  };
  const { bg, text, label } = map[status] || map.PENDING;
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded ${bg} ${text}`}>{label}</span>;
}
