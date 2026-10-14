import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Slowly breathing point light for the surprise room
function BreathingLight({ position, color, baseIntensity, amplitude }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity =
        baseIntensity + Math.sin(state.clock.elapsedTime * 1.8) * amplitude;
    }
  });
  return <pointLight ref={ref} position={position} color={color} intensity={baseIntensity} distance={10} castShadow={false} />;
}

export default function Lighting({ isFinalScene }) {
  return (
    <>
      {/* Soft warm ambient — never fully dark */}
      <ambientLight intensity={0.35} color="#ffe8d6" />

      {/* Main directional key light */}
      <directionalLight
        position={[4, 9, 6]}
        intensity={isFinalScene ? 0.6 : 0.9}
        color="#fff5e6"
        castShadow={false}
      />

      {/* ── Room 1: Entry Lounge — warm candlelight ── */}
      <pointLight position={[0,  3.0, -0.8]}  intensity={3.0} color="#ffcc88" distance={8}  decay={2} />
      <pointLight position={[-2, 1.5, -1.5]}  intensity={1.5} color="#ffaa55" distance={5}  decay={2} />
      <pointLight position={[ 2, 1.5, -1.5]}  intensity={1.5} color="#ffaa55" distance={5}  decay={2} />

      {/* ── Room 2: Bedroom — soft rose glow ── */}
      <pointLight position={[0,  3.0, -8.0]}  intensity={3.0} color="#ff9988" distance={9}  decay={2} />
      <pointLight position={[-2, 1.8, -7.5]}  intensity={1.8} color="#cc6688" distance={5}  decay={2} />
      <pointLight position={[ 2, 1.8, -7.5]}  intensity={1.8} color="#cc6688" distance={5}  decay={2} />

      {/* ── Room 3: Gallery — cool violet accent ── */}
      <pointLight position={[0,  3.0, -16.0]} intensity={3.0} color="#cc99ff" distance={9}  decay={2} />
      <pointLight position={[-2, 2.0, -15.5]} intensity={1.6} color="#9966cc" distance={5}  decay={2} />
      <pointLight position={[ 2, 2.0, -15.5]} intensity={1.6} color="#9966cc" distance={5}  decay={2} />

      {/* ── Room 4: Surprise — pulsing romantic rose ── */}
      <BreathingLight
        position={[0, 3.2, -24.0]}
        color="#ff4b72"
        baseIntensity={isFinalScene ? 5.0 : 4.0}
        amplitude={isFinalScene ? 1.8 : 0.8}
      />
      <pointLight position={[-2.2, 1.8, -23.5]} intensity={2.0} color="#ff6b8a" distance={6}  decay={2} />
      <pointLight position={[ 2.2, 1.8, -23.5]} intensity={2.0} color="#ff6b8a" distance={6}  decay={2} />
      {/* Gift box spotlight */}
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
