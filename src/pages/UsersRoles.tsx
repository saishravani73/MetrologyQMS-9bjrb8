import { useState } from 'react';
import { Users, Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mockData';
import { User, UserRole } from '@/types';

const ROLE_COLORS: Record<UserRole, string> = {
  ADMINISTRATOR: 'bg-red-50 text-red-700',
  QUALITY_MANAGER: 'bg-indigo-50 text-indigo-700',
  METROLOGY_ENGINEER: 'bg-blue-50 text-blue-700',
  TECHNICIAN: 'bg-teal-50 text-teal-700',
  VIEWER: 'bg-slate-50 text-slate-600',
};

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMINISTRATOR: ['Full system access', 'User management', 'Settings', 'Audit logs', 'All modules'],
  QUALITY_MANAGER: ['Dashboard & reports', 'Approvals', 'Audit logs (read)', 'All data views'],
  METROLOGY_ENGINEER: ['Tool records', 'Calibration workflow', 'Certificate upload', 'Tasks'],
  TECHNICIAN: ['Assigned tools only', 'Action status update', 'Document view'],
  VIEWER: ['Read-only access', 'Reports view', 'Audit log (read)'],
};

export default function UsersRoles() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const toggleActive = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold">Users & Roles</h1>
            <p className="text-xs text-muted-foreground">Manage system users and role-based access control</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded text-white"
          style={{ background: 'hsl(var(--primary))' }}>
          <Plus size={13} /> Add User
        </button>
      </div>

      {/* Role Permissions */}
      <div className="bg-card border border-border rounded p-4">
        <div className="section-header">Role Permissions Overview</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.keys(ROLE_PERMISSIONS) as UserRole[]).map((role) => (
            <div key={role} className="rounded border border-border p-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ROLE_COLORS[role]}`}>{role.replace('_', ' ')}</span>
              <ul className="mt-2 space-y-1">
                {ROLE_PERMISSIONS[role].map((p) => (
                  <li key={p} className="text-[11px] text-muted-foreground flex items-start gap-1">
                    <span className="text-green-500 mt-0.5">·</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-border rounded overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'hsl(var(--primary))', color: 'white' }}>
                      {u.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{u.name}</span>
                  </div>
                </td>
                <td><span className="text-xs text-muted-foreground">{u.email}</span></td>
                <td><span className={`text-xs font-semibold px-2 py-0.5 rounded ${ROLE_COLORS[u.role]}`}>{u.role.replace('_', ' ')}</span></td>
                <td><span className="text-xs">{u.department}</span></td>
                <td><span className="text-xs text-muted-foreground">{u.lastLogin ? u.lastLogin.slice(0, 16).replace('T', ' ') : '—'}</span></td>
                <td>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-muted">
                      <Edit size={13} className="text-muted-foreground" />
                    </button>
                    <button onClick={() => toggleActive(u.id)} className="p-1.5 rounded hover:bg-muted">
                      {u.isActive ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} className="text-slate-400" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
