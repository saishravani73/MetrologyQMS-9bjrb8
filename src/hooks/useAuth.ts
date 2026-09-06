import { useState, useEffect } from 'react';
import { AuthUser } from '@/types';
import { getCurrentUser, login as authLogin, logout as authLogout } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const u = authLogin(email, password);
    if (u) {
      setUser(u);
      return true;
    }
    return false;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return { user, loading, login, logout };
}
