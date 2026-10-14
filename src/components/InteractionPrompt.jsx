import React from 'react';

const DOOR_ICONS = {
  'Enter Room':   '🚪',
  'Open Door':    '🔑',
  'Unlock Door':  '✨',
  'Open Gift':    '🎁',
};

export default function InteractionPrompt({ title, subtitle, buttonText, onClick }) {
  const icon = DOOR_ICONS[buttonText] ?? '💫';

  return (
    <div className="room-card-overlay">
      <div className="room-card">
        <div className="room-card-icon" aria-hidden="true">{icon}</div>
        <h3 className="room-card-title">{title}</h3>
        <p className="room-card-subtitle">{subtitle}</p>
        <button className="room-card-btn" onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
