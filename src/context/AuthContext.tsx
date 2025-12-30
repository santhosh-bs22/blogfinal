import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'
import type { User, LoginCredentials, RegisterData, AuthState } from '../types/auth'
import { authApi } from '../api/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean }>
  register: (data: RegisterData) => Promise<{ success: boolean }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          const user = JSON.parse(userData)
          setState({
            user,
            token,
            isLoading: false,
            error: null,
          })
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
          }))
        }
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setState(prev => ({
          ...prev,
          isLoading: false,
        }))
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await authApi.login(credentials)
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      })
      
      toast.success('Welcome back!')
      return { success: true }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }))
      toast.error(error.message || 'Login failed')
      return { success: false }
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await authApi.register(data)
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      })
      
      toast.success('Account created successfully!')
      return { success: true }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed',
      }))
      toast.error(error.message || 'Registration failed')
      return { success: false }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    })
    toast.success('Logged out successfully')
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await authApi.updateProfile(data, state.token!)
      
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setState(prev => ({
        ...prev,
        user: response.user,
        isLoading: false,
        error: null,
      }))
      
      toast.success('Profile updated successfully')
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Update failed',
      }))
      toast.error(error.message || 'Update failed')
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!state.user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}