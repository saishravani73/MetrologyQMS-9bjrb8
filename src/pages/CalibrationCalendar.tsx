import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import { getCalibrationStatus } from '@/lib/deadlineUtils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, isValid, getDay } from 'date-fns';

export default function CalibrationCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { tools } = useTools();
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const toolsByDate = useMemo(() => {
    const map: Record<string, typeof tools> = {};
    tools.forEach((t) => {
      if (!t.expiryDate) return;
      try {
        const d = parseISO(t.expiryDate);
        if (!isValid(d)) return;
        const key = format(d, 'yyyy-MM-dd');
        if (!map[key]) map[key] = [];
        map[key].push(t);
      } catch {}
    });
    return map;
  }, [tools]);

  const statusColor: Record<string, string> = {
    OVERDUE: 'bg-red-500',
    DUE_TODAY: 'bg-orange-500',
    DUE_TOMORROW: 'bg-amber-500',
    DUE_WITHIN_7: 'bg-blue-500',
    DUE_WITHIN_30: 'bg-blue-400',
    VALID: 'bg-green-500',
  };

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={22} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Calibration Calendar</h1>
            <p className="text-xs text-muted-foreground">Monthly view of calibration due dates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded border border-border hover:bg-muted">
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm font-semibold px-3">{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded border border-border hover:bg-muted">
            <ChevronRight size={15} />
          </button>
          <button onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-xs border border-border rounded hover:bg-muted">
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { status: 'OVERDUE', label: 'Overdue', color: 'bg-red-500' },
          { status: 'DUE_TODAY', label: 'Due Today', color: 'bg-orange-500' },
          { status: 'DUE_WITHIN_7', label: 'Due ≤7 Days', color: 'bg-blue-500' },
          { status: 'VALID', label: 'Valid', color: 'bg-green-500' },
        ].map((l) => (
          <div key={l.status} className="flex items-center gap-1.5 text-xs">
            <span className={`w-3 h-3 rounded-full ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2 border-r last:border-r-0">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {/* Empty cells for start */}
          {Array.from({ length: startDayOfWeek }, (_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] border-r border-b bg-muted/20 last:border-r-0" />
          ))}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayTools = toolsByDate[key] || [];
            const isToday = isSameDay(day, new Date());
            return (
              <div key={key}
                className={`min-h-[90px] border-r border-b p-1.5 last:border-r-0 ${isToday ? 'bg-blue-50/60' : ''}`}>
                <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-0.5">
                  {dayTools.slice(0, 3).map((t) => {
                    const s = getCalibrationStatus(t.expiryDate);
                    return (
                      <button
                        key={t.id}
                        onClick={() => navigate(`/tools/${t.id}`)}
                        className={`w-full text-left text-[10px] px-1 py-0.5 rounded text-white truncate ${statusColor[s] || 'bg-slate-500'} hover:opacity-80`}
                        title={t.toolName}
                      >
                        {t.id}
                      </button>
                    );
                  })}
                  {dayTools.length > 3 && (
                    <div className="text-[10px] text-muted-foreground pl-1">+{dayTools.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
