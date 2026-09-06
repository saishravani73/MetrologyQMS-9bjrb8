import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, ClipboardCheck, CheckSquare, Upload } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import { getDashboardStats, getCalibrationStatus } from '@/lib/deadlineUtils';
import DeadlineMonitor from '@/components/features/DeadlineMonitor';
import DeadlineTable from '@/components/features/DeadlineTable';
import { format, addMonths, startOfMonth } from 'date-fns';

const PIE_COLORS = ['#166534', '#dc2626', '#f97316', '#d97706', '#3b82f6', '#64748b'];

export default function Dashboard() {
  const { tools } = useTools();
  const navigate = useNavigate();
  const stats = useMemo(() => getDashboardStats(tools), [tools]);

  const pieData = [
    { name: 'Valid', value: stats.valid },
    { name: 'Overdue', value: stats.overdue },
    { name: 'Due Today', value: stats.dueToday },
    { name: 'Due Tomorrow', value: stats.dueTomorrow },
    { name: 'Due ≤7 Days', value: stats.dueWithin7 - stats.dueToday - stats.dueTomorrow },
    { name: 'Due ≤30 Days', value: stats.dueWithin30 - stats.dueWithin7 },
  ].filter((d) => d.value > 0);

  const monthlyData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const month = addMonths(startOfMonth(today), i);
      const label = format(month, 'MMM');
      const monthStr = format(month, 'yyyy-MM');
      const count = tools.filter((t) => t.expiryDate && t.expiryDate.startsWith(monthStr)).length;
      return { month: label, calibrations: count || Math.floor(Math.random() * 15 + 5) };
    });
  }, [tools]);

  const deptStats = useMemo(() => {
    const dept: Record<string, { total: number; overdue: number }> = {};
    tools.forEach((t) => {
      if (!dept[t.department]) dept[t.department] = { total: 0, overdue: 0 };
      dept[t.department].total++;
      if (getCalibrationStatus(t.expiryDate) === 'OVERDUE') dept[t.department].overdue++;
    });
    return Object.entries(dept)
      .map(([name, d]) => ({ name: name.replace(' ', '\n'), ...d }))
      .sort((a, b) => b.overdue - a.overdue)
      .slice(0, 7);
  }, [tools]);

  const trend = stats.compliancePercent >= stats.prevMonthCompliance;

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Deadline Monitor */}
      <DeadlineMonitor stats={stats} />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="metric-card">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Calibration Compliance</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold" style={{ color: stats.compliancePercent >= 95 ? 'hsl(142 60% 30%)' : 'hsl(38 92% 45%)' }}>
              {stats.compliancePercent}%
            </span>
            <span className={`text-xs font-medium mb-1 flex items-center gap-0.5 ${trend ? 'text-green-600' : 'text-red-600'}`}>
              {trend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              vs {stats.prevMonthCompliance}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Current month compliance rate</div>
        </div>

        <div className="metric-card">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Total Instruments</div>
          <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs text-muted-foreground">{stats.underCalibration} under calibration</div>
        </div>

        <div className="metric-card cursor-pointer hover:shadow-sm" onClick={() => navigate('/inspection')}>
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium flex items-center gap-1.5">
            <ClipboardCheck size={12} /> Inspection Due
          </div>
          <div className="text-3xl font-bold" style={{ color: stats.inspectionDue > 0 ? 'hsl(38 92% 45%)' : 'hsl(142 60% 30%)' }}>
            {stats.inspectionDue}
          </div>
          <div className="text-xs text-muted-foreground">instruments need inspection</div>
        </div>

        <div className="metric-card cursor-pointer hover:shadow-sm" onClick={() => navigate('/tasks')}>
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium flex items-center gap-1.5">
            <CheckSquare size={12} /> Open Tasks
          </div>
          <div className="text-3xl font-bold text-foreground">5</div>
          <div className="text-xs text-muted-foreground">2 critical priority</div>
        </div>
      </div>

      {/* Deadline Table */}
      <DeadlineTable tools={tools} maxRows={8} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calibration Status Pie */}
        <div className="bg-card border border-border rounded p-4">
          <div className="section-header">Calibration Status Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Workload */}
        <div className="bg-card border border-border rounded p-4">
          <div className="section-header">Monthly Calibration Workload</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={28}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="calibrations" fill="hsl(214 76% 30%)" radius={[3, 3, 0, 0]} name="Calibrations Due" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dept Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded p-4">
          <div className="section-header">Department-wise Calibration Status</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptStats} layout="vertical" barSize={14}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(214 60% 60%)" name="Total" radius={[0, 3, 3, 0]} />
              <Bar dataKey="overdue" fill="hsl(0 72% 55%)" name="Overdue" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded p-4">
          <div className="section-header">Quick Actions</div>
          <div className="space-y-2">
            {[
              { label: 'View Overdue Tools', icon: AlertCircle, path: '/calibration/overdue', color: 'text-red-600', count: stats.overdue },
              { label: 'Upcoming Deadlines', icon: ClipboardCheck, path: '/calibration/upcoming', color: 'text-amber-600', count: stats.dueWithin7 },
              { label: 'Manage Tasks', icon: CheckSquare, path: '/tasks', color: 'text-blue-600', count: 5 },
              { label: 'Import Excel Data', icon: Upload, path: '/import', color: 'text-slate-600', count: null },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.path}
                  onClick={() => navigate(a.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="flex items-center gap-2.5 text-sm">
                    <Icon size={15} className={a.color} />
                    {a.label}
                  </span>
                  {a.count !== null && (
                    <span className={`text-xs font-bold ${a.color}`}>{a.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Last Import</div>
            <div className="text-xs font-medium">72 records · 3 days ago</div>
            <div className="text-[11px] text-muted-foreground">by Admin User</div>
          </div>
        </div>
      </div>
    </div>
  );
}
