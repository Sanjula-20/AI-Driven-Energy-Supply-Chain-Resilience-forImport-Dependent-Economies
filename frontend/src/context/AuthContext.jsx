import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('es_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.post('/auth/login', { email, password });
      localStorage.setItem('es_token', data.token);
      localStorage.setItem('es_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('es_token');
    localStorage.removeItem('es_user');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, logout, isAuthenticated: Boolean(user) }),
    [user, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
