import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Door({ position = [0, 0, 0], isOpen, onClick }) {
  const panelRef  = useRef();
  const glowRef   = useRef();
  const [hovered, setHovered] = useState(false);

  const targetAngle = isOpen ? -Math.PI * 0.85 : 0;

  useFrame((state, delta) => {
    if (!panelRef.current) return;
    panelRef.current.rotation.y = THREE.MathUtils.lerp(
      panelRef.current.rotation.y, targetAngle, delta * 4
    );
    // Pulse the glow so the door is impossible to miss
    if (glowRef.current && !isOpen) {
      glowRef.current.intensity =
        2.5 + Math.sin(state.clock.elapsedTime * 2.4) * 1.0;
    }
  });

  const doorW = 1.4;
  const doorH = 2.6;
  const wallT = 0.18;

  // Colours — bright gold throughout
  const wallColor  = '#1e2233';
  const frameColor = '#b8860b';           // dark gold frame
  const doorColor  = '#c8950a';           // rich warm gold door panel
  const doorEmissive = hovered && !isOpen ? '#ffe066' : '#b87800';
  const doorEmissiveInt = hovered && !isOpen ? 0.6 : 0.35;

  return (
    <group position={position}>

      {/* ── Invisible large tap-target mesh (mobile) ── */}
      {!isOpen && (
        <mesh
          position={[0, doorH / 2, 0.04]}
          onPointerDown={(e) => { e.stopPropagation(); onClick(); }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <boxGeometry args={[doorW + 0.6, doorH + 0.4, 0.08]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* ── Pulsing point-light on the door ── */}
      <pointLight
        ref={glowRef}
        position={[0, doorH / 2, 0.5]}
        color="#ffd700"
        intensity={isOpen ? 0 : 2.5}
        distance={3.5}
        decay={2}
      />

      {/* ── Dividing wall pieces ── */}
      <mesh position={[-(doorW / 2 + (6 - doorW) / 4), doorH / 2, 0]}>
        <boxGeometry args={[(6 - doorW) / 2 - 0.01, doorH, wallT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[(doorW / 2 + (6 - doorW) / 4), doorH / 2, 0]}>
        <boxGeometry args={[(6 - doorW) / 2 - 0.01, doorH, wallT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, doorH + (3.5 - doorH) / 2, 0]}>
        <boxGeometry args={[6, 3.5 - doorH, wallT]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* ── Gold door frame ── */}
      <mesh position={[-doorW / 2 - 0.06, doorH / 2, 0.02]}>
        <boxGeometry args={[0.12, doorH + 0.12, wallT + 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.15} metalness={0.95}
          emissive="#ffd700" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[doorW / 2 + 0.06, doorH / 2, 0.02]}>
        <boxGeometry args={[0.12, doorH + 0.12, wallT + 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.15} metalness={0.95}
          emissive="#ffd700" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, doorH + 0.05, 0.02]}>
        <boxGeometry args={[doorW + 0.26, 0.14, wallT + 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.15} metalness={0.95}
          emissive="#ffd700" emissiveIntensity={0.4} />
      </mesh>

      {/* ── Gold door panel ── */}
      <group position={[-doorW / 2, 0, 0]}>
        <group ref={panelRef}>
          {/* Main panel */}
          <mesh
            position={[doorW / 2, doorH / 2, 0.02]}
            onPointerDown={(e) => { e.stopPropagation(); if (!isOpen) onClick(); }}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            castShadow
          >
            <boxGeometry args={[doorW, doorH, 0.06]} />
            <meshStandardMaterial
              color={doorColor}
              roughness={0.18}
              metalness={0.75}
              emissive={doorEmissive}
              emissiveIntensity={doorEmissiveInt}
            />
          </mesh>

          {/* Decorative inset panels */}
          {[doorH * 0.72, doorH * 0.35].map((pz, i) => (
            <mesh key={i} position={[doorW / 2, pz, 0.065]}>
              <boxGeometry args={[doorW * 0.72, doorH * 0.27, 0.015]} />
              <meshStandardMaterial color="#e8b800" roughness={0.12} metalness={0.88}
                emissive="#c89600" emissiveIntensity={0.25} />
            </mesh>
          ))}

          {/* Knob */}
          <mesh position={[doorW - 0.14, doorH / 2, 0.09]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#ffe066" roughness={0.05} metalness={1.0}
              emissive="#ffd700" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[doorW - 0.14, doorH / 2, 0.062]}>
            <boxGeometry args={[0.06, 0.2, 0.01]} />
            <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.95} />
          </mesh>

          {/* ✨ Glowing star badge above knob — guides tap */}
          {!isOpen && (
            <mesh position={[doorW / 2, doorH * 0.55, 0.07]}>
              <planeGeometry args={[0.38, 0.18]} />
              <meshBasicMaterial color="#ffd700" transparent opacity={0.18} depthWrite={false} />
            </mesh>
          )}
        </group>
      </group>

    </group>
  );
}
