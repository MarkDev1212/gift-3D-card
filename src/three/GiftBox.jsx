import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import giftConfig from '../config/giftConfig';
import { checkMobile } from '../utils/device';

const MOBILE = checkMobile();

// ── Sparkle burst shown when gift opens ──────────────────────────────
function GiftSparkles({ isOpen }) {
  const COUNT = 20; // was 30

  const { geo, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      const r = 0.45 + (i % 5) * 0.08;
      pos[i*3]   = Math.cos(angle) * r;
      pos[i*3+1] = (i % 4) * 0.2;
      pos[i*3+2] = Math.sin(angle) * r;
      spd[i*3]   = (Math.cos(angle)) * 0.35;
      spd[i*3+1] = 0.3 + (i % 5) * 0.1;
      spd[i*3+2] = (Math.sin(angle)) * 0.35;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { geo: g, speeds: spd };
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: 0.07, color: '#ffd700', transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame((_, delta) => {
    if (!isOpen) return;
    const dt  = Math.min(delta, 0.05);
    const arr = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      arr[i*3]   += speeds[i*3]   * dt;
      arr[i*3+1] += speeds[i*3+1] * dt;
      arr[i*3+2] += speeds[i*3+2] * dt;
      if (arr[i*3+1] > 2.5) { arr[i*3] = 0; arr[i*3+1] = 0; arr[i*3+2] = 0; }
    }
    geo.attributes.position.needsUpdate = true;
  });

  if (!isOpen) return null;
  return <points geometry={geo} material={mat} />;
}

// ── Shared materials (created once) ──────────────────────────────────
const _mats = {};
function getMat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!_mats[key]) _mats[key] = new THREE.MeshStandardMaterial({ color, ...opts });
  return _mats[key];
}
const glowDiscMat = new THREE.MeshBasicMaterial({
  color: '#ff4b72', transparent: true, opacity: 0.08, depthWrite: false,
});

export default function GiftBox({ isOpen, onClick, position = [0, 0.5, -25.0] }) {
  const groupRef = useRef();
  const lidRef   = useRef();
  const glowRef  = useRef();
  const [hovered, setHovered] = useState(false);

  const boxColor    = giftConfig.giftColor   || '#ff4b72';
  const ribbonColor = giftConfig.ribbonColor || '#ffd700';

  // Geometry instances — created once
  const boxGeo     = useMemo(() => new THREE.BoxGeometry(0.72, 0.58, 0.72), []);
  const ribFrontGeo = useMemo(() => new THREE.BoxGeometry(0.74, 0.59, 0.10), []);
  const ribSideGeo  = useMemo(() => new THREE.BoxGeometry(0.10, 0.59, 0.74), []);
  const lidGeo      = useMemo(() => new THREE.BoxGeometry(0.76, 0.14, 0.76), []);
  const bowCenterGeo = useMemo(() => new THREE.SphereGeometry(0.10, 8, 8), []); // was 20×20
  // Torus: was (0.09, 0.03, 8, 16) → (0.09, 0.03, 5, 10) — 60% fewer verts
  const bowLoopGeo   = useMemo(() => new THREE.TorusGeometry(0.09, 0.03, 5, 10, Math.PI), []);
  const glowDiscGeo  = useMemo(() => new THREE.CircleGeometry(0.9, 20), []); // was 32 segs

  const boxMat    = useMemo(() => getMat(boxColor,    { roughness: 0.25, metalness: 0.15, emissive: boxColor, emissiveIntensity: 0.08 }), [boxColor]);
  const ribbonMat = useMemo(() => getMat(ribbonColor, { roughness: 0.10, metalness: 0.40, emissive: ribbonColor, emissiveIntensity: 0.20 }), [ribbonColor]);

  const BOW_ROTATIONS = useMemo(() => [
    [0, 0,  Math.PI / 4],   // left
    [0, 0, -Math.PI / 4],   // right
    [Math.PI / 4, 0, 0],    // front
    [-Math.PI / 4, 0, 0],   // back
  ], []);
  const BOW_POSITIONS = useMemo(() => [
    [-0.15, 0.11,  0],
    [ 0.15, 0.11,  0],
    [ 0,    0.11,  0.15],
    [ 0,    0.11, -0.15],
  ], []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);

    // Float bob
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.4) * 0.06;

    // Slow spin only when closed — stop wasting GPU when open
    if (!isOpen) groupRef.current.rotation.y += dt * (hovered ? 1.2 : 0.45);

    // Lid animation
    if (lidRef.current) {
      lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, isOpen ? 1.2 : 0.28, dt * 3);
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, isOpen ? -Math.PI * 0.6 : 0, dt * 2.5);
    }

    // Glow disc
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity, hovered ? 0.22 : 0.06, dt * 5
      );
    }

    // Update emissive intensity on hover — reuse shared mat instances
    const intensity = hovered ? 0.28 : 0.08;
    if (boxMat.emissiveIntensity !== intensity) boxMat.emissiveIntensity = intensity;
  });

  return (
    <group
      position={[position[0], 0, position[2]]}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Ground glow disc */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}
        geometry={glowDiscGeo} material={glowDiscMat} />

      <group ref={groupRef} position={[0, position[1], 0]}>
        {/* Box body */}
        <mesh geometry={boxGeo} material={boxMat} />
        {/* Ribbon bands */}
        <mesh geometry={ribFrontGeo} material={ribbonMat} />
        <mesh geometry={ribSideGeo}  material={ribbonMat} />

        {/* Lid group */}
        <group ref={lidRef} position={[0, 0.28, 0]}>
          <mesh geometry={lidGeo} material={boxMat} />

          {/* Bow center */}
          <mesh position={[0, 0.11, 0]} geometry={bowCenterGeo} material={ribbonMat} />

          {/* Bow loops — 4 torii, low-poly */}
          {BOW_POSITIONS.map((pos, i) => (
            <mesh key={i} position={pos} rotation={BOW_ROTATIONS[i]}
              geometry={bowLoopGeo} material={ribbonMat} />
          ))}

          {/* Lid ribbon cross */}
          <mesh position={[0, 0.08, 0]} material={ribbonMat}>
            <boxGeometry args={[0.78, 0.02, 0.10]} />
          </mesh>
          <mesh position={[0, 0.08, 0]} material={ribbonMat}>
            <boxGeometry args={[0.10, 0.02, 0.78]} />
          </mesh>
        </group>

        <GiftSparkles isOpen={isOpen} />
      </group>
    </group>
  );
}
