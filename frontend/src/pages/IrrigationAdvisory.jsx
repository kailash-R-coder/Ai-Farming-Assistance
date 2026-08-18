import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { recommendationService } from '../services';
import { Droplet, Clock, CloudRain, CheckCircle, AlertCircle, Shield } from 'lucide-react';

export const IrrigationAdvisory = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    crop: "Banana",
    soil_type: "Laterite",
    temperature: 31.0,
    humidity: 68.0,
    rainfall_forecast_mm: 5.0,
    recent_irrigation_days_ago: 2
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const soils = [
    { id: "Laterite", label: language === 'ml' ? "ചെങ്കൽ മണ്ണ് (Laterite Soil)" : "Laterite Soil" },
    { id: "Loamy", label: language === 'ml' ? "എക്കൽ മണ്ണ് / പശിമരാശി (Loamy Soil)" : "Loamy Soil" },
    { id: "Clay", label: language === 'ml' ? "കരിമണ്ണ് / കളിമണ്ണ് (Clay Soil)" : "Clay Soil" },
    { id: "Sandy", label: language === 'ml' ? "മണൽ മണ്ണ് (Sandy Soil)" : "Sandy Soil" },
    { id: "Alluvial", label: language === 'ml' ? "തീരദേശ എക്കൽ മണ്ണ് (Alluvial Soil)" : "Alluvial Soil" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await recommendationService.getIrrigationRec(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0891b2', fontWeight: 700, marginBottom: 4 }}>
          <Droplet size={20} />
          <span>{language === 'ml' ? 'ജല ക്രമീകരണം' : 'Evapotranspiration & Water Schedule'}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          {t('irrigation.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          {t('irrigation.subtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="farm-card" style={{ padding: 28 }}>
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">{t('irrigation.select_crop')}</label>
            <input
              type="text"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              className="form-input"
              placeholder="e.g. Banana, Coconut, Tomato, Pepper"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('irrigation.soil_type')}</label>
            <select
              value={formData.soil_type}
              onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
              className="form-select"
            >
              {soils.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">{t('irrigation.temperature')}</label>
            <input
              type="number"
              step="0.5"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('irrigation.humidity')}</label>
            <input
              type="number"
              value={formData.humidity}
              onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) || 0 })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('irrigation.rainfall_forecast')}</label>
            <input
              type="number"
              step="0.5"
              value={formData.rainfall_forecast_mm}
              onChange={(e) => setFormData({ ...formData, rainfall_forecast_mm: parseFloat(e.target.value) || 0 })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('irrigation.days_since_water')}</label>
            <input
              type="number"
              value={formData.recent_irrigation_days_ago}
              onChange={(e) => setFormData({ ...formData, recent_irrigation_days_ago: parseInt(e.target.value, 10) || 0 })}
              className="form-input"
              min="0"
              max="30"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', backgroundColor: '#0891b2' }}>
          <Droplet size={18} />
          <span>{loading ? 'Evaluating...' : t('irrigation.calculate')}</span>
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="farm-card" style={{ border: '2px solid #0891b2', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Status Banner */}
          <div
            style={{
              padding: 24,
              borderRadius: 'var(--radius-md)',
              backgroundColor: result.irrigation_required ? 'var(--primary-100)' : 'var(--accent-sky-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {result.irrigation_required ? (
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet size={24} />
                </div>
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--accent-sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={24} />
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {t('irrigation.status')}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  {language === 'ml' ? (result.status_text_ml || result.status_text) : result.status_text}
                </h2>
              </div>
            </div>

            <span className={`badge ${result.irrigation_required ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
              {result.irrigation_required ? (language === 'ml' ? 'നനയ്ക്കണം' : 'Needs Water') : (language === 'ml' ? 'നന ആവശ്യമില്ല' : 'Moisture OK')}
            </span>
          </div>

          {/* Details */}
          <div className="grid-2">
            <div style={{ padding: 18, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--primary-800)', marginBottom: 6 }}>
                <Clock size={18} />
                <span>{t('irrigation.timing')}</span>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {result.recommended_timing}
              </p>
            </div>

            <div style={{ padding: 18, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#0891b2', marginBottom: 6 }}>
                <Droplet size={18} />
                <span>{t('irrigation.quantity')}</span>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {result.estimated_water_liters_per_plant_or_sqm}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div style={{ padding: 16, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-50)', borderLeft: '4px solid var(--primary-600)' }}>
            <strong>{language === 'ml' ? 'കാരണം' : 'Reasoning'}:</strong> {language === 'ml' ? (result.reason_ml || result.reason) : result.reason}
          </div>

          {/* Tips */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>
              🛡️ {t('irrigation.conservation')}
            </h3>
            <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--text-muted)' }}>
              {result.best_practice_tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
