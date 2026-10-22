import React, { memo } from 'react';
import Room          from './Room';
import Lighting      from './Lighting';
import GiftBox       from './GiftBox';
import PhotoFrame    from './PhotoFrame';
import Door          from './Door';
import ParticleSystem from './ParticleSystem';
import giftConfig    from '../config/giftConfig';
import { isLowEnd }  from '../utils/device';

const LOW_END = isLowEnd();

// Memoised door — only re-renders when its own isOpen changes
const MemoedDoor = memo(Door);

// Memoised photo frames — never change after mount
const PhotoFrames = memo(function PhotoFrames({ onPhotoClick }) {
  return giftConfig.memories.map((mem) => (
    <PhotoFrame key={mem.id} memory={mem} onClick={() => onPhotoClick(mem)} />
  ));
});

export default function World({
  openDoors, onDoorClick, isGiftOpen, onGiftClick,
  onPhotoClick, experienceState, lowEnd,
}) {
  const isFinalScene = experienceState === 'FINAL_SCENE';
  const useLowEnd    = lowEnd || LOW_END;

  return (
    <>
      <Lighting isFinalScene={isFinalScene} />
      <Room lowEnd={useLowEnd} />

      <MemoedDoor position={[0, 0, -3.95]}  isOpen={openDoors.door1} onClick={() => onDoorClick('door1')} />
      <MemoedDoor position={[0, 0, -11.95]} isOpen={openDoors.door2} onClick={() => onDoorClick('door2')} />
      <MemoedDoor position={[0, 0, -19.95]} isOpen={openDoors.door3} onClick={() => onDoorClick('door3')} />

      <PhotoFrames onPhotoClick={onPhotoClick} />

      <GiftBox position={[0, 0.5, -25.0]} isOpen={isGiftOpen} onClick={onGiftClick} />

      <ParticleSystem isFinalScene={isFinalScene} />
    </>
  );
}
