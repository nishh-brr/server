import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/login', form);
      localStorage.setItem('zt_token', data.token);
      localStorage.setItem('zt_user',  JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
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
          <p>Hybrid Cloud Security Console</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="admin@corp.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Authenticating…' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>

        <div className="auth-badge">🔒 Zero Trust — Never trust, always verify</div>
      </div>
    </div>
  );
}
