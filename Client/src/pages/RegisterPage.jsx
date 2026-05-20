
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobSeeker' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', form)
      if (res.data.user.status === 'pending') {
        setPending(true)
      } else {
        login(res.data.token, res.data.user)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (pending) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.bubble1} />
        <div style={styles.bubble2} />
        <div style={styles.bubble3} />
        <div className="glass-card fade-in" style={styles.card}>
          <h2 style={styles.title}>Account Pending</h2>
          <p style={{ color: '#9999BB', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your recruiter account is pending admin approval. You will be notified once approved.
          </p>
          <Link to="/login" style={{ color: '#e94560', fontWeight: 600 }}>Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />
      <div style={styles.bubble3} />

      <div className="glass-card fade-in" style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Join GIU Nexus</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            name="name"
            placeholder="👤 Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="📧 Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            placeholder="🔒 Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            className="input-field"
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ cursor: 'pointer' }}
          >
            <option value="jobSeeker">🎓 Job Seeker</option>
            <option value="recruiter">💼 Recruiter</option>
          </select>

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.bottom}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>Log in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.5rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 700,
    color: '#1A1A2E',
    marginBottom: '0.4rem',
  },
  sub: {
    color: '#9999BB',
    fontSize: '0.9rem',
    marginBottom: '1.8rem',
  },
  bottom: {
    marginTop: '1.5rem',
    color: '#9999BB',
    fontSize: '0.9rem',
  },
  loginLink: {
    color: '#1A1A2E',
    fontWeight: 700,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
  bubble1: {
    position: 'fixed', width: '250px', height: '250px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,215,0.5), rgba(200,160,228,0.2))',
    top: '10%', right: '10%', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 7s ease-in-out infinite',
  },
  bubble2: {
    position: 'fixed', width: '180px', height: '180px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.4), rgba(180,140,220,0.15))',
    bottom: '15%', left: '8%', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float2 9s ease-in-out infinite',
  },
  bubble3: {
    position: 'fixed', width: '120px', height: '120px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,200,230,0.6), rgba(220,180,240,0.2))',
    top: '50%', left: '5%', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 11s ease-in-out infinite',
  },
}

export default RegisterPage