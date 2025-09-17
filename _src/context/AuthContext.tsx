import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'CEPEG_ADMIN' | 'RESTAURANT_OWNER' | 'RESTAURANT_MANAGER';
export type AuthUser = {
  token: string;
  role: UserRole;
  tenantId?: number | null;
  branchId?: number | null;
  tokenExpiresAt?: number;
};

type AuthContextType = {
  user: AuthUser | null;
  ready: boolean;                          // ✅ hydrate tamam mı?
  login: (u: AuthUser) => Promise<void> | void;
  logout: () => Promise<void> | void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  ready: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@auth_user');
        if (raw) {
          const parsed: AuthUser = JSON.parse(raw);
          // İstersen token süresi kontrolü:
          if (!parsed.tokenExpiresAt || parsed.tokenExpiresAt > Date.now()) {
            setUser(parsed);
          } else {
            await AsyncStorage.removeItem('@auth_user');
          }
        }
      } finally {
        setReady(true);                    // ✅ artık redirect kararını verebiliriz
      }
    })();
  }, []);

  const login = async (u: AuthUser) => {
    setUser(u);
    await AsyncStorage.setItem('@auth_user', JSON.stringify(u)); // ✅ persist
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
