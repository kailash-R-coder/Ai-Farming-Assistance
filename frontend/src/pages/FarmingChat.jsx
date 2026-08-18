import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { chatService } from '../services';
import { VoiceButton } from '../components/VoiceButton';
import { AudioPlayerButton } from '../components/AudioPlayerButton';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';

export const FarmingChat = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: language === 'ml'
        ? "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായിയാണ്. വിളകൾ, രോഗങ്ങൾ, ജൈവവളങ്ങൾ, കീടനിയന്ത്രണം എന്നിവയെക്കുറിച്ചുള്ള സംശയങ്ങൾ ചോദിക്കാം."
        : "Hello! I am your AI Farming Assistant. Ask any questions about crop care, pest management, bio-fertilizers, and weather advisories in English or Malayalam.",
      sources: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  // Sync transcript from speech recognition to input field
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  const handleSend = async (messageToSend) => {
    const text = messageToSend || inputText;
    if (!text.trim()) return;

    const userMessage = { role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(text, language);
      const assistantMessage = {
        role: 'assistant',
        text: res.answer,
        sources: res.sources || [],
        language: res.language
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: language === 'ml'
            ? "ക്ഷമിക്കണം, മറുപടി നൽകുന്നതിൽ തടസ്സമുണ്ടായി. ദയവായി വീണ്ടും ചോദിക്കുക."
            : "Sorry, I encountered an error answering your question. Please try again.",
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = language === 'ml' ? [
    "തക്കാളി ഇല മഞ്ഞയായി മാറുന്നു, എന്ത് ചെയ്യണം?",
    "വാഴയിലെ പിണ്ടിപ്പുഴുവിനെ എങ്ങനെ നിയന്ത്രിക്കാം?",
    "തെങ്ങിലെ കൊമ്പൻചെല്ലി തടയാൻ എന്താണ് വഴി?",
    "ജീവാമൃതം എങ്ങനെയാണ് ഉണ്ടാക്കുന്നത്?",
    "കുരുമുളകിലെ ദ്രുതവാട്ടം തടയാൻ എന്ത് ചെയ്യണം?"
  ] : [
    "My tomato leaves are turning yellow, what should I do?",
    "How to control pseudostem weevil in banana?",
    "How to manage rhinoceros beetle in coconut?",
    "How to prepare Jeevamrutham bio-fertilizer?",
    "Black pepper quick wilt prevention methods"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960, margin: '0 auto', height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-900)' }}>
          {t('chat.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {t('chat.subtitle')}
        </p>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            style={{
              whiteSpace: 'nowrap',
              padding: '6px 14px',
              borderRadius: 20,
              backgroundColor: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              color: 'var(--primary-900)',
              fontSize: '0.85rem',
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Messages Window */}
      <div className="farm-card" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
        {messages.map((msg, index) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 12,
                alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                maxWidth: '85%'
              }}
            >
              {isAssistant && (
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={20} />
                </div>
              )}

              <div style={{
                backgroundColor: isAssistant ? 'var(--surface-bg)' : 'var(--primary-600)',
                color: isAssistant ? 'var(--text-main)' : '#fff',
                padding: '14px 18px',
                borderRadius: 'var(--radius-lg)',
                border: isAssistant ? '1px solid var(--border-color)' : 'none',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: '0.975rem' }}>
                  {msg.text}
                </div>

                {/* Assistant footer: Sources + Audio Player */}
                {isAssistant && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    {msg.sources && msg.sources.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <BookOpen size={14} color="var(--primary-600)" />
                        <span>{msg.sources[0].title}</span>
                      </div>
                    ) : <div />}

                    <AudioPlayerButton text={msg.text} language={msg.language || language} />
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-amber)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={20} />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
            <RefreshCw size={18} className="animate-spin" />
            <span>{language === 'ml' ? 'AI സഹായി കൃഷി വിവരങ്ങൾ പരിശോധിക്കുന്നു...' : 'Assistant is consulting agricultural practices...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Status Pill */}
      {isListening && (
        <div style={{ padding: '8px 16px', backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content' }}>
          <span className="animate-pulse">🔴</span>
          <span>{t('chat.listening')} ({language === 'ml' ? 'മലയാളം' : 'English'})</span>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
      >
        {isSupported && (
          <VoiceButton
            isListening={isListening}
            onClick={handleVoiceToggle}
            title={t('chat.speak')}
          />
        )}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('chat.placeholder')}
          className="form-input"
          style={{ flex: 1, padding: '14px 18px', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="btn-primary"
          style={{ height: 50, padding: '0 20px', borderRadius: 'var(--radius-lg)' }}
        >
          <Send size={18} />
          <span>{t('chat.send')}</span>
        </button>
      </form>
    </div>
  );
};
