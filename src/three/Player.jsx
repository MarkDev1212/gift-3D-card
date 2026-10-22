import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { checkCollision } from '../utils/collision';

// Pre-allocated vectors — never create new THREE.* inside useFrame
const _dir   = new THREE.Vector3();
const _axis  = new THREE.Vector3(0, 1, 0);
const _camPos = new THREE.Vector3();

export default function Player({
  joystickRef,    // { current: { x, y } }  — ref, not state
  lookRef,        // { current: { x, y } }  — ref, not state
  unlockedRooms,
  onInteractCheck,
  isCameraLocked,
}) {
  const { camera } = useThree();

  const keys       = useRef({ forward: 0, right: 0 });
  const rotation   = useRef({ yaw: 0, pitch: 0 });
  const frameCount = useRef(0);  // throttle interact check

  /* ── keyboard ── */
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'w' || e.key === 'W') keys.current.forward = -1;
      if (e.key === 's' || e.key === 'S') keys.current.forward =  1;
      if (e.key === 'a' || e.key === 'A') keys.current.right   = -1;
      if (e.key === 'd' || e.key === 'D') keys.current.right   =  1;
    };
    const up = (e) => {
      if ('wWsS'.includes(e.key)) keys.current.forward = 0;
      if ('aAdD'.includes(e.key)) keys.current.right   = 0;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup',   up);
    };
  }, []);

  useFrame((_, delta) => {
    if (isCameraLocked) return;

    // Clamp delta to avoid huge jumps after tab switch
    const dt = Math.min(delta, 0.05);

    /* ── Look (camera rotation) ── */
    const lx = lookRef?.current?.x ?? 0;
    const ly = lookRef?.current?.y ?? 0;
    if (lx !== 0 || ly !== 0) {
      rotation.current.yaw  -= lx;
      rotation.current.pitch = THREE.MathUtils.clamp(
        rotation.current.pitch - ly,
        -Math.PI / 4,
        Math.PI / 4
      );
      // Clear after consuming so we don't keep spinning
      lookRef.current.x = 0;
      lookRef.current.y = 0;
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotation.current.yaw;
    camera.rotation.x = rotation.current.pitch;

    /* ── Movement ── */
    const jx = joystickRef?.current?.x ?? 0;
    const jy = joystickRef?.current?.y ?? 0;
    const mx = jx !== 0 ? jx : keys.current.right;
    const mz = jy !== 0 ? jy : keys.current.forward;

    if (mx !== 0 || mz !== 0) {
      const len = Math.sqrt(mx * mx + mz * mz);
      if (len > 0.001) {
        const speed = 3.0 * dt;
        _dir.set(mx / len, 0, mz / len);
        _dir.applyAxisAngle(_axis, rotation.current.yaw);

        const nx = camera.position.x + _dir.x * speed;
        const nz = camera.position.z + _dir.z * speed;

        if (!checkCollision(nx, camera.position.z, unlockedRooms)) camera.position.x = nx;
        if (!checkCollision(camera.position.x, nz, unlockedRooms)) camera.position.z = nz;
      }
    }

    camera.position.y = 1.6;

    /* ── Interact check — every 10 frames (~6× per second at 60fps) ── */
    frameCount.current++;
    if (frameCount.current >= 10) {
      frameCount.current = 0;
      _camPos.copy(camera.position);
      onInteractCheck(_camPos);
    }
  });

  return null;
}
