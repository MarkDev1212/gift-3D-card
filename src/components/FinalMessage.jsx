import React from 'react';
import giftConfig from '../config/giftConfig';
import confetti from 'canvas-confetti';

export default function FinalMessage({ onReplay }) {
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="final-overlay">
      <div className="final-card">
        <div className="floating-heart-icon">💖</div>
        <h1 className="final-name">For {giftConfig.receiverName}</h1>
        {giftConfig.finalMessages.map((msg, i) => (
          <p key={i} className="final-msg">{msg}</p>
        ))}
        <button className="replay-btn" onClick={onReplay}>
          Explore World Again ↺
        </button>
      </div>
    </div>
  );
}