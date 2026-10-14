import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ isFinalScene }) {
  const count      = isFinalScene ? 250 : 100;
  const goldCount  = isFinalScene ? 100 : 35;

  // --- Layer 1: pink/rose drifters ---
  const geo1  = useRef();
  const geo2  = useRef();

  const { l1pos, l1speed, l1drift, l1phase } = useMemo(() => {
    const l1pos   = new Float32Array(count * 3);
    const l1speed = new Float32Array(count);
    const l1drift = new Float32Array(count);
    const l1phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      l1pos[i * 3]     = (Math.random() - 0.5) * 5.5;
      l1pos[i * 3 + 1] = Math.random() * 3.2;
      l1pos[i * 3 + 2] = -Math.random() * 27;
      l1speed[i] = 0.12 + Math.random() * 0.22;
      l1drift[i] = (Math.random() - 0.5) * 0.3;
      l1phase[i] = Math.random() * Math.PI * 2;
    }
    return { l1pos, l1speed, l1drift, l1phase };
  }, [count]);

  const { l2pos, l2speed } = useMemo(() => {
    const l2pos   = new Float32Array(goldCount * 3);
    const l2speed = new Float32Array(goldCount);
    for (let i = 0; i < goldCount; i++) {
      l2pos[i * 3]     = (Math.random() - 0.5) * 5;
      l2pos[i * 3 + 1] = Math.random() * 3.5;
      l2pos[i * 3 + 2] = isFinalScene ? (-20 - Math.random() * 8) : (-Math.random() * 27);
      l2speed[i] = 0.18 + Math.random() * 0.3;
    }
    return { l2pos, l2speed };
  }, [goldCount, isFinalScene]);

  // Build Three.js geometry objects directly (avoids R3F bufferAttribute issues)
  const geometry1 = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(l1pos.slice(), 3));
    return g;
  }, [l1pos]);

  const geometry2 = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(l2pos.slice(), 3));
    return g;
  }, [l2pos]);

  const material1 = useMemo(() =>
    new THREE.PointsMaterial({
      size: isFinalScene ? 0.1 : 0.07,
      color: isFinalScene ? '#ff4b72' : '#ff9aaa',
      transparent: true,
      opacity: isFinalScene ? 0.9 : 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }), [isFinalScene]);

  const material2 = useMemo(() =>
    new THREE.PointsMaterial({
      size: isFinalScene ? 0.08 : 0.05,
      color: '#ffd700',
      transparent: true,
      opacity: isFinalScene ? 0.85 : 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }), [isFinalScene]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (geometry1) {
      const arr = geometry1.attributes.position.array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += l1speed[i] * delta;
        arr[i * 3]     += Math.sin(t * 0.5 + l1phase[i]) * l1drift[i] * delta;
        if (arr[i * 3 + 1] > 3.5) {
          arr[i * 3 + 1] = 0;
          arr[i * 3]     = (Math.random() - 0.5) * 5.5;
        }
      }
      geometry1.attributes.position.needsUpdate = true;
    }

    if (geometry2) {
      const arr = geometry2.attributes.position.array;
      for (let i = 0; i < goldCount; i++) {
        arr[i * 3 + 1] += l2speed[i] * delta * 1.2;
        if (arr[i * 3 + 1] > 3.5) arr[i * 3 + 1] = 0;
      }
      geometry2.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <points geometry={geometry1} material={material1} />
      <points geometry={geometry2} material={material2} />
    </>
  );
}
