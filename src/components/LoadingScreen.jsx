import React from 'react';

export default function LoadingScreen({ progress }) {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="pulsing-heart">💖</div>
        <h2>Creating your little world...</h2>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="progress-text">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}