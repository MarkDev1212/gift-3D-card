import React, { useState } from 'react';
import giftConfig from '../config/giftConfig';

export default function MessageOverlay({ onComplete }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < giftConfig.giftStory.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="story-overlay">
      <div className="story-card">
        <p className="story-text">{giftConfig.giftStory[index]}</p>
        <button className="next-btn" onClick={handleNext}>
          {index < giftConfig.giftStory.length - 1 ? "Continue ❤️" : "See Memories ✨"}
        </button>
      </div>
    </div>
  );
}