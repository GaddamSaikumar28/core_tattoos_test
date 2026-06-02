"use client";
 
import React, { useState, useRef } from "react";
import Image from "next/image";
import { getDistance, getAngle } from "./touchHelpers";
 
interface InteractiveTattooProps {
  /** URL of the tattoo overlay image (product.media.arOverlayImage) */
  src: string;
}
 
const InteractiveTattoo = ({ src }: InteractiveTattooProps) => {
  // Current cumulative transform applied to the tattoo layer.
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, rotate: 0 });
  const [isDragging, setIsDragging] = useState(false);
 
  // Snapshot of pinch state captured at the start of a 2-finger gesture.
  const pinchRef = useRef({
    initialDist: 0,
    initialScale: 1,
    initialAngle: 0,
    initialRotate: 0,
  });
 
  // Snapshot of drag state captured at the start of a 1-finger gesture.
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
 
  // ── Touch Handlers ──────────────────────────────────────
 
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single finger — record starting position for drag.
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        initialX: transform.x,
        initialY: transform.y,
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      // Two fingers — record starting geometry for pinch/rotate.
      pinchRef.current = {
        initialDist: getDistance(e.touches),
        initialScale: transform.scale,
        initialAngle: getAngle(e.touches),
        initialRotate: transform.rotate,
      };
    }
  };
 
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      // Drag: offset from recorded start applied to initial position.
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setTransform((prev) => ({
        ...prev,
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      }));
    } else if (e.touches.length === 2) {
      // Pinch + rotate: deltas relative to recorded start state.
      const scaleDelta = getDistance(e.touches) / pinchRef.current.initialDist;
      const angleDelta = getAngle(e.touches) - pinchRef.current.initialAngle;
      setTransform((prev) => ({
        ...prev,
        scale: pinchRef.current.initialScale * scaleDelta,
        rotate: pinchRef.current.initialRotate + angleDelta,
      }));
    }
  };
 
  const onTouchEnd = () => setIsDragging(false);
 
  // ── Render ───────────────────────────────────────────────
 
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      <div
        className="pointer-events-auto touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
          transformOrigin: "center center",
        }}
      >
        <Image
          src={src}
          alt="AR Tattoo Overlay"
          width={350}
          height={350}
          draggable={false}
          className="w-auto h-auto max-w-[350px] opacity-90 mix-blend-multiply drop-shadow-2xl filter contrast-125"
        />
      </div>
    </div>
  );
};
 
export default InteractiveTattoo;
 