import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '60px auto', padding: '0 20px' }}>
      <div className="farm-card" style={{ padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            backgroundColor: 'var(--primary-600)',
            color: '#fff',
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12
          }}>
            <Sprout size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-900)' }}>
            {language === 'ml' ? 'കർഷക ലോഗിൻ' : 'Farmer Login'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {language === 'ml' ? 'നിങ്ങളുടെ കാർഷിക അക്കൗണ്ടിലേക്ക് പ്രവേശിക്കുക' : 'Sign in to access your farm records & diagnoses'}
          </p>
        </div>

        {error && (
          <div style={{ padding: 12, backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)', borderRadius: 'var(--radius-md)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{language === 'ml' ? 'ഇമെയിൽ വിലാസം' : 'Email Address'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="farmer@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{language === 'ml' ? 'പാസ്‌വേഡ്' : 'Password'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            <LogIn size={18} />
            <span>{loading ? 'Logging in...' : (language === 'ml' ? 'പ്രവേശിക്കുക' : 'Login')}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {language === 'ml' ? 'അക്കൗണ്ട് ഇല്ലേ?' : "Don't have an account?"}{' '}
          <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
            {language === 'ml' ? 'ഇവിടെ രജിസ്റ്റർ ചെയ്യുക' : 'Register here'}
          </Link>
        </div>
      </div>
    </div>
  );
};
