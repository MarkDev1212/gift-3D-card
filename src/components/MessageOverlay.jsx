import React, { useState } from 'react';
import giftConfig from '../config/giftConfig';

const STORY_ICONS = ['🌹', '💫', '💝'];

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
        {/* Icon */}
        <div className="story-icon" aria-hidden="true">{STORY_ICONS[index] ?? '💖'}</div>

        {/* Step label */}
        <p className="story-step">Chapter {index + 1} of {total}</p>

        {/* Story text */}
        <p className="story-text">{giftConfig.giftStory[index]}</p>

        {/* Progress dots */}
        <div className="story-dots" aria-hidden="true">
          {giftConfig.giftStory.map((_, i) => (
            <div key={i} className={`story-dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>

        {/* Next / Finish button */}
        <button className="next-btn" onClick={handleNext}>
          {index < total - 1 ? 'Continue ❤️' : 'See Your Gift ✨'}
        </button>
      </div>
    </div>
  );
}
