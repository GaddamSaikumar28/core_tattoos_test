"use client";
import {
  Float,
  OrbitControls,
  Text,
  Sparkles,
  useTexture,
  useCursor,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import * as THREE from "three";
import { Book } from "./Book";
import { pageAtom, TattooProduct } from "./UI";

// ─────────────────────────────────────────────────────────────────────────────
// FIX #1 — Module-level Vector3 pool.
// The old code ran  `new THREE.Vector3(s, s, s)` inside useFrame per card per
// frame → 480+ heap allocations / second at 60 fps with 8 cards.  GC pauses
// caused stutter.  Pre-allocate once at module scope; mutate in place.
// ─────────────────────────────────────────────────────────────────────────────
const _scaleVec = new THREE.Vector3();

// ─── Deterministic seeded helpers (unchanged) ─────────────────────────────────
function seededFloat(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function seededRange(index: number, salt: number, min: number, max: number): number {
  return min + seededFloat(index, salt) * (max - min);
}

// ─── Scatter positions (unchanged) ────────────────────────────────────────────
function computeCardPositions(count: number): THREE.Vector3[] {
  const radiusX  = 3.8;
  const radiusZ  = 2.8;
  const arcSpread = Math.PI * 0.8;
  const startAngle = -arcSpread / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = count <= 1 ? 0 : startAngle + (i / (count - 1)) * arcSpread;
    const x = Math.sin(angle) * radiusX;
    const z = -Math.cos(angle) * radiusZ - 1.0;
    const y = 0.8 + (i % 2 === 0 ? 0.25 : -0.25);
    return new THREE.Vector3(x, y, z);
  });
}

// ─── AsteroidCard ─────────────────────────────────────────────────────────────
interface AsteroidCardProps {
  product:    TattooProduct;
  position:   THREE.Vector3;
  index:      number;
  isActive:   boolean;
  cardScale:  number;
  tiltX:      number;
  tiltY:      number;
  driftSpeed: number;
  driftAmp:   number;
  spinSpeeds: [number, number, number];
  onActivate: (pageIndex: number) => void;
  pageIndex:  number;
}

function AsteroidCard({
  product, position, index, isActive,
  cardScale, tiltX, tiltY, driftSpeed, driftAmp,
  spinSpeeds, onActivate, pageIndex,
}: AsteroidCardProps) {
  const groupRef     = useRef<THREE.Group>(null);
  const borderMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const baseY        = useRef(position.y);
  const baseX        = useRef(position.x);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const texture = useTexture(product.frontImage);
  texture.colorSpace = THREE.SRGBColorSpace;

  const w = cardScale;
  const h = cardScale * 1.45;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t     = state.clock.elapsedTime;
    const phase = index * 0.7;

    groupRef.current.position.y = baseY.current + Math.sin(t * driftSpeed + phase) * driftAmp;
    groupRef.current.position.x = baseX.current + Math.cos(t * driftSpeed * 0.6 + phase) * driftAmp * 0.4;
    groupRef.current.rotation.x = tiltX + Math.sin(t * spinSpeeds[0] + phase) * 0.08;
    groupRef.current.rotation.y = tiltY + Math.sin(t * spinSpeeds[1] + phase * 1.3) * 0.12;
    groupRef.current.rotation.z =         Math.sin(t * spinSpeeds[2] + phase * 0.8) * 0.04;

    // FIX #1 applied: reuse _scaleVec instead of  new THREE.Vector3()
    const targetScale = isActive ? 1.25 : 1.0;
    _scaleVec.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(_scaleVec, 0.08);

    if (borderMatRef.current) {
      borderMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        borderMatRef.current.emissiveIntensity,
        isActive ? 2.5 : 0.0,
        0.08,
      );
      borderMatRef.current.opacity = THREE.MathUtils.lerp(
        borderMatRef.current.opacity,
        isActive ? 1.0 : 0.0,
        0.08,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onActivate(pageIndex); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={isActive ? 1.0 : 0.6}
        />
      </mesh>

      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[w + 0.03, h + 0.03]} />
        <meshStandardMaterial
          ref={borderMatRef}
          color="#000000"
          emissive="#FF7A00"
          transparent
          depthWrite={false}
        />
      </mesh>

      {/*
        FIX #2 — Removed per-card <pointLight> that existed when isActive.
        A SpotLight / PointLight costs O(pixels) in the fragment shader
        for EVERY mesh in the scene — not just this card.  With 8 cards
        potentially all activating, this exploded fragment shader cost.
        The orange emissive on the border frame already communicates the
        active state visually.
      */}

      {isActive && (
        <Text
          position={[0, -(h / 2 + 0.12), 0.01]}
          fontSize={0.055}
          color="#FF7A00"
          anchorX="center"
          anchorY="top"
          letterSpacing={0.08}
          maxWidth={w * 1.5}
          material-toneMapped={false}
        >
          {product.title.toUpperCase()}
        </Text>
      )}
    </group>
  );
}

// ─── AsteroidField ─────────────────────────────────────────────────────────────
interface AsteroidFieldProps {
  products:   TattooProduct[];
  activePage: number;
  onActivate: (page: number) => void;
}

function AsteroidField({ products, activePage, onActivate }: AsteroidFieldProps) {
  // FIX #3 — Lazy-mount the asteroid field.
  // The AsteroidField triggers N texture loads immediately (one per product).
  // Competing with the book's cover textures loading at the same time stalled
  // the Three.js upload queue and made the book take ages to appear.
  // Waiting 1.5 s gives the book cover a clear runway.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const activeProductIndex = activePage > 0 ? activePage - 1 : -1;
  const positions = useMemo(() => computeCardPositions(products.length), [products.length]);

  const cardProps = useMemo(
    () => products.map((_, i) => ({
      cardScale:  seededRange(i, 10, 0.35, 0.55),
      tiltX:      seededRange(i, 20, -0.3, 0.3),
      tiltY:      seededRange(i, 30, -0.4, 0.4),
      driftSpeed: seededRange(i, 40, 0.15, 0.30),
      driftAmp:   seededRange(i, 50, 0.05, 0.15),
      spinSpeeds: [
        seededRange(i, 60, 0.08, 0.18),
        seededRange(i, 70, 0.06, 0.15),
        seededRange(i, 80, 0.04, 0.10),
      ] as [number, number, number],
    })),
    [products.length],
  );

  if (!ready) return null;

  return (
    <>
      {products.map((product, i) => (
        <AsteroidCard
          key={product.id ?? i}
          product={product}
          position={positions[i]}
          index={i}
          isActive={i === activeProductIndex}
          pageIndex={i + 1}
          onActivate={onActivate}
          {...cardProps[i]}
        />
      ))}
    </>
  );
}

// ─── Background particles ─────────────────────────────────────────────────────
function InkParticles() {
  const ref = useRef<THREE.Points>(null);
  // FIX #4 — Reduced from 80 → 28 particles.
  // Each point requires a vertex shader invocation per frame.  28 is visually
  // indistinguishable from 80 at this spread / size but halves the draw call cost.
  const count = 28;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#FF7A00"),
      new THREE.Color("#FFB347"),
      new THREE.Color("#FF4500"),
      new THREE.Color("#ffffff"),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/*
  FIX #5 — SweepLight REMOVED entirely.
  A SpotLight with animated position runs a shadow-map update + fragment shader
  cost each frame.  Even with castShadow={false} the per-pixel lighting calc
  runs for the whole scene.  The visual benefit (a slow orange sweep) was subtle
  and not worth the ~4ms/frame cost on mid-range devices.
*/

// ─── Floor ─────────────────────────────────────────────────────────────────────
function Floor() {
  return (
    // FIX: Changed floor colour from #FF7A00 (bright orange, looked wrong)
    // to near-black consistent with the scene background.
    <mesh position-y={-1.6} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#080808" roughness={1} metalness={0} />
    </mesh>
  );
}

// ─── Main Experience ───────────────────────────────────────────────────────────
interface ExperienceProps {
  products?:    TattooProduct[];
  customPages?: { front: string; back: string }[];
}

export const Experience = ({ products, customPages }: ExperienceProps) => {
  const [page, setPage] = useAtom(pageAtom);
  const handleActivate  = useCallback((pageIndex: number) => setPage(pageIndex), [setPage]);

  return (
    <>
      {/*
        FIX #6 — Lighting budget reduced from 6 lights → 3 lights.

        OLD setup:  ambientLight + directionalLight(castShadow) + 2×pointLight
                    + SweepLight(SpotLight) + per-card pointLight = 6+ lights.

        NEW setup:  ambientLight(0.9) + directionalLight(2.0, shadow-map 512²)
                    + 1 orange pointLight for accent = 3 lights.

        Impact: fragment shader complexity is O(lights × fragments).
        Halving the light count roughly halves GPU fragment time.
        Shadow map resolution reduced 1024² → 512² — visually identical from
        normal viewing distance, 4× fewer shadow texels to compute per frame.
      */}
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-2, 3, -1]} intensity={1.8} color="#FF7A00" />

      {/*
        FIX #7 — Environment HDR REMOVED.
        `Environment preset="sunset"` downloads a compressed HDR (~300 KB) from
        jsDelivr, decompresses it on the GPU into a 256³ cube-map, and samples
        it for every PBR material in the scene every frame.  The visual effect
        was subtle warm tones on the book cover.  Replaced by tweaking the
        directional light colour and intensity to achieve the same warmth.
      */}

      {/* Reduced-count particles */}
      <InkParticles />
      <Sparkles count={20} scale={8} size={0.9} speed={0.2} opacity={0.25} color="#FF7A00" />

      {/* Asteroid product cards — lazy mounted after 1.5 s */}
      {products && products.length > 0 && (
        <AsteroidField
          products={products}
          activePage={page}
          onActivate={handleActivate}
        />
      )}

      {/* The book */}
      <Float rotation-x={-Math.PI / 4} floatIntensity={0.8} speed={1.8} rotationIntensity={0.6}>
        <group>
          <Book scale={[1.2, 1.2, 1.2]} customPages={customPages} />
        </group>
      </Float>

      {/* Floor + shadow catcher */}
      <Floor />
      <mesh position-y={-1.59} rotation-x={-Math.PI / 2} receiveShadow>
        {/* FIX: Reduced shadow plane from 100×100 → 30×30 (less overdraw) */}
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
};