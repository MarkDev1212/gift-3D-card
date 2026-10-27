import React, { useEffect, useState } from 'react';
import giftConfig from '../config/giftConfig';

/* ── load confetti lazily ── */
let _confetti = null;
import('canvas-confetti').then((m) => { _confetti = m.default; }).catch(() => {});

function fireConfetti() {
  if (!_confetti) return;
  const colors = ['#ffd700', '#ff4b72', '#ff758c', '#9f7aea', '#fbb6ce', '#ffe066'];
  _confetti({ particleCount: 100, spread: 80, origin: { x: 0.5, y: 0.55 }, colors, scalar: 1.1 });
  setTimeout(() => _confetti && _confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.65 }, colors }), 350);
  setTimeout(() => _confetti && _confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors }), 600);
  setTimeout(() => _confetti && _confetti({ particleCount: 70, spread: 100, origin: { x: 0.5, y: 0.3 }, colors, gravity: 0.6 }), 1000);
}

/* ── friendly Amharic compliment shown on photo reveal ── */
const FRIEND_LINE = "ጓደኝነት ማለት አንቺ ነሽ — ሁሌ ደስ የምትሉ፣ ሁሌ ዋጋ ያላቸሁ! 💛✨";

export default function FinalMessage({ onReplay }) {
  const [phase, setPhase] = useState('photo'); // 'photo' → 'messages'

  useEffect(() => {
    fireConfetti();
  }, []);

  /* ── PHASE 1: photo reveal with friendly compliment ── */
  if (phase === 'photo') {
    return (
      <div style={s.overlay}>
        <div style={s.glow} aria-hidden="true" />

        <div style={s.card}>
          {/* Top label */}
          <div style={s.topBar}>
            <span style={s.star}>🌟</span>
            <span style={s.forYou}>ለምርጥ ጓደኛዬ ራሄል 💛</span>
            <span style={s.star}>🌟</span>
          </div>

          {/* Photo */}
          <div style={s.photoWrap}>
            <img
              src="/images/photo1.jpg"
              alt="ራሄል"
              style={s.photo}
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80';
              }}
            />
            <div style={s.vignette} aria-hidden="true" />
          </div>

          {/* Friendly compliment */}
          <p style={s.friendLine}>{FRIEND_LINE}</p>

          {/* CTA */}
          <button
            style={s.btn}
            onClick={() => { fireConfetti(); setPhase('messages'); }}
          >
            መልዕክቴን ተቀበዩ 💌
          </button>
        </div>
      </div>
    );
  }

  /* ── PHASE 2: final messages ── */
  return (
    <div className="final-overlay">
      <div className="final-card">
        <div className="final-heart-icon" aria-hidden="true">🎉</div>
        <h1 className="final-name">ለ{giftConfig.receiverName} 💛</h1>
        <div className="final-messages">
          {giftConfig.finalMessages.map((msg, i) => (
            <p key={i} className="final-msg" style={{ animationDelay: `${i * 0.15}s` }}>
              {msg}
            </p>
          ))}
        </div>
        <button className="replay-btn" onClick={onReplay}>
          ↺ እንደገና ዙር
        </button>
      </div>
    </div>
  );
}

const s = {
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
    paddingBottom:  'max(16px, env(safe-area-inset-bottom))',
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
    background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position:      'relative',
    zIndex:        1,
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           16,
    width:         '100%',
    maxWidth:      400,
    background:    'rgba(16,20,35,0.90)',
    border:        '1px solid rgba(255,215,0,0.35)',
    borderRadius:  24,
    padding:       '24px 20px 28px',
    boxShadow:     '0 24px 60px rgba(0,0,0,0.7), 0 0 50px rgba(255,215,0,0.15)',
    animation:     'scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both',
  },
  topBar: {
    display:    'flex',
    alignItems: 'center',
    gap:        8,
  },
  star: { fontSize: '1.3rem' },
  forYou: {
    fontSize:      '0.85rem',
    fontWeight:    700,
    letterSpacing: 1.5,
    color:         '#ffd700',
    fontFamily:    'sans-serif',
    textAlign:     'center',
  },
  photoWrap: {
    position:     'relative',
    width:        '100%',
    borderRadius: 16,
    overflow:     'hidden',
    border:       '2px solid rgba(255,215,0,0.45)',
    boxShadow:    '0 0 35px rgba(255,215,0,0.25)',
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
    background: 'linear-gradient(to top, rgba(16,20,35,0.5) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  friendLine: {
    fontFamily: 'sans-serif',
    fontSize:   'clamp(0.95rem, 4vw, 1.1rem)',
    fontWeight: 600,
    color:      '#fff',
    textAlign:  'center',
    lineHeight: 1.7,
    padding:    '0 4px',
    textShadow: '0 0 20px rgba(255,215,0,0.5)',
    margin:     0,
  },
  btn: {
    width:        '100%',
    padding:      '16px 20px',
    border:       'none',
    borderRadius: 40,
    background:   'linear-gradient(135deg, #f6ad55, #dd6b20)',
    color:        '#fff',
    fontSize:     '1rem',
    fontWeight:   700,
    letterSpacing: 1,
    cursor:       'pointer',
    boxShadow:    '0 8px 25px rgba(246,173,85,0.45)',
    fontFamily:   'sans-serif',
    minHeight:    52,
  },
};
