import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

export default function MusicControl() {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const isMuted = audioManager.toggleMute();
    setMuted(isMuted);
  };

  return (
    <button className="music-toggle" onClick={toggle} aria-label="Toggle Music">
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}