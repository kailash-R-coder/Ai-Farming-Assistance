import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { recommendationService } from '../services';
import { Beaker, ShieldAlert, CheckCircle2, Leaf, AlertTriangle } from 'lucide-react';

export const FertilizerAdvisory = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    crop: "Banana",
    soil_n: 80,
    soil_p: 25,
    soil_k: 60,
    soil_ph: 5.6,
    growth_stage: "Vegetative"
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const crops = [
    { id: "Rice / Paddy", label: language === 'ml' ? "നെല്ല് (Paddy)" : "Rice / Paddy" },
    { id: "Banana", label: language === 'ml' ? "വാഴ (Banana / Plantain)" : "Banana / Plantain" },
    { id: "Coconut", label: language === 'ml' ? "തെങ്ങ് (Coconut)" : "Coconut" },
    { id: "Tomato", label: language === 'ml' ? "തക്കാളി (Tomato)" : "Tomato" },
    { id: "Pepper", label: language === 'ml' ? "കുരുമുളക് (Black Pepper)" : "Black Pepper" },
    { id: "Tapioca", label: language === 'ml' ? "മരച്ചീനി / കപ്പ (Tapioca)" : "Tapioca" },
    { id: "Vegetables", label: language === 'ml' ? "മറ്റു പച്ചക്കറികൾ (Vegetables)" : "Other Vegetables" }
  ];

  const stages = [
    { id: "Basal / Sowing", label: language === 'ml' ? "അടിവളം / നടീൽ സമയം (Basal / Sowing)" : "Basal / Planting Stage" },
    { id: "Vegetative", label: language === 'ml' ? "വളർച്ചാ ഘട്ടം (Vegetative Flush)" : "Active Vegetative Stage" },
    { id: "Flowering", label: language === 'ml' ? "പൂവിടുന്ന സമയം (Flowering)" : "Flowering Stage" },
    { id: "Fruiting / Maturation", label: language === 'ml' ? "കായ്ഫലം / മൂപ്പെത്തുന്ന ഘട്ടം (Fruiting)" : "Fruiting / Bunch Maturation" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await recommendationService.getFertilizerRec(formData);
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9333ea', fontWeight: 700, marginBottom: 4 }}>
          <Beaker size={20} />
          <span>{language === 'ml' ? 'ശാസ്ത്രീയ വളപ്രയോഗം' : 'Agronomic Nutrient Balance'}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          {t('fertilizer.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          {t('fertilizer.subtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="farm-card" style={{ padding: 28 }}>
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">{t('fertilizer.select_crop')}</label>
            <select
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              className="form-select"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('fertilizer.growth_stage')}</label>
            <select
              value={formData.growth_stage}
              onChange={(e) => setFormData({ ...formData, growth_stage: e.target.value })}
              className="form-select"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">{t('fertilizer.soil_n')} (N)</label>
            <input
              type="number"
              value={formData.soil_n}
              onChange={(e) => setFormData({ ...formData, soil_n: parseFloat(e.target.value) || 0 })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('fertilizer.soil_p')} (P)</label>
            <input
              type="number"
              value={formData.soil_p}
              onChange={(e) => setFormData({ ...formData, soil_p: parseFloat(e.target.value) || 0 })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('fertilizer.soil_k')} (K)</label>
            <input
              type="number"
              value={formData.soil_k}
              onChange={(e) => setFormData({ ...formData, soil_k: parseFloat(e.target.value) || 0 })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('fertilizer.soil_ph')}</label>
            <input
              type="number"
              step="0.1"
              value={formData.soil_ph}
              onChange={(e) => setFormData({ ...formData, soil_ph: parseFloat(e.target.value) || 6.5 })}
              className="form-input"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', backgroundColor: '#9333ea' }}>
          <Beaker size={18} />
          <span>{loading ? 'Calculating...' : t('fertilizer.calculate')}</span>
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="farm-card" style={{ border: '2px solid #9333ea', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {language === 'ml' ? 'വളപ്രയോഗ മാർഗ്ഗരേഖ' : 'Fertilizer Recommendation For'}
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
              {language === 'ml' ? (result.crop_ml || result.crop) : result.crop}
            </h2>
          </div>

          {/* Nutrient Status Badges */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>
              {t('fertilizer.nutrient_status')}
            </h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {Object.entries(result.nutrient_status).map(([nutrient, status]) => {
                const isDef = status.includes('Deficient');
                return (
                  <div
                    key={nutrient}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isDef ? 'var(--accent-red-light)' : 'var(--primary-100)',
                      color: isDef ? 'var(--accent-red)' : 'var(--primary-800)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <span>{nutrient}:</span>
                    <span>{status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Soil Conditioning Alert (Acidic soil / Lime) */}
          {result.soil_conditioning && (
            <div style={{ backgroundColor: 'var(--accent-amber-light)', padding: 18, borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#92400e', marginBottom: 4 }}>
                ⚠️ {t('fertilizer.lime_alert')}
              </div>
              <p style={{ color: '#78350f', fontSize: '0.925rem' }}>{result.soil_conditioning}</p>
            </div>
          )}

          {/* Organic Options */}
          <div style={{ backgroundColor: 'var(--primary-50)', padding: 22, borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary-600)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Leaf size={20} color="var(--primary-600)" />
              <span>{t('fertilizer.organic_title')}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.organic_recommendations.map((opt, idx) => (
                <div key={idx} style={{ backgroundColor: '#fff', padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-200)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.95rem' }}>{opt.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <strong>{language === 'ml' ? 'അളവ്' : 'Dosage'}:</strong> {opt.dosage} | <strong>{language === 'ml' ? 'സമയം' : 'Timing'}:</strong> {opt.timing}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mineral Recommendations */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
              {t('fertilizer.mineral_title')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.mineral_recommendations.map((opt, idx) => (
                <div key={idx} style={{ padding: 14, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{opt.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {opt.dosage} — <em>{opt.timing}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines & Warnings */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>{language === 'ml' ? 'സുരക്ഷാ നിർദ്ദേശങ്ങൾ' : 'Safety Instructions'}:</strong>
            <ul style={{ paddingLeft: 20, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
