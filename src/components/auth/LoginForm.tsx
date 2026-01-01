import React from 'react'
import AuthPage from '../../pages/AuthPage'

// Redesigned to use the unified auth system
const LoginForm: React.FC = () => {
  return <AuthPage type="login" />
}

export default LoginForm