import React, { useState } from 'react';
import * as THREE from 'three';

export default function PhotoFrame({ memory, onClick }) {
  const [texture] = useState(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(memory.image, undefined, undefined, () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffb6c1'; ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#fff'; ctx.font = '20px sans-serif';
      ctx.fillText(memory.title, 20, 130);
      return new THREE.CanvasTexture(canvas);
    });
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <group position={memory.position} rotation={memory.rotation} onPointerDown={handlePointerDown}>
      {/* Frame border */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.3, 1.0, 0.05]} />
        <meshStandardMaterial color="#4a2e18" roughness={0.6} />
      </mesh>

      {/* Photo Image Canvas */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.2, 0.9]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
}