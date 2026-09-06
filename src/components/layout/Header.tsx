import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, LogOut, User as UserIcon, Settings, X, Check, CheckCheck } from 'lucide-react';
import { AuthUser, Notification } from '@/types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: AuthUser;
  onLogout: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const notifTypeColors: Record<string, string> = {
  CRITICAL: 'text-red-600',
  DUE_TODAY: 'text-orange-600',
  DUE_TOMORROW: 'text-amber-600',
  UPCOMING: 'text-blue-600',
  SYSTEM: 'text-slate-600',
  IMPORT_ERROR: 'text-purple-600',
  ESCALATION: 'text-red-700',
};

export default function Header({ user, onLogout, notifications, unreadCount, onMarkAsRead, onMarkAllAsRead }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b bg-card border-border flex-shrink-0 gap-4">
      {/* Title */}
      <div className="flex flex-col min-w-0 lg:ml-0 ml-8">
        <span className="text-sm font-bold text-foreground leading-tight tracking-tight truncate">
          METROLOGY CALIBRATION MANAGEMENT SYSTEM
        </span>
        <span className="text-[11px] text-muted-foreground">
          Quality Metrology & Quality Management · {format(new Date(), 'dd MMM yyyy')}
        </span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
        <div className="relative w-full">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search Tool ID, Name, Location..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
            className="relative p-2 rounded hover:bg-muted transition-colors"
          >
            <Bell size={18} className="text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center"
                style={{ background: 'hsl(var(--overdue))', color: 'white' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-96 bg-card border border-border rounded shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-2.5 border-b">
                <span className="text-sm font-semibold">Notification Centre</span>
                <div className="flex items-center gap-2">
                  <button onClick={onMarkAllAsRead} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <CheckCheck size={12} /> Mark All Read
                  </button>
                  <button onClick={() => setNotifOpen(false)} className="p-0.5 hover:text-foreground text-muted-foreground">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                {notifications.slice(0, 8).map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-2.5 cursor-pointer hover:bg-muted/40 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => { onMarkAsRead(n.id); if (n.toolId) navigate(`/tools/${n.toolId}`); }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-xs font-semibold ${notifTypeColors[n.type] || 'text-foreground'}`}>{n.title}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground">{n.timestamp.substring(0, 16).replace('T', ' ')}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t text-center">
                <button onClick={() => { navigate('/notifications'); setNotifOpen(false); }} className="text-xs text-blue-600 hover:underline">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'hsl(var(--primary))', color: 'white' }}>
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-xs font-medium leading-tight">{user.name}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{user.role.replace('_', ' ')}</span>
            </div>
            <ChevronDown size={13} className="text-muted-foreground" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded shadow-lg z-50">
              <div className="px-3 py-2 border-b">
                <div className="text-xs font-semibold">{user.name}</div>
                <div className="text-[11px] text-muted-foreground">{user.email}</div>
              </div>
              <button onClick={() => navigate('/settings')} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left">
                <Settings size={14} /> Settings
              </button>
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full text-left text-red-600">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
