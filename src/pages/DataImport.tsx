import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, X, Eye, Download } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import { Tool } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ParsedRow {
  rowNum: number;
  id: string;
  toolName: string;
  department: string;
  calibrationDate: string;
  expiryDate: string;
  responsiblePerson: string;
  storageLocation: string;
  errors: string[];
}

interface ImportSummary {
  total: number;
  valid: number;
  duplicates: number;
  missingExpiry: number;
  invalidDates: number;
  missingId: number;
  other: number;
}

const IMPORT_HISTORY = [
  { id: 'i001', fileName: 'QM_Tool_Register_2024_Q3.xlsx', importedAt: '2024-09-03T14:20:00', importedBy: 'Admin User', totalRecords: 75, validRecords: 72, duplicates: 0, missingExpiry: 3, invalidDates: 0, otherErrors: 0, status: 'PARTIAL' as const },
  { id: 'i002', fileName: 'HAL_Metrology_Master_Aug2024.xlsx', importedAt: '2024-08-01T10:00:00', importedBy: 'Rajesh Kumar', totalRecords: 68, validRecords: 68, duplicates: 0, missingExpiry: 0, invalidDates: 0, otherErrors: 0, status: 'SUCCESS' as const },
];

function generateDemoPreview(): ParsedRow[] {
  return [
    { rowNum: 2, id: 'HAL-QM-101', toolName: 'Laser Distance Meter', department: 'Quality Metrology', calibrationDate: '2024-01-15', expiryDate: '2025-01-15', responsiblePerson: 'Rajesh Kumar', storageLocation: 'Rack A1', errors: [] },
    { rowNum: 3, id: 'HAL-QM-102', toolName: 'Inside Caliper Digital', department: 'Production Engineering', calibrationDate: '2024-03-01', expiryDate: '2025-03-01', responsiblePerson: 'Anil Verma', storageLocation: 'Cabinet T1', errors: [] },
    { rowNum: 4, id: 'HAL-QM-001', toolName: 'Digital Vernier Caliper 150mm (Duplicate)', department: 'Quality Metrology', calibrationDate: '2024-01-10', expiryDate: '2025-01-10', responsiblePerson: 'Rajesh Kumar', storageLocation: 'Rack A1', errors: ['Duplicate Tool ID exists in database'] },
    { rowNum: 5, id: 'HAL-QM-103', toolName: 'Thickness Gauge Ultrasonic', department: 'NDT Division', calibrationDate: '2024-02-01', expiryDate: '', responsiblePerson: 'Suresh Babu', storageLocation: 'NDT Store', errors: ['Missing expiry date'] },
    { rowNum: 6, id: '', toolName: 'Ring Gauge Master Set', department: 'Central Standards Room', calibrationDate: '2024-05-01', expiryDate: '2025-05-01', responsiblePerson: '', storageLocation: 'Standards Room', errors: ['Missing Tool ID', 'Missing responsible person'] },
    { rowNum: 7, id: 'HAL-QM-104', toolName: 'Digital Protractor', department: 'Quality Metrology', calibrationDate: '2024-06-01', expiryDate: 'INVALID_DATE', responsiblePerson: 'Priya Sharma', storageLocation: 'Rack A2', errors: ['Invalid expiry date format'] },
    { rowNum: 8, id: 'HAL-QM-105', toolName: 'Precision Ruler 500mm', department: 'Quality Metrology', calibrationDate: '2024-07-01', expiryDate: '2025-07-01', responsiblePerson: 'Deepa Menon', storageLocation: 'Rack A3', errors: [] },
    { rowNum: 9, id: 'HAL-QM-106', toolName: 'Optical Level', department: 'Structural Testing', calibrationDate: '2024-08-01', expiryDate: '2025-08-01', responsiblePerson: 'Suresh Babu', storageLocation: 'Lab Bench 3', errors: [] },
  ];
}

export default function DataImport() {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [progress, setProgress] = useState(0);
  const { addTools, tools } = useTools();

  const summary: ImportSummary = {
    total: preview.length,
    valid: preview.filter((r) => r.errors.length === 0).length,
    duplicates: preview.filter((r) => r.errors.some((e) => e.includes('Duplicate'))).length,
    missingExpiry: preview.filter((r) => r.errors.some((e) => e.includes('expiry'))).length,
    invalidDates: preview.filter((r) => r.errors.some((e) => e.includes('Invalid'))).length,
    missingId: preview.filter((r) => r.errors.some((e) => e.includes('Tool ID'))).length,
    other: 0,
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file.name);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file.name);
  };

  const processFile = (name: string) => {
    setFileName(name);
    setPreview(generateDemoPreview());
    setStep('preview');
  };

  const handleImport = () => {
    setStep('importing');
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setStep('done'), 400);
      }
      setProgress(Math.min(prog, 100));
    }, 200);
  };

  const handleReset = () => {
    setStep('upload');
    setFileName('');
    setPreview([]);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Upload size={22} className="text-primary" />
        <div>
          <h1 className="text-lg font-bold">Data Import</h1>
          <p className="text-xs text-muted-foreground">Import instrument data from Excel files. Supports .xlsx and .csv formats.</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {['Upload File', 'Preview & Validate', 'Import'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${
              i === 0 && step === 'upload' ? 'bg-primary text-primary-foreground' :
              i === 1 && step === 'preview' ? 'bg-primary text-primary-foreground' :
              i === 2 && (step === 'importing' || step === 'done') ? 'bg-primary text-primary-foreground' :
              (i === 0 && step !== 'upload') || (i === 1 && (step === 'importing' || step === 'done')) ? 'bg-green-100 text-green-700' :
              'bg-muted text-muted-foreground'
            }`}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] border border-current">{i + 1}</span>
              {s}
            </div>
            {i < 2 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:border-primary/50'}`}
          >
            <FileSpreadsheet size={40} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground mb-2">Drag & Drop Excel File Here</h3>
            <p className="text-sm text-muted-foreground mb-4">Supports .xlsx, .xls, .csv files up to 50MB</p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white"
              style={{ background: 'hsl(var(--primary))' }}>
              <Upload size={15} /> Browse File
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
            </label>
            <div className="mt-4 pt-4 border-t border-border">
              <button onClick={() => processFile('Demo_Tool_Register.xlsx')}
                className="text-xs text-blue-600 hover:underline">
                Load Demo Excel File (for evaluation)
              </button>
            </div>
          </div>

          {/* Template Download */}
          <div className="bg-muted/30 border border-border rounded p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Download Import Template</div>
              <div className="text-xs text-muted-foreground">Use this template to format your data correctly before importing</div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded hover:bg-muted">
              <Download size={13} /> Template.xlsx
            </button>
          </div>

          {/* Required Columns */}
          <div className="bg-card border border-border rounded p-4">
            <div className="section-header">Required & Optional Columns</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { col: 'Tool ID *', req: true }, { col: 'Tool Name *', req: true },
                { col: 'Department *', req: true }, { col: 'Expiry Date *', req: true },
                { col: 'Calibration Date', req: false }, { col: 'Responsible Person', req: false },
                { col: 'Storage Location', req: false }, { col: 'Serial Number', req: false },
                { col: 'Manufacturer', req: false }, { col: 'Calibration Agency', req: false },
              ].map((c) => (
                <div key={c.col} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${c.req ? 'bg-red-500' : 'bg-green-500'}`} />
                  {c.col}
                  {c.req && <span className="text-red-500 text-[10px]">Required</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-green-600" />
              <span className="text-sm font-semibold">{fileName}</span>
              <span className="text-xs text-muted-foreground">— {summary.total} records found</span>
            </div>
            <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X size={12} /> Change File
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { label: 'Total Records', value: summary.total, color: 'text-foreground' },
              { label: 'Valid Records', value: summary.valid, color: 'text-green-700' },
              { label: 'Duplicates', value: summary.duplicates, color: summary.duplicates > 0 ? 'text-amber-700' : 'text-muted-foreground' },
              { label: 'Missing Expiry', value: summary.missingExpiry, color: summary.missingExpiry > 0 ? 'text-red-700' : 'text-muted-foreground' },
              { label: 'Invalid Dates', value: summary.invalidDates, color: summary.invalidDates > 0 ? 'text-red-700' : 'text-muted-foreground' },
              { label: 'Missing ID', value: summary.missingId, color: summary.missingId > 0 ? 'text-red-700' : 'text-muted-foreground' },
            ].map((s) => (
              <div key={s.label} className="metric-card text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {summary.total > summary.valid && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>{summary.total - summary.valid} records have validation errors</strong> and will NOT be imported.
                Only {summary.valid} valid records will be imported if you proceed.
                Review the errors below before continuing.
              </div>
            </div>
          )}

          {/* Preview Table */}
          <div className="border border-border rounded overflow-hidden">
            <div className="px-3 py-2 border-b bg-muted/30 flex items-center gap-2">
              <Eye size={14} className="text-muted-foreground" />
              <span className="text-xs font-semibold">Data Preview (first {preview.length} rows)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Tool ID</th>
                    <th>Tool Name</th>
                    <th>Department</th>
                    <th>Calib. Date</th>
                    <th>Expiry Date</th>
                    <th>Responsible</th>
                    <th>Validation</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {preview.map((row) => (
                    <tr key={row.rowNum} className={row.errors.length > 0 ? 'bg-red-50/40' : ''}>
                      <td><span className="text-xs text-muted-foreground">{row.rowNum}</span></td>
                      <td><span className={`font-mono text-xs ${!row.id ? 'text-red-600 font-bold' : 'text-foreground'}`}>{row.id || 'MISSING'}</span></td>
                      <td><span className="text-xs">{row.toolName}</span></td>
                      <td><span className="text-xs text-muted-foreground">{row.department}</span></td>
                      <td><span className="text-xs">{row.calibrationDate || '—'}</span></td>
                      <td><span className={`text-xs ${!row.expiryDate || row.expiryDate === 'INVALID_DATE' ? 'text-red-600 font-medium' : ''}`}>{row.expiryDate || 'MISSING'}</span></td>
                      <td><span className={`text-xs ${!row.responsiblePerson ? 'text-amber-600' : ''}`}>{row.responsiblePerson || '—'}</span></td>
                      <td>
                        {row.errors.length === 0 ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CheckCircle size={12} /> Valid
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            {row.errors.map((err, i) => (
                              <div key={i} className="flex items-center gap-1 text-[10px] text-red-700">
                                <AlertTriangle size={10} /> {err}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleImport}
              className="px-4 py-2 text-sm font-semibold rounded text-white"
              style={{ background: 'hsl(var(--primary))' }}>
              Import {summary.valid} Valid Records
            </button>
            <button onClick={handleReset} className="px-4 py-2 text-sm border border-border rounded hover:bg-muted">
              Cancel Import
            </button>
          </div>
        </div>
      )}

      {step === 'importing' && (
        <div className="bg-card border border-border rounded p-10 text-center">
          <FileSpreadsheet size={40} className="mx-auto mb-4 text-primary" />
          <h3 className="text-base font-semibold mb-4">Importing Records...</h3>
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs mb-1">
              <span>Processing</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%`, background: 'hsl(var(--primary))' }} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Validating records, checking for duplicates, updating database...</p>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-card border border-green-200 rounded p-10 text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-bold text-green-700 mb-2">Import Successful</h3>
          <p className="text-sm text-muted-foreground mb-1">{summary.valid} records imported successfully from <strong>{fileName}</strong></p>
          {summary.total > summary.valid && (
            <p className="text-xs text-amber-700 mb-4">{summary.total - summary.valid} records with errors were skipped.</p>
          )}
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={handleReset} className="px-4 py-2 text-sm border border-border rounded hover:bg-muted">
              Import Another File
            </button>
            <button onClick={() => window.location.href = '/tools'}
              className="px-4 py-2 text-sm font-semibold rounded text-white"
              style={{ background: 'hsl(var(--primary))' }}>
              View Tool Register
            </button>
          </div>
        </div>
      )}

      {/* Import History */}
      <div className="bg-card border border-border rounded p-4">
        <div className="section-header">Import History</div>
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Imported At</th>
              <th>By</th>
              <th>Total</th>
              <th>Valid</th>
              <th>Errors</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {IMPORT_HISTORY.map((h) => (
              <tr key={h.id}>
                <td className="font-medium text-sm">{h.fileName}</td>
                <td><span className="text-xs text-muted-foreground">{h.importedAt.replace('T', ' ').slice(0, 16)}</span></td>
                <td><span className="text-xs">{h.importedBy}</span></td>
                <td><span className="text-xs">{h.totalRecords}</span></td>
                <td><span className="text-xs text-green-700 font-medium">{h.validRecords}</span></td>
                <td><span className={`text-xs ${h.totalRecords - h.validRecords > 0 ? 'text-red-700' : 'text-muted-foreground'}`}>{h.totalRecords - h.validRecords}</span></td>
                <td>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${h.status === 'SUCCESS' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{h.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
