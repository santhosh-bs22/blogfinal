import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AnimatedAuthCard from '../components/auth/AnimatedAuthCard'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { LoginCredentials, RegisterData } from '../types/auth'

interface AuthPageProps {
  type: 'login' | 'register'
}

const AuthPage: React.FC<AuthPageProps> = ({ type: initialType }) => {
  const [type, setType] = useState<'login' | 'register'>(initialType)
  const { login, register, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Allow switching mode if initial prop changes or internal toggle
  useEffect(() => {
    setType(initialType)
  }, [initialType])

  const handleSubmit = async (data: any) => {
    try {
      if (type === 'login') {
        const result = await login(data as LoginCredentials)
        if (result.success) {
          toast.success("Welcome back!")
          navigate('/')
        } else {
          toast.error(result.error || "Login failed")
        }
      } else {
        const result = await register(data as RegisterData)
        if (result.success) {
          toast.success("Account created successfully!")
          navigate('/')
        } else {
          toast.error(result.error || "Registration failed")
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <AnimatedAuthCard
      type={type}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      toggleType={() => {
         const newType = type === 'login' ? 'register' : 'login';
         setType(newType);
         // Update URL without refresh to match state
         window.history.pushState(null, '', `/${newType === 'login' ? 'login' : 'register'}`);
      }}
    />
  )
}

export default AuthPage