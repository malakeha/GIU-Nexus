import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>GIU Nexus</Link>

      <div style={styles.links}>
        <Link to="/jobs" style={styles.link}>Jobs</Link>

        {!isAuthenticated && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {isAuthenticated && user?.role === 'jobSeeker' && (
          <>
            <Link to="/jobs/recommended" style={styles.link}>Recommended</Link>
            <Link to="/jobs/saved" style={styles.link}>Saved</Link>
            <Link to="/applications/my" style={styles.link}>My Applications</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
          </>
        )}

        {isAuthenticated && user?.role === 'recruiter' && (
          <>
            <Link to="/recruiter/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/recruiter/jobs/create" style={styles.link}>Post Job</Link>
          </>
        )}

        {isAuthenticated && user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/admin/recruiters" style={styles.link}>Recruiters</Link>
            <Link to="/admin/jobs" style={styles.link}>Jobs</Link>
            <Link to="/admin/users" style={styles.link}>Users</Link>
          </>
        )}

        {isAuthenticated && (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '64px',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#e94560',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'center',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
}

export default Navbar