"use client";
import {
  Environment,
  Float,
  OrbitControls,
  Text,
  Sparkles,
  useTexture,
  useCursor,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useRef, useMemo, useCallback, useState } from "react";
import * as THREE from "three";
import { Book, PAGE_WIDTH, PAGE_HEIGHT } from "./Book";
import { pageAtom, TattooProduct } from "./UI";

// ─── Deterministic seeded helpers ─────────────────────────────────────────────
function seededFloat(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function seededRange(index: number, salt: number, min: number, max: number): number {
  return min + seededFloat(index, salt) * (max - min);
}

// ─── Scatter positions: Elegant semi-circular arc behind the book ─────────────
function computeCardPositions(count: number): THREE.Vector3[] {
  const radiusX = 3.8;
  const radiusZ = 2.8;
  const arcSpread = Math.PI * 0.8; // Spread angle of the gallery
  const startAngle = -arcSpread / 2;

  return Array.from({ length: count }, (_, i) => {
    // Distribute evenly along the arc
    const angle = count <= 1 ? 0 : startAngle + (i / (count - 1)) * arcSpread;
    const x = Math.sin(angle) * radiusX;
    // Push cards backward so they form a nice backdrop behind the book
    const z = -Math.cos(angle) * radiusZ - 1.0;
    // Alternating gentle height offset for a dynamic look
    const y = 0.8 + (i % 2 === 0 ? 0.25 : -0.25);

    return new THREE.Vector3(x, y, z);
  });
}

// ─── Single asteroid card ─────────────────────────────────────────────────────
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
  
  // FIX: Properly handle pointer cursor using state and useCursor
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

    // Slow independent drift
    groupRef.current.position.y = baseY.current + Math.sin(t * driftSpeed + phase) * driftAmp;
    groupRef.current.position.x = baseX.current + Math.cos(t * driftSpeed * 0.6 + phase) * driftAmp * 0.4;

    // Gentle tumble on all three axes
    groupRef.current.rotation.x = tiltX + Math.sin(t * spinSpeeds[0] + phase) * 0.08;
    groupRef.current.rotation.y = tiltY + Math.sin(t * spinSpeeds[1] + phase * 1.3) * 0.12;
    groupRef.current.rotation.z =         Math.sin(t * spinSpeeds[2] + phase * 0.8) * 0.04;

    // Smooth transition for scale and professional emissive glow
    const targetScale = isActive ? 1.25 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    if (borderMatRef.current) {
      borderMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        borderMatRef.current.emissiveIntensity,
        isActive ? 2.5 : 0.0,
        0.08
      );
      borderMatRef.current.opacity = THREE.MathUtils.lerp(
        borderMatRef.current.opacity,
        isActive ? 1.0 : 0.0, // completely hide border when inactive for a cleaner look
        0.08
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
      {/* Main image plane */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={isActive ? 1.0 : 0.6}
        />
      </mesh>

      {/* Elegant Emissive Frame */}
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

      {/* Soft local 3D light for active card (creates realistic environment glow) */}
      {isActive && (
        <pointLight position={[0, 0, 0.5]} intensity={1.5} color="#FF7A00" distance={3} />
      )}

      {/* Product title — only when active */}
      {isActive && (
        <Text
          position={[0, -(h / 2 + 0.12), 0.01]}
          fontSize={0.055}
          color="#FF7A00"
          anchorX="center"
          anchorY="top"
          letterSpacing={0.08}
          maxWidth={w * 1.5}
          material-toneMapped={false} // Prevents color washing out
        >
          {product.title.toUpperCase()}
        </Text>
      )}
    </group>
  );
}

// ─── Full asteroid field ──────────────────────────────────────────────────────
interface AsteroidFieldProps {
  products:   TattooProduct[];
  activePage: number;
  onActivate: (page: number) => void;
}

function AsteroidField({ products, activePage, onActivate }: AsteroidFieldProps) {
  const activeProductIndex = activePage > 0 ? activePage - 1 : -1;
  const positions = useMemo(() => computeCardPositions(products.length), [products.length]);

  const cardProps = useMemo(() =>
    products.map((_, i) => ({
      cardScale:  seededRange(i, 10, 0.35, 0.55), // Slightly larger baseline scale
      tiltX:      seededRange(i, 20, -0.3,  0.3),
      tiltY:      seededRange(i, 30, -0.4,  0.4),
      driftSpeed: seededRange(i, 40, 0.15, 0.30),
      driftAmp:   seededRange(i, 50, 0.05, 0.15),
      spinSpeeds: [
        seededRange(i, 60, 0.08, 0.18),
        seededRange(i, 70, 0.06, 0.15),
        seededRange(i, 80, 0.04, 0.10),
      ] as [number, number, number],
    })),
  [products.length]);

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
  const ref   = useRef<THREE.Points>(null);
  const count = 80;

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
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2; // Bias slightly backward
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
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Sweep spotlight ──────────────────────────────────────────────────────────
function SweepLight() {
  const lightRef = useRef<THREE.SpotLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 4;
    lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.4) * 4;
  });
  return (
    <spotLight
      ref={lightRef}
      position={[3, 5, 3]}
      angle={0.3}
      penumbra={0.8}
      intensity={2.5}
      color="#FF7A00"
      castShadow={false}
    />
  );
}

// ─── Floor ────────────────────────────────────────────────────────────────────
function Floor() {
  return (
    <mesh position-y={-1.6} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[20, 20]} />
      {/* <meshStandardMaterial color="#080808" metalness={0.6} roughness={0.8} /> */}
      {/* <meshStandardMaterial color="#1a0a00" metalness={0.2} roughness={0.9} /> */}
      <meshStandardMaterial color="#FF7A00" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

// ─── Main Experience ──────────────────────────────────────────────────────────
interface ExperienceProps {
  products?:    TattooProduct[];
  customPages?: { front: string; back: string }[];
}

export const Experience = ({ products, customPages }: ExperienceProps) => {
  const [page, setPage] = useAtom(pageAtom);

  const handleActivate = useCallback((pageIndex: number) => {
    setPage(pageIndex);
  }, [setPage]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[2, 5, 2]}
        // intensity={2.5}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-3, 3, -2]} intensity={1.2} color="#FF7A00" />
      <pointLight position={[3, -2, 3]}  intensity={0.7} color="#FFB347" />
      <SweepLight />

      {/* Environment */}
      {/* <Environment preset="dawn" /> */}
        <Environment preset="sunset" />
      {/* Background scatter */}
      <InkParticles />
      <Sparkles count={30} scale={8} size={1.2} speed={0.25} opacity={0.35} color="#FF7A00" />

      {/* ── ASTEROID PRODUCT CARDS ── */}
      {products && products.length > 0 && (
        <AsteroidField
          products={products}
          activePage={page}
          onActivate={handleActivate}
        />
      )}

      {/* Bigger & Bolder JUST TATTOOS label */}
      {/* <Float floatIntensity={0.5} speed={1.5}>
        <Text
          font="/assets/fonts/Almarena-Bold.otf"
          position={[0, 1.9, 0.5]} // Shifted up slightly to fit the larger text
          fontSize={0.28}
          fontWeight="bold" // Bolder font
          color="#FF7A00"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          outlineWidth={0.008} // Adds extra thickness to the font
          outlineColor="#FF7A00"
        >
          JUST TATTOOS
        </Text>
      </Float> */}

      {/* The book */}
      <Float rotation-x={-Math.PI / 4} floatIntensity={0.8} speed={1.8} rotationIntensity={0.6}>
        <group>
          <Book scale={[1.2, 1.2, 1.2]} customPages={customPages} />
        </group>
      </Float>

      {/* Floor + shadow */}
      <Floor />
      <mesh position-y={-1.59} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      {/* Orbit controls */}
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