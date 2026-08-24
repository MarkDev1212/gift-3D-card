import React from 'react';

export default function Room() {
  return (
    <group>
      {/* --- ROOM 1: ENTRY LOUNGE (Z: -4 to 2.5) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.75]}>
        <planeGeometry args={[6, 6.5]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      {/* Wall Left & Right */}
      <mesh position={[-3, 1.75, -0.75]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[6.5, 3.5]} /><meshStandardMaterial color="#2d3748" /></mesh>
      <mesh position={[3, 1.75, -0.75]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[6.5, 3.5]} /><meshStandardMaterial color="#2d3748" /></mesh>

      {/* --- ROOM 2: BEAUTIFUL BEDROOM (Z: -12 to -4) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#2c1e13" />
      </mesh>
      <mesh position={[-3, 1.75, -8]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[8, 3.5]} /><meshStandardMaterial color="#322659" /></mesh>
      <mesh position={[3, 1.75, -8]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[8, 3.5]} /><meshStandardMaterial color="#322659" /></mesh>
      {/* Bedroom Furniture: Bed */}
      <group position={[-1.8, 0, -8.5]}>
        <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.8, 0.4, 2.2]} /><meshStandardMaterial color="#1a202c" /></mesh>
        <mesh position={[0, 0.45, 0]}><boxGeometry args={[1.7, 0.25, 2.1]} /><meshStandardMaterial color="#edf2f7" /></mesh>
        <mesh position={[0, 0.6, -0.7]}><boxGeometry args={[1.2, 0.15, 0.4]} /><meshStandardMaterial color="#feb2b2" /></mesh>
      </group>

      {/* --- ROOM 3: MEMORIES GALLERY (Z: -20 to -12) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -16]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
      <mesh position={[-3, 1.75, -16]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[8, 3.5]} /><meshStandardMaterial color="#1a202c" /></mesh>
      <mesh position={[3, 1.75, -16]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[8, 3.5]} /><meshStandardMaterial color="#1a202c" /></mesh>

      {/* --- ROOM 4: SURPRISE ROOM (Z: -28 to -20) --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -24]}>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#4a1525" />
      </mesh>
      <mesh position={[-3, 1.75, -24]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[8, 3.5]} /><meshStandardMaterial color="#702459" /></mesh>
      <mesh position={[3, 1.75, -24]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[8, 3.5]} /><meshStandardMaterial color="#702459" /></mesh>
      <mesh position={[0, 1.75, -28]}><planeGeometry args={[6, 3.5]} /><meshStandardMaterial color="#702459" /></mesh>

      {/* Ceiling throughout all rooms */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, -13]}>
        <planeGeometry args={[6, 30]} />
        <meshStandardMaterial color="#faf5ef" />
      </mesh>
    </group>
  );
}