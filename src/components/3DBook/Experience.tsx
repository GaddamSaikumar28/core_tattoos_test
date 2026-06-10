"use client";
import {
  Float,
  OrbitControls,
  Text,
  useTexture,
  useCursor,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useRef, useMemo, useCallback, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Book } from "./Book";
import { pageAtom, TattooProduct } from "./UI";

const _scaleVec = new THREE.Vector3();

function seededFloat(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function seededRange(index: number, salt: number, min: number, max: number): number {
  return min + seededFloat(index, salt) * (max - min);
}

function computeCardPositions(count: number): THREE.Vector3[] {
  const radiusX   = 3.8;
  const radiusZ   = 2.8;
  const arcSpread  = Math.PI * 0.8;
  const startAngle = -arcSpread / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = count <= 1 ? 0 : startAngle + (i / (count - 1)) * arcSpread;
    const x = Math.sin(angle) * radiusX;
    const z = -Math.cos(angle) * radiusZ - 1.0;
    const y = 0.8 + (i % 2 === 0 ? 0.25 : -0.25);
    return new THREE.Vector3(x, y, z);
  });
}

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

  // const texture = useTexture(product.frontImage);
  // texture.colorSpace = THREE.SRGBColorSpace;

  // const w = cardScale;
  const texture = useTexture(product.frontImage);
  
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

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

interface AsteroidFieldProps {
  products:   TattooProduct[];
  activePage: number;
  onActivate: (page: number) => void;
}

function AsteroidField({ products, activePage, onActivate }: AsteroidFieldProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2500);
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

function InkParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 20;

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
        {/* Pass the array and itemSize (3) into the args prop */}
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          args={[colors, 3]} 
        />
      </bufferGeometry>
      
      {/* Make sure you uncomment your pointsMaterial so the particles actually render! */}
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Floor() {
  return (
    <mesh position-y={-1.6} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#080808" roughness={1} metalness={0} />
    </mesh>
  );
}

interface ExperienceProps {
  products?:    TattooProduct[];
  customPages?: { front: string; back: string }[];
}

export const Experience = ({ products, customPages }: ExperienceProps) => {
  const [page, setPage] = useAtom(pageAtom);
  const handleActivate  = useCallback((pageIndex: number) => setPage(pageIndex), [setPage]);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-2, 3, -1]} intensity={1.8} color="#FF7A00" />

      <InkParticles />

      {/* FIX: Isolated the AsteroidField inside a nested Suspense boundary to stop page-load canvas drops */}
      {products && products.length > 0 && (
        <Suspense fallback={null}>
          <AsteroidField
            products={products}
            activePage={page}
            onActivate={handleActivate}
          />
        </Suspense>
      )}

      <Float rotation-x={-Math.PI / 4} floatIntensity={0.8} speed={1.8} rotationIntensity={0.6}>
        <group>
          <Book scale={[1.2, 1.2, 1.2]} customPages={customPages} />
        </group>
      </Float>

      <Floor />
      <mesh position-y={-1.59} rotation-x={-Math.PI / 2} receiveShadow>
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