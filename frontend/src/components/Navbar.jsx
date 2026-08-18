import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Languages, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Activity, 
  MessageSquareText, 
  Layers, 
  Beaker, 
  Droplet, 
  CloudSun, 
  History 
} from 'lucide-react';

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.dashboard'), icon: Sprout },
    { path: '/disease', label: t('nav.disease'), icon: Activity },
    { path: '/chat', label: t('nav.chat'), icon: MessageSquareText },
    { path: '/crop', label: t('nav.crop_rec'), icon: Layers },
    { path: '/fertilizer', label: t('nav.fertilizer'), icon: Beaker },
    { path: '/irrigation', label: t('nav.irrigation'), icon: Droplet },
    { path: '/weather', label: t('nav.weather'), icon: CloudSun },
    { path: '/history', label: t('nav.history'), icon: History }
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '0 20px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            backgroundColor: 'var(--primary-600)',
            color: '#fff',
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-900)', lineHeight: 1.1 }}>
              {language === 'ml' ? 'കിസാൻ സഹായി' : 'Kisan AI'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {language === 'ml' ? 'AI കാർഷിക സഹായി' : 'Personal Farming Assistant'}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary-700)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Lang Switcher & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            title="Toggle English / മലയാളം"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--primary-600)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-800)',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            <Languages size={18} color="var(--primary-600)" />
            <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* User Session */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {user?.name?.split(' ')[0] || 'Farmer'}
              </span>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  padding: 8,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-hover)',
                  color: 'var(--accent-red)'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-600)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <LogIn size={16} />
              <span>{t('nav.login')}</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{ padding: 6, color: 'var(--text-main)', display: 'none' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          backgroundColor: '#fff',
          borderTop: '1px solid var(--border-color)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary-700)' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--primary-50)' : 'transparent'
                }}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};
