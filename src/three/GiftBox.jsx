import React, { useRef, useState } from 'react';import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import giftConfig from '../config/giftConfig';

// A small floating sparkle particle burst around the gift
function GiftSparkles({ isOpen }) {
  const count = 30;

  const { geo, speeds } = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.4;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.random() * 0.8;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      spd[i * 3]     = (Math.random() - 0.5) * 0.4;
      spd[i * 3 + 1] = 0.3 + Math.random() * 0.5;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { geo: g, speeds: spd };
  }, []);

  const mat = React.useMemo(() => new THREE.PointsMaterial({
    size: 0.07, color: '#ffd700', transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame((_, delta) => {
    if (!isOpen) return;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3]     += speeds[i * 3]     * delta;
      arr[i * 3 + 1] += speeds[i * 3 + 1] * delta;
      arr[i * 3 + 2] += speeds[i * 3 + 2] * delta;
      if (arr[i * 3 + 1] > 2.5) {
        arr[i * 3] = 0; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = 0;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  if (!isOpen) return null;
  return <points geometry={geo} material={mat} />;
}

export default function GiftBox({ isOpen, onClick, position = [0, 0.5, -25.0] }) {
  const boxGroupRef = useRef();
  const lidRef      = useRef();
  const lidTarget   = useRef(0);
  const [hovered, setHovered]   = useState(false);

  // Hover glow ref
  const glowRef = useRef();

  useFrame((state, delta) => {
    if (!boxGroupRef.current) return;

    // Gentle float bob
    boxGroupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.4) * 0.06;

    // Slow spin when not open
    if (!isOpen) {
      boxGroupRef.current.rotation.y += delta * (hovered ? 1.5 : 0.5);
    }

    // Lid opening animation
    if (lidRef.current) {
      lidTarget.current = isOpen ? 1 : 0;
      lidRef.current.position.y = THREE.MathUtils.lerp(
        lidRef.current.position.y, isOpen ? 1.2 : 0.28, delta * 3
      );
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x, isOpen ? -Math.PI * 0.6 : 0, delta * 2.5
      );
    }

    // Pulse glow on hover
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity,
        hovered ? 0.25 : 0.08,
        delta * 5
      );
    }
  });

  const boxColor    = giftConfig.giftColor   || '#ff4b72';
  const ribbonColor = giftConfig.ribbonColor || '#ffd700';

  return (
    <group
      position={[position[0], 0, position[2]]}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Soft ground glow disc */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color={boxColor} transparent opacity={0.08} depthWrite={false} />
      </mesh>

      <group ref={boxGroupRef} position={[0, position[1], 0]}>
        {/* === BOX BODY === */}
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.58, 0.72]} />
          <meshStandardMaterial
            color={boxColor}
            roughness={0.25}
            metalness={0.15}
            emissive={boxColor}
            emissiveIntensity={hovered ? 0.3 : 0.08}
          />
        </mesh>

        {/* Ribbon — front/back band */}
        <mesh>
          <boxGeometry args={[0.74, 0.59, 0.1]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.4} emissive={ribbonColor} emissiveIntensity={0.2} />
        </mesh>
        {/* Ribbon — left/right band */}
        <mesh>
          <boxGeometry args={[0.1, 0.59, 0.74]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.4} emissive={ribbonColor} emissiveIntensity={0.2} />
        </mesh>

        {/* === LID === */}
        <group ref={lidRef} position={[0, 0.28, 0]}>
          {/* Lid panel */}
          <mesh castShadow>
            <boxGeometry args={[0.76, 0.14, 0.76]} />
            <meshStandardMaterial
              color={boxColor}
              roughness={0.2}
              metalness={0.2}
              emissive={boxColor}
              emissiveIntensity={hovered ? 0.3 : 0.08}
            />
          </mesh>

          {/* Bow center sphere */}
          <mesh position={[0, 0.11, 0]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.05} metalness={0.5} emissive={ribbonColor} emissiveIntensity={0.4} />
          </mesh>

          {/* Bow loop left */}
          <mesh position={[-0.15, 0.11, 0]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.09, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.3} emissive={ribbonColor} emissiveIntensity={0.3} />
          </mesh>
          {/* Bow loop right */}
          <mesh position={[0.15, 0.11, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <torusGeometry args={[0.09, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.3} emissive={ribbonColor} emissiveIntensity={0.3} />
          </mesh>
          {/* Bow loop front */}
          <mesh position={[0, 0.11, 0.15]} rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.09, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.3} emissive={ribbonColor} emissiveIntensity={0.3} />
          </mesh>
          {/* Bow loop back */}
          <mesh position={[0, 0.11, -0.15]} rotation={[-Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.09, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.3} emissive={ribbonColor} emissiveIntensity={0.3} />
          </mesh>

          {/* Lid ribbon cross */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.78, 0.02, 0.1]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.4} emissive={ribbonColor} emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.1, 0.02, 0.78]} />
            <meshStandardMaterial color={ribbonColor} roughness={0.1} metalness={0.4} emissive={ribbonColor} emissiveIntensity={0.25} />
          </mesh>
        </group>

        {/* Sparkles burst when opened */}
        <GiftSparkles isOpen={isOpen} />
      </group>
    </group>
  );
}
