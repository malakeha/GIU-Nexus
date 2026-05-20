import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const HomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ jobs: 0, companies: 0, applicants: 0 })

  useEffect(() => {
    api.get('/jobs?limit=1')
      .then(res => setStats(s => ({ ...s, jobs: res.data.total || 0 })))
      .catch(() => {})
  }, [])

  const isRecruiter = user?.role === 'recruiter'
  const isAdmin = user?.role === 'admin'
  const isJobSeeker = user?.role === 'jobSeeker'

  return (
    <div style={styles.wrapper}>
      {/* Bubbles */}
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />
      <div style={styles.bubble3} />

      {/* Hero */}
      <section style={styles.hero}>
        <div className="glass-card fade-in" style={styles.heroCard}>
          <h1 style={styles.heroTitle}>
            Welcome back, <span style={styles.accent}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={styles.heroSub}>
            {isJobSeeker && 'Find your dream internship or job — tailored just for you.'}
            {isRecruiter && 'Post jobs and discover the best talent from GIU.'}
            {isAdmin && 'Manage the platform and keep everything running smoothly.'}
          </p>

          <div style={styles.btnRow}>
            {isJobSeeker && (
              <>
                <Link to="/jobs" className="btn-primary" style={styles.btn}>Browse Jobs</Link>
                <Link to="/jobs/recommended" className="btn-primary" style={{ ...styles.btn, ...styles.btnOutline }}>Recommended</Link>
              </>
            )}
            {isRecruiter && (
              <>
                <Link to="/jobs/create" className="btn-primary" style={styles.btn}>Post a Job</Link>
                <Link to="/recruiter/dashboard" className="btn-primary" style={{ ...styles.btn, ...styles.btnOutline }}>My Dashboard</Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="btn-primary" style={styles.btn}>Admin Dashboard</Link>
                <Link to="/admin/pending-recruiters" className="btn-primary" style={{ ...styles.btn, ...styles.btnOutline }}>Pending Recruiters</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={styles.statsRow}>
        {[
          { label: 'Open Positions', value: stats.jobs || '50+', icon: '💼' },
          { label: 'Companies', value: '20+', icon: '🏢' },
          { label: 'Students Hired', value: '100+', icon: '🎓' },
        ].map((s, i) => (
          <div key={i} className="glass-card fade-in" style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Quick Links */}
      <section style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.linksGrid}>
          {isJobSeeker && [
            { to: '/jobs', icon: '🔍', label: 'Browse All Jobs' },
            { to: '/jobs/recommended', icon: '⭐', label: 'Recommended for You' },
            { to: '/jobs/saved', icon: '🔖', label: 'Saved Jobs' },
            { to: '/my-applications', icon: '📋', label: 'My Applications' },
            { to: '/profile', icon: '👤', label: 'My Profile' },
            { to: '/profile/edit', icon: '✏️', label: 'Edit Profile' },
          ].map((link, i) => (
            <Link key={i} to={link.to} className="glass-card" style={styles.linkCard}>
              <span style={styles.linkIcon}>{link.icon}</span>
              <span style={styles.linkLabel}>{link.label}</span>
            </Link>
          ))}

          {isRecruiter && [
            { to: '/jobs/create', icon: '➕', label: 'Post a Job' },
            { to: '/recruiter/dashboard', icon: '📊', label: 'My Dashboard' },
            { to: '/profile', icon: '👤', label: 'My Profile' },
            { to: '/profile/edit', icon: '✏️', label: 'Edit Profile' },
          ].map((link, i) => (
            <Link key={i} to={link.to} className="glass-card" style={styles.linkCard}>
              <span style={styles.linkIcon}>{link.icon}</span>
              <span style={styles.linkLabel}>{link.label}</span>
            </Link>
          ))}

          {isAdmin && [
            { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
            { to: '/admin/users', icon: '👥', label: 'Manage Users' },
            { to: '/admin/jobs', icon: '💼', label: 'Manage Jobs' },
            { to: '/admin/pending-recruiters', icon: '⏳', label: 'Pending Recruiters' },
          ].map((link, i) => (
            <Link key={i} to={link.to} className="glass-card" style={styles.linkCard}>
              <span style={styles.linkIcon}>{link.icon}</span>
              <span style={styles.linkLabel}>{link.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '90vh',
    padding: '2rem',
    position: 'relative',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  bubble1: {
    position: 'fixed', width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,215,0.4), rgba(200,160,228,0.15))',
    top: '5%', right: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 7s ease-in-out infinite',
  },
  bubble2: {
    position: 'fixed', width: '200px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.3), rgba(180,140,220,0.1))',
    bottom: '10%', left: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float2 9s ease-in-out infinite',
  },
  bubble3: {
    position: 'fixed', width: '150px', height: '150px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,200,230,0.5), rgba(220,180,240,0.15))',
    top: '50%', left: '3%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 11s ease-in-out infinite',
  },
  hero: { marginBottom: '2.5rem', position: 'relative', zIndex: 1 },
  heroCard: {
    padding: '3rem 2.5rem',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '2.4rem',
    fontWeight: 700,
    color: '#1A1A2E',
    marginBottom: '0.8rem',
  },
  accent: { color: '#e94560' },
  heroSub: {
    color: '#9999BB',
    fontSize: '1.05rem',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  btnRow: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '0.75rem 2rem',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '1rem',
    textDecoration: 'none',
    display: 'inline-block',
  },
  btnOutline: {
    background: 'transparent',
    border: '2px solid #e94560',
    color: '#e94560',
  },
  statsRow: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2.5rem',
    position: 'relative',
    zIndex: 1,
  },
  statCard: {
    padding: '1.8rem 2.5rem',
    textAlign: 'center',
    minWidth: '160px',
    flex: 1,
  },
  statIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
  statValue: { fontSize: '2rem', fontWeight: 700, color: '#e94560' },
  statLabel: { color: '#9999BB', fontSize: '0.9rem', marginTop: '0.3rem' },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1A1A2E',
    marginBottom: '1.2rem',
    position: 'relative',
    zIndex: 1,
  },
  quickLinks: { position: 'relative', zIndex: 1 },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
  },
  linkCard: {
    padding: '1.5rem 1rem',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.6rem',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  linkIcon: { fontSize: '1.8rem' },
  linkLabel: { color: '#1A1A2E', fontWeight: 600, fontSize: '0.9rem' },
}

export default HomePage

