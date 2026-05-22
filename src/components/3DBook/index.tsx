
"use client";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { UI, TattooProduct, buildPagesFromProducts, pages } from "./UI";
import { Experience } from "./Experience";
import * as THREE from "three";

// ─── Props ────────────────────────────────────────────────────────────────────
interface BookSceneProps {
  products?: TattooProduct[];
}

// ─── Ambient background effects (CSS only, behind canvas) ────────────────────
function BackgroundFX() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050505]" />

      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,122,0,0.12) 0%, transparent 70%)",
          animation:  "drift1 8s ease-in-out infinite",
        }}
      />

      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,69,0,0.1) 0%, transparent 70%)",
          animation:  "drift2 10s ease-in-out infinite",
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(255,122,0,0.05) 0%, transparent 70%)",
          animation:  "pulse 4s ease-in-out infinite",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,122,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <style jsx>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-40px, 30px) scale(1.1); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, -40px) scale(1.15); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
function BookScene({ products }: BookSceneProps) {
  const [cameraZ, setCameraZ] = useState(3.5);

  useEffect(() => {
    //const update = () => setCameraZ(window.innerWidth > 800 ? 3.5 : 5.5);
    const update = () => setCameraZ(window.innerWidth > 800 ? 5.0 : 7.5);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Build page list from products if provided
  const builtPages = products && products.length > 0
    ? buildPagesFromProducts(products)
    : undefined;

  const productMeta = builtPages?.map((p) => (p as any).meta);

  return (
    <div className="relative w-full h-full">
      <BackgroundFX />

      {/* Three.js Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [0, 0.2, cameraZ], fov: 42 }}
        className="relative z-10"
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 8, 20]} />
        <group position-y={0} scale={0.7}>
          <Suspense fallback={null}>
            {/* FIX: Prop drill builtPages into customPages here */}
            <Experience products={products} customPages={builtPages} />
          </Suspense>
        </group>
      </Canvas>

      {/* HUD UI overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <UI
            totalPages  ={builtPages?.length ?? pages.length}
            productMeta ={productMeta}
          />
        </div>
      </div>

      {/* drei Loader */}
      <Loader
        containerStyles={{
          position:        "absolute",
          inset:           0,
          zIndex:          40,
          background:      "rgba(5,5,5,0.92)",
          backdropFilter:  "blur(8px)",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
        }}
        innerStyles={{
          background: "#FF7A00",
          height:     "2px",
          borderRadius: "1px",
        }}
        barStyles={{ background: "rgba(255,122,0,0.2)", height: "2px" }}
        dataStyles={{ color: "#FF7A00", fontSize: "12px", letterSpacing: "0.15em" }}
        dataInterpolation={(p) => `Loading… ${Math.round(p)}%`}
        initialState={() => true}
      />
    </div>
  );
}

export default BookScene;