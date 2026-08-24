import React from 'react';

export default function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, 0]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#faf5ef" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 1.75, -4]}>
        <planeGeometry args={[6, 3.5]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 1.75, 0]}>
        <planeGeometry args={[8, 3.5]} />
        <meshStandardMaterial color="#2b3648" />
      </mesh>

      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3, 1.75, 0]}>
        <planeGeometry args={[8, 3.5]} />
        <meshStandardMaterial color="#2b3648" />
      </mesh>

      {/* Front Door Wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 1.75, 4]}>
        <planeGeometry args={[6, 3.5]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Procedural Bed */}
      <group position={[-1.8, 0, -2.5]}>
        {/* Bed Frame */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.8, 0.4, 2.2]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.7, 0.25, 2.1]} />
          <meshStandardMaterial color="#edf2f7" />
        </mesh>
        {/* Pillow */}
        <mesh position={[0, 0.6, -0.7]}>
          <boxGeometry args={[1.2, 0.15, 0.4]} />
          <meshStandardMaterial color="#feb2b2" />
        </mesh>
      </group>

      {/* Procedural Table & Lamp */}
      <group position={[1.8, 0, 1.0]}>
        {/* Table Top */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.2, 0.08, 1.2]} />
          <meshStandardMaterial color="#4a2e18" />
        </mesh>

        {/* Table Legs */}
        {[[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.25, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5]} />
            <meshStandardMaterial color="#2d1d0f" />
          </mesh>
        ))}

        {/* Table Lamp Base */}
        <mesh position={[0.3, 0.58, -0.2]}>
          <cylinderGeometry args={[0.1, 0.12, 0.08]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>

        {/* Lamp Shade */}
        <mesh position={[0.3, 0.8, -0.2]}>
          <cylinderGeometry args={[0.15, 0.25, 0.3]} />
          <meshStandardMaterial color="#fffaf0" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Decorative Window with Night View */}
      <group position={[0, 2.0, -3.95]}>
        <mesh>
          <planeGeometry args={[2.0, 1.4]} />
          <meshBasicMaterial color="#0b132b" />
        </mesh>
        {/* Window Frame */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[2.1, 0.05, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.05, 1.5, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}