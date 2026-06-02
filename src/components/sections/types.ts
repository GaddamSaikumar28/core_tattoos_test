
import { FormattedProduct, Variant } from "@/src/lib/shopify";

// ─────────────────────────────────────────────────────────────────────────────
// CORE PRODUCT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface TattooProductDetailProps {
  product: FormattedProduct;
}

/**
 * Discriminated union tracking the active media preview panel.
 * Includes explicit support for 3D GLB/USDZ models, skin tone swatches,
 * standard gallery images, and directional angle view overrides.
 */
export type ViewState =
  | { type: "3d"; source: any }
  | { type: "skintone"; source: any }
  | { type: "gallery"; source: any; index: number }
  | { type: "angle"; source: any; index: number };

// ─────────────────────────────────────────────────────────────────────────────
// AR TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type BlendMode =
  | "normal"
  | "multiply"
  | "overlay"
  | "darken"
  | "screen"
  | "soft-light";

export type StylePreset = "Classic" | "Faded" | "Fresh" | "Watercolor" | "Neon";

export interface ARTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number; // Standardized name
  flipX: boolean;
  flipY: boolean;
}

export interface ARAppearance {
  opacity: number;
  blendMode: BlendMode;
  filter: string;
  brightness: number;
  contrast: number;
  hue: number;
  preset: StylePreset;
}

export interface ARState {
  transform: ARTransform;
  appearance: ARAppearance;
  rotationLocked: boolean;
  gridVisible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// AR CONFIGURATION CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_AR_TRANSFORM: ARTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  flipX: false,
  flipY: false,
};

export const DEFAULT_AR_APPEARANCE: ARAppearance = {
  opacity: 0.9,
  blendMode: "multiply",
  filter: "",
  brightness: 100,
  contrast: 125,
  hue: 0,
  preset: "Classic",
};

export const DEFAULT_AR_STATE: ARState = {
  transform: DEFAULT_AR_TRANSFORM,
  appearance: DEFAULT_AR_APPEARANCE,
  rotationLocked: false,
  gridVisible: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-MEDIA EXTENSION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AngleView {
  name: string;
  degree: number;
  imageUrl: string;
}

export interface SkinToneSwatch {
  hexCode: string;
  imageUrl: string;
}