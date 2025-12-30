import { apiClient } from './client'
import type { LoginCredentials, RegisterData, User, AuthResponse } from '../types/auth'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const users = await apiClient.get<any[]>('users.json')
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    )
    
    if (!user) {
      throw new Error('Invalid email or password')
    }

    const { password, ...userWithoutPassword } = user
    
    return {
      user: userWithoutPassword,
      token: 'mock-jwt-token',
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    const users = await apiClient.get<any[]>('users.json')
    
    if (users.some(u => u.email === data.email)) {
      throw new Error('Email already exists')
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      bio: '',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      user: newUser,
      token: 'mock-jwt-token',
    }
  },

  async updateProfile(data: Partial<User>, token: string): Promise<{ user: User }> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, ...data, updatedAt: new Date().toISOString() }
        resolve({ user: updatedUser })
      }, 500)
    })
  },
}