import { useTools } from '@/hooks/useTools';
import { getCalibrationStatus, getDaysRemaining } from '@/lib/deadlineUtils';
import { AlertCircle, Download } from 'lucide-react';
import DeadlineTable from '@/components/features/DeadlineTable';

export default function CalibrationOverdue() {
  const { tools } = useTools();
  const overdueTools = tools
    .filter((t) => getCalibrationStatus(t.expiryDate) === 'OVERDUE')
    .sort((a, b) => getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate));

  const escalated = overdueTools.filter((t) => getDaysRemaining(t.expiryDate) <= -3);
  const notActioned = overdueTools.filter((t) => getDaysRemaining(t.expiryDate) > -3);

  return (
    <div className="max-w-[1400px] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={22} className="text-red-600" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Overdue Calibrations</h1>
            <p className="text-xs text-muted-foreground">{overdueTools.length} instruments past calibration expiry — immediate action required</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-300 text-red-700 rounded hover:bg-red-50">
          <Download size={13} /> Export Overdue Report
        </button>
      </div>

      {overdueTools.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded p-8 text-center">
          <div className="text-green-700 font-semibold text-lg mb-1">No Overdue Calibrations</div>
          <div className="text-green-600 text-sm">All instruments are within their calibration validity period.</div>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="text-2xl font-bold text-red-700">{overdueTools.length}</div>
              <div className="text-xs font-semibold text-red-600 uppercase tracking-wide">Total Overdue</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="text-2xl font-bold text-red-700">{escalated.length}</div>
              <div className="text-xs font-semibold text-red-600 uppercase tracking-wide">Escalated (3+ Days)</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded p-3">
              <div className="text-2xl font-bold text-orange-700">{notActioned.length}</div>
              <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Newly Overdue (&lt;3 Days)</div>
            </div>
          </div>

          <DeadlineTable tools={overdueTools} title="All Overdue Instruments" showAll />
        </>
      )}
    </div>
  );
}
