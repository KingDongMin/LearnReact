import React from 'react'
import AuthTemplate from '../components/auth/AuthTemplate'
import AuthForm from '../components/auth/AuthForm'
import LoginForm from '../containers/auth/LoginForm'

export const LoginPage = () => {
  return (
    <AuthTemplate>
      <LoginForm/>
    </AuthTemplate>
  )
}
