import React, { useState } from 'react';
import giftConfig from '../config/giftConfig';

const STORY_ICONS = ['🌟', '💫', '🎁'];

export default function MessageOverlay({ onComplete }) {
  const [index, setIndex] = useState(0);
  const total = giftConfig.giftStory.length;

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="story-overlay">
      <div className="story-card">
        <div className="story-icon" aria-hidden="true">{STORY_ICONS[index] ?? '💛'}</div>

        {/* Step label — Amharic */}
        <p className="story-step">Chapter {index + 1} ከ {total}</p>

        <p className="story-text">{giftConfig.giftStory[index]}</p>

        <div className="story-dots" aria-hidden="true">
          {giftConfig.giftStory.map((_, i) => (
            <div key={i} className={`story-dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>

        <button className="next-btn" onClick={handleNext}>
          {index < total - 1 ? 'Next 💛' : 'take my gift ✨'}
        </button>
      </div>
    </div>
  );
}
