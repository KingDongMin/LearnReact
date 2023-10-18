import React from 'react'
import AuthTemplate from '../components/auth/AuthTemplate'
import AuthForm from '../components/auth/AuthForm'

export const LoginPage = () => {
  return (
    <AuthTemplate>
      <AuthForm type="login"/>
    </AuthTemplate>
  )
}
