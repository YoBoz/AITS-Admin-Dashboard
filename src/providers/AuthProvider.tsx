import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthContextType, User } from '@/types/auth.types';
import { STORAGE_KEYS } from '@/lib/constants';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@aits.io',
  role: 'super_admin',
  avatar: null,
  terminal: 'Terminal 1',
  language: 'en',
  permissions: [
    'dashboard.view',
    'trolleys.view',
    'trolleys.manage',
    'terminals.view',
    'terminals.manage',
    'users.view',
    'users.manage',
    'reports.view',
    'reports.export',
    'settings.view',
    'settings.manage',
  ],
};

const MOCK_CREDENTIALS = {
  email: 'admin@aits.io',
  password: 'Admin@123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      email === MOCK_CREDENTIALS.email &&
      password === MOCK_CREDENTIALS.password
    ) {
      setUser(MOCK_USER);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_USER));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
