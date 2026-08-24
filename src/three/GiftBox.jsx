import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import giftConfig from '../config/giftConfig';

export default function GiftBox({ isOpen, onClick, isHovered }) {
  const lidRef = useRef();
  const boxRef = useRef();

  useFrame((state, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += delta * 0.5;
    }
    if (isOpen && lidRef.current && lidRef.current.position.y < 1.2) {
      lidRef.current.position.y += delta * 1.5;
      lidRef.current.rotation.x += delta * 2;
    }
  });

  return (
    <group position={[1.5, 0.5, 1.0]} onClick={onClick}>
      <group ref={boxRef}>
        {/* Gift Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.6]} />
          <meshStandardMaterial color={giftConfig.giftColor} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Ribbon Vertical */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.62, 0.51, 0.1]} />
          <meshStandardMaterial color={giftConfig.ribbonColor} roughness={0.2} />
        </mesh>
        
        {/* Ribbon Horizontal */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.51, 0.62]} />
          <meshStandardMaterial color={giftConfig.ribbonColor} roughness={0.2} />
        </mesh>

        {/* Lid */}
        <group ref={lidRef} position={[0, 0.28, 0]}>
          <mesh>
            <boxGeometry args={[0.64, 0.12, 0.64]} />
            <meshStandardMaterial color={giftConfig.giftColor} />
          </mesh>
          {/* Bow */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={giftConfig.ribbonColor} />
          </mesh>
        </group>
      </group>
    </group>
  );
}