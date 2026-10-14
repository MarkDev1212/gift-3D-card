import React, { useState } from 'react';
import { audioManager } from '../utils/audioManager';

export default function MusicControl() {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const isMuted = audioManager.toggleMute();
    setMuted(isMuted);
  };

  return (
    <div className="music-control-bar">
      {/* Play/Mute button */}
      <button className="music-btn" onClick={toggle} aria-label={muted ? 'Unmute music' : 'Mute music'}>
        {muted ? '🔇' : '🎵'}
      </button>

      {/* Info + waveform */}
      <div className="music-info">
        <span className="music-label">Now Playing</span>
        <div className={`music-waves ${muted ? 'paused' : ''}`} aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
      </div>
    </div>
  );
}
