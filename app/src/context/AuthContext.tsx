import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

export type AuthUser = {
  token: string;
  tokenExpiresAt: number; // epoch ms
  role: 'CEPEG_ADMIN' | 'RESTAURANT_OWNER' | 'RESTAURANT_MANAGER';
  tenantId?: number | null;
  branchId?: number | null;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (user: Omit<AuthUser, 'token' | 'tokenExpiresAt'> & { token?: string; tokenExpiresAt?: number }) => void;
  logout: () => void;
};

// 🚀 Varsayılan değerler
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Helper: check expiry
  const isExpired = (u: AuthUser | null) => !u || Date.now() >= u.tokenExpiresAt;

  const login: AuthContextType['login'] = async (payload) => {
    // create token if not provided
    const token = payload.token ?? `tok_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    const defaultTtlMs = 1000 * 60 * 30; // 30 minutes
    const tokenExpiresAt = payload.tokenExpiresAt ?? (Date.now() + defaultTtlMs);
    const next: AuthUser = {
      token,
      tokenExpiresAt,
      role: payload.role,
      tenantId: payload.tenantId ?? null,
      branchId: payload.branchId ?? null,
    };
    setUser(next);
    await AsyncStorage.setItem('auth:user', JSON.stringify(next));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('auth:user');
  };

  // Hydrate on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('auth:user');
        if (raw) {
          const parsed: AuthUser = JSON.parse(raw);
          if (!isExpired(parsed)) {
            setUser(parsed);
          } else {
            await AsyncStorage.removeItem('auth:user');
          }
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Auto logout when app returns to foreground if token expired
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active' && isExpired(user)) {
        await logout();
      }
    });
    return () => sub.remove();
  }, [user]);

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
