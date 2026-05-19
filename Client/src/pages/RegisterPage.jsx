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
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Account Pending</h2>
          <p style={{ color: '#555', lineHeight: 1.6 }}>Your recruiter account is pending admin approval. You will be notified once approved.</p>
          <Link to="/login" style={{ color: '#e94560' }}>Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Join GIU Nexus</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input style={styles.input} type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <select style={styles.input} name="role" value={form.role} onChange={handleChange}>
            <option value="jobSeeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.3rem' },
  sub: { color: '#888', marginBottom: '1.5rem' },
  error: { color: '#e94560', marginBottom: '1rem', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', display: 'block' },
  btn: { width: '100%', padding: '0.75rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  link: { marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#555' },
}

export default RegisterPage
