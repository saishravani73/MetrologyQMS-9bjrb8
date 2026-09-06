export type CalibrationStatus =
  | 'OVERDUE'
  | 'DUE_TODAY'
  | 'DUE_TOMORROW'
  | 'DUE_WITHIN_7'
  | 'DUE_WITHIN_30'
  | 'VALID'
  | 'UNDER_CALIBRATION';

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW';

export type InspectionStatus = 'PASSED' | 'FAILED' | 'PENDING' | 'DUE' | 'OVERDUE';

export type ToolStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_REPAIR' | 'RETIRED' | 'UNDER_CALIBRATION';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SENT_FOR_CALIBRATION' | 'CALIBRATION_COMPLETED' | 'VERIFIED' | 'CLOSED';

export type UserRole = 'ADMINISTRATOR' | 'QUALITY_MANAGER' | 'METROLOGY_ENGINEER' | 'TECHNICIAN' | 'VIEWER';

export interface Tool {
  id: string;
  toolName: string;
  category: string;
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
  department: string;
  storageLocation: string;
  responsiblePerson: string;
  range?: string;
  accuracy?: string;
  calibrationFrequencyMonths: number;
  calibrationDate: string;
  expiryDate: string;
  nextCalibrationDate: string;
  calibrationAgency?: string;
  certificateNumber?: string;
  lastCalibrationResult?: string;
  inspectionDate?: string;
  nextInspectionDate?: string;
  inspectionStatus: InspectionStatus;
  toolStatus: ToolStatus;
  remarks?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

export interface CalibrationEvent {
  id: string;
  toolId: string;
  type: 'CALIBRATION' | 'INSPECTION' | 'REMINDER' | 'ESCALATION' | 'IMPORT' | 'NOTE';
  date: string;
  description: string;
  performedBy?: string;
  result?: string;
  certificateRef?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  toolId?: string;
  toolName?: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  module: string;
}

export interface Notification {
  id: string;
  type: 'CRITICAL' | 'DUE_TODAY' | 'DUE_TOMORROW' | 'UPCOMING' | 'SYSTEM' | 'IMPORT_ERROR' | 'ESCALATION';
  title: string;
  message: string;
  toolId?: string;
  toolName?: string;
  timestamp: string;
  read: boolean;
  escalationLevel?: number;
}

export interface Task {
  id: string;
  toolId: string;
  toolName: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  remarks: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Document {
  id: string;
  toolId: string;
  name: string;
  type: 'CALIBRATION_CERTIFICATE' | 'INSPECTION_REPORT' | 'MAINTENANCE_RECORD' | 'REPAIR_REPORT' | 'PURCHASE_DOCUMENT' | 'MANUFACTURER_SPEC';
  uploadedBy: string;
  uploadDate: string;
  version: string;
  fileSize: string;
  fileUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface ImportRecord {
  id: string;
  fileName: string;
  importedAt: string;
  importedBy: string;
  totalRecords: number;
  validRecords: number;
  duplicates: number;
  missingExpiry: number;
  invalidDates: number;
  otherErrors: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
}

export interface DashboardStats {
  total: number;
  valid: number;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
  dueWithin7: number;
  dueWithin30: number;
  underCalibration: number;
  inspectionDue: number;
  compliancePercent: number;
  prevMonthCompliance: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}
