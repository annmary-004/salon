import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return

    if (!user) {
      toast.info('Please sign in as admin to access the admin dashboard.')
      navigate('/auth', { state: { from: location.pathname } })
      return
    }

    if (user.role !== 'admin') {
      toast.error('Access denied. Admins only.')
      navigate('/')
    }
  }, [user, loading, navigate, location.pathname])

  if (loading) {
    return null
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return children
}
