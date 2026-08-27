import api from '../api/axios'
import type { LoginRequest, LoginResponse } from '../types/auth'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  async validate(): Promise<void> {
    await api.get('/auth/validate')
  },
}