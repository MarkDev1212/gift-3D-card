import React, { useRef, useCallback } from 'react';

/**
 * Mobile controls — two-zone layout:
 *   LEFT  half → virtual joystick (move + strafe)
 *   RIGHT half → swipe to look
 *
 * Uses a SINGLE pointerId per zone so multi-touch doesn't conflict.
 */
export default function MobileControls({ onMove, onLook }) {
  /* ── Joystick state ── */
  const joystickBase    = useRef(null);
  const joystickThumb   = useRef(null);
  const joystickPtrId   = useRef(null);
  const joystickOrigin  = useRef({ x: 0, y: 0 });

  /* ── Look state ── */
  const lookPtrId    = useRef(null);
  const lookLast     = useRef({ x: 0, y: 0 });

  const MAX_R = 48; // px — thumb travel radius

  /* ─── JOYSTICK handlers ─────────────────────────────── */
  const onJoyDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    joystickPtrId.current = e.pointerId;
    const rect = joystickBase.current.getBoundingClientRect();
    joystickOrigin.current = {
      x: rect.left + rect.width / 2,
      y: rect.top  + rect.height / 2,
    };
  }, []);

  const onJoyMove = useCallback((e) => {
    if (e.pointerId !== joystickPtrId.current) return;
    let dx = e.clientX - joystickOrigin.current.x;
    let dy = e.clientY - joystickOrigin.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > MAX_R) { dx = (dx / dist) * MAX_R; dy = (dy / dist) * MAX_R; }

    if (joystickThumb.current) {
      joystickThumb.current.style.transform = `translate(${dx}px,${dy}px)`;
    }
    onMove(dx / MAX_R, dy / MAX_R);
  }, [onMove]);

  const onJoyUp = useCallback((e) => {
    if (e.pointerId !== joystickPtrId.current) return;
    joystickPtrId.current = null;
    if (joystickThumb.current) {
      joystickThumb.current.style.transform = 'translate(0px,0px)';
    }
    onMove(0, 0);
  }, [onMove]);

  /* ─── LOOK handlers ─────────────────────────────────── */
  const onLookDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lookPtrId.current  = e.pointerId;
    lookLast.current   = { x: e.clientX, y: e.clientY };
  }, []);

  const onLookMove = useCallback((e) => {
    if (e.pointerId !== lookPtrId.current) return;
    const dx = e.clientX - lookLast.current.x;
    const dy = e.clientY - lookLast.current.y;
    lookLast.current = { x: e.clientX, y: e.clientY };
    onLook(dx * 0.005, dy * 0.005);
  }, [onLook]);

  const onLookUp = useCallback((e) => {
    if (e.pointerId !== lookPtrId.current) return;
    lookPtrId.current = null;
  }, []);

  return (
    <div className="mobile-controls-root" style={styles.root}>

      {/* ── LEFT — joystick zone ── */}
      <div style={styles.joystickZone}>
        <div
          ref={joystickBase}
          style={styles.joystickBase}
          onPointerDown={onJoyDown}
          onPointerMove={onJoyMove}
          onPointerUp={onJoyUp}
          onPointerCancel={onJoyUp}
        >
          <div ref={joystickThumb} style={styles.joystickThumb} />
        </div>
        <span style={styles.label}>MOVE</span>
      </div>

      {/* ── RIGHT — look zone ── */}
      <div
        style={styles.lookZone}
        onPointerDown={onLookDown}
        onPointerMove={onLookMove}
        onPointerUp={onLookUp}
        onPointerCancel={onLookUp}
      >
        <span style={styles.lookHint}>👆 Swipe to look</span>
      </div>

    </div>
  );
}

/* ── Inline styles (no CSS class dependency) ── */
const styles = {
  root: {
    position:      'absolute',
    inset:         0,
    zIndex:        25,
    display:       'flex',
    pointerEvents: 'none',          // children re-enable selectively
    // push controls to bottom, leave top 55% free for the 3D view
    alignItems:    'flex-end',
  },

  joystickZone: {
    width:          '50%',
    height:         '45%',
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    pointerEvents:  'auto',
    paddingBottom:  'env(safe-area-inset-bottom, 16px)',
    gap:            8,
  },

  joystickBase: {
    width:           110,
    height:          110,
    borderRadius:    '50%',
    background:      'rgba(255,255,255,0.08)',
    border:          '2.5px solid rgba(255,255,255,0.28)',
    backdropFilter:  'blur(8px)',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    touchAction:     'none',
    boxShadow:       '0 0 24px rgba(255,75,114,0.25), 0 4px 20px rgba(0,0,0,0.5)',
    cursor:          'grab',
    userSelect:      'none',
    WebkitUserSelect:'none',
  },

  joystickThumb: {
    width:        50,
    height:       50,
    borderRadius: '50%',
    background:   'linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.7))',
    boxShadow:    '0 4px 16px rgba(0,0,0,0.45)',
    transition:   'transform 0s',
    pointerEvents:'none',
  },

  label: {
    color:       'rgba(255,255,255,0.45)',
    fontSize:    11,
    fontWeight:  700,
    letterSpacing: 2,
    fontFamily:  'sans-serif',
    pointerEvents: 'none',
  },

  lookZone: {
    width:          '50%',
    height:         '45%',
    pointerEvents:  'auto',
    touchAction:    'none',
    display:        'flex',
    alignItems:     'flex-end',
    justifyContent: 'center',
    paddingBottom:  'calc(env(safe-area-inset-bottom, 16px) + 18px)',
    cursor:         'grab',
  },

  lookHint: {
    color:       'rgba(255,255,255,0.3)',
    fontSize:    11,
    fontFamily:  'sans-serif',
    letterSpacing: 1,
    pointerEvents: 'none',
  },
};
