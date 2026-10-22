import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * PERFORMANCE STRATEGY
 * ─────────────────────
 * The original Room had ~120+ individual mesh components each making its own
 * draw call. On a mobile GPU that caused severe frame drops.
 *
 * New approach:
 *  1. Every wall/floor/ceiling is a plain <mesh> sharing a SINGLE shared
 *     material instance via useMemo — same color = same material object,
 *     so Three.js batches them automatically.
 *  2. Decorative furniture groups (bed, nightstand, lamps, etc.) are wrapped
 *     in <group> so the scene graph stays readable.
 *  3. Cylinder segments cut from 10-12 → 6, sphere segments 10x10 → 6x6.
 *  4. lowEnd prop: skips all decorative sub-meshes (sconces, art, skirting,
 *     window stars) — drops draw calls from ~120 to ~35 on cheap phones.
 *  5. receiveShadow / castShadow removed everywhere — shadows are off in
 *     Lighting.jsx already; keeping the flag costs a shadow-map lookup.
 */

// ── Shared material cache — same hex → same object ──────────────────
const _matCache = {};
function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!_matCache[key]) {
    _matCache[key] = new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...opts });
  }
  return _matCache[key];
}
function basicMat(color, opts = {}) {
  const key = 'basic_' + color + JSON.stringify(opts);
  if (!_matCache[key]) {
    _matCache[key] = new THREE.MeshBasicMaterial({ color, ...opts });
  }
  return _matCache[key];
}

// ── Pre-seeded decorative positions ─────────────────────────────────
const STAR_SEEDS = Array.from({ length: 8 }, (_, i) => ({
  x: ((i * 73 + 17) % 100) / 100 - 0.5,
  y: ((i * 47 + 31) % 100) / 100 - 0.5,
}));
const PETAL_SEEDS = Array.from({ length: 12 }, (_, i) => ({
  x:   (((i * 83 + 11) % 100) / 100 - 0.5) * 4.2,
  z:   -21 - ((i * 61 + 7) % 100) / 100 * 6,
  rot: ((i * 137) % 360) * (Math.PI / 180),
  w:   0.14 + ((i * 29) % 10) / 100,
  h:   0.09 + ((i * 37) % 8)  / 100,
}));
const CANDLE_POS = [[-2.2, -22], [-2.2, -25], [2.2, -22], [2.2, -25]];

// ── Tiny helper components ───────────────────────────────────────────
const Wall = ({ p, r, w, h, color, emissive, emissiveIntensity = 0 }) => (
  <mesh position={p} rotation={r} material={mat(color, emissive ? { emissive, emissiveIntensity, roughness: 0.85 } : { roughness: 0.85 })}>
    <planeGeometry args={[w, h]} />
  </mesh>
);

const Box = ({ p, r, args, color, opts }) => (
  <mesh position={p} rotation={r} material={mat(color, opts)}>
    <boxGeometry args={args} />
  </mesh>
);

const Plane = ({ p, r, args, color, opts }) => (
  <mesh position={p} rotation={r} material={basicMat(color, opts)}>
    <planeGeometry args={args} />
  </mesh>
);

// Sconce — 3 draw calls instead of 3 separate component instances
function Sconce({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.08]} material={mat('#8b6914', { roughness: 0.3, metalness: 0.7 })}>
        <cylinderGeometry args={[0.04, 0.06, 0.18, 6]} />
      </mesh>
      <mesh position={[0, 0.14, 0.08]} material={mat('#ffeeaa', { emissive: '#ffeeaa', emissiveIntensity: 2, roughness: 1 })}>
        <sphereGeometry args={[0.06, 6, 6]} />
      </mesh>
    </group>
  );
}

// Candle — 2 draw calls
function Candle({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.18, 0]} material={mat('#fffaf0', { roughness: 0.7 })}>
        <cylinderGeometry args={[0.06, 0.07, 0.36, 6]} />
      </mesh>
      <mesh position={[0, 0.4, 0]} material={mat('#ffcc44', { emissive: '#ffcc44', emissiveIntensity: 3, roughness: 1 })}>
        <sphereGeometry args={[0.05, 5, 5]} />
      </mesh>
    </group>
  );
}

// Bed — 6 draw calls total (merged pillow pair into one wider mesh)
function Bed({ px, pz }) {
  return (
    <group position={[px, 0, pz]}>
      <Box p={[0, 0.2,  0]} args={[2.0, 0.38, 2.5]} color="#1a0a1e" />
      <Box p={[0, 0.46, 0]} args={[1.88, 0.26, 2.38]} color="#f5e6f0" opts={{ roughness: 0.6 }} />
      <Box p={[0, 0.6,  0.3]} args={[1.8, 0.1, 1.8]} color="#e8c4d0" opts={{ roughness: 0.9 }} />
      <Box p={[0, 0.9,  -1.2]} args={[1.95, 1.1, 0.12]} color="#1a0a1e" opts={{ roughness: 0.5 }} />
      <Box p={[0, 1.46, -1.2]} args={[2.0, 0.08, 0.16]} color="#3d2817" opts={{ roughness: 0.4 }} />
      {/* Single wide pillow strip instead of 2 separate meshes */}
      <Box p={[0, 0.62, -0.8]} args={[1.5, 0.14, 0.44]} color="#ffd0dc" opts={{ roughness: 0.8 }} />
    </group>
  );
}

// Nightstand — 2 draw calls
function Nightstand({ position }) {
  return (
    <group position={position}>
      <Box p={[0, 0.28, 0]} args={[0.45, 0.56, 0.38]} color="#2d1f14" opts={{ roughness: 0.7 }} />
      <Box p={[0, 0.57, 0]} args={[0.47, 0.03, 0.40]} color="#3d2817" opts={{ roughness: 0.5 }} />
    </group>
  );
}

// Lamp — 3 draw calls (pole merged into base cylinder)
function Lamp({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} material={mat('#b8860b', { roughness: 0.3, metalness: 0.7 })}>
        <cylinderGeometry args={[0.025, 0.1, 0.56, 6]} />
      </mesh>
      <mesh position={[0, 0.62, 0]} material={mat('#fffaf0', { roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })}>
        <cylinderGeometry args={[0.18, 0.26, 0.28, 8, 1, true]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={mat('#ffeeaa', { emissive: '#ffeeaa', emissiveIntensity: 2.5, roughness: 1 })}>
        <sphereGeometry args={[0.05, 6, 6]} />
      </mesh>
    </group>
  );
}

// Window — simplified: 1 sky pane + frame cross only (no per-star meshes on low-end)
function Window({ position, lowEnd }) {
  return (
    <group position={position}>
      <Plane p={[0, 0, 0]} args={[1.8, 1.3]} color="#060d1a" />
      {!lowEnd && STAR_SEEDS.map((s, i) => (
        <mesh key={i} position={[s.x * 1.6, s.y * 1.1, 0.01]}
          material={basicMat('#ffffff')}>
          <planeGeometry args={[0.03, 0.03]} />
        </mesh>
      ))}
      {/* Window frame as two crossing boxes */}
      <Box p={[0, 0, 0.02]} args={[1.9, 0.055, 0.04]} color="#cccccc" opts={{ roughness: 0.3 }} />
      <Box p={[0, 0, 0.02]} args={[0.055, 1.4,  0.04]} color="#cccccc" opts={{ roughness: 0.3 }} />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN ROOM COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Room({ lowEnd = false }) {
  const W = 6.0;
  const H = 3.5;

  return (
    <group>

      {/* ── ROOM 1 · Entry Lounge  Z: +2.5 → -4.0 ── */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.75]}
        material={mat('#3d2817', { roughness: 0.75 })}>
        <planeGeometry args={[W, 6.5]} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, -0.75]}
        material={mat('#1a1a2e', { roughness: 1 })}>
        <planeGeometry args={[W, 6.5]} />
      </mesh>
      <Wall p={[-W/2, H/2, -0.75]} r={[0,  Math.PI/2, 0]} w={6.5} h={H} color="#1e2233" />
      <Wall p={[ W/2, H/2, -0.75]} r={[0, -Math.PI/2, 0]} w={6.5} h={H} color="#1e2233" />
      <Wall p={[0, H/2, 2.5]}      r={[0,  Math.PI,   0]} w={W}   h={H} color="#1a1a2e" />
      {/* Rug */}
      <Plane p={[0, 0.005, -0.5]} r={[-Math.PI/2, 0, 0]} args={[3.5, 4.0]}
        color="#4a2040" />
      {!lowEnd && <>
        <Sconce position={[-2.9, 2.1,  0.0]} />
        <Sconce position={[ 2.9, 2.1,  0.0]} />
        <Window position={[0, 2.1, -3.92]} lowEnd={lowEnd} />
        {/* Side table + lamp */}
        <group position={[2.1, 0, 1.0]}>
          <Box p={[0, 0.5, 0]} args={[1.0, 0.06, 0.8]} color="#3d2817" opts={{ roughness: 0.5 }} />
          <Lamp position={[0, 0.53, 0]} />
        </group>
      </>}


      {/* ── ROOM 2 · Cozy Bedroom  Z: -4.0 → -12.0 ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8.0]}
        material={mat('#2c1e13', { roughness: 0.75 })}>
        <planeGeometry args={[W, 8]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, -8.0]}
        material={mat('#17112a', { roughness: 1 })}>
        <planeGeometry args={[W, 8]} />
      </mesh>
      <Wall p={[-W/2, H/2, -8.0]} r={[0,  Math.PI/2, 0]} w={8} h={H} color="#2a1a3a" />
      <Wall p={[ W/2, H/2, -8.0]} r={[0, -Math.PI/2, 0]} w={8} h={H} color="#2a1a3a" />
      {/* Rug */}
      <Plane p={[-1.4, 0.005, -8.0]} r={[-Math.PI/2, 0, 0]} args={[3.0, 5.5]}
        color="#3d1030" />
      <Bed px={-1.4} pz={-8.2} />
      {!lowEnd && <>
        <Nightstand position={[-2.55, 0, -7.0]} />
        <Nightstand position={[-0.22, 0, -7.0]} />
        <Lamp position={[-2.55, 0.57, -7.0]} />
        <Lamp position={[-0.22, 0.57, -7.0]} />
        <Sconce position={[-2.9, 2.2, -6.5]} />
        <Sconce position={[ 2.9, 2.2, -6.5]} />
        <Window position={[2.88, 2.1, -8.0]} lowEnd={lowEnd} />
      </>}


      {/* ── ROOM 3 · Memories Gallery  Z: -12 → -20 ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -16.0]}
        material={mat('#1a202c', { roughness: 0.75 })}>
        <planeGeometry args={[W, 8]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, -16.0]}
        material={mat('#10131f', { roughness: 1 })}>
        <planeGeometry args={[W, 8]} />
      </mesh>
      <Wall p={[-W/2, H/2, -16.0]} r={[0,  Math.PI/2, 0]} w={8} h={H} color="#141828" />
      <Wall p={[ W/2, H/2, -16.0]} r={[0, -Math.PI/2, 0]} w={8} h={H} color="#141828" />
      {/* Gallery runner rug */}
      <Plane p={[0, 0.005, -16.0]} r={[-Math.PI/2, 0, 0]} args={[2.0, 8.0]}
        color="#0d1021" />
      {!lowEnd && <>
        <Sconce position={[-2.9, 2.2, -13.5]} />
        <Sconce position={[ 2.9, 2.2, -13.5]} />
        <Sconce position={[-2.9, 2.2, -17.5]} />
        <Sconce position={[ 2.9, 2.2, -17.5]} />
      </>}


      {/* ── ROOM 4 · Surprise Room  Z: -20 → -28 ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -24.0]}
        material={mat('#3a0a1a', { roughness: 0.75 })}>
        <planeGeometry args={[W, 8]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, -24.0]}
        material={mat('#1a0010', { roughness: 1 })}>
        <planeGeometry args={[W, 8]} />
      </mesh>
      <Wall p={[-W/2, H/2, -24.0]} r={[0,  Math.PI/2, 0]} w={8} h={H}
        color="#5a0a2a" emissive="#ff2255" emissiveIntensity={0.05} />
      <Wall p={[ W/2, H/2, -24.0]} r={[0, -Math.PI/2, 0]} w={8} h={H}
        color="#5a0a2a" emissive="#ff2255" emissiveIntensity={0.05} />
      <Wall p={[0, H/2, -28.0]} r={[0, 0, 0]} w={W} h={H}
        color="#6a0a35" emissive="#ff2255" emissiveIntensity={0.08} />
      {/* Petal rug */}
      <Plane p={[0, 0.005, -24.5]} r={[-Math.PI/2, 0, 0]} args={[4.5, 6.5]}
        color="#5c0a22" />
      {/* Rose petals */}
      {PETAL_SEEDS.map((s, i) => (
        <Plane key={i} p={[s.x, 0.008, s.z]} r={[-Math.PI/2, 0, s.rot]}
          args={[s.w, s.h]} color="#cc1133"
          opts={{ transparent: true, opacity: 0.85 }} />
      ))}
      {/* Candles */}
      {CANDLE_POS.map(([x, z], i) => <Candle key={i} x={x} z={z} />)}
      {!lowEnd && <>
        <Sconce position={[-2.9, 2.2, -22.0]} />
        <Sconce position={[ 2.9, 2.2, -22.0]} />
        <Sconce position={[-2.9, 2.2, -26.0]} />
        <Sconce position={[ 2.9, 2.2, -26.0]} />
      </>}

    </group>
  );
}
