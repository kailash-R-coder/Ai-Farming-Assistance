import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { weatherService } from '../services';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudRain, 
  MapPin, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

export const WeatherAdvisory = () => {
  const { language, t } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("Palakkad");

  const keralaDistricts = [
    { name: "Palakkad", lat: 10.7867, lon: 76.6548, label: language === 'ml' ? "പാലക്കാട്" : "Palakkad" },
    { name: "Thrissur", lat: 10.5276, lon: 76.2144, label: language === 'ml' ? "തൃശ്ശൂർ" : "Thrissur" },
    { name: "Wayanad", lat: 11.6854, lon: 76.1320, label: language === 'ml' ? "വയനാട്" : "Wayanad" },
    { name: "Idukki", lat: 9.8500, lon: 76.9700, label: language === 'ml' ? "ഇടുക്കി" : "Idukki" },
    { name: "Alappuzha (Kuttanad)", lat: 9.4981, lon: 76.3388, label: language === 'ml' ? "ആലപ്പുഴ (കുട്ടനാട്)" : "Alappuzha" },
    { name: "Kottayam", lat: 9.5916, lon: 76.5222, label: language === 'ml' ? "കോട്ടയം" : "Kottayam" },
    { name: "Malappuram", lat: 11.0510, lon: 76.0711, label: language === 'ml' ? "മലപ്പുറം" : "Malappuram" },
    { name: "Kozhikode", lat: 11.2588, lon: 75.7804, label: language === 'ml' ? "കോഴിക്കോട്" : "Kozhikode" }
  ];

  const fetchDistrictWeather = async (districtName) => {
    setLoading(true);
    const d = keralaDistricts.find(item => item.name === districtName) || keralaDistricts[0];
    try {
      const res = await weatherService.getWeather(d.lat, d.lon, `${d.label}, Kerala`);
      setWeather(res);
      setSelectedDistrict(districtName);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistrictWeather("Palakkad");
  }, [language]);

  const advisories = language === 'ml' && weather?.agricultural_advisories_ml?.length
    ? weather.agricultural_advisories_ml
    : weather?.agricultural_advisories;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#ea580c', fontWeight: 700, marginBottom: 4 }}>
          <CloudSun size={20} />
          <span>{language === 'ml' ? 'തത്സമയ കാലാവസ്ഥ' : 'Open-Meteo Weather Feed'}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          {t('weather.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          {t('weather.subtitle')}
        </p>
      </div>

      {/* District Selector Tabs */}
      <div className="farm-card" style={{ padding: 16 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={16} />
          <span>{language === 'ml' ? 'ജില്ല തിരഞ്ഞെടുക്കുക:' : 'Select Kerala District:'}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {keralaDistricts.map((d) => (
            <button
              key={d.name}
              type="button"
              onClick={() => fetchDistrictWeather(d.name)}
              className={selectedDistrict === d.name ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>{language === 'ml' ? 'കാലാവസ്ഥാ വിവരങ്ങൾ എടുക്കുന്നു...' : 'Fetching live weather...'}</p>
        </div>
      ) : weather && (
        <>
          {/* Main Weather Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-xl)',
              padding: '32px 36px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem', fontWeight: 600, opacity: 0.9, marginBottom: 8 }}>
                <MapPin size={20} />
                <span>{weather.location}</span>
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>
                {weather.current_temperature}°C
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 8 }}>
                {language === 'ml' ? (weather.condition_ml || weather.condition) : weather.condition}
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, backgroundColor: 'rgba(255,255,255,0.15)', padding: '20px 24px', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', opacity: 0.85 }}>
                  <Droplets size={16} />
                  <span>{t('weather.humidity')}</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{weather.humidity}%</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', opacity: 0.85 }}>
                  <CloudRain size={16} />
                  <span>{t('weather.rain')}</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{weather.precipitation_mm} mm</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', opacity: 0.85 }}>
                  <Wind size={16} />
                  <span>{t('weather.wind')}</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{weather.wind_speed_kmh} km/h</div>
              </div>
            </div>
          </div>

          {/* Agricultural Action Items / Monsoon Alerts */}
          <div className="farm-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🌾</span>
              <span>{t('weather.advisories')}</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {advisories?.map((adv, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-50)',
                    borderLeft: '4px solid var(--primary-600)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12
                  }}
                >
                  <AlertTriangle size={20} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.95rem', color: 'var(--primary-950)', lineHeight: 1.5, fontWeight: 500 }}>
                    {adv}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="farm-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>
              {t('weather.forecast')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
              {weather.forecast_daily.map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-bg)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {day.date}
                  </div>
                  <div style={{ fontSize: '1.75rem', marginBottom: 4 }}>🌧️</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{day.max_temp}° / {day.min_temp}°</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-sky)', marginTop: 4, fontWeight: 600 }}>
                    💧 {day.precipitation_probability}% ({day.precipitation_sum}mm)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
