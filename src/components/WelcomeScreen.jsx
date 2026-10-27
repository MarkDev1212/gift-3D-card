import React, { useMemo } from 'react';
import giftConfig from '../config/giftConfig';

const HEARTS = ['💛', '✨', '🌟', '💫', '⭐', '🎁', '🌸', '💝', '✦', '🎊', '💛', '✨'];

export default function WelcomeScreen({ onStart }) {
  const floatingHearts = useMemo(() =>
    HEARTS.map((h, i) => ({
      id: i,
      symbol: h,
      left: `${5 + (i * 8.2) % 90}%`,
      delay: `${(i * 0.7) % 6}s`,
      duration: `${7 + (i * 1.3) % 8}s`,
      size: `${0.9 + (i * 0.15) % 1}rem`,
    })), []
  );

  return (
    <div className="welcome-screen">
      <div className="welcome-bg-glow" />

      {/* Floating icons */}
      <div className="hearts-bg" aria-hidden="true">
        {floatingHearts.map((h) => (
          <span
            key={h.id}
            style={{
              left: h.left,
              animationDelay: h.delay,
              animationDuration: h.duration,
              fontSize: h.size,
            }}
          >
            {h.symbol}
          </span>
        ))}
      </div>

      {/* Main card */}
      <div className="welcome-content">
        <div className="welcome-icon-wrap">
          <span className="welcome-icon">🎁</span>
          <div className="icon-ring" />
        </div>

        <p className="welcome-eyebrow">ለምርጥ ጓደኛዬ — surprize! 🎉</p>

        <h1 className="welcome-title">{giftConfig.title}</h1>

        <div className="welcome-divider" />

        <p className="welcome-subtitle">{giftConfig.subtitle}</p>

        <button className="enter-button" onClick={onStart} aria-label="ጀምር">
          ✨ enter✨
        </button>

        <div className="audio-hint">
          <span className="audio-hint-icon">🎧</span>
          <span>{giftConfig.headphonesHint}</span>
        </div>
      </div>
    </div>
  );
}
