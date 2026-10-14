import React from 'react';
import * as THREE from 'three';

// Pre-seed deterministic values for decorative random placements so they
// never re-roll on re-render (satisfies react(purity) lint rule).
const STAR_SEEDS = Array.from({ length: 12 }, (_, i) => ({
  x: ((i * 73 + 17) % 100) / 100 - 0.5,
  y: ((i * 47 + 31) % 100) / 100 - 0.5,
}));
const PETAL_SEEDS = Array.from({ length: 18 }, (_, i) => ({
  x:  (((i * 83 + 11) % 100) / 100 - 0.5) * 4.5,
  z: -21 - ((i * 61 + 7) % 100) / 100 * 6,
  rot: ((i * 137) % 360) * (Math.PI / 180),
  w: 0.14 + ((i * 29) % 10) / 100,
  h: 0.09 + ((i * 37) % 8) / 100,
}));

/* ── Helpers ─────────────────────────────────────────── */
function Wall({ position, rotation, width, height, color, emissive = '#000000', emissiveIntensity = 0 }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} roughness={0.85} emissive={emissive} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
}

function Floor({ position, width, depth, color }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} />
    </mesh>
  );
}

function Ceiling({ position, width, depth, color = '#1a1a2e' }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

// A simple skirting board strip at base of wall
function Skirting({ position, rotation, width, color = '#2d1f14' }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, 0.12, 0.04]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

// Glowing wall lamp sconce
function WallSconce({ position }) {
  return (
    <group position={position}>
      {/* Bracket */}
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.04, 0.06, 0.18, 10]} />
        <meshStandardMaterial color="#8b6914" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0.18, 0.08]}>
        <cylinderGeometry args={[0.13, 0.2, 0.22, 12, 1, true]} />
        <meshStandardMaterial color="#fffaf0" side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>
      {/* Glow bulb */}
      <mesh position={[0, 0.12, 0.08]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#ffeeaa" emissive="#ffeeaa" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// Framed decorative art panel on a wall
function WallArt({ position, rotation, width = 1.1, height = 0.75, color: _color = '#1a0033' }) {
  const artColor = _color;
  return (
    <group position={position} rotation={rotation}>
      {/* Dark mat */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[width + 0.14, height + 0.14, 0.02]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.6} />
      </mesh>
      {/* Canvas */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={artColor} roughness={0.9} emissive={artColor} emissiveIntensity={0.12} />
      </mesh>
    </group>
  );
}

// Small nightstand
function Nightstand({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.45, 0.56, 0.38]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.7} />
      </mesh>
      {/* Top surface */}
      <mesh position={[0, 0.57, 0]}>
        <boxGeometry args={[0.47, 0.03, 0.40]} />
        <meshStandardMaterial color="#3d2817" roughness={0.5} />
      </mesh>
      {/* Drawer strip */}
      <mesh position={[0, 0.32, 0.2]}>
        <boxGeometry args={[0.36, 0.16, 0.01]} />
        <meshStandardMaterial color="#4a3020" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Lamp on table
function TableLamp({ position }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.1, 12]} />
        <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
        <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.3, 14, 1, true]} />
        <meshStandardMaterial color="#fffaf0" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      {/* Glow */}
      <mesh position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffeeaa" emissive="#ffeeaa" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// Bed with headboard, frame, mattress, duvet, pillows
function Bed({ position, color: _color = '#1a0a1e', mattressColor = '#f0e6f6', pillarColor = '#2d1f14' }) {
  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.0, 0.38, 2.5]} />
        <meshStandardMaterial color={pillarColor} roughness={0.7} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.88, 0.26, 2.38]} />
        <meshStandardMaterial color={mattressColor} roughness={0.6} />
      </mesh>
      {/* Duvet */}
      <mesh position={[0, 0.6, 0.3]}>
        <boxGeometry args={[1.8, 0.1, 1.8]} />
        <meshStandardMaterial color="#e8c4d0" roughness={0.9} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 0.9, -1.2]}>
        <boxGeometry args={[1.95, 1.1, 0.12]} />
        <meshStandardMaterial color={pillarColor} roughness={0.5} />
      </mesh>
      {/* Headboard top rail */}
      <mesh position={[0, 1.46, -1.2]}>
        <boxGeometry args={[2.0, 0.08, 0.16]} />
        <meshStandardMaterial color="#3d2817" roughness={0.4} />
      </mesh>
      {/* Pillow L */}
      <mesh position={[-0.5, 0.62, -0.8]}>
        <boxGeometry args={[0.7, 0.14, 0.44]} />
        <meshStandardMaterial color="#ffd0dc" roughness={0.8} />
      </mesh>
      {/* Pillow R */}
      <mesh position={[0.5, 0.62, -0.8]}>
        <boxGeometry args={[0.7, 0.14, 0.44]} />
        <meshStandardMaterial color="#ffd0dc" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Rug
function Rug({ position, width, depth, color }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], position[1] + 0.005, position[2]]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

// Window with star-lit outer pane
function Window({ position }) {
  return (
    <group position={position}>
      {/* Night sky pane */}
      <mesh>
        <planeGeometry args={[1.8, 1.3]} />
        <meshBasicMaterial color="#060d1a" />
      </mesh>
      {/* Stars sprinkled on pane — positions pre-seeded, not random on render */}
      {STAR_SEEDS.map((s, i) => (
        <mesh
          key={i}
          position={[s.x * 1.6, s.y * 1.1, 0.01]}
        >
          <sphereGeometry args={[0.015, 4, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* Outer frame */}
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[1.9, 0.06, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[0.06, 1.4, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Cross bar */}
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[1.9, 1.42, 0.02]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    </group>
  );
}

/* ── Main Room Component ─────────────────────────────── */
export default function Room() {
  const W  = 6.0;  // room width
  const H  = 3.5;  // room height

  return (
    <group>

      {/* ══════════════════════════════════════════════
          ROOM 1  —  Entry Lounge   Z: 2.5 → -4.0
      ══════════════════════════════════════════════ */}
      <Floor   position={[0, 0, -0.75]} width={W} depth={6.5} color="#3d2817" />
      <Ceiling position={[0, H, -0.75]} width={W} depth={6.5} />
      <Wall position={[-W/2, H/2, -0.75]} rotation={[0,  Math.PI/2, 0]} width={6.5} height={H} color="#1e2233" />
      <Wall position={[ W/2, H/2, -0.75]} rotation={[0, -Math.PI/2, 0]} width={6.5} height={H} color="#1e2233" />
      <Wall position={[0, H/2,  2.5]}   rotation={[0, Math.PI, 0]}  width={W}   height={H} color="#1a1a2e" />

      {/* Rug */}
      <Rug position={[0, 0, -0.5]} width={3.5} depth={4.0} color="#4a2040" />

      {/* Sconces on left/right walls */}
      <WallSconce position={[-2.9, 2.1, -0.0]} />
      <WallSconce position={[ 2.9, 2.1, -0.0]} />

      {/* Window on front entrance wall */}
      <Window position={[0, 2.1, -3.92]} />

      {/* Decorative art on side walls */}
      <WallArt position={[-2.85, 1.8, -2.0]} rotation={[0, Math.PI/2, 0]} color="#200830" />
      <WallArt position={[ 2.85, 1.8, -2.0]} rotation={[0, -Math.PI/2, 0]} color="#200830" />

      {/* Skirting boards */}
      <Skirting position={[-2.97, 0.06, -0.75]} rotation={[0, Math.PI/2, 0]} width={6.5} />
      <Skirting position={[ 2.97, 0.06, -0.75]} rotation={[0, -Math.PI/2, 0]} width={6.5} />

      {/* Small side table + lamp */}
      <group position={[2.1, 0, 1.0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.0, 0.06, 0.8]} />
          <meshStandardMaterial color="#3d2817" roughness={0.5} />
        </mesh>
        {[[-0.4, -0.3], [0.4, -0.3], [-0.4, 0.3], [0.4, 0.3]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.25, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
            <meshStandardMaterial color="#2d1f14" roughness={0.7} />
          </mesh>
        ))}
        <TableLamp position={[0, 0.53, 0]} />
      </group>


      {/* ══════════════════════════════════════════════
          ROOM 2  —  Cozy Bedroom   Z: -4.0 → -12.0
      ══════════════════════════════════════════════ */}
      <Floor   position={[0, 0, -8.0]} width={W} depth={8.0} color="#2c1e13" />
      <Ceiling position={[0, H, -8.0]} width={W} depth={8.0} color="#17112a" />
      <Wall position={[-W/2, H/2, -8.0]} rotation={[0,  Math.PI/2, 0]} width={8} height={H} color="#2a1a3a" />
      <Wall position={[ W/2, H/2, -8.0]} rotation={[0, -Math.PI/2, 0]} width={8} height={H} color="#2a1a3a" />

      {/* Rug under bed */}
      <Rug position={[-1.4, 0, -8.0]} width={3.0} depth={5.5} color="#3d1030" />

      {/* Bed */}
      <Bed position={[-1.4, 0, -8.2]} mattressColor="#f5e6f0" pillarColor="#1a0a1e" />

      {/* Nightstands */}
      <Nightstand position={[-2.55, 0, -7.0]} />
      <Nightstand position={[-0.22, 0, -7.0]} />

      {/* Lamps on nightstands */}
      <TableLamp position={[-2.55, 0.57, -7.0]} />
      <TableLamp position={[-0.22, 0.57, -7.0]} />

      {/* Wall sconces bedroom */}
      <WallSconce position={[-2.9, 2.2, -6.5]} />
      <WallSconce position={[ 2.9, 2.2, -6.5]} />

      {/* Decorative window right wall */}
      <Window position={[2.88, 2.1, -8.0]} />

      {/* Skirting */}
      <Skirting position={[-2.97, 0.06, -8.0]} rotation={[0, Math.PI/2, 0]} width={8} />
      <Skirting position={[ 2.97, 0.06, -8.0]} rotation={[0, -Math.PI/2, 0]} width={8} />


      {/* ══════════════════════════════════════════════
          ROOM 3  —  Memories Gallery   Z: -12 → -20
      ══════════════════════════════════════════════ */}
      <Floor   position={[0, 0, -16.0]} width={W} depth={8.0} color="#1a202c" />
      <Ceiling position={[0, H, -16.0]} width={W} depth={8.0} color="#10131f" />
      <Wall position={[-W/2, H/2, -16.0]} rotation={[0,  Math.PI/2, 0]} width={8} height={H} color="#141828" />
      <Wall position={[ W/2, H/2, -16.0]} rotation={[0, -Math.PI/2, 0]} width={8} height={H} color="#141828" />

      {/* Gallery floor strip */}
      <Rug position={[0, 0, -16.0]} width={2.0} depth={8.0} color="#0d1021" />

      {/* Overhead spotlight strips on ceiling */}
      {[-13.5, -15.5, -17.5, -19.0].map((z, i) => (
        <mesh key={i} position={[0, H - 0.05, z]}>
          <boxGeometry args={[5.5, 0.05, 0.14]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
        </mesh>
      ))}

      {/* Sconces gallery */}
      <WallSconce position={[-2.9, 2.2, -13.5]} />
      <WallSconce position={[ 2.9, 2.2, -13.5]} />
      <WallSconce position={[-2.9, 2.2, -17.5]} />
      <WallSconce position={[ 2.9, 2.2, -17.5]} />

      {/* Skirting */}
      <Skirting position={[-2.97, 0.06, -16.0]} rotation={[0, Math.PI/2, 0]} width={8} />
      <Skirting position={[ 2.97, 0.06, -16.0]} rotation={[0, -Math.PI/2, 0]} width={8} />


      {/* ══════════════════════════════════════════════
          ROOM 4  —  Surprise Room   Z: -20 → -28
      ══════════════════════════════════════════════ */}
      <Floor   position={[0, 0, -24.0]} width={W} depth={8.0} color="#3a0a1a" />
      <Ceiling position={[0, H, -24.0]} width={W} depth={8.0} color="#1a0010" />
      <Wall position={[-W/2, H/2, -24.0]} rotation={[0,  Math.PI/2, 0]} width={8} height={H} color="#5a0a2a" emissive="#ff2255" emissiveIntensity={0.06} />
      <Wall position={[ W/2, H/2, -24.0]} rotation={[0, -Math.PI/2, 0]} width={8} height={H} color="#5a0a2a" emissive="#ff2255" emissiveIntensity={0.06} />
      {/* Back wall */}
      <Wall position={[0, H/2, -28.0]} rotation={[0, 0, 0]} width={W} height={H} color="#6a0a35" emissive="#ff2255" emissiveIntensity={0.1} />

      {/* Romantic petal rug */}
      <Rug position={[0, 0, -24.5]} width={4.5} depth={6.5} color="#5c0a22" />

      {/* Rose-petal scatter — positions pre-seeded, stable across renders */}
      {PETAL_SEEDS.map((s, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, s.rot]}
          position={[s.x, 0.008, s.z]}
        >
          <planeGeometry args={[s.w, s.h]} />
          <meshBasicMaterial color="#cc1133" transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Candle clusters on both sides */}
      {[[-2.2, -22], [-2.2, -24.5], [-2.2, -27], [2.2, -22], [2.2, -24.5], [2.2, -27]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Candle body */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.06, 0.07, 0.36, 10]} />
            <meshStandardMaterial color="#fffaf0" roughness={0.7} />
          </mesh>
          {/* Flame glow */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#ffcc44" emissive="#ffcc44" emissiveIntensity={3} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}

      {/* Sconces surprise room */}
      <WallSconce position={[-2.9, 2.2, -22.0]} />
      <WallSconce position={[ 2.9, 2.2, -22.0]} />
      <WallSconce position={[-2.9, 2.2, -26.0]} />
      <WallSconce position={[ 2.9, 2.2, -26.0]} />

      {/* Skirting */}
      <Skirting position={[-2.97, 0.06, -24.0]} rotation={[0, Math.PI/2, 0]} width={8} />
      <Skirting position={[ 2.97, 0.06, -24.0]} rotation={[0, -Math.PI/2, 0]} width={8} />

    </group>
  );
}
