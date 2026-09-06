import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, AlertTriangle, CalendarDays, CheckCircle2 } from 'lucide-react';
import { DashboardStats } from '@/types';

interface DeadlineMonitorProps {
  stats: DashboardStats;
}

export default function DeadlineMonitor({ stats }: DeadlineMonitorProps) {
  const navigate = useNavigate();

  const items = [
    {
      label: 'OVERDUE',
      count: stats.overdue,
      icon: AlertCircle,
      urgency: 'critical',
      desc: 'Immediate action required',
      path: '/calibration/overdue',
      textColor: 'text-red-700',
      countColor: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      badgeBg: 'bg-red-600',
    },
    {
      label: 'DUE TODAY',
      count: stats.dueToday,
      icon: AlertTriangle,
      urgency: 'high',
      desc: 'Act by end of day',
      path: '/calibration/upcoming?filter=DUE_TODAY',
      textColor: 'text-orange-700',
      countColor: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      badgeBg: 'bg-orange-500',
    },
    {
      label: 'DUE TOMORROW',
      count: stats.dueTomorrow,
      icon: Clock,
      urgency: 'high',
      desc: 'Schedule immediately',
      path: '/calibration/upcoming?filter=DUE_TOMORROW',
      textColor: 'text-amber-700',
      countColor: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      badgeBg: 'bg-amber-500',
    },
    {
      label: 'NEXT 7 DAYS',
      count: stats.dueWithin7 - stats.dueToday - stats.dueTomorrow,
      icon: CalendarDays,
      urgency: 'medium',
      desc: 'Plan calibration actions',
      path: '/calibration/upcoming?filter=DUE_WITHIN_7',
      textColor: 'text-blue-700',
      countColor: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      badgeBg: 'bg-blue-500',
    },
    {
      label: 'NEXT 30 DAYS',
      count: stats.dueWithin30 - stats.dueWithin7,
      icon: CalendarDays,
      urgency: 'normal',
      desc: 'Plan ahead',
      path: '/calibration/upcoming?filter=DUE_WITHIN_30',
      textColor: 'text-slate-700',
      countColor: 'text-slate-700',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100',
      badgeBg: 'bg-slate-500',
    },
    {
      label: 'VALID',
      count: stats.valid,
      icon: CheckCircle2,
      urgency: 'ok',
      desc: 'Within calibration validity',
      path: '/tools?status=VALID',
      textColor: 'text-green-700',
      countColor: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      badgeBg: 'bg-green-600',
    },
  ];

  return (
    <div>
      <div className="section-header">Calibration Deadline Monitor</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`metric-card ${item.bg} ${item.border} border text-left hover:shadow-sm transition-all duration-150 group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded ${item.iconBg}`}>
                  <Icon size={16} className={item.textColor} />
                </div>
                {item.count > 0 && item.urgency !== 'ok' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeBg}`}>
                    {item.count}
                  </span>
                )}
              </div>
              <div className={`text-2xl font-bold leading-none mb-1 ${item.countColor}`}>{item.count}</div>
              <div className={`text-[11px] font-bold uppercase tracking-wide ${item.textColor}`}>{item.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
