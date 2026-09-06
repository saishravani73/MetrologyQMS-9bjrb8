import { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Building, Calendar, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'org', label: 'Organisation', icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'escalation', label: 'Escalation', icon: Shield },
  { id: 'email', label: 'Email Config', icon: Mail },
  { id: 'thresholds', label: 'Thresholds', icon: Calendar },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('org');
  const [saving, setSaving] = useState(false);

  const [orgSettings, setOrgSettings] = useState({
    orgName: 'Quality Metrology & Quality Management Department',
    orgCode: 'HAL-QMD',
    address: 'Government Engineering Organisation, India',
    contactEmail: 'qmd@organisation.gov.in',
    contactPhone: '+91-80-XXXX-XXXX',
  });

  const [notifSettings, setNotifSettings] = useState({
    enableInApp: true,
    enableEmail: false,
    dailyCheckTime: '06:00',
    reminder30Days: true,
    reminder7Days: true,
    reminder1Day: true,
    reminderDueToday: true,
  });

  const [escalationSettings, setEscalationSettings] = useState({
    day1: 'Notify responsible person',
    day2: 'Notify responsible person + supervisor',
    day3plus: 'Escalate to Quality Manager',
    enableEscalation: true,
  });

  const [thresholds, setThresholds] = useState({
    critical: 0,
    high: 1,
    medium: 7,
    normal: 30,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <SettingsIcon size={22} className="text-primary" />
        <div>
          <h1 className="text-lg font-bold">System Settings</h1>
          <p className="text-xs text-muted-foreground">Configure system behaviour, notifications, and organisation details</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Tab Nav */}
        <div className="w-44 flex-shrink-0 space-y-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${activeTab === tab.id ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-foreground'}`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-card border border-border rounded p-5">
          {activeTab === 'org' && (
            <div className="space-y-4">
              <div className="section-header">Organisation Information</div>
              {Object.entries(orgSettings).map(([key, val]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input value={val} onChange={(e) => setOrgSettings((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="section-header">Notification Settings</div>
              {[
                { key: 'enableInApp', label: 'In-app notifications' },
                { key: 'enableEmail', label: 'Email notifications' },
                { key: 'reminder30Days', label: '30-day advance reminder' },
                { key: 'reminder7Days', label: '7-day advance reminder' },
                { key: 'reminder1Day', label: '1-day advance reminder' },
                { key: 'reminderDueToday', label: 'Due today reminder' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <button
                    onClick={() => setNotifSettings((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className={`w-10 h-5 rounded-full relative transition-colors ${notifSettings[key as keyof typeof notifSettings] ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifSettings[key as keyof typeof notifSettings] ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5">Daily Check Time</label>
                <input type="time" value={notifSettings.dailyCheckTime}
                  onChange={(e) => setNotifSettings((p) => ({ ...p, dailyCheckTime: e.target.value }))}
                  className="px-3 py-2 text-sm border border-border rounded bg-background focus:outline-none" />
              </div>
            </div>
          )}

          {activeTab === 'escalation' && (
            <div className="space-y-4">
              <div className="section-header">Escalation Rules</div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Enable Auto-escalation</span>
                <button
                  onClick={() => setEscalationSettings((p) => ({ ...p, enableEscalation: !p.enableEscalation }))}
                  className={`w-10 h-5 rounded-full relative transition-colors ${escalationSettings.enableEscalation ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${escalationSettings.enableEscalation ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              {[
                { key: 'day1', label: 'Day 1 Overdue Action' },
                { key: 'day2', label: 'Day 2 Overdue Action' },
                { key: 'day3plus', label: 'Day 3+ Overdue Action' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5">{label}</label>
                  <input value={escalationSettings[key as keyof typeof escalationSettings] as string}
                    onChange={(e) => setEscalationSettings((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded bg-background focus:outline-none" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="section-header">Email Configuration</div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                Email notifications require backend configuration. Configure SMTP settings to enable automatic email reminders.
              </div>
              {[
                { label: 'SMTP Host', placeholder: 'smtp.organisation.gov.in' },
                { label: 'SMTP Port', placeholder: '587' },
                { label: 'From Email', placeholder: 'mcms-notifications@organisation.gov.in' },
                { label: 'From Name', placeholder: 'MCMS Notification System' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold mb-1.5">{label}</label>
                  <input placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm border border-border rounded bg-background focus:outline-none" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'thresholds' && (
            <div className="space-y-4">
              <div className="section-header">Priority Thresholds (Days)</div>
              <p className="text-xs text-muted-foreground">Configure the number of days before expiry to trigger each priority level.</p>
              {[
                { key: 'critical', label: 'Critical (Overdue)', color: 'text-red-600' },
                { key: 'high', label: 'High Priority', color: 'text-orange-600' },
                { key: 'medium', label: 'Medium Priority', color: 'text-amber-600' },
                { key: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
              ].map(({ key, label, color }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${color}`}>{label}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={thresholds[key as keyof typeof thresholds]}
                      onChange={(e) => setThresholds((p) => ({ ...p, [key]: parseInt(e.target.value) }))}
                      className="w-20 px-2 py-1.5 text-sm border border-border rounded bg-background text-center focus:outline-none" />
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded text-white disabled:opacity-60"
              style={{ background: 'hsl(var(--primary))' }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
