import React from 'react';

const LOADING_MESSAGES = [
  "Preparing your love story...",
  "Hanging up the memories...",
  "Lighting the candles...",
  "Almost ready for you...",
];

export default function LoadingScreen({ progress }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const msgIndex = Math.min(Math.floor(clampedProgress / 25), LOADING_MESSAGES.length - 1);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Triple pulsing hearts */}
        <div className="loading-hearts" aria-hidden="true">
          <span>💗</span>
          <span>💖</span>
          <span>💗</span>
        </div>

        {/* Title */}
        <h2 className="loading-title">{LOADING_MESSAGES[msgIndex]}</h2>

        {/* Progress bar */}
        <div className="progress-bar-bg" role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar-fill" style={{ width: `${clampedProgress}%` }} />
        </div>

        {/* Percentage */}
        <p className="progress-text">{Math.round(clampedProgress)}%</p>
      </div>
    </div>
  );
}
