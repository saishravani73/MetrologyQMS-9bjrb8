import { AuthUser } from '@/types';

const STORAGE_KEY = 'mcms_auth_user';
const DEMO_USERS: (AuthUser & { password: string })[] = [
  {
    id: 'u001',
    name: 'Admin User',
    email: 'admin@mcms.gov.in',
    password: 'admin123',
    role: 'ADMINISTRATOR',
    department: 'Quality Metrology',
  },
  {
    id: 'u002',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@mcms.gov.in',
    password: 'quality123',
    role: 'QUALITY_MANAGER',
    department: 'Quality Metrology',
  },
  {
    id: 'u003',
    name: 'Priya Sharma',
    email: 'priya.sharma@mcms.gov.in',
    password: 'metro123',
    role: 'METROLOGY_ENGINEER',
    department: 'Quality Metrology',
  },
  {
    id: 'u004',
    name: 'Anil Verma',
    email: 'anil.verma@mcms.gov.in',
    password: 'tech123',
    role: 'TECHNICIAN',
    department: 'Production Engineering',
  },
];

export function login(email: string, password: string): AuthUser | null {
  const match = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!match) return null;
  const { password: _p, ...user } = match;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
