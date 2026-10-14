import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function buildFallbackTexture(title) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 384;
  const ctx = canvas.getContext('2d');

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 512, 384);
  grad.addColorStop(0, '#1a0a2e');
  grad.addColorStop(1, '#3d0a1e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 384);

  // Heart icon
  ctx.font = '80px serif';
  ctx.textAlign = 'center';
  ctx.fillText('💖', 256, 200);

  // Title text
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(title, 256, 300);

  return new THREE.CanvasTexture(canvas);
}

export default function PhotoFrame({ memory, onClick }) {
  const [hovered, setHovered] = useState(false);
  const groupRef  = useRef();
  const glowRef   = useRef();

  // Load texture once
  const texture = React.useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(
      memory.image,
      undefined,
      undefined,
      () => buildFallbackTexture(memory.title)
    );
  }, [memory.image, memory.title]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Gentle breathe scale on hover
    const targetScale = hovered ? 1.06 : 1.0;
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 6);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, delta * 6);

    // Glow pulse on hover
    if (glowRef.current) {
      const targetEmissive = hovered ? 0.45 : 0.0;
      glowRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        glowRef.current.material.emissiveIntensity, targetEmissive, delta * 8
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={memory.position}
      rotation={memory.rotation}
      onPointerDown={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Outer decorative moulding */}
      <mesh position={[0, 0, -0.035]}>
        <boxGeometry args={[1.46, 1.14, 0.05]} />
        <meshStandardMaterial color="#2d1a0e" roughness={0.55} metalness={0.1} />
      </mesh>

      {/* Inner gold bevel */}
      <mesh ref={glowRef} position={[0, 0, -0.018]}>
        <boxGeometry args={[1.32, 1.01, 0.04]} />
        <meshStandardMaterial
          color="#8b6914"
          roughness={0.2}
          metalness={0.85}
          emissive="#b8860b"
          emissiveIntensity={0.0}
        />
      </mesh>

      {/* Photo surface */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.22, 0.92]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Subtle hover glow halo behind frame */}
      {hovered && (
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[1.7, 1.35]} />
          <meshBasicMaterial color="#ff4b72" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
