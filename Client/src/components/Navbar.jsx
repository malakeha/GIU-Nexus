import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <style>{`
        @keyframes spin360 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .nav-link { color: #555577; font-size: 0.88rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; transition: all 0.25s ease; }
        .nav-link:hover { color: #FF2D6B; }
        .nav-link.active { color: #1A1A2E; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: #FF2D6B; }
        .nav-logout:hover { background: #FF2D6B !important; color: #fff !important; }
        .nav-register:hover { box-shadow: 0 8px 24px rgba(26,26,46,0.4) !important; transform: translateY(-1px); }
        .logo-icon { display: inline-block; animation: spin360 6s linear infinite; color: #FF2D6B; margin-right: 0.3rem; font-size: 1.1rem; }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.inner}>

          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span className="logo-icon">✦</span>
            <span>nexus<span style={{ color: '#FF2D6B' }}>giu</span></span>
          </Link>

          {/* Links */}
          <div style={styles.links}>
            <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>Jobs</Link>

            {!isAuthenticated && (
              <>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                <Link to="/register" style={styles.registerBtn} className="nav-register">Sign Up</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'jobSeeker' && (
              <>
                <Link to="/jobs/recommended" className={`nav-link ${isActive('/jobs/recommended') ? 'active' : ''}`}>Recommended</Link>
                <Link to="/jobs/saved" className={`nav-link ${isActive('/jobs/saved') ? 'active' : ''}`}>Saved</Link>
                <Link to="/applications/my" className={`nav-link ${isActive('/applications/my') ? 'active' : ''}`}>Applications</Link>
                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" className={`nav-link ${isActive('/recruiter/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/recruiter/jobs/create" className={`nav-link ${isActive('/recruiter/jobs/create') ? 'active' : ''}`}>Post Job</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/admin/recruiters" className={`nav-link ${isActive('/admin/recruiters') ? 'active' : ''}`}>Recruiters</Link>
                <Link to="/admin/jobs" className={`nav-link ${isActive('/admin/jobs') ? 'active' : ''}`}>Jobs</Link>
                <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>Users</Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <span style={styles.greeting}>Hi, {user?.name?.split(' ')[0]} 👋</span>
                <button onClick={handleLogout} style={styles.logoutBtn} className="nav-logout">Log out</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

const styles = {
  nav: {
    background: 'rgba(255,255,255,0.3)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.5)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#1A1A2E',
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.8rem',
  },
  registerBtn: {
    background: '#1A1A2E',
    color: '#fff',
    padding: '0.5rem 1.4rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
    boxShadow: '0 4px 12px rgba(26,26,46,0.2)',
    transition: 'all 0.25s ease',
  },
  greeting: {
    color: '#555577',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.6)',
    color: '#555577',
    border: '1px solid rgba(255,255,255,0.8)',
    padding: '0.45rem 1.1rem',
    borderRadius: '50px',
    fontSize: '0.83rem',
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.25s ease',
  },
}

export default Navbar