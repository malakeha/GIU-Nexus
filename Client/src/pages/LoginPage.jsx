import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const LoginPage = () => {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
const { login } = useAuth()
const navigate = useNavigate()

const handleSubmit = async (e) => {
e.preventDefault()
setLoading(true)
setError('')
try {
const res = await api.post('/auth/login', { email, password })
login(res.data.token, res.data.user)
const role = res.data.user.role
if (role === 'admin') navigate('/home')
else if (role === 'recruiter') navigate('/home')
else navigate('/home')
} catch (err) {
setError(err.response?.data?.message || 'Login failed')
} finally {
setLoading(false)
}
}

return (
<div style={styles.wrapper}>
<div style={styles.bubble1} />
<div style={styles.bubble2} />
<div style={styles.bubble3} />

<div className="glass-card fade-in" style={styles.card}>
<h2 style={styles.title}>Log in</h2>
<p style={styles.sub}>Welcome back to GIU Nexus</p>

{error && <p className="error-text">{error}</p>}

<form onSubmit={handleSubmit}>
<input
className="input-field"
type="email"
placeholder="📧 Email"
value={email}
onChange={e => setEmail(e.target.value)}
required
/>
<input
className="input-field"
type="password"
placeholder="🔒 Password"
value={password}
onChange={e => setPassword(e.target.value)}
required
/>
<div style={styles.forgotRow}>
<Link to="/forgot-password" style={styles.forgot}>Forgot Password?</Link>
</div>
<button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} type="submit" disabled={loading}>
{loading ? 'Logging in...' : 'Log in'}
</button>
</form>

<p style={styles.bottom}>
or <Link to="/register" style={styles.signupLink}>Sign up</Link>
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
forgotRow: {
textAlign: 'right',
marginTop: '-0.5rem',
},
forgot: {
color: '#9999BB',
fontSize: '0.83rem',
},
bottom: {
marginTop: '1.5rem',
color: '#9999BB',
fontSize: '0.9rem',
},
signupLink: {
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

export default LoginPage
