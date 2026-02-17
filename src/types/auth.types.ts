export type Role = 'super_admin' | 'terminal_admin' | 'operator' | 'viewer';

export type Permission =
  | 'dashboard.view'
  | 'trolleys.view'
  | 'trolleys.manage'
  | 'terminals.view'
  | 'terminals.manage'
  | 'users.view'
  | 'users.manage'
  | 'reports.view'
  | 'reports.export'
  | 'settings.view'
  | 'settings.manage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  terminal: string;
  language: string;
  permissions: Permission[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
