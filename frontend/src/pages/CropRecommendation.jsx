import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { recommendationService } from '../services';
import { Layers, Sparkles, AlertCircle, CheckCircle, MapPin } from 'lucide-react';

export const CropRecommendation = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    nitrogen: 90,
    phosphorus: 45,
    potassium: 45,
    temperature: 27.5,
    humidity: 78,
    ph: 6.2,
    rainfall: 210
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Kerala agro-climatic presets
  const presets = [
    {
      name: language === 'ml' ? '🌾 പാലക്കാട് സമതലം (Paddy / Veg)' : '🌾 Palakkad Plains',
      values: { nitrogen: 85, phosphorus: 45, potassium: 40, temperature: 29.5, humidity: 75, ph: 6.5, rainfall: 180 }
    },
    {
      name: language === 'ml' ? '⛰️ വയനാട് / ഇടുക്കി ഹൈറേഞ്ച് (Pepper / Coffee)' : '⛰️ Wayanad Highlands',
      values: { nitrogen: 95, phosphorus: 52, potassium: 90, temperature: 22.0, humidity: 85, ph: 5.8, rainfall: 260 }
    },
    {
      name: language === 'ml' ? '🌴 കുട്ടനാട് / തീരദേശം (Coconut / Paddy)' : '🌴 Kuttanad / Coastal',
      values: { nitrogen: 75, phosphorus: 40, potassium: 45, temperature: 28.0, humidity: 88, ph: 5.5, rainfall: 240 }
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await recommendationService.getCropRec(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError("Failed to generate crop recommendation. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-amber)', fontWeight: 700, marginBottom: 4 }}>
          <Layers size={20} />
          <span>{language === 'ml' ? 'റാൻഡം ഫോറസ്റ്റ് മോഡൽ' : 'Random Forest ML Classifier'}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          {t('crop.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          {t('crop.subtitle')}
        </p>
      </div>

      {/* Kerala Agro-Zone Presets */}
      <div className="farm-card" style={{ padding: 18, backgroundColor: 'var(--primary-50)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 10 }}>
          <MapPin size={18} color="var(--primary-600)" />
          <span>{language === 'ml' ? 'കേരള കാർഷിക മേഖല തിരഞ്ഞെടുക്കുക (Quick Presets):' : 'Select Kerala Agro-Climatic Zone (Quick Presets):'}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-secondary"
              style={{ backgroundColor: '#fff', padding: '8px 14px', fontSize: '0.85rem' }}
              onClick={() => { setFormData(p.values); setResult(null); }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="farm-card" style={{ padding: 28 }}>
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">{t('crop.nitrogen')} (N)</label>
            <input
              type="number"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleChange}
              min="0"
              max="300"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('crop.phosphorus')} (P)</label>
            <input
              type="number"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleChange}
              min="0"
              max="300"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('crop.potassium')} (K)</label>
            <input
              type="number"
              name="potassium"
              value={formData.potassium}
              onChange={handleChange}
              min="0"
              max="300"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('crop.temperature')}</label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('crop.humidity')}</label>
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              min="10"
              max="100"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('crop.ph')}</label>
            <input
              type="number"
              step="0.1"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              min="3"
              max="10"
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 3' }}>
            <label className="form-label">{t('crop.rainfall')}</label>
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              min="0"
              max="3000"
              className="form-input"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
          <Sparkles size={18} />
          <span>{loading ? 'Evaluating Model...' : t('crop.calculate')}</span>
        </button>

        {error && (
          <div style={{ marginTop: 16, padding: 12, backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}
      </form>

      {/* Results Display */}
      {result && (
        <div className="farm-card" style={{ border: '2px solid var(--accent-amber)', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {t('crop.recommended_crop')}
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                {language === 'ml' ? (result.recommended_crop_ml || result.recommended_crop) : result.recommended_crop}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-green" style={{ fontSize: '1.1rem', padding: '8px 18px' }}>
                {result.confidence}% {t('crop.suitability')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Soil Health Assessment */}
            <div style={{ padding: 16, backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary-600)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-900)', marginBottom: 4 }}>
                🌱 {t('crop.soil_health')}
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {result.soil_health_assessment}
              </p>
            </div>

            {/* Kerala Regional Suitability */}
            <div style={{ padding: 16, backgroundColor: 'var(--accent-amber-light)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#92400e', marginBottom: 4 }}>
                📍 {t('crop.kerala_notes')}
              </div>
              <p style={{ color: '#78350f', fontSize: '0.95rem' }}>
                {result.kerala_suitability}
              </p>
            </div>

            {/* Alternative Crops */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                  {t('crop.alternatives')}
                </h3>
                <div className="grid-2">
                  {result.alternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-bg)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-900)' }}>
                          {language === 'ml' ? (alt.crop_ml || alt.crop) : alt.crop}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{alt.reason}</div>
                      </div>
                      <span className="badge badge-amber">{alt.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
