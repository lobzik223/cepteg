import React, { createContext, useContext, useMemo, useState } from "react";

export type Role =
  | "CEPEG_ADMIN"
  | "RESTAURANT_OWNER"
  | "RESTAURANT_MANAGER"
  | "KITCHEN_STAFF"
  | "WAITER_STAFF"
  | "CASHIER_STAFF";

export type Session = {
  token: string;
  role: Role;
  tenantId?: number | null;
  branchId?: number | null;
} | null;

type Ctx = {
  session: Session;
  login: (s: Session) => void;
  logout: () => void;
};

const AuthContext = createContext<Ctx>({
  session: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const value = useMemo(
    () => ({
      session,
      login: (s: Session) => setSession(s),
      logout: () => setSession(null),
    }),
    [session]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
