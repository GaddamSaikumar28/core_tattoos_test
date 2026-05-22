"use client";
import {
  Environment,
  Float,
  OrbitControls,
  Text,
  MeshReflectorMaterial,
  Sparkles,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Book, PAGE_WIDTH, PAGE_HEIGHT } from "./Book";
import { pageAtom, pages, TattooProduct } from "./UI";

// ─── Ink particle field ──────────────────────────────────────────────────────
function InkParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 180;

  const { positions, colors } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const col  = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#FF7A00"),
      new THREE.Color("#FFB347"),
      new THREE.Color("#FF4500"),
      new THREE.Color("#ffffff"),
      new THREE.Color("#FF7A00"),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Floating arc text ring (semi-circle) ────────────────────────────────────
function ArcText({
  text,
  radius,
  y,
  color,
  fontSize,
  startAngle = -Math.PI * 0.55,
  totalArc   = Math.PI * 1.1,
}: {
  text:        string;
  radius:      number;
  y:           number;
  color:       string;
  fontSize:    number;
  startAngle?: number;
  totalArc?:   number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const chars    = text.split("");
  const step     = totalArc / Math.max(chars.length - 1, 1);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {chars.map((char, i) => {
        const angle = startAngle + i * step;
        const x     = Math.sin(angle) * radius;
        const z     = Math.cos(angle) * radius;
        return (
          <Text
            key={i}
            position   ={[x, 0, z]}
            rotation   ={[0, -angle, 0]}
            fontSize   ={fontSize}
            color      ={color}
            // font       ="/fonts/Bebas.ttf" // FIX: Commented out to prevent infinite Suspense failure
            anchorX    ="center"
            anchorY    ="middle"
            letterSpacing={0.05}
          >
            {char}
          </Text>
        );
      })}
    </group>
  );
}

// ─── Glowing ring halo ───────────────────────────────────────────────────────
function GlowRing({
  radius, tube, color, y, speed,
}: {
  radius: number; tube: number; color: string; y: number; speed: number;
}) {
  const ref  = useRef<THREE.Mesh>(null);
  const mat  = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color:       new THREE.Color(color),
        transparent: true,
        opacity:     0.18,
        side:        THREE.DoubleSide,
      }),
    [color]
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    const pulse = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    mat.opacity = pulse;
  });

  return (
    <mesh ref={ref} position={[0, y, 0]} material={mat}>
      <torusGeometry args={[radius, tube, 12, 80]} />
    </mesh>
  );
}

// ─── Floating ink blobs ──────────────────────────────────────────────────────
function FloatingBlobs() {
  const blobs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x:     (i % 3 - 1) * 3.2,
        y:     i < 3 ? 1.8 : -1.8,
        z:     -2,
        scale: 0.08 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? "#FF7A00" : "#FF4500",
      })),
    []
  );

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = state.clock.elapsedTime + blobs[i].phase;
      mesh.position.y = blobs[i].y + Math.sin(t * 0.6) * 0.25;
      mesh.rotation.z = t * 0.4;
      mesh.scale.setScalar(blobs[i].scale * (1 + Math.sin(t * 1.2) * 0.15));
    });
  });

  return (
    <>
      {blobs.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          position={[b.x, b.y, b.z]}
        >
          <icosahedronGeometry args={[b.scale, 1]} />
          <meshStandardMaterial
            color      ={b.color}
            emissive   ={b.color}
            emissiveIntensity={1.2}
            transparent
            opacity    ={0.55}
            roughness  ={0.3}
            metalness  ={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Animated spotlight that sweeps ─────────────────────────────────────────
function SweepLight() {
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 4;
    lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.4) * 4;
  });

  return (
    <spotLight
      ref       ={lightRef}
      position  ={[3, 5, 3]}
      angle     ={0.3}
      penumbra  ={0.8}
      intensity ={3}
      color     ="#FF7A00"
      castShadow={false}
    />
  );
}

// ─── Reflective floor ────────────────────────────────────────────────────────
function Floor() {
  return (
    <mesh position-y={-1.6} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        blur        ={[300, 100]}
        resolution  ={512}
        mixBlur     ={0.9}
        mixStrength ={40}
        roughness   ={1}
        depthScale  ={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color       ="#050505"
        metalness   ={0.8}
        mirror      ={0}
      />
    </mesh>
  );
}

// ─── Main Experience ─────────────────────────────────────────────────────────
interface ExperienceProps {
  products?: TattooProduct[];
  customPages?: { front: string; back: string }[];
}

export const Experience = ({ products, customPages }: ExperienceProps) => {
  const [page] = useAtom(pageAtom);

  const current = products?.[page > 0 && page <= (products?.length ?? 0) ? page - 1 : 0];

  return (
    <>
      {/* ── Ambient & key lights ── */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position ={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width ={2048}
        shadow-mapSize-height={2048}
        shadow-bias          ={-0.0001}
      />
      <pointLight position={[-3, 3, -2]} intensity={1.5} color="#FF7A00" />
      <pointLight position={[3, -2, 3]} intensity={0.8} color="#FFB347" />
      <SweepLight />

      {/* ── Environment ── */}
      <Environment preset="city" />

      {/* ── Particles ── */}
      <InkParticles />
      <Sparkles
        count ={60}
        scale ={6}
        size  ={1.5}
        speed ={0.3}
        opacity={0.5}
        color ="#FF7A00"
      />

      {/* ── Glow rings ── */}
      {/* <GlowRing radius={2.4} tube={0.012} color="#FF7A00" y={0}    speed={0.15}  />
      <GlowRing radius={2.8} tube={0.008} color="#FFB347" y={0.3}  speed={-0.1}  />
      <GlowRing radius={1.9} tube={0.009} color="#FF4500" y={-0.2} speed={0.22}  /> */}

      {/* ── Floating blobs ── */}
      <FloatingBlobs />

      {/* ── Arc text — top: brand name ── */}
      <ArcText
        text      ="JUST TATTOOS"
        radius    ={2.3}
        y         ={2.05}
        color     ="#FF7A00"
        fontSize  ={0.13}
        startAngle={-Math.PI * 0.45}
        totalArc  ={Math.PI * 0.9}
      />

      {/* ── Arc text — bottom: tagline ── */}
      <ArcText
        text      ="PREMIUM BODY ART"
        radius    ={2.3}
        y         ={-2.05}
        color     ="#ffffff"
        fontSize  ={0.1}
        startAngle={Math.PI * 0.55}
        totalArc  ={-Math.PI * 0.9}
      />

      {/* ── Floating 3D label above book ── */}
      <Float floatIntensity={0.5} speed={1.5}>
        <Text
          position ={[0, 1.55, 0.5]}
          fontSize ={0.09}
          color    ="#FF7A00"
          //font     ="/fonts/Bebas.ttf"
          anchorX  ="center"
          anchorY  ="middle"
          letterSpacing={0.12}
        >
          TAP TO EXPLORE
        </Text>
      </Float>

      {/* ── The book ── */}
      <Float
        rotation-x    ={-Math.PI / 4}
        floatIntensity={0.8}
        speed         ={1.8}
        rotationIntensity={0.6}
      >
        <Book scale={[1.2, 1.2, 1.2]} customPages={customPages} />
      </Float>

      {/* ── Floor reflection ── */}
      <Floor />

      {/* ── Shadow catcher ── */}
      <mesh position-y={-1.59} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>

      {/* ── Orbit controls ── */}
      <OrbitControls
        enableZoom   ={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
};