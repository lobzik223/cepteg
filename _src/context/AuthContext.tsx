// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';

export type AuthUser = {
  token: string;
  tokenExpiresAt: number; // epoch ms
  role: 'CEPEG_ADMIN' | 'RESTAURANT_OWNER' | 'RESTAURANT_MANAGER';
  tenantId?: number | null;
  branchId?: number | null;
};

type LoginInput =
  Partial<Pick<AuthUser, 'token' | 'tokenExpiresAt' | 'tenantId' | 'branchId'>> &
  Pick<AuthUser, 'role'>;

type AuthContextType = {
  user: AuthUser | null;
  hydrated: boolean;
  login: (payload: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const NOOP = async () => {};
const AuthContext = createContext<AuthContextType>({
  user: null,
  hydrated: false,
  login: NOOP,
  logout: NOOP,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const expiryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpired = (u: AuthUser | null) => !u || Date.now() >= u.tokenExpiresAt;

  const scheduleExpiry = (u: AuthUser | null) => {
    if (expiryTimer.current) clearTimeout(expiryTimer.current);
    if (!u) return;
    const ms = Math.max(0, u.tokenExpiresAt - Date.now());
    expiryTimer.current = setTimeout(() => {
      // güvenlik: async çağrı
      logout();
    }, ms);
  };

  const login: AuthContextType['login'] = async (payload) => {
    const token = payload.token ?? `tok_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    const ttlMs = 30 * 60 * 1000; // 30 dk
    const next: AuthUser = {
      token,
      tokenExpiresAt: payload.tokenExpiresAt ?? Date.now() + ttlMs,
      role: payload.role,
      tenantId: payload.tenantId ?? null,
      branchId: payload.branchId ?? null,
    };
    setUser(next);
    scheduleExpiry(next);
    await AsyncStorage.setItem('auth:user', JSON.stringify(next));
  };

  const logout: AuthContextType['logout'] = async () => {
    setUser(null);
    scheduleExpiry(null);
    await AsyncStorage.removeItem('auth:user');
  };

  // Persist edilen oturumu yükle
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('auth:user');
        if (raw) {
          const saved: AuthUser = JSON.parse(raw);
          if (!isExpired(saved)) {
            setUser(saved);
            scheduleExpiry(saved);
          } else {
            await AsyncStorage.removeItem('auth:user');
          }
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // App tekrar öne gelince süresi dolmuşsa çıkış yap
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && isExpired(user)) {
        logout();
      }
    });
    return () => sub.remove();
  }, [user]);

  const value = useMemo(() => ({ user, hydrated, login, logout }), [user, hydrated]);

  // hydration tamamlanana kadar children render etme
  return <AuthContext.Provider value={value}>{hydrated ? children : null}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
