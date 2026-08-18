import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { diseaseService, chatService, recommendationService } from '../services';
import { Activity, MessageSquareText, Layers, RefreshCw, Calendar } from 'lucide-react';

export const HistoryPage = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('disease');
  const [diagnoses, setDiagnoses] = useState([]);
  const [chats, setChats] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllHistory = async () => {
      setLoading(true);
      try {
        const [dRes, cRes, rRes] = await Promise.allSettled([
          diseaseService.getHistory(),
          chatService.getHistory(),
          recommendationService.getHistory()
        ]);
        if (dRes.status === 'fulfilled') setDiagnoses(dRes.value || []);
        if (cRes.status === 'fulfilled') setChats(cRes.value || []);
        if (rRes.status === 'fulfilled') setRecommendations(rRes.value || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllHistory();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
          {language === 'ml' ? 'കാർഷിക പ്രവർത്തന ചരിത്രം' : 'Farmer Activity Records & History'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          {language === 'ml' ? 'നിങ്ങളുടെ മുൻകാല രോഗനിർണ്ണയങ്ങളും സംശയങ്ങളും വളപ്രയോഗ രേഖകളും ഇവിടെ കാണാം.' : 'Track your historical leaf diagnoses, AI conversations, and agronomic plans.'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '2px solid var(--border-color)', paddingBottom: 8 }}>
        {[
          { id: 'disease', label: language === 'ml' ? 'ഇല രോഗ പരിശോധനകൾ' : 'Leaf Diagnoses', icon: Activity, count: diagnoses.length },
          { id: 'chat', label: language === 'ml' ? 'ചോദിച്ച സംശയങ്ങൾ' : 'AI Chat History', icon: MessageSquareText, count: chats.length },
          { id: 'recs', label: language === 'ml' ? 'വള & വിള നിർദ്ദേശങ്ങൾ' : 'Recommendations', icon: Layers, count: recommendations.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                backgroundColor: isActive ? 'var(--primary-600)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              <span style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--surface-hover)',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: '0.75rem'
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <RefreshCw size={32} className="animate-spin" color="var(--primary-600)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading history records...</p>
        </div>
      ) : (
        <div>
          {/* Disease Tab */}
          {activeTab === 'disease' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {diagnoses.length > 0 ? (
                diagnoses.map((item) => (
                  <div key={item.id} className="farm-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="badge badge-green">{item.crop}</span>
                        <span className="badge badge-amber">{item.confidence}% Confidence</span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                        {item.disease}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={14} />
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="farm-card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No leaf diagnoses recorded yet.
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {chats.length > 0 ? (
                chats.map((item) => (
                  <div key={item.id} className="farm-card">
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 8 }}>
                      ❓ {item.question}
                    </div>
                    <div style={{ backgroundColor: 'var(--surface-bg)', padding: 14, borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.925rem', whiteSpace: 'pre-line' }}>
                      {item.answer}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 8 }}>
                      {new Date(item.created_at).toLocaleString()} ({item.language?.toUpperCase()})
                    </div>
                  </div>
                ))
              ) : (
                <div className="farm-card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No chat conversations recorded yet.
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {recommendations.length > 0 ? (
                recommendations.map((item) => (
                  <div key={item.id} className="farm-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className="badge badge-green" style={{ textTransform: 'uppercase' }}>
                        {item.recommendation_type} Recommendation
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                    <pre style={{ backgroundColor: 'var(--surface-bg)', padding: 12, borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', overflowX: 'auto' }}>
                      {JSON.stringify(item.result, null, 2)}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="farm-card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No recommendation records yet.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
