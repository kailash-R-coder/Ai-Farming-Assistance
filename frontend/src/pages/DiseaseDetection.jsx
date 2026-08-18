import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { diseaseService } from '../services';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { 
  UploadCloud, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Leaf, 
  RefreshCw, 
  FileText 
} from 'lucide-react';

export const DiseaseDetection = () => {
  const { language, t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  // Helper to create synthetic leaf sample for 1-click test demonstration
  const handleSampleSelect = (sampleName) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Draw leaf shape
    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.ellipse(150, 150, 120, 70, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw yellow/brown necrotic disease spots
    ctx.fillStyle = '#b08968';
    ctx.beginPath();
    ctx.arc(130, 140, 25, 0, 2 * Math.PI);
    ctx.arc(180, 160, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Concentric yellow halo
    ctx.strokeStyle = '#e9c46a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(130, 140, 30, 0, 2 * Math.PI);
    ctx.stroke();

    canvas.toBlob((blob) => {
      const file = new File([blob], `${sampleName}.jpg`, { type: 'image/jpeg' });
      processSelectedFile(file);
    }, 'image/jpeg');
  };

  const handleDiagnose = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const res = await diseaseService.predictDisease(selectedFile);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to analyze leaf image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const symptoms = language === 'ml' && result?.symptoms_ml?.length ? result.symptoms_ml : result?.symptoms;
  const organicRemedies = language === 'ml' && result?.recommendations_ml?.organic?.length 
    ? result.recommendations_ml.organic 
    : result?.recommendations?.organic;
  const chemicalAdvisory = language === 'ml' && result?.recommendations_ml?.chemical_advisory
    ? result.recommendations_ml.chemical_advisory
    : result?.recommendations?.chemical_advisory;
  const prevention = language === 'ml' && result?.recommendations_ml?.prevention?.length
    ? result.recommendations_ml.prevention
    : result?.recommendations?.prevention;

  const audioSummaryText = result ? (
    language === 'ml'
      ? `${result.crop_ml || result.crop} ചെടിയിൽ ${result.disease_ml || result.disease} കണ്ടെത്തി. കൃത്യത ${result.confidence} ശതമാനം. പ്രധാന പരിഹാരം: ${organicRemedies?.[0] || ''}`
      : `Diagnosed ${result.crop} with ${result.disease} with ${result.confidence} percent confidence. Main remedy: ${organicRemedies?.[0] || ''}`
  ) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary-700)', fontWeight: 700, marginBottom: 4 }}>
          <Leaf size={20} />
          <span>{language === 'ml' ? 'AI ഇല രോഗ സ്കാനർ' : 'Computer Vision Diagnosis'}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          {t('disease.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          {t('disease.subtitle')}
        </p>
      </div>

      {/* Upload Box */}
      <div className="farm-card" style={{ padding: 32, textAlign: 'center' }}>
        <div
          style={{
            border: '2px dashed var(--primary-500)',
            backgroundColor: 'var(--primary-50)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => document.getElementById('leaf-file-input').click()}
        >
          <input
            id="leaf-file-input"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <UploadCloud size={52} color="var(--primary-600)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 6 }}>
            {t('disease.drag_drop')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
            JPG, PNG (Max 10MB)
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('leaf-file-input').click();
            }}
          >
            <Camera size={18} />
            <span>{t('disease.take_photo')}</span>
          </button>
        </div>

        {/* Demo leaf presets for instant testing */}
        <div style={{ marginTop: 24, textAlign: 'left' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>
            {t('disease.demo_samples')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { id: 'tomato', label: language === 'ml' ? '🍅 തക്കാളി (Early Blight)' : '🍅 Tomato Early Blight' },
              { id: 'banana', label: language === 'ml' ? '🍌 വാഴ (Sigatoka Spot)' : '🍌 Banana Sigatoka' },
              { id: 'rice', label: language === 'ml' ? '🌾 നെല്ല് (Leaf Blast)' : '🌾 Rice Leaf Blast' },
              { id: 'coconut', label: language === 'ml' ? '🥥 തെങ്ങ് (Bud Rot)' : '🥥 Coconut Bud Rot' }
            ].map((sample) => (
              <button
                key={sample.id}
                type="button"
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.875rem' }}
                onClick={() => handleSampleSelect(sample.id)}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Image Preview & Action */}
        {previewUrl && (
          <div style={{ marginTop: 24, padding: 20, backgroundColor: 'var(--surface-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <img
                src={previewUrl}
                alt="Selected Leaf"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedFile?.name || 'leaf_image.jpg'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ready for CNN classification</div>
              </div>
            </div>
            <button
              onClick={handleDiagnose}
              disabled={loading}
              className="btn-primary"
              style={{ minWidth: 200 }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>{language === 'ml' ? 'പരിശോധിക്കുന്നു...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>{language === 'ml' ? 'രോഗം കണ്ടെത്തുക' : 'Analyze Leaf'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: 14, backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Diagnosis Results Display */}
      {result && (
        <div className="farm-card" style={{ border: '2px solid var(--primary-500)', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 20, marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="badge badge-green" style={{ fontSize: '1rem', padding: '6px 14px' }}>
                  {language === 'ml' ? (result.crop_ml || result.crop) : result.crop}
                </span>
                <span className={`badge ${result.confidence >= 75 ? 'badge-green' : 'badge-amber'}`}>
                  {result.confidence}% {language === 'ml' ? 'കൃത്യത' : 'Confidence'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                {language === 'ml' ? (result.disease_ml || result.disease) : result.disease}
              </h2>
            </div>

            {/* Read Aloud */}
            <AudioPlayerButton text={audioSummaryText} language={language} />
          </div>

          {/* Warning if low confidence */}
          {result.warning && (
            <div style={{ padding: 16, backgroundColor: 'var(--accent-amber-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent-amber)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={22} />
              <span>{result.warning}</span>
            </div>
          )}

          {/* Diagnosis Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Symptoms */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔍</span>
                <span>{t('disease.symptoms')}</span>
              </h3>
              <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--text-main)' }}>
                {symptoms?.map((sym, idx) => (
                  <li key={idx} style={{ lineHeight: 1.5 }}>{sym}</li>
                ))}
              </ul>
            </div>

            {/* Organic Remedies */}
            <div style={{ backgroundColor: 'var(--primary-50)', padding: 20, borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary-600)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🌿</span>
                <span>{t('disease.organic_remedies')}</span>
              </h3>
              <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {organicRemedies?.map((rem, idx) => (
                  <li key={idx} style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{rem}</li>
                ))}
              </ul>
            </div>

            {/* Chemical Advisory */}
            <div style={{ backgroundColor: 'var(--accent-amber-light)', padding: 18, borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-amber)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#92400e', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚠️</span>
                <span>{t('disease.chemical_advisory')}</span>
              </h3>
              <p style={{ color: '#78350f', fontSize: '0.95rem' }}>{chemicalAdvisory}</p>
            </div>

            {/* Cultural Prevention */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🛡️</span>
                <span>{t('disease.prevention')}</span>
              </h3>
              <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prevention?.map((prev, idx) => (
                  <li key={idx} style={{ color: 'var(--text-muted)' }}>{prev}</li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
              📌 {result.disclaimer || t('disease.disclaimer')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
