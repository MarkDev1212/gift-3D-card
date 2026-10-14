import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import giftConfig from './config/giftConfig';
import { audioManager } from './utils/audioManager';
import { checkMobile, checkWebGL, getDPR } from './utils/device';

import WelcomeScreen    from './components/WelcomeScreen';
import LoadingScreen    from './components/LoadingScreen';
import MobileControls   from './components/MobileControls';
import InteractionPrompt from './components/InteractionPrompt';
import MusicControl     from './components/MusicControl';
import PhotoModal       from './components/PhotoModal';
import MessageOverlay   from './components/MessageOverlay';
import FinalMessage     from './components/FinalMessage';
import WebGLFallback    from './components/WebGLFallback';
import World            from './three/World';
import Player           from './three/Player';

// Evaluated once at module load — never changes per session
const IS_MOBILE = checkMobile();
const HAS_WEBGL = checkWebGL();

export default function App() {
  /* ── state ── */
  const [experienceState, setExperienceState] = useState('WELCOME');
  const [loadProgress,    setLoadProgress]    = useState(0);
  const [activePrompt,    setActivePrompt]    = useState(null);
  const [selectedMemory,  setSelectedMemory]  = useState(null);
  const [isGiftOpen,      setIsGiftOpen]      = useState(false);
  const [openDoors,       setOpenDoors]       = useState({ door1: false, door2: false, door3: false });
  const [unlockedRooms,   setUnlockedRooms]   = useState(1);
  const [joystickVector,  setJoystickVector]  = useState({ x: 0, y: 0 });
  const [lookDelta,       setLookDelta]       = useState({ x: 0, y: 0 });

  // Prevent rules-of-hooks: early return AFTER all hooks
  if (!HAS_WEBGL) return <WebGLFallback />;

  /* ── helpers ── */
  const handleStart = () => {
    setExperienceState('LOADING');
    audioManager.init(giftConfig.musicPath);
    audioManager.play();

    let p = 0;
    const timer = setInterval(() => {
      p += 20;
      setLoadProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => setExperienceState('EXPLORING'), 400);
      }
    }, 120);
  };

  const handleOpenDoor = (doorKey) => {
    setOpenDoors((prev) => ({ ...prev, [doorKey]: true }));
    setUnlockedRooms((prev) => prev + 1);
    setActivePrompt(null);
  };

  /**
   * Called every frame by Player with current camera position.
   * On mobile the prompt appears as soon as she's close — she taps the
   * on-screen button rather than clicking a 3D object.
   */
  const handleInteractCheck = (camPos) => {
    if (!openDoors.door1 && camPos.distanceTo({ x: 0, y: 1.6, z: -3.8 }) < 2.2) {
      setActivePrompt({
        title:      "Rahel's Bedroom 💕",
        subtitle:   "A cozy romantic space awaits...",
        buttonText: "Enter Room",
        action:     () => handleOpenDoor('door1'),
      });
      return;
    }
    if (openDoors.door1 && !openDoors.door2 && camPos.distanceTo({ x: 0, y: 1.6, z: -11.8 }) < 2.2) {
      setActivePrompt({
        title:      "Memories Gallery ✨",
        subtitle:   "Walk through our sweetest photos...",
        buttonText: "Open Door",
        action:     () => handleOpenDoor('door2'),
      });
      return;
    }
    if (openDoors.door2 && !openDoors.door3 && camPos.distanceTo({ x: 0, y: 1.6, z: -19.8 }) < 2.2) {
      setActivePrompt({
        title:      "Surprise Room 💖",
        subtitle:   "Something magical waits inside...",
        buttonText: "Unlock Door",
        action:     () => handleOpenDoor('door3'),
      });
      return;
    }
    if (openDoors.door3 && camPos.distanceTo({ x: 0, y: 1.6, z: -25.0 }) < 2.2) {
      setActivePrompt({
        title:      "Your Gift is Here 🎁",
        subtitle:   "Tap below to open your surprise!",
        buttonText: "Open Gift",
        action:     () => {
          setIsGiftOpen(true);
          setExperienceState('MESSAGE');
        },
      });
      return;
    }
    setActivePrompt(null);
  };

  const handleMove = useCallback((x, y) => setJoystickVector({ x, y }), []);
  const handleLook = useCallback((dx, dy) => {
    setLookDelta({ x: dx, y: dy });
    // reset after one frame so Player doesn't keep spinning
    setTimeout(() => setLookDelta({ x: 0, y: 0 }), 16);
  }, []);

  const isPlaying = experienceState !== 'WELCOME' && experienceState !== 'LOADING';

  /* ── Camera FOV: narrower on phone so scene fits without clipping ── */
  const cameraFOV = IS_MOBILE ? 72 : 60;

  return (
    <div className="app-viewport">
      {experienceState === 'WELCOME' && <WelcomeScreen onStart={handleStart} />}
      {experienceState === 'LOADING' && <LoadingScreen progress={loadProgress} />}

      {isPlaying && (
        <>
          <MusicControl />

          <Canvas
            dpr={getDPR()}
            camera={{ position: [0, 1.6, 1.0], fov: cameraFOV }}
            gl={{ antialias: !IS_MOBILE, powerPreference: 'high-performance' }}
            style={{ position: 'absolute', inset: 0, background: '#0d0f17' }}
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

          {/* ── HUD layer — always above canvas ── */}
          {experienceState === 'EXPLORING' && (
            <>
              {/* Interaction prompt — centred, large tap target */}
              {activePrompt && (
                <InteractionPrompt
                  title={activePrompt.title}
                  subtitle={activePrompt.subtitle}
                  buttonText={activePrompt.buttonText}
                  onClick={activePrompt.action}
                />
              )}

              {/* Mobile joystick — always shown on mobile */}
              {IS_MOBILE && (
                <MobileControls onMove={handleMove} onLook={handleLook} />
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
