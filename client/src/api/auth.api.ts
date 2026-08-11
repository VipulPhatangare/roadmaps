import apiClient from './client';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }
export interface AuthResponse { success: boolean; token: string; user: { id: string; name: string; email: string; role: string; }; }

export const authApi = {
  login: (data: LoginPayload) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterPayload) => apiClient.post<AuthResponse>('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
};
