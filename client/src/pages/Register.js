import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const data = await api.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      localStorage.setItem('zt_token', data.token);
      localStorage.setItem('zt_user',  JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-shield">🛡️</span>
          <h1>ZERO TRUST</h1>
          <p>Create your admin account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="Navya Syal"
            value={form.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="admin@corp.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            name="confirm"
            type="password"
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account…' : 'Register →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

        <div className="auth-badge">🔒 Zero Trust — Never trust, always verify</div>
      </div>
    </div>
  );
}
