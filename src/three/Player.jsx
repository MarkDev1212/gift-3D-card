import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { checkCollision } from '../utils/collision';

export default function Player({ joystickVector, lookDelta, unlockedRooms, onInteractCheck, isCameraLocked }) {
  const { camera } = useThree();
  const keys = useRef({ forward: 0, right: 0 });
  const rotation = useRef({ yaw: 0, pitch: 0 });

  // Keyboard support for desktop testing
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

    // Apply look delta only when finger moves (fixes auto-spin bug!)
    if (lookDelta.x !== 0 || lookDelta.y !== 0) {
      rotation.current.yaw -= lookDelta.x;
      rotation.current.pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotation.current.pitch - lookDelta.y));
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = rotation.current.yaw;
    camera.rotation.x = rotation.current.pitch;

    // Movement speeds
    const moveSpeed = 2.8 * delta;
    const moveX = joystickVector.x !== 0 ? joystickVector.x : keys.current.right;
    const moveZ = joystickVector.y !== 0 ? joystickVector.y : keys.current.forward;

    if (moveX !== 0 || moveZ !== 0) {
      const dir = new THREE.Vector3(moveX, 0, moveZ).normalize();
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current.yaw);

      const nextX = camera.position.x + dir.x * moveSpeed;
      const nextZ = camera.position.z + dir.z * moveSpeed;

      if (!checkCollision(nextX, camera.position.z, unlockedRooms)) {
        camera.position.x = nextX;
      }
      if (!checkCollision(camera.position.x, nextZ, unlockedRooms)) {
        camera.position.z = nextZ;
      }
    }

    camera.position.y = 1.6; // Stand height
    onInteractCheck(camera.position);
  });

  return null;
}