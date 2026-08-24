class AudioManager {
  constructor() {
    this.audio = null;
    this.isMuted = false;
    this.isLoaded = false;
    this.targetVolume = 0.5;
    this.fadeInterval = null;
  }

  init(src) {
    if (this.audio) return;
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0;

    this.audio.addEventListener('canplaythrough', () => {
      this.isLoaded = true;
    });

    // Graceful fallback if audio is missing
    this.audio.addEventListener('error', () => {
      console.warn("Audio file missing or failed to load. Continuing silently.");
      this.isLoaded = false;
    });
  }

  play() {
    if (!this.audio) return;
    this.audio.play().then(() => {
      this.fadeIn(0.5, 2000);
    }).catch(err => console.warn("Audio play prevented:", err));
  }

  fadeIn(targetVol = 0.5, duration = 2000) {
    if (!this.audio || this.isMuted) return;
    clearInterval(this.fadeInterval);
    const step = 0.05;
    const intervalTime = duration / (targetVol / step);

    this.fadeInterval = setInterval(() => {
      if (this.audio.volume < targetVol) {
        this.audio.volume = Math.min(this.audio.volume + step, targetVol);
      } else {
        clearInterval(this.fadeInterval);
      }
    }, intervalTime);
  }

  fadeOut(duration = 1500) {
    if (!this.audio) return;
    clearInterval(this.fadeInterval);
    const step = 0.05;
    const intervalTime = duration / (this.audio.volume / step || 1);

    this.fadeInterval = setInterval(() => {
      if (this.audio.volume > step) {
        this.audio.volume = Math.max(this.audio.volume - step, 0);
      } else {
        this.audio.volume = 0;
        clearInterval(this.fadeInterval);
      }
    }, intervalTime);
  }

  toggleMute() {
    if (!this.audio) return !this.isMuted;
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();