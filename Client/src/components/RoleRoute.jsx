import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

const RoleRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!roles.includes(user?.role)) return <Navigate to="/" replace />

  return children
}

export default RoleRoute