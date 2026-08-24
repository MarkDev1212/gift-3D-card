import React from 'react';

export default function Lighting({ isFinalScene }) {
  return (
    <>
      <ambientLight intensity={isFinalScene ? 0.3 : 0.8} color="#fff2e6" />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={isFinalScene ? 0.5 : 1.2} 
        color="#fffaed" 
        castShadow 
      />
      {/* Warm lamp glow inside room */}
      <pointLight position={[1.8, 1.8, 1.0]} intensity={2.0} color="#ff9e59" distance={5} />
      {/* Subtle gift box glow */}
      <pointLight position={[1.5, 0.8, 1.0]} intensity={1.5} color="#ff4b72" distance={3} />
    </>
  );
}