import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Database, Gauge, Clock, AlertCircle, Calendar, History,
  ClipboardCheck, CheckSquare, FileText, BarChart2, Upload, Bell, Shield,
  AlertTriangle, Users, Settings, ChevronDown, ChevronRight, Menu, X,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LayoutDashboard, Database, Gauge, Clock, AlertCircle, Calendar, History,
  ClipboardCheck, CheckSquare, FileText, BarChart2, Upload, Bell, Shield,
  AlertTriangle, Users, Settings,
};

const NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Tool Register', path: '/tools', icon: 'Database' },
  {
    label: 'Calibration', icon: 'Gauge', children: [
      { label: 'Upcoming', path: '/calibration/upcoming', icon: 'Clock' },
      { label: 'Overdue', path: '/calibration/overdue', icon: 'AlertCircle' },
      { label: 'Calendar', path: '/calibration/calendar', icon: 'Calendar' },
      { label: 'History', path: '/calibration/history', icon: 'History' },
    ],
  },
  { label: 'Inspection', path: '/inspection', icon: 'ClipboardCheck' },
  { label: 'Tasks', path: '/tasks', icon: 'CheckSquare' },
  { label: 'Documents', path: '/documents', icon: 'FileText' },
  { label: 'Reports', path: '/reports', icon: 'BarChart2' },
  { label: 'Data Import', path: '/import', icon: 'Upload' },
  { label: 'Notifications', path: '/notifications', icon: 'Bell' },
  { label: 'Audit Log', path: '/audit', icon: 'Shield' },
  { label: 'Data Quality', path: '/data-quality', icon: 'AlertTriangle' },
  { label: 'Users & Roles', path: '/users', icon: 'Users' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string[]>(['Calibration']);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleExpand = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const isGroupActive = (children: { path: string }[]) =>
    children.some((c) => location.pathname === c.path);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'hsl(214 50% 20%)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(214 60% 30%)', color: 'white' }}>
            QM
          </div>
          <div>
            <div className="text-xs font-bold leading-tight" style={{ color: 'hsl(210 40% 95%)' }}>MCMS</div>
            <div className="text-[10px] leading-tight" style={{ color: 'hsl(214 20% 65%)' }}>Metrology System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {NAV.map((item) => {
          const Icon = iconMap[item.icon];
          if (item.children) {
            const active = isGroupActive(item.children);
            const open = expanded.includes(item.label);
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`sidebar-item w-full justify-between ${active ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-2.5">
                    {Icon && <Icon size={15} />}
                    <span>{item.label}</span>
                  </span>
                  {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
                {open && (
                  <div className="ml-3 mt-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      const CIcon = iconMap[child.icon];
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`sidebar-item text-xs ${isActive(child.path) ? 'active' : ''}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {CIcon && <CIcon size={13} />}
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {Icon && <Icon size={15} />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t text-[10px]" style={{ borderColor: 'hsl(214 50% 20%)', color: 'hsl(214 20% 55%)' }}>
        MCMS v2.0 · Demo Mode
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded"
        style={{ background: 'hsl(var(--primary))', color: 'white' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-40 w-56 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'hsl(var(--sidebar-background))', color: 'hsl(var(--sidebar-foreground))' }}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-52 flex-shrink-0"
        style={{ background: 'hsl(var(--sidebar-background))', color: 'hsl(var(--sidebar-foreground))' }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
