import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export const AudioPlayerButton = ({ text, language = 'en', title = "Listen" }) => {
  const { speak, stop, speaking, supported } = useSpeechSynthesis();

  if (!supported || !text) return null;

  const handleClick = () => {
    if (speaking) {
      stop();
    } else {
      speak(text, language);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={speaking ? "Stop Audio" : title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: speaking ? 'var(--accent-amber-light)' : 'var(--primary-50)',
        color: speaking ? 'var(--accent-amber)' : 'var(--primary-800)',
        border: '1px solid var(--border-color)',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
      <span>{speaking ? 'Stop' : (language === 'ml' ? 'കേൾക്കുക' : 'Listen')}</span>
    </button>
  );
};
