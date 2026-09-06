import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Plus } from 'lucide-react';
import { MOCK_TASKS } from '@/lib/mockData';
import { Task, TaskStatus } from '@/types';
import { PriorityBadge, TaskStatusBadge } from '@/components/features/StatusBadge';

const STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'SENT_FOR_CALIBRATION', 'CALIBRATION_COMPLETED', 'VERIFIED', 'CLOSED'];
const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Pending', IN_PROGRESS: 'In Progress', SENT_FOR_CALIBRATION: 'Sent for Calibration',
  CALIBRATION_COMPLETED: 'Calib. Completed', VERIFIED: 'Verified', CLOSED: 'Closed',
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const navigate = useNavigate();

  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);

  const updateStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  };

  const counts: Record<string, number> = {
    ALL: tasks.length,
    ...STATUSES.reduce((acc, s) => ({ ...acc, [s]: tasks.filter((t) => t.status === s).length }), {}),
  };

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare size={22} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold">Calibration Tasks</h1>
            <p className="text-xs text-muted-foreground">Track and manage calibration action items</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded text-white"
          style={{ background: 'hsl(var(--primary))' }}>
          <Plus size={13} /> New Task
        </button>
      </div>

      {/* Status Pipeline */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ value: 'ALL' as const, label: 'All Tasks' }, ...STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))].map((tab) => (
          <button key={tab.value} onClick={() => setFilter(tab.value)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs rounded border font-medium transition-colors ${filter === tab.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}>
            {tab.label}
            <span className={`ml-1 text-[10px] px-1 rounded ${filter === tab.value ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>
              {counts[tab.value] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((task) => (
          <div key={task.id} className="bg-card border border-border rounded p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <PriorityBadge priority={task.priority} />
                  <TaskStatusBadge status={task.status} />
                  <span className="font-mono text-xs font-semibold text-blue-700 cursor-pointer hover:underline"
                    onClick={() => navigate(`/tools/${task.toolId}`)}>
                    {task.toolId}
                  </span>
                </div>
                <div className="font-medium text-sm text-foreground mb-1">{task.toolName}</div>
                <div className="text-xs text-muted-foreground mb-2">{task.remarks}</div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Assigned: <strong className="text-foreground">{task.assignedTo}</strong></span>
                  <span>Due: <strong className={task.dueDate < new Date().toISOString().slice(0, 10) ? 'text-red-600' : 'text-foreground'}>{task.dueDate}</strong></span>
                  <span>Created by: {task.createdBy}</span>
                  <span>Updated: {task.updatedAt.substring(0, 10)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                  className="text-xs px-2 py-1 border border-border rounded bg-background focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">No tasks found for this filter.</div>
        )}
      </div>
    </div>
  );
}
