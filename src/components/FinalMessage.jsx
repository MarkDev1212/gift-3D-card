import React, { useEffect, useState } from 'react';
import giftConfig from '../config/giftConfig';

/* ── load confetti lazily so old phones don't crash ── */
let _confetti = null;
import('canvas-confetti').then((m) => { _confetti = m.default; }).catch(() => {});

function fireConfetti() {
  if (!_confetti) return;
  const colors = ['#ff4b72', '#ffd700', '#ff758c', '#9f7aea', '#fbb6ce'];
  _confetti({ particleCount: 100, spread: 80, origin: { x: 0.5, y: 0.55 }, colors, scalar: 1.1 });
  setTimeout(() => _confetti && _confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.65 }, colors }), 350);
  setTimeout(() => _confetti && _confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors }), 600);
  setTimeout(() => _confetti && _confetti({ particleCount: 70, spread: 100, origin: { x: 0.5, y: 0.3 }, colors, gravity: 0.6 }), 1000);
}

/* ── romantic pick-up line shown on photo reveal ── */
const PICKUP_LINE =
  "If beauty were time, you'd be an eternity. 💛";

export default function FinalMessage({ onReplay }) {
  const [phase, setPhase] = useState('photo'); // 'photo' → 'messages'

  useEffect(() => {
    fireConfetti();
  }, []);

  /* ── PHASE 1: full-screen photo reveal with pick-up line ── */
  if (phase === 'photo') {
    return (
      <div style={photoStyles.overlay}>

        {/* Confetti fires on mount above */}

        {/* Glow backdrop */}
        <div style={photoStyles.glow} aria-hidden="true" />

        {/* Photo card */}
        <div style={photoStyles.card}>

          {/* Top bar */}
          <div style={photoStyles.topBar}>
            <span style={photoStyles.eyes}>✨</span>
            <span style={photoStyles.forYou}>A gift for Rahel 💝</span>
            <span style={photoStyles.eyes}>✨</span>
          </div>

          {/* Photo */}
          <div style={photoStyles.photoWrap}>
            <img
              src="/images/photo1.jpg"
              alt="Rahel"
              style={photoStyles.photo}
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80';
              }}
            />
            {/* Soft vignette overlay */}
            <div style={photoStyles.vignette} aria-hidden="true" />
          </div>

          {/* Pick-up line */}
          <p style={photoStyles.pickupLine}>{PICKUP_LINE}</p>

          {/* CTA */}
          <button
            style={photoStyles.btn}
            onClick={() => { fireConfetti(); setPhase('messages'); }}
          >
            See My Message 💌
          </button>
        </div>
      </div>
    );
  }

  /* ── PHASE 2: final messages card ── */
  return (
    <div className="final-overlay">
      <div className="final-card">
        <div className="final-heart-icon" aria-hidden="true">💖</div>
        <h1 className="final-name">For {giftConfig.receiverName} ❤️</h1>
        <div className="final-messages">
          {giftConfig.finalMessages.map((msg, i) => (
            <p key={i} className="final-msg" style={{ animationDelay: `${i * 0.15}s` }}>
              {msg}
            </p>
          ))}
        </div>
        <button className="replay-btn" onClick={onReplay}>
          ↺ Explore Again
        </button>
      </div>
    </div>
  );
}

/* ── inline styles for the photo reveal (no CSS class needed) ── */
const photoStyles = {
  overlay: {
    position:       'fixed',
    inset:          0,
    zIndex:         60,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    background:     'rgba(6,8,17,0.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding:        '16px',
    overflowY:      'auto',
    animation:      'fadeIn 0.5s ease both',
  },
  glow: {
    position:   'absolute',
    top:        '30%',
    left:       '50%',
    transform:  'translateX(-50%)',
    width:      '280px',
    height:     '280px',
    borderRadius:'50%',
    background: 'radial-gradient(circle, rgba(255,75,114,0.25) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position:        'relative',
    zIndex:          1,
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    gap:             16,
    width:           '100%',
    maxWidth:        400,
    background:      'rgba(16,20,35,0.88)',
    border:          '1px solid rgba(255,215,0,0.3)',
    borderRadius:    24,
    padding:         '24px 20px 28px',
    boxShadow:       '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,215,0,0.12)',
    animation:       'scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both',
  },
  topBar: {
    display:    'flex',
    alignItems: 'center',
    gap:        8,
  },
  eyes: {
    fontSize: '1.2rem',
  },
  forYou: {
    fontSize:      '0.85rem',
    fontWeight:    700,
    letterSpacing: 2,
    color:         '#ffd700',
    textTransform: 'uppercase',
    fontFamily:    'sans-serif',
  },
  photoWrap: {
    position:     'relative',
    width:        '100%',
    borderRadius: 16,
    overflow:     'hidden',
    border:       '2px solid rgba(255,215,0,0.4)',
    boxShadow:    '0 0 30px rgba(255,215,0,0.2)',
  },
  photo: {
    width:       '100%',
    aspectRatio: '4/5',
    objectFit:   'cover',
    display:     'block',
  },
  vignette: {
    position:   'absolute',
    inset:      0,
    background: 'linear-gradient(to top, rgba(16,20,35,0.55) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  pickupLine: {
    fontFamily:  "'Playfair Display', Georgia, serif",
    fontSize:    'clamp(1rem, 4.5vw, 1.2rem)',
    fontStyle:   'italic',
    fontWeight:  600,
    color:       '#fff',
    textAlign:   'center',
    lineHeight:  1.6,
    padding:     '0 4px',
    textShadow:  '0 0 20px rgba(255,215,0,0.5)',
    margin:      0,
  },
  btn: {
    width:        '100%',
    padding:      '16px 20px',
    border:       'none',
    borderRadius: 40,
    background:   'linear-gradient(135deg, #ff4b72, #ff758c)',
    color:        '#fff',
    fontSize:     '1rem',
    fontWeight:   700,
    letterSpacing: 1,
    cursor:       'pointer',
    boxShadow:    '0 8px 25px rgba(255,75,114,0.45)',
    fontFamily:   'sans-serif',
    minHeight:    52,        // comfortable tap target
  },
};
