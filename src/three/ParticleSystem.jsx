import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isLowEnd, checkMobile } from '../utils/device';

const MOBILE   = checkMobile();
const LOW_END  = isLowEnd();

// Particle counts scaled to device capability
const P1 = LOW_END ? 40  : MOBILE ? 60  : 120;
const P2 = LOW_END ? 12  : MOBILE ? 20  : 40;
const P1_FINAL = LOW_END ? 80  : MOBILE ? 120 : 250;
const P2_FINAL = LOW_END ? 25  : MOBILE ? 50  : 100;

export default function ParticleSystem({ isFinalScene }) {
  const count     = isFinalScene ? P1_FINAL : P1;
  const goldCount = isFinalScene ? P2_FINAL : P2;

  const frameSkip = useRef(0); // only update positions every other frame

  const { l1pos, l1speed, l1drift, l1phase } = useMemo(() => {
    const l1pos   = new Float32Array(count * 3);
    const l1speed = new Float32Array(count);
    const l1drift = new Float32Array(count);
    const l1phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      l1pos[i*3]   = (Math.random() - 0.5) * 5.5;
      l1pos[i*3+1] = Math.random() * 3.2;
      l1pos[i*3+2] = -Math.random() * 27;
      l1speed[i] = 0.12 + Math.random() * 0.20;
      l1drift[i] = (Math.random() - 0.5) * 0.25;
      l1phase[i] = Math.random() * Math.PI * 2;
    }
    return { l1pos, l1speed, l1drift, l1phase };
  }, [count]);

  const { l2pos, l2speed } = useMemo(() => {
    const l2pos   = new Float32Array(goldCount * 3);
    const l2speed = new Float32Array(goldCount);
    for (let i = 0; i < goldCount; i++) {
      l2pos[i*3]   = (Math.random() - 0.5) * 5;
      l2pos[i*3+1] = Math.random() * 3.5;
      l2pos[i*3+2] = isFinalScene ? (-20 - Math.random() * 8) : (-Math.random() * 27);
      l2speed[i] = 0.16 + Math.random() * 0.28;
    }
    return { l2pos, l2speed };
  }, [goldCount, isFinalScene]);

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

  const material1 = useMemo(() => new THREE.PointsMaterial({
    size:            isFinalScene ? 0.10 : 0.07,
    color:           isFinalScene ? '#ff4b72' : '#ff9aaa',
    transparent:     true,
    opacity:         isFinalScene ? 0.9 : 0.6,
    blending:        THREE.AdditiveBlending,
    depthWrite:      false,
    sizeAttenuation: true,
  }), [isFinalScene]);

  const material2 = useMemo(() => new THREE.PointsMaterial({
    size:            isFinalScene ? 0.08 : 0.05,
    color:           '#ffd700',
    transparent:     true,
    opacity:         isFinalScene ? 0.85 : 0.4,
    blending:        THREE.AdditiveBlending,
    depthWrite:      false,
    sizeAttenuation: true,
  }), [isFinalScene]);

  useFrame((state, delta) => {
    // Skip every other frame on mobile — halves CPU cost of particle updates
    frameSkip.current ^= 1;
    if (MOBILE && frameSkip.current) return;

    const t  = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05) * (MOBILE ? 2 : 1); // compensate for skip

    const arr1 = geometry1.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr1[i*3+1] += l1speed[i] * dt;
      arr1[i*3]   += Math.sin(t * 0.4 + l1phase[i]) * l1drift[i] * dt;
      if (arr1[i*3+1] > 3.5) {
        arr1[i*3+1] = 0;
        arr1[i*3]   = (Math.random() - 0.5) * 5.5;
      }
    }
    geometry1.attributes.position.needsUpdate = true;

    const arr2 = geometry2.attributes.position.array;
    for (let i = 0; i < goldCount; i++) {
      arr2[i*3+1] += l2speed[i] * dt;
      if (arr2[i*3+1] > 3.5) arr2[i*3+1] = 0;
    }
    geometry2.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points geometry={geometry1} material={material1} />
      <points geometry={geometry2} material={material2} />
    </>
  );
}
