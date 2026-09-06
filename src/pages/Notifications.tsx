import { Bell, CheckCheck, AlertCircle, Clock, Calendar, Settings, Info, Upload } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types';
import { useNavigate } from 'react-router-dom';

const TYPE_CONFIG: Record<string, { icon: React.FC<{size?: number; className?: string}>; label: string; iconClass: string }> = {
  CRITICAL: { icon: AlertCircle, label: 'Critical', iconClass: 'text-red-600' },
  DUE_TODAY: { icon: Clock, label: 'Due Today', iconClass: 'text-orange-600' },
  DUE_TOMORROW: { icon: Clock, label: 'Due Tomorrow', iconClass: 'text-amber-600' },
  UPCOMING: { icon: Calendar, label: 'Upcoming', iconClass: 'text-blue-600' },
  SYSTEM: { icon: Info, label: 'System', iconClass: 'text-slate-600' },
  IMPORT_ERROR: { icon: Upload, label: 'Import', iconClass: 'text-purple-600' },
  ESCALATION: { icon: AlertCircle, label: 'Escalation', iconClass: 'text-red-700' },
};

const SECTION_ORDER = ['CRITICAL', 'ESCALATION', 'DUE_TODAY', 'DUE_TOMORROW', 'UPCOMING', 'IMPORT_ERROR', 'SYSTEM'];

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, getByType } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell size={22} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold">Notification Centre</h1>
            <p className="text-xs text-muted-foreground">{unreadCount} unread · {notifications.length} total</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllAsRead} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted">
            <CheckCheck size={13} /> Mark All Read
          </button>
          <button onClick={() => navigate('/settings')} className="p-2 rounded border border-border hover:bg-muted">
            <Settings size={15} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {SECTION_ORDER.map((type) => {
        const items = getByType(type as Notification['type']);
        if (items.length === 0) return null;
        const config = TYPE_CONFIG[type];
        const Icon = config.icon;
        return (
          <div key={type} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon size={14} className={config.iconClass} />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{config.label}</span>
              <span className="text-xs text-muted-foreground">({items.length})</span>
            </div>
            {items.map((n) => (
              <div
                key={n.id}
                className={`bg-card border rounded p-4 cursor-pointer hover:shadow-sm transition-all ${!n.read ? 'border-l-4 border-l-blue-500' : 'border-border'} ${n.type === 'CRITICAL' || n.type === 'ESCALATION' ? 'border-red-200 bg-red-50/30' : ''}`}
                onClick={() => { markAsRead(n.id); if (n.toolId) navigate(`/tools/${n.toolId}`); }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Icon size={16} className={config.iconClass + ' mt-0.5 flex-shrink-0'} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{n.title}</span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span>{n.timestamp.replace('T', ' ').slice(0, 16)}</span>
                        {n.escalationLevel && (
                          <span className="text-red-600 font-semibold">Escalation Level {n.escalationLevel}</span>
                        )}
                        {n.toolId && (
                          <button className="text-blue-600 hover:underline" onClick={(e) => { e.stopPropagation(); navigate(`/tools/${n.toolId}`); }}>
                            View Tool →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {!n.read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted flex-shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {notifications.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <div className="font-medium">No notifications</div>
          <div className="text-xs mt-1">All calibration deadlines are under control.</div>
        </div>
      )}

      {/* Notification Settings Preview */}
      <div className="bg-card border border-border rounded p-4">
        <div className="section-header">Notification Configuration</div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Daily calibration check</span>
            <span className="text-green-600 font-medium">Enabled · 06:00 AM</span>
          </div>
          <div className="flex justify-between">
            <span>Overdue escalation (Day 1)</span>
            <span className="text-green-600 font-medium">Notify responsible person</span>
          </div>
          <div className="flex justify-between">
            <span>Overdue escalation (Day 2)</span>
            <span className="text-green-600 font-medium">Notify person + supervisor</span>
          </div>
          <div className="flex justify-between">
            <span>Overdue escalation (Day 3+)</span>
            <span className="text-green-600 font-medium">Escalate to Quality Manager</span>
          </div>
          <div className="flex justify-between">
            <span>Email notifications</span>
            <span className="text-amber-600 font-medium">Configure SMTP in Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
