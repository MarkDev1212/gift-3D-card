import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { checkCollision } from '../utils/collision';

export default function Player({ joystickVector, lookDelta, unlockedRooms, onInteractCheck, isCameraLocked }) {
  const { camera } = useThree();
  const keys = useRef({ forward: 0, right: 0 });
  const rotation = useRef({ yaw: 0, pitch: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'w' || e.key === 'W') keys.current.forward = -1;
      if (e.key === 's' || e.key === 'S') keys.current.forward = 1;
      if (e.key === 'a' || e.key === 'A') keys.current.right = -1;
      if (e.key === 'd' || e.key === 'D') keys.current.right = 1;
    };
    const handleKeyUp = (e) => {
      if (['w','W','s','S'].includes(e.key)) keys.current.forward = 0;
      if (['a','A','d','D'].includes(e.key)) keys.current.right = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (isCameraLocked) return;

    // Fix NaN for look delta
    const dx = typeof lookDelta?.x === 'number' && !isNaN(lookDelta.x) ? lookDelta.x : 0;
    const dy = typeof lookDelta?.y === 'number' && !isNaN(lookDelta.y) ? lookDelta.y : 0;

    if (dx !== 0 || dy !== 0) {
      rotation.current.yaw -= dx;
      rotation.current.pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotation.current.pitch - dy));
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotation.current.yaw;
    camera.rotation.x = rotation.current.pitch;

    // Fix NaN for joystick input
    const jX = typeof joystickVector?.x === 'number' && !isNaN(joystickVector.x) ? joystickVector.x : 0;
    const jY = typeof joystickVector?.y === 'number' && !isNaN(joystickVector.y) ? joystickVector.y : 0;

    const moveX = jX !== 0 ? jX : keys.current.right;
    const moveZ = jY !== 0 ? jY : keys.current.forward;

    if (moveX !== 0 || moveZ !== 0) {
      const moveSpeed = 2.8 * Math.min(delta, 0.1);
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);

      // Prevent 0 division / NaN crash
      if (len > 0.001) {
        const normX = moveX / len;
        const normZ = moveZ / len;

        const dir = new THREE.Vector3(normX, 0, normZ);
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.yaw);

        const nextX = camera.position.x + dir.x * moveSpeed;
        const nextZ = camera.position.z + dir.z * moveSpeed;

        if (!isNaN(nextX) && !isNaN(nextZ)) {
          if (!checkCollision(nextX, camera.position.z, unlockedRooms)) {
            camera.position.x = nextX;
          }
          if (!checkCollision(camera.position.x, nextZ, unlockedRooms)) {
            camera.position.z = nextZ;
          }
        }
      }
    }

    camera.position.y = 1.6; // Stand height
    onInteractCheck(camera.position);
  });

  return null;
}