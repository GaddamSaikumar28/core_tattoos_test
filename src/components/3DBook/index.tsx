"use client";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { UI, TattooProduct, buildPagesFromProducts, pages } from "./UI";
import { Experience } from "./Experience";
import * as THREE from "three";

interface BookSceneProps {
  products?: TattooProduct[];
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX #1 — Inject BackgroundFX keyframes via useEffect instead of <style jsx>.
//
// `style jsx` and `style jsx global` are styled-jsx syntax.  In Next.js App
// Router "use client" components styled-jsx is supported, but ONLY if the
// `styled-jsx` npm package is installed and babel is configured.  When using
// the default SWC compiler (no babel.config) styled-jsx tags silently produce
// no output — the keyframes never register and the drift animations freeze.
//
// Solution: inject a <style> element once via useEffect.  This is guaranteed
// to work regardless of compiler config.
// ─────────────────────────────────────────────────────────────────────────────
const BG_FX_STYLE_ID = "book-bg-fx-keyframes";

function useBackgroundKeyframes() {
  useEffect(() => {
    if (document.getElementById(BG_FX_STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = BG_FX_STYLE_ID;
    s.textContent = `
      @keyframes bookDrift1 {
        0%,100% { transform: translate(0,0) scale(1); }
        50%      { transform: translate(-40px,30px) scale(1.1); }
      }
      @keyframes bookDrift2 {
        0%,100% { transform: translate(0,0) scale(1); }
        50%      { transform: translate(30px,-40px) scale(1.15); }
      }
      @keyframes bookPulse {
        0%,100% { opacity:1; }
        50%      { opacity:0.5; }
      }
      @keyframes bookSpin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById(BG_FX_STYLE_ID)?.remove(); };
  }, []);
}

// ─── Ambient background effects (CSS only, behind canvas) ────────────────────
function BackgroundFX() {
  // Keyframes injected once on mount (see above hook)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050505]" />

      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
        style={{
          background:  "radial-gradient(circle, rgba(255,122,0,0.12) 0%, transparent 70%)",
          animation:   "bookDrift1 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,69,0,0.10) 0%, transparent 70%)",
          animation:  "bookDrift2 10s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(255,122,0,0.05) 0%, transparent 70%)",
          animation:  "bookPulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,122,0,0.5) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,122,0,0.5) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
function BookScene({ products }: BookSceneProps) {
  const [cameraZ, setCameraZ]       = useState(5.0);
  const [canvasReady, setCanvasReady] = useState(false);

  // Inject keyframes (fixes broken style jsx)
  useBackgroundKeyframes();

  useEffect(() => {
    const update = () => setCameraZ(window.innerWidth > 800 ? 5.0 : 7.5);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // FIX #2 — Improved Canvas defer strategy.
  //
  // The old code used requestIdleCallback with a 2000 ms timeout.  On mobile
  // browsers the idle callback might never fire during a busy initial load,
  // causing the book to simply not appear until the user scrolled.
  //
  // New strategy:
  //   1. Use requestIdleCallback with a 500 ms timeout (shorter safety net).
  //   2. Fall back to a 200 ms setTimeout so the hero gets one render cycle
  //      before the WebGL context is created.
  //   3. The hero section is in its own Suspense boundary above in page.tsx,
  //      so by the time this component mounts the hero data is already resolved.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let id: number | ReturnType<typeof setTimeout>;

    if (typeof requestIdleCallback !== "undefined") {
      id = requestIdleCallback(() => setCanvasReady(true), { timeout: 500 });
    } else {
      id = setTimeout(() => setCanvasReady(true), 200);
    }

    return () => {
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as ReturnType<typeof setTimeout>);
      }
    };
  }, []);

  const builtPages  = products && products.length > 0 ? buildPagesFromProducts(products) : undefined;
  const productMeta = builtPages?.map((p) => (p as any).meta);

  return (
    <div className="relative w-full h-full">
      <BackgroundFX />

      {canvasReady ? (
        <Canvas
          shadows
          gl={{
            // FIX #3 — Only enable MSAA on low-DPI screens where it's cheap.
            // On Retina (dpr ≥ 2) the native super-sampling already provides
            // smooth edges; MSAA on top just doubles fill-rate for no gain.
            antialias: typeof window !== "undefined" && window.devicePixelRatio <= 1,
            toneMapping:     THREE.ACESFilmicToneMapping,
            powerPreference: "high-performance",
          }}
          // FIX #4 — Cap DPR at 2 (saves up to 3× fill on 3× screens).
          dpr={[1, 2]}
          camera={{ position: [0, 0.2, cameraZ], fov: 42 }}
          className="relative z-10"
        >
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#050505", 8, 20]} />
          <group position-y={0} scale={1}>
            <Suspense fallback={null}>
              <Experience products={products} customPages={builtPages} />
            </Suspense>
          </group>
        </Canvas>
      ) : (
        /* Lightweight placeholder while Canvas defers — prevents layout shift */
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050505]">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-2 border-[#FF7A00]/30 border-t-[#FF7A00]"
              /* FIX #5: animation name now matches keyframe injected by useBackgroundKeyframes */
              style={{ animation: "bookSpin 1s linear infinite" }}
            />
          </div>
        </div>
      )}

      {/* HUD UI overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <UI
            totalPages ={builtPages?.length ?? pages.length}
            productMeta={productMeta}
          />
        </div>
      </div>

      <Loader
        containerStyles={{
          position:       "absolute",
          inset:          0,
          zIndex:         40,
          background:     "rgba(5,5,5,0.92)",
          backdropFilter: "blur(8px)",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
        }}
        innerStyles={{ background: "#FF7A00", height: "2px", borderRadius: "1px" }}
        barStyles={{ background: "rgba(255,122,0,0.2)", height: "2px" }}
        dataStyles={{ color: "#FF7A00", fontSize: "12px", letterSpacing: "0.15em" }}
        dataInterpolation={(p) => `Loading… ${Math.round(p)}%`}
        initialState={() => true}
      />
    </div>
  );
}

export default BookScene;