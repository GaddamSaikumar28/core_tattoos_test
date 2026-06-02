"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlipHorizontal,
  FlipVertical,
  Lock,
  Unlock,
  Grid3x3,
  RotateCcw,
  Share2,
  Sliders,
  Layers,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  getDistance,
  getAngle,
  getMidpoint,
} from "./touchHelpers";
import {
  ARTransform,
  ARAppearance,
  ARState,
  BlendMode,
  StylePreset,
  DEFAULT_AR_TRANSFORM,
  DEFAULT_AR_APPEARANCE,
  DEFAULT_AR_STATE,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & PRESETS
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_PRESETS: Record<StylePreset, Partial<ARAppearance>> = {
  Classic:    { brightness: 100, contrast: 125, hue: 0,   opacity: 0.90 },
  Faded:      { brightness: 130, contrast:  75, hue: 5,   opacity: 0.65 },
  Fresh:      { brightness:  95, contrast: 145, hue: 0,   opacity: 0.95 },
  Watercolor: { brightness: 110, contrast:  80, hue: 15,  opacity: 0.70 },
  Neon:       { brightness: 120, contrast: 160, hue: 200, opacity: 0.85 },
};

const BLEND_MODES: { label: string; value: BlendMode }[] = [
  { label: "Multiply",   value: "multiply"   },
  { label: "Overlay",    value: "overlay"    },
  { label: "Darken",     value: "darken"     },
  { label: "Screen",     value: "screen"     },
  { label: "Soft Light", value: "soft-light" },
  { label: "Normal",     value: "normal"     },
];

const SIZE_PRESETS: { label: string; scale: number }[] = [
  { label: "XS",  scale: 0.4  },
  { label: "S",   scale: 0.65 },
  { label: "M",   scale: 1.0  },
  { label: "L",   scale: 1.35 },
  { label: "XL",  scale: 1.65 },
  { label: "XXL", scale: 2.0  },
];

type ToolbarTab = "style" | "blend" | "size";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface InteractiveTattooProps {
  /** URL of the tattoo overlay image (product.media.arOverlayImage) */
  src: string;
  /** The live camera <video> ref — used for canvas screenshot capture. */
  //videoRef?: React.RefObject<HTMLVideoElement>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const InteractiveTattoo = ({ src, videoRef }: InteractiveTattooProps) => {

  // ── AR State ──────────────────────────────────────────────
  const [arState, setArState] = useState<ARState>(DEFAULT_AR_STATE);

  // Convenient destructured aliases
  const { transform, appearance, rotationLocked, gridVisible } = arState;

  // ── Toolbar UI state ──────────────────────────────────────
  const [toolbarOpen, setToolbarOpen]   = useState(false);
  const [activeTab, setActiveTab]       = useState<ToolbarTab>("style");
  const [flashVisible, setFlashVisible] = useState(false);

  // ── Gesture tracking refs ─────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    active: false,
  });

  const pinchRef = useRef({
    initialDist: 0,
    initialScale: 1,
    initialAngle: 0,
    initialRotate: 0,
    active: false,
  });

  const doubleTapRef = useRef({
    lastTap: 0,
  });

  // ─────────────────────────────────────────────────────────
  // TRANSFORM HELPERS
  // ─────────────────────────────────────────────────────────

  const updateTransform = useCallback((patch: Partial<ARTransform>) => {
    setArState((prev) => ({
      ...prev,
      transform: { ...prev.transform, ...patch },
    }));
  }, []);

  const updateAppearance = useCallback((patch: Partial<ARAppearance>) => {
    setArState((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, ...patch },
    }));
  }, []);

  const applyPreset = useCallback((preset: StylePreset) => {
    const values = STYLE_PRESETS[preset];
    setArState((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, ...values, preset },
    }));
  }, []);

  const resetAll = useCallback(() => {
    setArState(DEFAULT_AR_STATE);
  }, []);

  // ─────────────────────────────────────────────────────────
  // COMPUTED CSS VALUES
  // ─────────────────────────────────────────────────────────

  const cssFilter = `
    brightness(${appearance.brightness}%)
    contrast(${appearance.contrast}%)
    hue-rotate(${appearance.hue}deg)
  `.trim();

  const cssTransform = `
    translate3d(${transform.x}px, ${transform.y}px, 0)
    scale(${transform.scale * (transform.flipX ? -1 : 1)}, ${transform.scale * (transform.flipY ? -1 : 1)})
    rotate(${transform.rotation}deg)
  `.trim();

  // ─────────────────────────────────────────────────────────
  // TOUCH HANDLERS
  // ─────────────────────────────────────────────────────────

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        // Double-tap detection
        const now = Date.now();
        if (now - doubleTapRef.current.lastTap < 300) {
          resetAll();
          doubleTapRef.current.lastTap = 0;
          return;
        }
        doubleTapRef.current.lastTap = now;

        // Single-finger drag setup
        dragRef.current = {
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          initialX: arState.transform.x,
          initialY: arState.transform.y,
          active: true,
        };
        pinchRef.current.active = false;
      } else if (e.touches.length === 2) {
        // Two-finger pinch/rotate setup
        dragRef.current.active = false;
        pinchRef.current = {
          initialDist: getDistance(e.touches),
          initialScale: arState.transform.scale,
          initialAngle: getAngle(e.touches),
          initialRotate: arState.transform.rotation,
          active: true,
        };
      }
    },
    [arState.transform, resetAll],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      // Prevent scrolling while manipulating the tattoo
      if (dragRef.current.active || pinchRef.current.active) {
        e.preventDefault(); 
      }

      if (e.touches.length === 1 && dragRef.current.active) {
        const dx = e.touches[0].clientX - dragRef.current.startX;
        const dy = e.touches[0].clientY - dragRef.current.startY;
        updateTransform({
          x: dragRef.current.initialX + dx,
          y: dragRef.current.initialY + dy,
        });
      } else if (e.touches.length === 2 && pinchRef.current.active) {
        const scaleDelta =
          getDistance(e.touches) / (pinchRef.current.initialDist || 1);
        const newScale = Math.max(
          0.2,
          Math.min(5, pinchRef.current.initialScale * scaleDelta),
        );

        const angleDelta = getAngle(e.touches) - pinchRef.current.initialAngle;

        updateTransform({
          scale: newScale,
          ...(rotationLocked
            ? {}
            : { rotation: pinchRef.current.initialRotate + angleDelta }),
        });
      }
    },
    [updateTransform, rotationLocked],
  );

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      dragRef.current.active  = false;
      pinchRef.current.active = false;
    }
  }, []);

  // ─────────────────────────────────────────────────────────
  // SCREENSHOT (canvas composite)
  // ─────────────────────────────────────────────────────────

  const handleScreenshot = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const video = videoRef?.current;
    const rect  = container.getBoundingClientRect();
    const w     = rect.width;
    const h     = rect.height;

    const canvas  = document.createElement("canvas");
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw the camera feed as the background
    if (video) {
      ctx.drawImage(video, 0, 0, w, h);
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Load and composite the tattoo overlay
    try {
      const img     = document.createElement("img") as HTMLImageElement;
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload  = () => resolve();
        img.onerror = reject;
        img.src     = src;
      });

      // Compute proportional aspect ratio bounding within 350px
      const imgAspect = img.naturalWidth / (img.naturalHeight || 1);
      let baseW = 350;
      let baseH = 350;
      if (imgAspect > 1) {
        baseH = 350 / imgAspect;
      } else {
        baseW = 350 * imgAspect;
      }

      const overlayW = baseW * transform.scale;
      const overlayH = baseH * transform.scale;
      const cx       = w / 2 + transform.x;
      const cy       = h / 2 + transform.y;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
      ctx.globalAlpha              = appearance.opacity;
      ctx.globalCompositeOperation = blendModeToCompositeOp(appearance.blendMode);
      ctx.filter = cssFilter;
      ctx.drawImage(img, -overlayW / 2, -overlayH / 2, overlayW, overlayH);
      ctx.restore();
    } catch {
      // If overlay fails, we still save the camera frame
    }

    // 3. Flash animation
    setFlashVisible(true);
    setTimeout(() => setFlashVisible(false), 350);

    // 4. Download / share
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "tattoo-try-on.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My Tattoo Try-On" });
          return;
        } catch {
          // User cancelled or share failed — fall through to download
        }
      }

      // Fallback: trigger a download
      const url = URL.createObjectURL(blob);
      const a   = document.createElement("a");
      a.href     = url;
      a.download = "tattoo-try-on.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [
    videoRef,
    src,
    transform,
    appearance,
    cssFilter,
  ]);

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">

      {/* ── TATTOO OVERLAY ─────────────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ touchAction: "none" }}
      >
        <div
          className="pointer-events-auto touch-none select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transform: cssTransform,
            transformOrigin: "center center",
            opacity: appearance.opacity,
            mixBlendMode: appearance.blendMode,
            filter: cssFilter,
            willChange: "transform",
          }}
        >
          <Image
            src={src}
            alt="AR Tattoo Overlay"
            width={350}
            height={350}
            draggable={false}
            className="w-auto h-auto max-w-[350px] drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* ── GRID OVERLAY ───────────────────────────────────── */}
      <AnimatePresence>
        {gridVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />
            {/* Horizontal center line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />
            {/* Rule-of-thirds verticals */}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
            {/* Rule-of-thirds horizontals */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10" />
            {/* Center crosshair */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border-2 border-[#fe8204]/60 rounded-full" />
              <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-[#fe8204] rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCREENSHOT FLASH ───────────────────────────────── */}
      <AnimatePresence>
        {flashVisible && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ── BOTTOM TOOLBAR ─────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <AnimatePresence initial={false}>
          {toolbarOpen && (
            <motion.div
              key="toolbar-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden bg-black/85 backdrop-blur-xl border-t border-white/[0.08]"
            >
              {/* ── TAB BAR ─────────────────────────────────── */}
              <div className="flex border-b border-white/[0.08]">
                {(["style", "blend", "size"] as ToolbarTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${
                      activeTab === tab
                        ? "text-[#fe8204] border-b-2 border-[#fe8204]"
                        : "text-neutral-500 hover:text-neutral-300"
                    }`}
                  >
                    {tab === "style" && <Sliders className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                    {tab === "blend" && <Layers className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                    {tab === "size"  && <Maximize2 className="w-3 h-3 inline mr-1.5 -mt-0.5" />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* ── TAB CONTENT ────────────────────────────── */}
              <div className="p-4">

                {/* STYLE TAB */}
                {activeTab === "style" && (
                  <div className="space-y-4">
                    {/* Style presets */}
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">
                        Preset
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {(Object.keys(STYLE_PRESETS) as StylePreset[]).map((preset) => (
                          <button
                            key={preset}
                            onClick={() => applyPreset(preset)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                              appearance.preset === preset
                                ? "bg-[#fe8204] text-black shadow-[0_0_12px_rgba(254,130,4,0.4)]"
                                : "bg-white/[0.06] text-neutral-400 hover:bg-white/10 hover:text-white border border-white/[0.08]"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brightness */}
                    <SliderRow
                      label="Brightness"
                      value={appearance.brightness}
                      min={50}
                      max={200}
                      onChange={(v) => updateAppearance({ brightness: v })}
                    />

                    {/* Contrast */}
                    <SliderRow
                      label="Contrast"
                      value={appearance.contrast}
                      min={50}
                      max={200}
                      onChange={(v) => updateAppearance({ contrast: v })}
                    />

                    {/* Tint (hue-rotate) */}
                    <SliderRow
                      label="Tint"
                      value={appearance.hue}
                      min={0}
                      max={360}
                      onChange={(v) => updateAppearance({ hue: v })}
                    />
                  </div>
                )}

                {/* BLEND TAB */}
                {activeTab === "blend" && (
                  <div className="grid grid-cols-3 gap-2">
                    {BLEND_MODES.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => updateAppearance({ blendMode: value })}
                        className={`relative py-2.5 px-2 rounded-xl text-[11px] font-bold text-center transition-all border ${
                          appearance.blendMode === value
                            ? "bg-[#fe8204]/15 border-[#fe8204]/60 text-[#fe8204]"
                            : "bg-white/[0.04] border-white/[0.06] text-neutral-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {appearance.blendMode === value && (
                          <span className="absolute top-1 right-1">
                            <Check className="w-2.5 h-2.5 text-[#fe8204]" />
                          </span>
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* SIZE TAB */}
                {activeTab === "size" && (
                  <div className="space-y-4">
                    {/* Size presets */}
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">
                        Preset Size
                      </p>
                      <div className="flex gap-2">
                        {SIZE_PRESETS.map(({ label, scale }) => (
                          <button
                            key={label}
                            onClick={() => updateTransform({ scale })}
                            className={`flex-1 py-2 rounded-lg text-[11px] font-black transition-all ${
                              Math.abs(transform.scale - scale) < 0.01
                                ? "bg-[#fe8204] text-black"
                                : "bg-white/[0.06] text-neutral-400 hover:bg-white/10 hover:text-white border border-white/[0.08]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fine scale slider */}
                    <SliderRow
                      label="Scale"
                      value={Math.round(transform.scale * 100)}
                      min={20}
                      max={500}
                      onChange={(v) => updateTransform({ scale: v / 100 })}
                      displayValue={`${Math.round(transform.scale * 100)}%`}
                    />

                    {/* Fine rotation slider */}
                    <SliderRow
                      label="Rotation"
                      value={transform.rotation}
                      min={-180}
                      max={180}
                      onChange={(v) => updateTransform({ rotation: v })}
                      displayValue={`${Math.round(transform.rotation)}°`}
                      disabled={rotationLocked}
                    />
                  </div>
                )}
              </div>

              {/* ── OPACITY (always visible) ───────────────── */}
              <div className="px-4 pb-3 border-t border-white/[0.06] pt-3">
                <SliderRow
                  label="Opacity"
                  value={Math.round(appearance.opacity * 100)}
                  min={10}
                  max={100}
                  onChange={(v) => updateAppearance({ opacity: v / 100 })}
                  displayValue={`${Math.round(appearance.opacity * 100)}%`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── QUICK ACTIONS ROW ───────────────────────────── */}
        <div className="bg-black/85 backdrop-blur-xl border-t border-white/[0.08] px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Quick action buttons */}
            <div className="flex items-center gap-1">
              <QuickActionBtn
                icon={<FlipHorizontal className="w-4 h-4" />}
                label="Flip H"
                onClick={() => updateTransform({ flipX: !transform.flipX })}
                active={transform.flipX}
              />
              <QuickActionBtn
                icon={<FlipVertical className="w-4 h-4" />}
                label="Flip V"
                onClick={() => updateTransform({ flipY: !transform.flipY })}
                active={transform.flipY}
              />
              <QuickActionBtn
                icon={rotationLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                label="Lock"
                onClick={() =>
                  setArState((prev) => ({ ...prev, rotationLocked: !prev.rotationLocked }))
                }
                active={rotationLocked}
              />
              <QuickActionBtn
                icon={<Grid3x3 className="w-4 h-4" />}
                label="Grid"
                onClick={() =>
                  setArState((prev) => ({ ...prev, gridVisible: !prev.gridVisible }))
                }
                active={gridVisible}
              />
              <QuickActionBtn
                icon={<RotateCcw className="w-4 h-4" />}
                label="Reset"
                onClick={resetAll}
              />
              <QuickActionBtn
                icon={<Share2 className="w-4 h-4" />}
                label="Save"
                onClick={handleScreenshot}
                highlight
              />
            </div>

            {/* Toolbar drag-handle / collapse toggle */}
            <button
              onClick={() => setToolbarOpen((o) => !o)}
              className="flex flex-col items-center gap-0.5 p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 transition-colors ml-2"
            >
              {toolbarOpen
                ? <ChevronDown className="w-4 h-4 text-neutral-400" />
                : <ChevronUp   className="w-4 h-4 text-neutral-400" />
              }
              <span className="text-[8px] font-black uppercase tracking-wider text-neutral-600">
                {toolbarOpen ? "Hide" : "Edit"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface QuickActionBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  highlight?: boolean;
}

const QuickActionBtn = ({ icon, label, onClick, active, highlight }: QuickActionBtnProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200 ${
      highlight
        ? "bg-[#fe8204]/15 text-[#fe8204] hover:bg-[#fe8204]/25 border border-[#fe8204]/30"
        : active
        ? "bg-[#fe8204]/15 text-[#fe8204] border border-[#fe8204]/30"
        : "bg-white/[0.04] text-neutral-400 hover:bg-white/10 hover:text-white border border-transparent"
    }`}
  >
    {icon}
    <span className="text-[7px] font-black uppercase tracking-wider leading-none">
      {label}
    </span>
  </button>
);

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  displayValue?: string;
  disabled?: boolean;
}

const SliderRow = ({
  label,
  value,
  min,
  max,
  onChange,
  displayValue,
  disabled,
}: SliderRowProps) => (
  <div className={disabled ? "opacity-40 pointer-events-none" : ""}>
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
        {label}
      </span>
      <span className="text-[10px] font-bold text-[#fe8204] tabular-nums">
        {displayValue ?? value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={[
        "w-full h-1 appearance-none rounded-full outline-none cursor-pointer",
        "bg-white/10",
        // Webkit thumb
        "[&::-webkit-slider-thumb]:appearance-none",
        "[&::-webkit-slider-thumb]:w-4",
        "[&::-webkit-slider-thumb]:h-4",
        "[&::-webkit-slider-thumb]:rounded-full",
        "[&::-webkit-slider-thumb]:bg-[#fe8204]",
        "[&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(254,130,4,0.4)]",
        // Moz thumb
        "[&::-moz-range-thumb]:w-4",
        "[&::-moz-range-thumb]:h-4",
        "[&::-moz-range-thumb]:rounded-full",
        "[&::-moz-range-thumb]:bg-[#fe8204]",
        "[&::-moz-range-thumb]:border-0",
      ].join(" ")}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps a CSS mix-blend-mode string to the closest Canvas globalCompositeOperation.
 * Used when compositing the tattoo onto the screenshot canvas.
 */
function blendModeToCompositeOp(mode: BlendMode): GlobalCompositeOperation {
  const map: Record<BlendMode, GlobalCompositeOperation> = {
    multiply:   "multiply",
    overlay:    "overlay",
    darken:     "darken",
    screen:     "screen",
    "soft-light": "soft-light",
    normal:     "source-over",
  };
  return map[mode] ?? "source-over";
}

export default InteractiveTattoo;