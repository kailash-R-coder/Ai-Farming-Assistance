import React from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VoiceButton = ({ isListening, onClick, title = "Speak" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isListening ? 'var(--accent-red)' : 'var(--primary-100)',
        color: isListening ? '#fff' : 'var(--primary-800)',
        border: isListening ? '2px solid #ef4444' : '1.5px solid var(--primary-500)',
        boxShadow: isListening ? '0 0 0 4px rgba(239, 68, 68, 0.25)' : 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
    >
      {isListening ? (
        <MicOff size={22} className="animate-pulse" />
      ) : (
        <Mic size={22} />
      )}
    </button>
  );
};
