import React from 'react';
import giftConfig from '../config/giftConfig';
import { Volume2 } from 'lucide-react';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="sparkle-heart">❤️</div>
        <h1 className="welcome-title">{giftConfig.title}</h1>
        <p className="welcome-subtitle">{giftConfig.subtitle}</p>
        
        <button className="enter-button" onClick={onStart}>
          <span>ENTER MY WORLD</span>
        </button>

        <div className="audio-hint">
          <Volume2 size={18} />
          <span>{giftConfig.headphonesHint}</span>
        </div>
      </div>
    </div>
  );
}