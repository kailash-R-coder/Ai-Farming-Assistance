import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, UserPlus, AlertCircle } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prefLang, setPrefLang] = useState(language);
  const [location, setLocation] = useState('Palakkad, Kerala');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password, prefLang, location);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
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
            {language === 'ml' ? 'കർഷക രജിസ്ട്രേഷൻ' : 'Farmer Registration'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {language === 'ml' ? 'പുതിയ കാർഷിക അക്കൗണ്ട് ആരംഭിക്കുക' : 'Create your free digital farming assistant account'}
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
            <label className="form-label">{language === 'ml' ? 'പേര്' : 'Full Name'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="e.g. Sreekumar Nair"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{language === 'ml' ? 'ഇമെയിൽ' : 'Email Address'}</label>
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
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{language === 'ml' ? 'സ്ഥലം / ജില്ല' : 'Location / District'}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-input"
              placeholder="e.g. Wayanad, Kerala"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{language === 'ml' ? 'തിരഞ്ഞെടുത്ത ഭാഷ' : 'Preferred Language'}</label>
            <select
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value)}
              className="form-select"
            >
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="en">English</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : (language === 'ml' ? 'അക്കൗണ്ട് ഉണ്ടാക്കുക' : 'Register')}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {language === 'ml' ? 'മുൻപ് അക്കൗണ്ട് ഉണ്ടോ?' : 'Already have an account?'}{' '}
          <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
            {language === 'ml' ? 'ലോഗിൻ ചെയ്യുക' : 'Login here'}
          </Link>
        </div>
      </div>
    </div>
  );
};
