import { create } from 'zustand';

export interface UserState {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isEmailVerified: boolean;
}

interface AuthStore {
  user: UserState | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserState, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wegen_token', token);
      localStorage.setItem('wegen_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wegen_token');
      localStorage.removeItem('wegen_user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('wegen_token');
      const userStr = localStorage.getItem('wegen_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      }
    }
  },
}));
