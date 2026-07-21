import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { UserResponse } from '../api/types';

interface AuthState {
  user: UserResponse | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('ruma_token');
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    (async () => {
      const token = await AsyncStorage.getItem('ruma_token');
      if (token) {
        try { setUser(await authApi.me()); } catch { await AsyncStorage.removeItem('ruma_token'); }
      }
      setLoading(false);
    })();
  }, [logout]);

  const login = useCallback(async (phone: string, password: string) => {
    const { token, user: u } = await authApi.login(phone, password);
    await AsyncStorage.setItem('ruma_token', token);
    setUser(u);
  }, []);

  const refreshMe = useCallback(async () => setUser(await authApi.me()), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
