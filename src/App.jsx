import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import giftConfig from './config/giftConfig';
import { audioManager } from './utils/audioManager';
import { checkMobile, checkWebGL, getDPR } from './utils/device';

import WelcomeScreen from './components/WelcomeScreen';
import LoadingScreen from './components/LoadingScreen';
import MobileControls from './components/MobileControls';
import InteractionPrompt from './components/InteractionPrompt';
import MusicControl from './components/MusicControl';
import PhotoModal from './components/PhotoModal';
import MessageOverlay from './components/MessageOverlay';
import FinalMessage from './components/FinalMessage';
import WebGLFallback from './components/WebGLFallback';
import World from './three/World';
import Player from './three/Player';

export default function App() {
  const [experienceState, setExperienceState] = useState('WELCOME');
  const [loadProgress, setLoadProgress] = useState(0);
  const [activePrompt, setActivePrompt] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isGiftOpen, setIsGiftOpen] = useState(false);

  const [openDoors, setOpenDoors] = useState({ door1: false, door2: false, door3: false });
  const [unlockedRooms, setUnlockedRooms] = useState(1);

  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 });
  const [lookDelta, setLookDelta] = useState({ x: 0, y: 0 });

  const isMobile = checkMobile();
  const hasWebGL = checkWebGL();

  if (!hasWebGL) return <WebGLFallback />;

  const handleStart = () => {
    setExperienceState('LOADING');
    audioManager.init(giftConfig.musicPath);
    audioManager.play();

    let p = 0;
    const timer = setInterval(() => {
      p += 25;
      setLoadProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => setExperienceState('EXPLORING'), 300);
      }
    }, 100);
  };

  const handleInteractCheck = (camPos) => {
    // Proximity to Door 1 (Bedroom Door)
    if (!openDoors.door1 && camPos.distanceTo({ x: 0, y: 1.6, z: -3.8 }) < 1.8) {
      setActivePrompt({
        title: "Rahel's Bedroom",
        subtitle: "A cozy romantic space awaits...",
        buttonText: "Enter Room",
        action: () => handleOpenDoor('door1')
      });
      return;
    }

    // Proximity to Door 2 (Memories Gallery)
    if (openDoors.door1 && !openDoors.door2 && camPos.distanceTo({ x: 0, y: 1.6, z: -11.8 }) < 1.8) {
      setActivePrompt({
        title: "Memories Gallery",
        subtitle: "Walk through our sweetest photos...",
        buttonText: "Open Door",
        action: () => handleOpenDoor('door2')
      });
      return;
    }

    // Proximity to Door 3 (Surprise Room)
    if (openDoors.door2 && !openDoors.door3 && camPos.distanceTo({ x: 0, y: 1.6, z: -19.8 }) < 1.8) {
      setActivePrompt({
        title: "Surprise Room",
        subtitle: "A special surprise is waiting inside ✨",
        buttonText: "Unlock Door",
        action: () => handleOpenDoor('door3')
      });
      return;
    }

    // Proximity to Gift Box in Room 4
    if (openDoors.door3 && camPos.distanceTo({ x: 0, y: 1.6, z: -25.0 }) < 1.8) {
      setActivePrompt({
        title: "Surprise Gift Box 🎁",
        subtitle: "Tap to open your final surprise!",
        buttonText: "Open Gift",
        action: () => {
          setIsGiftOpen(true);
          setExperienceState('MESSAGE');
        }
      });
      return;
    }

    setActivePrompt(null);
  };

  const handleOpenDoor = (doorKey) => {
    setOpenDoors((prev) => ({ ...prev, [doorKey]: true }));
    setUnlockedRooms((prev) => prev + 1);
    setActivePrompt(null);
  };

  return (
    <div className="app-viewport">
      {experienceState === 'WELCOME' && <WelcomeScreen onStart={handleStart} />}
      {experienceState === 'LOADING' && <LoadingScreen progress={loadProgress} />}

      {experienceState !== 'WELCOME' && experienceState !== 'LOADING' && (
        <>
          <MusicControl />

          <Canvas
            dpr={getDPR()}
            camera={{ position: [0, 1.6, 1.0], fov: 60 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Player
              joystickVector={joystickVector}
              lookDelta={lookDelta}
              unlockedRooms={unlockedRooms}
              onInteractCheck={handleInteractCheck}
              isCameraLocked={experienceState !== 'EXPLORING'}
            />
            <World
              openDoors={openDoors}
              onDoorClick={handleOpenDoor}
              isGiftOpen={isGiftOpen}
              onGiftClick={() => { setIsGiftOpen(true); setExperienceState('MESSAGE'); }}
              onPhotoClick={(mem) => setSelectedMemory(mem)}
              experienceState={experienceState}
            />
          </Canvas>

          {experienceState === 'EXPLORING' && (
            <>
              {activePrompt && (
                <InteractionPrompt
                  title={activePrompt.title}
                  subtitle={activePrompt.subtitle}
                  buttonText={activePrompt.buttonText}
                  onClick={activePrompt.action}
                />
              )}
              {isMobile && (
                <MobileControls
                  onMove={(x, y) => setJoystickVector({ x, y })}
                  onLook={(dx, dy) => {
                    setLookDelta({ x: dx, y: dy });
                    setTimeout(() => setLookDelta({ x: 0, y: 0 }), 16);
                  }}
                />
              )}
            </>
          )}

          {selectedMemory && (
            <PhotoModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
          )}

          {experienceState === 'MESSAGE' && (
            <MessageOverlay onComplete={() => setExperienceState('FINAL_SCENE')} />
          )}

          {experienceState === 'FINAL_SCENE' && (
            <FinalMessage onReplay={() => setExperienceState('EXPLORING')} />
          )}
        </>
      )}
    </div>
  );
}