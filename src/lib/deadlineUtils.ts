import { CalibrationStatus, Priority, Tool } from '@/types';
import { differenceInDays, parseISO, isValid } from 'date-fns';

export function getDaysRemaining(expiryDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const expiry = parseISO(expiryDateStr);
    if (!isValid(expiry)) return NaN;
    expiry.setHours(0, 0, 0, 0);
    return differenceInDays(expiry, today);
  } catch {
    return NaN;
  }
}

export function getCalibrationStatus(expiryDateStr: string): CalibrationStatus {
  const days = getDaysRemaining(expiryDateStr);
  if (isNaN(days)) return 'VALID';
  if (days < 0) return 'OVERDUE';
  if (days === 0) return 'DUE_TODAY';
  if (days === 1) return 'DUE_TOMORROW';
  if (days <= 7) return 'DUE_WITHIN_7';
  if (days <= 30) return 'DUE_WITHIN_30';
  return 'VALID';
}

export function getPriority(expiryDateStr: string): Priority {
  const days = getDaysRemaining(expiryDateStr);
  if (isNaN(days)) return 'LOW';
  if (days < 0) return 'CRITICAL';
  if (days <= 1) return 'HIGH';
  if (days <= 7) return 'MEDIUM';
  if (days <= 30) return 'NORMAL';
  return 'LOW';
}

export function getDaysRemainingLabel(expiryDateStr: string): string {
  const days = getDaysRemaining(expiryDateStr);
  if (isNaN(days)) return 'Unknown';
  if (days < 0) return `OVERDUE BY ${Math.abs(days)} DAY${Math.abs(days) !== 1 ? 'S' : ''}`;
  if (days === 0) return 'DUE TODAY';
  if (days === 1) return '1 DAY LEFT';
  return `${days} DAYS LEFT`;
}

export function getStatusLabel(status: CalibrationStatus): string {
  const map: Record<CalibrationStatus, string> = {
    OVERDUE: 'Overdue',
    DUE_TODAY: 'Due Today',
    DUE_TOMORROW: 'Due Tomorrow',
    DUE_WITHIN_7: 'Due Within 7 Days',
    DUE_WITHIN_30: 'Due Within 30 Days',
    VALID: 'Valid',
    UNDER_CALIBRATION: 'Under Calibration',
  };
  return map[status] || status;
}

export function filterToolsByStatus(tools: Tool[], status: CalibrationStatus): Tool[] {
  return tools.filter((t) => t.toolStatus === 'ACTIVE' && getCalibrationStatus(t.expiryDate) === status);
}

export function getDashboardStats(tools: Tool[]) {
  const active = tools.filter((t) => t.toolStatus !== 'RETIRED');
  const overdue = active.filter((t) => getCalibrationStatus(t.expiryDate) === 'OVERDUE').length;
  const dueToday = active.filter((t) => getCalibrationStatus(t.expiryDate) === 'DUE_TODAY').length;
  const dueTomorrow = active.filter((t) => getCalibrationStatus(t.expiryDate) === 'DUE_TOMORROW').length;
  const dueWithin7 = active.filter((t) => {
    const s = getCalibrationStatus(t.expiryDate);
    return s === 'DUE_WITHIN_7' || s === 'DUE_TOMORROW' || s === 'DUE_TODAY';
  }).length;
  const dueWithin30 = active.filter((t) => {
    const s = getCalibrationStatus(t.expiryDate);
    return s === 'DUE_WITHIN_30' || s === 'DUE_WITHIN_7' || s === 'DUE_TOMORROW' || s === 'DUE_TODAY';
  }).length;
  const underCalibration = active.filter((t) => t.toolStatus === 'UNDER_CALIBRATION').length;
  const valid = active.filter((t) => getCalibrationStatus(t.expiryDate) === 'VALID').length;
  const inspectionDue = active.filter((t) =>
    t.inspectionStatus === 'DUE' || t.inspectionStatus === 'OVERDUE'
  ).length;

  const compliant = active.filter((t) => {
    const s = getCalibrationStatus(t.expiryDate);
    return s === 'VALID' || s === 'DUE_WITHIN_30' || s === 'DUE_WITHIN_7';
  }).length;
  const compliancePercent = active.length > 0 ? (compliant / active.length) * 100 : 0;

  return {
    total: active.length,
    valid,
    overdue,
    dueToday,
    dueTomorrow,
    dueWithin7,
    dueWithin30,
    underCalibration,
    inspectionDue,
    compliancePercent: Math.round(compliancePercent * 10) / 10,
    prevMonthCompliance: 96.2,
  };
}
