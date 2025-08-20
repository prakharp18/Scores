import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '@/lib/useAuth'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  // while user is null we redirect to /auth; if you want a loading state, change logic
  if (!user) return <Navigate to="/auth" replace />
  return children
}
