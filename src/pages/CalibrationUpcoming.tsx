import { useSearchParams } from 'react-router-dom';
import { useTools } from '@/hooks/useTools';
import { getCalibrationStatus } from '@/lib/deadlineUtils';
import DeadlineTable from '@/components/features/DeadlineTable';
import { CalibrationStatus } from '@/types';
import { Download } from 'lucide-react';

const TABS: { value: CalibrationStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Critical' },
  { value: 'DUE_TODAY', label: 'Due Today' },
  { value: 'DUE_TOMORROW', label: 'Due Tomorrow' },
  { value: 'DUE_WITHIN_7', label: 'Next 7 Days' },
  { value: 'DUE_WITHIN_30', label: 'Next 30 Days' },
];

export default function CalibrationUpcoming() {
  const { tools } = useTools();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = (searchParams.get('filter') || 'ALL') as CalibrationStatus | 'ALL';

  const criticalTools = tools.filter((t) => {
    const s = getCalibrationStatus(t.expiryDate);
    return s !== 'VALID' && s !== 'UNDER_CALIBRATION';
  });

  const filteredTools = activeFilter === 'ALL'
    ? tools
    : tools.filter((t) => getCalibrationStatus(t.expiryDate) === activeFilter);

  const counts: Record<string, number> = {
    ALL: criticalTools.length,
    DUE_TODAY: tools.filter((t) => getCalibrationStatus(t.expiryDate) === 'DUE_TODAY').length,
    DUE_TOMORROW: tools.filter((t) => getCalibrationStatus(t.expiryDate) === 'DUE_TOMORROW').length,
    DUE_WITHIN_7: tools.filter((t) => ['DUE_WITHIN_7', 'DUE_TOMORROW', 'DUE_TODAY'].includes(getCalibrationStatus(t.expiryDate))).length,
    DUE_WITHIN_30: tools.filter((t) => ['DUE_WITHIN_30', 'DUE_WITHIN_7', 'DUE_TOMORROW', 'DUE_TODAY'].includes(getCalibrationStatus(t.expiryDate))).length,
  };

  return (
    <div className="max-w-[1400px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Upcoming Calibration Deadlines</h1>
          <p className="text-xs text-muted-foreground">{criticalTools.length} instruments requiring attention</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted">
          <Download size={13} /> Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSearchParams(tab.value === 'ALL' ? {} : { filter: tab.value })}
            className={`px-3 py-1.5 text-xs rounded border font-medium transition-colors ${
              activeFilter === tab.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-[10px] px-1 rounded ${activeFilter === tab.value ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      <DeadlineTable tools={filteredTools} title={`${TABS.find((t) => t.value === activeFilter)?.label || 'Critical'} Calibration Deadlines`} showAll />
    </div>
  );
}
