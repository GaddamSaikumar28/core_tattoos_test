import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TOUCH GEOMETRY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the Euclidean distance between two touch points.
 * Fully compatible with both native DOM and React TouchLists.
 */
export const getDistance = (touches: TouchList | React.TouchList): number => {
  if (!touches || touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Returns the angle (degrees) of the line connecting two touch points.
 * Used to compute precise multi-finger rotation streams.
 */
export const getAngle = (touches: TouchList | React.TouchList): number => {
  if (!touches || touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

/**
 * Returns the midpoint between two touch points.
 */
export const getMidpoint = (touches: TouchList | React.TouchList): { x: number; y: number } => {
  if (!touches || touches.length < 2) return { x: 0, y: 0 };
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
};

/**
 * Returns the midpoint of a touch gesture relative to a target element's bounding box.
 */
export const getMidpointRelative = (
  touches: TouchList | React.TouchList,
  rect: DOMRect,
): { x: number; y: number } => {
  const mid = getMidpoint(touches);
  return {
    x: mid.x - rect.left,
    y: mid.y - rect.top,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// COLOR LUMINANCE VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a hex color string (#rrggbb or #rgb) to an { r, g, b } object.
 * Returns absolute black if format processing fails.
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const sanitized = hex.replace(/^#/, "");

  const full =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((c) => c + c)
          .join("")
      : sanitized;

  const num = parseInt(full, 16);

  if (isNaN(num) || full.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

/**
 * Computes the perceived luminance of a hex color using ITU-R BT.601 rules:
 * L = 0.299·R + 0.587·G + 0.114·B (Normalized between 0 and 1)
 */
export const getHexLuminance = (hex: string): number => {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};