import React from 'react'
import Auth from '../pages/Auth'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (user && user.role === 'admin') {
    return children
  }

  return <Auth adminOnly />
}
