import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('roadmap_user') || 'null'),
  token: localStorage.getItem('roadmap_token'),
  isAuthenticated: Boolean(localStorage.getItem('roadmap_token')),
  setAuth: (user, token) => {
    localStorage.setItem('roadmap_token', token);
    localStorage.setItem('roadmap_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('roadmap_token');
    localStorage.removeItem('roadmap_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
