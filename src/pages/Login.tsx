import { useState } from 'react';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import loginBg from '@/assets/login-bg.jpg';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
}

const DEMO_CREDS = [
  { label: 'Administrator', email: 'admin@mcms.gov.in', password: 'admin123' },
  { label: 'Quality Manager', email: 'rajesh.kumar@mcms.gov.in', password: 'quality123' },
  { label: 'Metrology Engineer', email: 'priya.sharma@mcms.gov.in', password: 'metro123' },
  { label: 'Technician', email: 'anil.verma@mcms.gov.in', password: 'tech123' },
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@mcms.gov.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = onLogin(email, password);
    if (!ok) setError('Invalid credentials. Please check email and password.');
    setLoading(false);
  };

  const fillDemo = (e: string, p: string) => { setEmail(e); setPassword(p); setError(''); };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — form */}
      <div className="w-full lg:w-[420px] flex flex-col justify-center px-8 lg:px-12 bg-card border-r border-border">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded flex items-center justify-center font-bold text-sm"
              style={{ background: 'hsl(var(--primary))', color: 'white' }}>
              QM
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-foreground">Quality Metrology Dept.</div>
              <div className="text-[11px] text-muted-foreground">Government Engineering Organisation</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Metrology Calibration<br />Management System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@organisation.gov.in"
              required
              className="w-full px-3 py-2.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2.5 pr-10 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold rounded transition-colors disabled:opacity-60"
            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6 pt-5 border-t border-border">
          <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Shield size={12} />
            Demo Accounts — Click to Fill
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_CREDS.map((c) => (
              <button
                key={c.email}
                onClick={() => fillDemo(c.email, c.password)}
                className="text-left px-2.5 py-2 rounded border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <div className="text-xs font-semibold text-foreground">{c.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{c.email}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[10px] text-muted-foreground">
          This is a demonstration system. All data is fictional and for evaluation purposes only.
          © Quality Metrology & Quality Management Department
        </p>
      </div>

      {/* Right panel — image */}
      <div className="hidden lg:block flex-1 relative">
        <img src={loginBg} alt="Metrology Laboratory" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'hsl(214 76% 16% / 0.75)' }} />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-3">Preventing Missed Deadlines</h2>
            <p className="text-blue-100 text-base leading-relaxed max-w-md">
              Centralized calibration tracking, automatic deadline detection, escalation workflows,
              and management-level compliance visibility — all in one system.
            </p>
            <div className="flex gap-6 mt-6">
              {[
                { label: 'Instruments Tracked', value: '72+' },
                { label: 'Departments', value: '10' },
                { label: 'Compliance Rate', value: '97.4%' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-blue-200 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
