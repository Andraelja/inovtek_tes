import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { loginApi } from "../api/auth";

type AuthContextValue = {
  token: string | null;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      logout: () => {
        try {
          localStorage.removeItem("token");
        } catch {
          // ignore
        }
        setToken(null);
      },
      login: async (email, password) => {
        const res = await loginApi(email, password);
        try {
          localStorage.setItem("token", res.token);
        } catch {
          // ignore
        }
        setToken(res.token);
      },
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
