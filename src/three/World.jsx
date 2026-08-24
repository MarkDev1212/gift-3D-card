import React from 'react';
import Room from './Room';
import Lighting from './Lighting';
import GiftBox from './GiftBox';
import PhotoFrame from './PhotoFrame';
import Door from './Door';
import ParticleSystem from './ParticleSystem';
import giftConfig from '../config/giftConfig';

export default function World({ openDoors, onDoorClick, isGiftOpen, onGiftClick, onPhotoClick, experienceState }) {
  const isFinalScene = experienceState === 'FINAL_SCENE';

  return (
    <>
      <Lighting isFinalScene={isFinalScene} />
      <Room />

      {/* 🚪 Door 1 (Room 1 to Room 2) */}
      <Door
        position={[0, 0, -3.95]}
        isOpen={openDoors.door1}
        onClick={() => onDoorClick('door1')}
      />

      {/* 🚪 Door 2 (Room 2 to Room 3) */}
      <Door
        position={[0, 0, -11.95]}
        isOpen={openDoors.door2}
        onClick={() => onDoorClick('door2')}
      />

      {/* 🚪 Door 3 (Room 3 to Room 4 Surprise) */}
      <Door
        position={[0, 0, -19.95]}
        isOpen={openDoors.door3}
        onClick={() => onDoorClick('door3')}
      />

      {/* 🖼️ 11 Photo Frames */}
      {giftConfig.memories.map((mem) => (
        <PhotoFrame key={mem.id} memory={mem} onClick={() => onPhotoClick(mem)} />
      ))}

      {/* 🎁 Gift Box in Surprise Room */}
      <GiftBox position={[0, 0.5, -25.0]} isOpen={isGiftOpen} onClick={onGiftClick} />

      <ParticleSystem isFinalScene={isFinalScene} />
    </>
  );
}