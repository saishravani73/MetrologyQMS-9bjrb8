import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTools } from '@/hooks/useTools';

export default function DataQuality() {
  const { tools } = useTools();
  const navigate = useNavigate();

  const issues = {
    missingExpiry: tools.filter((t) => !t.expiryDate),
    missingResponsible: tools.filter((t) => !t.responsiblePerson),
    missingLocation: tools.filter((t) => !t.storageLocation),
    missingCertificate: tools.filter((t) => !t.certificateNumber),
    missingCalibDate: tools.filter((t) => !t.calibrationDate),
    missingSerial: tools.filter((t) => !t.serialNumber),
  };

  const totalIssues = Object.values(issues).reduce((a, b) => a + b.length, 0);
  const qualityScore = Math.round(((tools.length * 6 - totalIssues) / (tools.length * 6)) * 1000) / 10;

  const checks = [
    { label: 'Missing Expiry Date', key: 'missingExpiry' as const, severity: 'high', desc: 'Critical — affects deadline detection' },
    { label: 'Missing Responsible Person', key: 'missingResponsible' as const, severity: 'high', desc: 'Required for notifications' },
    { label: 'Missing Storage Location', key: 'missingLocation' as const, severity: 'medium', desc: 'Required for retrieval' },
    { label: 'Missing Calibration Date', key: 'missingCalibDate' as const, severity: 'medium', desc: 'Important for history tracking' },
    { label: 'Missing Certificate Number', key: 'missingCertificate' as const, severity: 'low', desc: 'Recommended for compliance' },
    { label: 'Missing Serial Number', key: 'missingSerial' as const, severity: 'low', desc: 'Recommended for traceability' },
  ];

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <AlertTriangle size={22} className="text-amber-600" />
        <div>
          <h1 className="text-lg font-bold">Data Quality Monitor</h1>
          <p className="text-xs text-muted-foreground">Identify incomplete or incorrect records in the instrument database</p>
        </div>
      </div>

      {/* Score */}
      <div className="bg-card border border-border rounded p-5">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={`text-5xl font-bold ${qualityScore >= 95 ? 'text-green-600' : qualityScore >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
              {qualityScore}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Data Quality Score</div>
          </div>
          <div className="flex-1">
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-3 rounded-full transition-all"
                style={{ width: `${qualityScore}%`, background: qualityScore >= 95 ? 'hsl(142 60% 30%)' : qualityScore >= 85 ? 'hsl(38 92% 45%)' : 'hsl(0 72% 51%)' }} />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">{tools.length}</div>
                <div className="text-xs text-muted-foreground">Total Records</div>
              </div>
              <div>
                <div className="text-lg font-bold text-amber-600">{totalIssues}</div>
                <div className="text-xs text-muted-foreground">Total Issues</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{tools.length - issues.missingExpiry.length - issues.missingResponsible.length}</div>
                <div className="text-xs text-muted-foreground">Complete Records</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Checks */}
      <div className="space-y-3">
        {checks.map((check) => {
          const count = issues[check.key].length;
          const ok = count === 0;
          return (
            <div key={check.key} className={`bg-card border rounded p-4 ${!ok && check.severity === 'high' ? 'border-red-200' : !ok && check.severity === 'medium' ? 'border-amber-200' : 'border-border'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {ok ? (
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle size={18} className={check.severity === 'high' ? 'text-red-600 flex-shrink-0' : 'text-amber-600 flex-shrink-0'} />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{check.label}</div>
                    <div className="text-xs text-muted-foreground">{check.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!ok && (
                    <span className={`text-sm font-bold ${check.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                      {count} record{count !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${ok ? 'bg-green-50 text-green-700' : check.severity === 'high' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    {ok ? 'OK' : check.severity.toUpperCase()}
                  </span>
                </div>
              </div>
              {!ok && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Affected instruments:</div>
                  <div className="flex flex-wrap gap-2">
                    {issues[check.key].slice(0, 8).map((t) => (
                      <button key={t.id} onClick={() => navigate(`/tools/${t.id}`)}
                        className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100">
                        {t.id || 'MISSING-ID'}
                      </button>
                    ))}
                    {issues[check.key].length > 8 && (
                      <span className="text-xs text-muted-foreground py-0.5">+{issues[check.key].length - 8} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
