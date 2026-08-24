import React, { useState, useRef } from 'react';

export default function MobileControls({ onMove, onLook }) {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef(null);
  const lookStartRef = useRef({ x: 0, y: 0 });

  // Joystick Touch Start
  const handleJoystickStart = (e) => {
    setIsDragging(true);
    updateJoystick(e.touches[0]);
  };

  // Joystick Touch Move
  const handleJoystickMove = (e) => {
    if (!isDragging) return;
    updateJoystick(e.touches[0]);
  };

  const updateJoystick = (touch) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 40; // Max joystick radius

    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    setJoystickPos({ x: dx, y: dy });

    // Normalize values between -1 and 1
    const normX = dx / maxRadius;
    const normY = dy / maxRadius;
    onMove(normX, normY);
  };

  const handleJoystickEnd = () => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  // Right Side Touch to Look Around
  const handleLookStart = (e) => {
    lookStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleLookMove = (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - lookStartRef.current.x;
    const dy = touch.clientY - lookStartRef.current.y;
    onLook(dx * 0.004, dy * 0.004);
    lookStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  return (
    <div className="mobile-ui-layer">
      {/* 🕹️ Left Side: Circular Joystick */}
      <div className="joystick-zone">
        <div
          ref={joystickRef}
          className="joystick-base"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
        >
          <div
            className="joystick-thumb"
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
            }}
          />
        </div>
        <span className="joystick-label">MOVE + TURN</span>
      </div>

      {/* 🔄 Right Side: Swipe Screen to Look */}
      <div
        className="look-zone"
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
      />
    </div>
  );
}