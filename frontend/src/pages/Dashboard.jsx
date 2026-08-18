import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services';
import { 
  Activity, 
  MessageSquareText, 
  Layers, 
  Beaker, 
  Droplet, 
  CloudSun, 
  ArrowRight, 
  CloudRain, 
  Thermometer, 
  Wind, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const Dashboard = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await dashboardService.getSummary();
        setData(res);
      } catch (err) {
        console.error("Error loading dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const actionCards = [
    {
      title: t('dashboard.action_disease'),
      desc: t('dashboard.action_disease_desc'),
      path: '/disease',
      icon: Activity,
      color: '#16a34a',
      bg: 'var(--primary-50)'
    },
    {
      title: t('dashboard.action_chat'),
      desc: t('dashboard.action_chat_desc'),
      path: '/chat',
      icon: MessageSquareText,
      color: '#0284c7',
      bg: 'var(--accent-sky-light)'
    },
    {
      title: t('dashboard.action_crop'),
      desc: t('dashboard.action_crop_desc'),
      path: '/crop',
      icon: Layers,
      color: '#d97706',
      bg: 'var(--accent-amber-light)'
    },
    {
      title: t('dashboard.action_fertilizer'),
      desc: t('dashboard.action_fertilizer_desc'),
      path: '/fertilizer',
      icon: Beaker,
      color: '#9333ea',
      bg: '#f3e8ff'
    },
    {
      title: t('dashboard.action_irrigation'),
      desc: t('dashboard.action_irrigation_desc'),
      path: '/irrigation',
      icon: Droplet,
      color: '#0891b2',
      bg: '#cffafe'
    },
    {
      title: t('dashboard.action_weather'),
      desc: t('dashboard.action_weather_desc'),
      path: '/weather',
      icon: CloudSun,
      color: '#ea580c',
      bg: '#ffedd5'
    }
  ];

  const weather = data?.current_weather;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-900) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 36px',
        color: '#fff',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ maxWidth: 650 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', marginBottom: 12, fontWeight: 600 }}>
            <span>🌱</span>
            <span>{language === 'ml' ? 'കേരള കാർഷിക ഡാഷ്‌ബോർഡ്' : 'Kerala Smart Agriculture Hub'}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
            {t('dashboard.greeting')}{user ? `, ${user.name}` : ''}!
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--primary-100)', lineHeight: 1.5 }}>
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Quick Weather Capsule */}
        {weather && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 24px',
            minWidth: 240,
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <div style={{ fontSize: '2.5rem' }}>🌤️</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{weather.current_temperature}°C</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-100)' }}>
                {language === 'ml' ? (weather.condition_ml || weather.condition) : weather.condition}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                💧 {weather.humidity}% | 🌧️ {weather.precipitation_mm}mm
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Tiles */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 16 }}>
          {t('dashboard.quick_actions')}
        </h2>
        <div className="grid-3">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.path}
                to={card.path}
                className="farm-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: 24,
                  textDecoration: 'none',
                  border: '1.5px solid var(--border-color)'
                }}
              >
                <div style={{
                  backgroundColor: card.bg,
                  color: card.color,
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {card.title}
                    </h3>
                    <ArrowRight size={18} color="var(--text-light)" />
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {card.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Diagnoses & Quick Tips */}
      <div className="grid-2">
        {/* Recent Diagnoses */}
        <div className="farm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              {t('dashboard.recent_diagnoses')}
            </h3>
            <Link to="/history" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)' }}>
              {t('dashboard.view_all')} →
            </Link>
          </div>

          {data?.recent_diagnoses && data.recent_diagnoses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.recent_diagnoses.map((diag) => (
                <div
                  key={diag.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-bg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--primary-100)',
                      color: 'var(--primary-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      🌿
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{diag.crop} - {diag.disease}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(diag.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-green">{diag.confidence}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
              <Activity size={36} color="var(--text-light)" style={{ marginBottom: 8 }} />
              <p>{language === 'ml' ? 'ഇതുവരെ രോഗനിർണ്ണയങ്ങൾ ചെയ്തിട്ടില്ല.' : 'No crop diagnoses yet.'}</p>
              <Link to="/disease" className="btn-secondary" style={{ marginTop: 12 }}>
                {t('dashboard.action_disease')}
              </Link>
            </div>
          )}
        </div>

        {/* Kerala Seasonal Agro Advisories */}
        <div className="farm-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 16 }}>
            {t('dashboard.farming_tips')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data?.quick_tips && data.quick_tips.map((tip, idx) => (
              <div
                key={idx}
                style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-50)',
                  borderLeft: '4px solid var(--primary-600)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-900)', marginBottom: 4 }}>
                  {language === 'ml' ? (tip.title_ml || tip.title) : tip.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {language === 'ml' ? (tip.tip_ml || tip.tip) : tip.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
