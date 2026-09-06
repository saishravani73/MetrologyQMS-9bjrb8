export const DEPARTMENTS = [
  'Quality Metrology',
  'Production Engineering',
  'Avionics Systems',
  'Structural Testing',
  'Materials Laboratory',
  'NDT Division',
  'Hydraulics & Pneumatics',
  'Electrical Systems',
  'Toolroom',
  'Central Standards Room',
];

export const TOOL_CATEGORIES = [
  'Dimensional Measurement',
  'Force & Torque',
  'Pressure & Vacuum',
  'Temperature',
  'Electrical & Electronic',
  'Surface Finish',
  'Optical',
  'Mass & Weight',
  'Hardness Testing',
  'NDT Equipment',
  'Flow Measurement',
  'Vibration Analysis',
  'Air Gauging',
  'Angle & Geometry',
  'Length Standards',
];

export const STORAGE_LOCATIONS = [
  'Metrology Rack A1',
  'Metrology Rack A2',
  'Metrology Rack A3',
  'Metrology Rack A4',
  'Metrology Rack B1',
  'Metrology Rack B2',
  'Calibration Room C1',
  'Calibration Room C2',
  'Lab Bench 1',
  'Lab Bench 2',
  'Lab Bench 3',
  'Production Floor Cabinet',
  'Toolroom Cabinet T1',
  'Toolroom Cabinet T2',
  'Standards Room Safe',
  'NDT Store',
];

export const CALIBRATION_AGENCIES = [
  'NABL Accredited Lab - Alpha Metrology',
  'NABL Accredited Lab - Precision Standards',
  'In-House Calibration Lab',
  'NPL Traceable Lab - Delta Instruments',
  'ISO/IEC 17025 Lab - Sigma Calibration',
  'OEM Service Center',
];

export const RESPONSIBLE_PERSONS = [
  'Rajesh Kumar',
  'Priya Sharma',
  'Anil Verma',
  'Sunita Nair',
  'Vikram Singh',
  'Deepa Menon',
  'Ramesh Patel',
  'Kavitha Rajan',
  'Suresh Babu',
  'Anitha Krishnan',
  'Mohan Das',
  'Lakshmi Iyer',
];

export const DEADLINE_THRESHOLDS = {
  dueToday: 0,
  dueTomorrow: 1,
  dueWithin7: 7,
  dueWithin30: 30,
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Tool Register', path: '/tools', icon: 'Database' },
  {
    label: 'Calibration',
    icon: 'Gauge',
    children: [
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
