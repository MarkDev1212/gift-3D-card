import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { checkMobile, isLowEnd } from '../utils/device';

const MOBILE  = checkMobile();
const LOW_END = isLowEnd();

/**
 * PERFORMANCE RULES
 * ─────────────────
 * • NO castShadow / receiveShadow anywhere — shadow maps are expensive.
 * • Low-end: only ambient + 1 directional + 1 per-room point light (4 total).
 * • Mobile: ambient + directional + 2 per-room lights (9 total, no spot).
 * • Desktop: full set with spot and breathing light.
 * • The breathing light uses sin() on intensity only — no material updates.
 */

function BreathingLight({ position, color, base, amp }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity = base + Math.sin(state.clock.elapsedTime * 1.8) * amp;
    }
  });
  return (
    <pointLight ref={ref} position={position} color={color}
      intensity={base} distance={9} decay={2} />
  );
}

export default function Lighting({ isFinalScene }) {
  if (LOW_END) {
    // Ultra-minimal: 1 ambient + 1 directional + 4 room key lights
    return (
      <>
        <ambientLight intensity={0.5} color="#ffe8d6" />
        <directionalLight position={[4, 9, 6]} intensity={0.8} color="#fff5e6" />
        <pointLight position={[0, 3, -1]}   color="#ffcc88" intensity={2.5} distance={8}  decay={2} />
        <pointLight position={[0, 3, -8]}   color="#ff9988" intensity={2.5} distance={8}  decay={2} />
        <pointLight position={[0, 3, -16]}  color="#cc99ff" intensity={2.5} distance={8}  decay={2} />
        <pointLight position={[0, 3, -24]}  color="#ff4b72"
          intensity={isFinalScene ? 5 : 3.5} distance={9} decay={2} />
      </>
    );
  }

  if (MOBILE) {
    // Mobile: ambient + directional + 2 lights per room (no spot, no breathing)
    return (
      <>
        <ambientLight intensity={0.38} color="#ffe8d6" />
        <directionalLight position={[4, 9, 6]} intensity={0.85} color="#fff5e6" />

        {/* Room 1 */}
        <pointLight position={[0,  3.0, -0.8]}  color="#ffcc88" intensity={2.8} distance={8} decay={2} />
        <pointLight position={[-2, 1.5, -1.5]}  color="#ffaa55" intensity={1.4} distance={5} decay={2} />

        {/* Room 2 */}
        <pointLight position={[0,  3.0, -8.0]}  color="#ff9988" intensity={2.8} distance={9} decay={2} />
        <pointLight position={[-2, 1.8, -7.5]}  color="#cc6688" intensity={1.4} distance={5} decay={2} />

        {/* Room 3 */}
        <pointLight position={[0,  3.0, -16.0]} color="#cc99ff" intensity={2.8} distance={9} decay={2} />
        <pointLight position={[-2, 2.0, -15.5]} color="#9966cc" intensity={1.4} distance={5} decay={2} />

        {/* Room 4 */}
        <pointLight position={[0,  3.2, -24.0]} color="#ff4b72"
          intensity={isFinalScene ? 5.0 : 3.5} distance={9} decay={2} />
        <pointLight position={[0,  1.8, -25.0]} color="#ff6b8a" intensity={1.8} distance={6} decay={2} />
      </>
    );
  }

  // Desktop: full lighting with breathing + spot
  return (
    <>
      <ambientLight intensity={0.35} color="#ffe8d6" />
      <directionalLight position={[4, 9, 6]} intensity={isFinalScene ? 0.6 : 0.9} color="#fff5e6" />

      {/* Room 1 */}
      <pointLight position={[0,  3.0, -0.8]}  color="#ffcc88" intensity={3.0} distance={8}  decay={2} />
      <pointLight position={[-2, 1.5, -1.5]}  color="#ffaa55" intensity={1.5} distance={5}  decay={2} />
      <pointLight position={[ 2, 1.5, -1.5]}  color="#ffaa55" intensity={1.5} distance={5}  decay={2} />

      {/* Room 2 */}
      <pointLight position={[0,  3.0, -8.0]}  color="#ff9988" intensity={3.0} distance={9}  decay={2} />
      <pointLight position={[-2, 1.8, -7.5]}  color="#cc6688" intensity={1.8} distance={5}  decay={2} />
      <pointLight position={[ 2, 1.8, -7.5]}  color="#cc6688" intensity={1.8} distance={5}  decay={2} />

      {/* Room 3 */}
      <pointLight position={[0,  3.0, -16.0]} color="#cc99ff" intensity={3.0} distance={9}  decay={2} />
      <pointLight position={[-2, 2.0, -15.5]} color="#9966cc" intensity={1.6} distance={5}  decay={2} />
      <pointLight position={[ 2, 2.0, -15.5]} color="#9966cc" intensity={1.6} distance={5}  decay={2} />

      {/* Room 4 — breathing + spot */}
      <BreathingLight
        position={[0, 3.2, -24.0]}
        color="#ff4b72"
        base={isFinalScene ? 5.0 : 4.0}
        amp={isFinalScene ? 1.8 : 0.8}
      />
      <pointLight position={[-2.2, 1.8, -23.5]} color="#ff6b8a" intensity={2.0} distance={6} decay={2} />
      <pointLight position={[ 2.2, 1.8, -23.5]} color="#ff6b8a" intensity={2.0} distance={6} decay={2} />
      <spotLight
        position={[0, 3.4, -25.0]}
        intensity={isFinalScene ? 6 : 3}
        angle={0.35}
        penumbra={0.5}
        color="#ffd0dc"
        distance={6}
        decay={2}
      />
    </>
  );
}
