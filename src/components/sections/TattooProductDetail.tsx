// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import {
//   Plus,
//   Minus,
//   ZoomIn,
//   X,
//   Star,
//   Droplets,
//   ChevronDown,
//   ShieldCheck,
//   Loader2,
//   Clock,
//   Sparkles,
//   ShoppingBag,
//   AlertCircle,
//   Camera,
//   Box,
// } from "lucide-react";
// import clsx from "clsx";
// import { toast } from "sonner";
// import { useCart } from "@/src/context/CartContext";
// import { FormattedProduct, Variant } from "@/src/lib/shopify";

// // Bypass React's strict custom element checks for Model Viewer
// const ModelViewer = "model-viewer" as any;

// interface TattooProductDetailProps {
//   product: FormattedProduct;
// }

// const getDistance = (touches: React.TouchList) => {
//   const dx = touches[0].clientX - touches[1].clientX;
//   const dy = touches[0].clientY - touches[1].clientY;
//   return Math.sqrt(dx * dx + dy * dy);
// };

// const getAngle = (touches: React.TouchList) => {
//   const dx = touches[0].clientX - touches[1].clientX;
//   const dy = touches[0].clientY - touches[1].clientY;
//   return Math.atan2(dy, dx) * (180 / Math.PI);
// };

// // =========================================================
// // INTERACTIVE AR OVERLAY COMPONENT
// // =========================================================
// const InteractiveTattoo = ({ src }: { src: string }) => {
//   const [transform, setTransform] = useState({
//     x: 0,
//     y: 0,
//     scale: 1,
//     rotate: 0,
//   });
//   const [isDragging, setIsDragging] = useState(false);

//   const pinchRef = useRef({
//     initialDist: 0,
//     initialScale: 1,
//     initialAngle: 0,
//     initialRotate: 0,
//   });
//   const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

//   const onTouchStart = (e: React.TouchEvent) => {
//     if (e.touches.length === 1) {
//       dragRef.current = {
//         startX: e.touches[0].clientX,
//         startY: e.touches[0].clientY,
//         initialX: transform.x,
//         initialY: transform.y,
//       };
//       setIsDragging(true);
//     } else if (e.touches.length === 2) {
//       pinchRef.current = {
//         initialDist: getDistance(e.touches),
//         initialScale: transform.scale,
//         initialAngle: getAngle(e.touches),
//         initialRotate: transform.rotate,
//       };
//     }
//   };

//   const onTouchMove = (e: React.TouchEvent) => {
//     if (e.touches.length === 1 && isDragging) {
//       const dx = e.touches[0].clientX - dragRef.current.startX;
//       const dy = e.touches[0].clientY - dragRef.current.startY;
//       setTransform((prev) => ({
//         ...prev,
//         x: dragRef.current.initialX + dx,
//         y: dragRef.current.initialY + dy,
//       }));
//     } else if (e.touches.length === 2) {
//       const currentDist = getDistance(e.touches);
//       const currentAngle = getAngle(e.touches);

//       const scaleDelta = currentDist / pinchRef.current.initialDist;
//       const angleDelta = currentAngle - pinchRef.current.initialAngle;

//       setTransform((prev) => ({
//         ...prev,
//         scale: pinchRef.current.initialScale * scaleDelta,
//         rotate: pinchRef.current.initialRotate + angleDelta,
//       }));
//     }
//   };

//   const onTouchEnd = () => setIsDragging(false);

//   return (
//     <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
//       <div
//         className="pointer-events-auto touch-none"
//         onTouchStart={onTouchStart}
//         onTouchMove={onTouchMove}
//         onTouchEnd={onTouchEnd}
//         style={{
//           transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
//           transformOrigin: "center center",
//         }}
//       >
//         <Image
//           src={src}
//           alt="AR Tattoo Overlay"
//           width={350}
//           height={350}
//           draggable={false}
//           className="w-auto h-auto max-w-[350px] opacity-90 mix-blend-multiply drop-shadow-2xl filter contrast-125"
//         />
//       </div>
//     </div>
//   );
// };

// type ViewState =
//   | { type: "3d"; source: any }
//   | { type: "skintone"; source: any }
//   | { type: "gallery"; source: any; index: number };

// export default function TattooProductDetail({
//   product,
// }: TattooProductDetailProps) {
//   const { addToCart, buyNow } = useCart();

//   // =========================================================
//   // DATA PARSING & MEDIA HIERARCHY
//   // =========================================================
//   const models = product.media?.models || [];
//   const swatches = product.skinToneSwatches || [];
//   const rawGallery = product.media?.gallery || [];
//   const featuredUrl = product.media?.featuredImage;

//   // Filter out swatches and the featured image from standard gallery to prevent duplicates
//   const swatchUrls = swatches.map((s: any) => s.imageUrl);
//   const filteredGallery = rawGallery.filter(
//     (img: any) => img.url !== featuredUrl && !swatchUrls.includes(img.url),
//   );

//   const standardImages = [
//     ...(featuredUrl ? [{ url: featuredUrl, altText: product.title }] : []),
//     ...filteredGallery,
//   ];
//   const toggleAccordion = (id: string) => {
//     setActiveAccordion((prev) => (prev === id ? null : id));
//   };

//   // Determine Default Media View on Load
//   const getInitialViewState = (): ViewState => {
//     if (models.length > 0) return { type: "3d", source: models[0] };
//     if (swatches.length > 0) return { type: "skintone", source: swatches[0] };
//     if (standardImages.length > 0)
//       return { type: "gallery", source: standardImages[0], index: 0 };
//     return { type: "gallery", source: { url: "/placeholder.png" }, index: 0 };
//   };

//   // =========================================================
//   // UI & STATE MANAGEMENT
//   // =========================================================
//   const [isMounted, setIsMounted] = useState(false);
//   const [viewState, setViewState] = useState<ViewState>(getInitialViewState());
//   const [activeSkinTone, setActiveSkinTone] = useState<string | null>(
//     swatches[0]?.hexCode || null,
//   );

//   const [isZoomed, setIsZoomed] = useState(false);
//   const [activeAccordion, setActiveAccordion] = useState<string | null>(
//     "description",
//   );

//   // 3D & AR States
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [arSupported, setArSupported] = useState(false);
//   const [isCameraAROpen, setIsCameraAROpen] = useState(false);
//   const modelViewerRef = useRef<HTMLElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   // Cart & Variant States
//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);
//   const [isBuyingNow, setIsBuyingNow] = useState(false);

//   const variants = product.allVariants || [];
//   const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
//     variants.find((v) => v.availableForSale) || variants[0] || null,
//   );

//   const price = selectedVariant
//     ? Number(selectedVariant.price)
//     : product.checkout.price;
//   const compareAtPrice = selectedVariant?.compareAtPrice
//     ? Number(selectedVariant.compareAtPrice)
//     : product.checkout.compareAtPrice;
//   const isOnSale = compareAtPrice && compareAtPrice > price;
//   //const discount = product.checkout.discountPercentage || (isOnSale ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0);
//   const discount =
//     product.checkout.discountPercentage ||
//     (isOnSale && compareAtPrice > 0
//       ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
//       : 0);
//   // =========================================================
//   // EFFECTS
//   // =========================================================
//   useEffect(() => {
//     setIsMounted(true);

//     // Load model-viewer dynamically
//     if (models.length > 0) {
//       import("@google/model-viewer").then(() => {
//         customElements.whenDefined("model-viewer").then(() => {
//           const mv = modelViewerRef.current as any;
//           if (mv) {
//             mv.addEventListener("load", () => setModelLoaded(true));
//             if (typeof mv.canActivateAR !== "undefined") {
//               setArSupported(mv.canActivateAR);
//             }
//           }
//         });
//       });
//     }
//   }, [models]);

//   // Lock body scroll when Modals are open
//   useEffect(() => {
//     if (isZoomed || isCameraAROpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isZoomed, isCameraAROpen]);

//   useEffect(() => {
//     let activeStream: MediaStream | null = null;

//     const startCamera = async () => {
//       if (!isCameraAROpen || !videoRef.current) return;

//       // Guard against unsupported browsers or insecure HTTP environments
//       if (!navigator?.mediaDevices?.getUserMedia) {
//         toast.error("Camera access requires a secure connection (HTTPS).");
//         setIsCameraAROpen(false);
//         return;
//       }

//       try {
//         activeStream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: "environment" },
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = activeStream;
//         }
//       } catch (err) {
//         console.error("Camera access denied or failed:", err);
//         toast.error("Unable to access camera. Please check permissions.");
//         setIsCameraAROpen(false);
//       }
//     };

//     startCamera();

//     return () => {
//       // Use the local stream reference to guarantee tracks stop even if the DOM element unmounted
//       if (activeStream) {
//         activeStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [isCameraAROpen]);

//   // =========================================================
//   // HANDLERS
//   // =========================================================
//   const handleQuantityChange = (type: "increase" | "decrease") => {
//     setQuantity((prev) =>
//       type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1,
//     );
//   };

//   const handleAddToCart = async () => {
//     if (!selectedVariant?.variantId)
//       return toast.error("Please select an option");
//     setIsAdding(true);
//     try {
//       await addToCart(selectedVariant.variantId, quantity);
//       toast.success("Added to cart");
//     } catch (error) {
//       toast.error("Failed to add to cart");
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleBuyNow = async () => {
//     if (!selectedVariant?.variantId)
//       return toast.error("Please select an option");
//     setIsBuyingNow(true);
//     try {
//       const checkoutUrl = await buyNow(selectedVariant.variantId, quantity);
//       if (checkoutUrl) window.location.href = checkoutUrl;
//     } finally {
//       setIsBuyingNow(false);
//     }
//   };

//   // const handleTriggerAR = () => {
//   //   if (viewState.type === '3d') {
//   //     const mv = modelViewerRef.current as any;
//   //     if (mv?.canActivateAR) {
//   //       mv.activateAR();
//   //     } else {
//   //       toast.error("3D AR is not supported on this device.");
//   //     }
//   //   } else {
//   //     // 2D Camera AR Fallback
//   //     setIsCameraAROpen(true);
//   //   }
//   // };
//   const handleTriggerAR = () => {
//     if (viewState.type === "3d") {
//       const mv = modelViewerRef.current as any;
//       if (mv?.canActivateAR) {
//         mv.activateAR();
//       } else {
//         toast.error("3D AR is not supported on this device.");
//       }
//     } else {
//       // 2D Camera AR Fallback - Check for the transparent AR image
//       if (product.media?.arOverlayImage) {
//         setIsCameraAROpen(true);
//       } else {
//         toast.info("Stay tuned! AR Try-On for this product is coming soon.", {
//           position: "bottom-center",
//           duration: 4000,
//           style: {
//             background: "#27272a",
//             color: "#fff",
//             border: "1px solid rgba(255,255,255,0.1)",
//           },
//         });
//       }
//     }
//   };

//   // Build the dynamic thumbnail array
//   // const thumbnails = [];
//   // if (models.length > 0) {
//   //   thumbnails.push({ type: '3d', thumbUrl: standardImages[0]?.url, source: models[0] });
//   // }
//   // if (swatches.length > 0) {
//   //   const activeSwatch = swatches.find((s: any) => s.hexCode === activeSkinTone) || swatches[0];
//   //   thumbnails.push({ type: 'skintone', thumbUrl: activeSwatch.imageUrl, source: activeSwatch });
//   // }
//   // standardImages.forEach((img, index) => {
//   //   thumbnails.push({ type: 'gallery', thumbUrl: img.url, source: img, index });
//   // });
//   const thumbnails = [];
//   if (models.length > 0) {
//     // FIXED: Added a fallback placeholder string if standardImages[0] doesn't exist yet
//     thumbnails.push({
//       type: "3d",
//       thumbUrl: standardImages[0]?.url || "/placeholder.png",
//       source: models[0],
//     });
//   }
//   if (swatches.length > 0) {
//     const activeSwatch =
//       swatches.find((s: any) => s.hexCode === activeSkinTone) || swatches[0];
//     thumbnails.push({
//       type: "skintone",
//       thumbUrl: activeSwatch.imageUrl,
//       source: activeSwatch,
//     });
//   }
//   standardImages.forEach((img, index) => {
//     thumbnails.push({
//       type: "gallery",
//       thumbUrl: img.url || "/placeholder.png",
//       source: img,
//       index,
//     });
//   });

//   if (!isMounted) return null;

//   return (
//     // Updated container: Dark mode background, massive top padding for transparent headers
//     <div className="bg-[#0a0a0a] min-h-screen pt-[140px] lg:pt-[160px] pb-20 selection:bg-[#fe8204] selection:text-white font-sans">
//       <div className="container max-w-[1400px] mx-auto px-4">
//         {/* BREADCRUMBS */}
//         <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 lg:mb-8">
//           <a href="/" className="hover:text-white transition-colors">
//             Home
//           </a>
//           <span>/</span>
//           <a
//             href="/collections/"
//             className="hover:text-white transition-colors"
//           >
//             Shop ALL
//           </a>
//           <span>/</span>
//           <span className="text-white truncate max-w-[150px] sm:max-w-none">
//             {product.title}
//           </span>
//         </nav>

//         <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 xl:gap-16 items-start">
//           {/* ========================================================= */}
//           {/* LEFT: DYNAMIC MEDIA VIEWER                                */}
//           {/* ========================================================= */}
//           <div className="flex flex-col gap-6 lg:sticky lg:top-32">
//             {/* Main Canvas */}
//             <div className="relative w-full aspect-square md:aspect-[4/3] max-h-[600px] rounded-2xl bg-[#111] border border-white/10 overflow-hidden flex items-center justify-center group shadow-2xl">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={
//                     viewState.type +
//                     (viewState.type === "gallery" ? viewState.index : "")
//                   }
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative w-full h-full"
//                 >
//                   {/* 3D Model Render */}
//                   {viewState.type === "3d" && (
//                     <div className="w-full h-full p-6">
//                       {!modelLoaded && (
//                         <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#111]">
//                           <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
//                         </div>
//                       )}
//                       <ModelViewer
//                         ref={modelViewerRef}
//                         src={
//                           viewState.source.sources?.find(
//                             (s: any) => s.format === "glb",
//                           )?.url
//                         }
//                         ios-src={
//                           viewState.source.sources?.find(
//                             (s: any) => s.format === "usdz",
//                           )?.url
//                         }
//                         alt="3D product model"
//                         ar="true"
//                         ar-modes="webxr scene-viewer quick-look"
//                         camera-controls="true"
//                         auto-rotate="true"
//                         rotation-per-second="30deg"
//                         shadow-intensity="1"
//                         environment-image="neutral"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           backgroundColor: "transparent",
//                         }}
//                       >
//                         <button slot="ar-button" className="hidden">
//                           AR
//                         </button>
//                       </ModelViewer>
//                     </div>
//                   )}

//                   {/* 2D Image Render (Skin Tones & Gallery) */}
//                   {(viewState.type === "skintone" ||
//                     viewState.type === "gallery") && (
//                     <div className="w-full h-full p-6 md:p-8">
//                       <Image
//                         src={
//                           viewState.type === "skintone"
//                             ? viewState.source.imageUrl
//                             : viewState.source.url
//                         }
//                         alt={product.title}
//                         fill
//                         priority={true}
//                         className="object-contain"
//                         sizes="(max-width: 768px) 100vw, 50vw"
//                       />
//                     </div>
//                   )}
//                 </motion.div>
//               </AnimatePresence>

//               {/* Badges Overlay */}
//               <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
//                 {product.styling?.badges
//                   ?.filter(Boolean)
//                   .map((badge: any, i: number) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black rounded-md shadow-sm"
//                       style={{ backgroundColor: badge.color || "#fff" }}
//                     >
//                       {badge.label}
//                     </span>
//                   ))}
//               </div>

//               {/* Action Buttons Overlay (Zoom & AR Try On) */}
//               <div className="absolute bottom-4 right-4 flex gap-3 z-10">
//                 <button
//                   onClick={handleTriggerAR}
//                   className="px-4 py-3 bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 text-white transition-all duration-300"
//                 >
//                   <Camera className="w-4 h-4" />
//                   <span className="text-xs font-bold uppercase tracking-widest">
//                     {viewState.type === "3d" ? "AR View" : "Try On"}
//                   </span>
//                 </button>
//                 {(viewState.type === "skintone" ||
//                   viewState.type === "gallery") && (
//                   <button
//                     onClick={() => setIsZoomed(true)}
//                     className="w-11 h-11 bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
//                     aria-label="Zoom image"
//                   >
//                     <ZoomIn className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Skin Tone Selection Bar (Only shows if swatches exist) */}
//             {swatches.length > 0 && (
//               <div className="flex flex-col items-center justify-center -mt-2">
//                 <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
//                   Preview on your skin tone
//                 </span>
//                 <div className="flex items-center gap-2 bg-white/5 p-2 rounded-full border border-white/10 shadow-lg">
//                   {swatches.map((swatch: any) => (
//                     <button
//                       key={swatch.hexCode}
//                       onClick={() => {
//                         setActiveSkinTone(swatch.hexCode);
//                         setViewState({ type: "skintone", source: swatch });
//                       }}
//                       className={clsx(
//                         "w-8 h-8 rounded-full border-2 transition-all duration-300",
//                         activeSkinTone === swatch.hexCode
//                           ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
//                           : "border-transparent hover:scale-105",
//                       )}
//                       style={{ backgroundColor: swatch.hexCode }}
//                       aria-label={`Select skin tone`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Thumbnails */}
//             {thumbnails.length > 1 && (
//               <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar pb-2 pt-2">
//                 {thumbnails.map((thumb: any, idx: number) => {
//                   const isActive =
//                     (thumb.type === "3d" && viewState.type === "3d") ||
//                     (thumb.type === "skintone" &&
//                       viewState.type === "skintone") ||
//                     (thumb.type === "gallery" &&
//                       viewState.type === "gallery" &&
//                       viewState.index === thumb.index);

//                   return (
//                     <button
//                       key={idx}
//                       onClick={() =>
//                         setViewState(
//                           thumb.type === "gallery"
//                             ? {
//                                 type: "gallery",
//                                 source: thumb.source,
//                                 index: thumb.index,
//                               }
//                             : { type: thumb.type as any, source: thumb.source },
//                         )
//                       }
//                       className={clsx(
//                         "relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#111] border-2 transition-all duration-300",
//                         isActive
//                           ? "border-[#fe8204]"
//                           : "border-white/10 hover:border-white/30",
//                       )}
//                     >
//                       {thumb.type === "3d" && (
//                         <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
//                           <Box className="w-6 h-6 text-white" />
//                         </div>
//                       )}
//                       <Image
//                         src={thumb.thumbUrl || "/placeholder.png"}
//                         alt="Thumbnail"
//                         fill
//                         className="object-contain p-2"
//                         sizes="80px"
//                       />
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* ========================================================= */}
//           {/* RIGHT: PRODUCT INFO (Dark Mode)                           */}
//           {/* ========================================================= */}
//           <div className="flex flex-col py-2">
//             <div className="mb-6">
//               <div className="flex items-center gap-2 mb-3 flex-wrap">
//                 <span className="text-[10px] font-black text-[#fe8204] uppercase tracking-widest bg-[#fe8204]/10 px-2.5 py-1 rounded-md">
//                   {product.vendor}
//                 </span>
//                 {product.styling?.tattooColorType && (
//                   <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">
//                     {product.styling.tattooColorType}
//                   </span>
//                 )}
//               </div>

//               <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.1] mb-4">
//                 {product.title}
//               </h1>

//               <div className="flex flex-wrap items-center gap-4">
//                 <div className="flex items-center gap-1 text-[#fe8204]">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-current" />
//                   ))}
//                 </div>
//                 <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest pt-0.5">
//                   4.9 (120 Reviews)
//                 </p>
//               </div>
//             </div>

//             {/* Price & Inventory */}
//             <div className="mb-8 border-b border-white/10 pb-8">
//               <div className="flex items-end gap-4 mb-2">
//                 <span className="text-3xl font-black text-white tracking-tight">
//                   ${price.toFixed(2)}
//                 </span>
//                 {isOnSale && (
//                   <>
//                     <span className="text-xl font-bold text-neutral-500 line-through mb-0.5">
//                       ${compareAtPrice.toFixed(2)}
//                     </span>
//                     <span className="bg-red-500/20 text-red-400 px-2.5 py-1 text-xs font-black uppercase tracking-widest rounded-md mb-1.5 border border-red-500/20">
//                       {discount}% OFF
//                     </span>
//                   </>
//                 )}
//               </div>

//               {product.inventory?.stockLevel > 0 &&
//               product.inventory.stockLevel < 10 ? (
//                 <div className="flex items-center gap-1.5 text-red-400 mt-2">
//                   <AlertCircle className="w-4 h-4" />
//                   <span className="text-[11px] font-bold uppercase tracking-widest">
//                     Low Stock: Only {product.inventory.stockLevel} left!
//                   </span>
//                 </div>
//               ) : product.inventory?.inStock ? (
//                 <span className="text-[11px] font-bold uppercase tracking-widest text-green-400 mt-2 block">
//                   ✓ In Stock & Ready to Ship
//                 </span>
//               ) : null}
//             </div>

//             {/* Variants */}
//             {variants.length > 1 && (
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-xs font-black uppercase tracking-widest text-neutral-300">
//                     Select Option
//                   </h3>
//                   {selectedVariant && !selectedVariant.availableForSale && (
//                     <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
//                       Out of Stock
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex flex-wrap gap-3">
//                   {variants.map((v) => (
//                     <button
//                       key={v.variantId}
//                       onClick={() => setSelectedVariant(v)}
//                       className={clsx(
//                         "px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 border-2",
//                         selectedVariant?.variantId === v.variantId
//                           ? "border-[#fe8204] bg-[#fe8204] text-white shadow-[0_0_15px_rgba(254,130,4,0.3)]"
//                           : "border-white/20 bg-transparent text-neutral-300 hover:border-white hover:text-white",
//                       )}
//                     >
//                       {v.title}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quick Features */}
//             <div className="grid grid-cols-2 gap-4 mb-8">
//               {[
//                 { icon: Droplets, text: "Waterproof" },
//                 { icon: Clock, text: "Lasts 1-2 Weeks" },
//                 { icon: ShieldCheck, text: "Skin Safe" },
//                 { icon: Sparkles, text: "Realistic Look" },
//               ].map((feat, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
//                 >
//                   <feat.icon className="w-5 h-5 text-[#fe8204]" />
//                   <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-300">
//                     {feat.text}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Actions */}
//             <div className="flex flex-col gap-4 mb-12">
//               <div className="flex flex-col sm:flex-row items-stretch gap-4">
//                 <div className="flex items-center justify-between border-2 border-white/20 rounded-xl bg-transparent h-[60px] w-full sm:w-[140px] shrink-0">
//                   <button
//                     onClick={() => handleQuantityChange("decrease")}
//                     className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
//                   >
//                     <Minus className="w-4 h-4" />
//                   </button>
//                   <span className="text-base font-black text-white">
//                     {quantity}
//                   </span>
//                   <button
//                     onClick={() => handleQuantityChange("increase")}
//                     className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>

//                 <button
//                   onClick={handleAddToCart}
//                   disabled={isAdding || !selectedVariant?.availableForSale}
//                   className="flex-1 h-[60px] border-2 p-5 border-white text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isAdding ? (
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <ShoppingBag className="w-5 h-5" />
//                   )}
//                   Add to Cart
//                 </button>
//               </div>

//               <button
//                 onClick={handleBuyNow}
//                 disabled={isBuyingNow || !selectedVariant?.availableForSale}
//                 className="w-full h-[60px] bg-[#fe8204] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#e07103] transition-colors duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(254,130,4,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isBuyingNow ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : null}
//                 {selectedVariant?.availableForSale
//                   ? "Buy It Now"
//                   : "Out of Stock"}
//               </button>
//             </div>

//             {/* Accordions */}
//             <div className="border-t-2 border-white/10">
//               <AccordionItem
//                 title="Description"
//                 isOpen={activeAccordion === "description"}
//                 onToggle={() => toggleAccordion("description")}
//               >
//                 <div
//                   className="prose prose-sm prose-invert max-w-none text-neutral-400 font-medium leading-relaxed"
//                   dangerouslySetInnerHTML={{
//                     __html: product.descriptionHtml || product.description,
//                   }}
//                 />
//               </AccordionItem>

//               <AccordionItem
//                 title="Tattoo Details"
//                 isOpen={activeAccordion === "details"}
//                 onToggle={() => toggleAccordion("details")}
//               >
//                 <div className="space-y-4">
//                   {product.attributes?.themes?.length > 0 && (
//                     <div>
//                       <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
//                         Themes
//                       </span>
//                       <div className="flex flex-wrap gap-2">
//                         {product.attributes.themes.map((theme, i) => (
//                           <span
//                             key={i}
//                             className="bg-white/10 text-neutral-200 px-3 py-1 rounded-md text-[11px] font-bold uppercase"
//                           >
//                             {theme}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {product.attributes?.placements?.length > 0 && (
//                     <div>
//                       <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
//                         Best Placements
//                       </span>
//                       <div className="flex flex-wrap gap-2">
//                         {product.attributes.placements.map((placement, i) => (
//                           <span
//                             key={i}
//                             className="bg-white/10 text-neutral-200 px-3 py-1 rounded-md text-[11px] font-bold uppercase"
//                           >
//                             {placement}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {product.attributes?.tags?.length > 0 && (
//                     <div>
//                       <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
//                         Tags
//                       </span>
//                       <div className="flex flex-wrap gap-2">
//                         {product.attributes.tags.map((tag, i) => (
//                           <span
//                             key={i}
//                             className="bg-transparent border border-white/20 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </AccordionItem>

//               <AccordionItem
//                 title="How To Apply"
//                 isOpen={activeAccordion === "apply"}
//                 onToggle={() => toggleAccordion("apply")}
//               >
//                 <ol className="space-y-3 text-sm text-neutral-400 font-medium list-decimal pl-4">
//                   <li>
//                     Ensure your skin is clean, dry, and free of makeup or
//                     lotions.
//                   </li>
//                   <li>Remove the clear protective top sheet.</li>
//                   <li>Press the tattoo design firmly onto your skin.</li>
//                   <li>
//                     Hold a wet cloth or sponge against the back of the tattoo
//                     for 30 seconds.
//                   </li>
//                   <li>Gently peel off the paper backing. Let it dry!</li>
//                 </ol>
//               </AccordionItem>

//               <AccordionItem
//                 title="Shipping & Returns"
//                 isOpen={activeAccordion === "shipping"}
//                 onToggle={() => toggleAccordion("shipping")}
//               >
//                 <p className="text-sm text-neutral-400 font-medium leading-relaxed">
//                   Orders process within 1-2 business days. Free shipping on
//                   orders over $50. Not completely satisfied? We accept returns
//                   within 30 days of purchase for a full refund.
//                 </p>
//               </AccordionItem>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================================= */}
//       {/* MAGNIFIER / ZOOM MODAL                                    */}
//       {/* ========================================================= */}
//       <AnimatePresence>
//         {isZoomed &&
//           (viewState.type === "skintone" || viewState.type === "gallery") && (
//             <motion.div
//               initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
//               animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
//               exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
//               className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 cursor-zoom-out"
//               onClick={() => setIsZoomed(false)}
//             >
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setIsZoomed(false);
//                 }}
//                 className="absolute top-6 right-6 md:top-8 md:right-8 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
//                 aria-label="Close zoom"
//               >
//                 <X className="w-6 h-6" />
//               </button>

//               <div className="relative flex items-center justify-center w-full h-full max-h-[85vh]">
//                 <Image
//                   src={
//                     viewState.type === "skintone"
//                       ? viewState.source.imageUrl
//                       : viewState.source.url
//                   }
//                   alt={product.title}
//                   width={1200}
//                   height={1200}
//                   className="w-auto h-full max-h-full object-contain rounded-xl drop-shadow-2xl cursor-default"
//                   onClick={(e) => e.stopPropagation()}
//                   priority={true}
//                 />
//               </div>
//             </motion.div>
//           )}
//       </AnimatePresence>

//       {/* ========================================================= */}
//       {/* WEBRTC 2D CAMERA AR MODAL                                 */}
//       {/* ========================================================= */}
//       <AnimatePresence>
//         {isCameraAROpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
//           >
//             <button
//               onClick={() => setIsCameraAROpen(false)}
//               className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             {/* Live Camera Feed */}
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               muted
//               className="absolute inset-0 w-full h-full object-cover"
//             />

//             {/* Transparent Tattoo Overlay */}
//             {/* {featuredUrl && (
//               <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-8">
//                 <img 
//                   src={featuredUrl}
//                   alt="Tattoo Overlay" 
//                   className="w-full max-w-sm h-auto opacity-80 mix-blend-multiply drop-shadow-2xl"
//                 />
//               </div>
//             )} */}
//             {/* {product.media?.arOverlayImage && (
//               <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-8 md:p-12">
//                 <Image 
//                   src={product.media.arOverlayImage}
//                   alt="AR Tattoo Overlay" 
//                   width={350}
//                   height={350}
//                   className="w-auto h-auto max-w-[350px] opacity-90 mix-blend-multiply drop-shadow-2xl filter contrast-125"
//                 />
//               </div>
//             )} */}

//             {product.media?.arOverlayImage && (
//               <InteractiveTattoo src={product.media.arOverlayImage} />
//             )}

//             {/* Instructional HUD */}
//             <div className="absolute bottom-12 left-0 w-full z-20 flex justify-center pointer-events-none">
//               <div className="bg-black/60 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full">
//                 <p className="text-white text-xs font-bold tracking-widest uppercase text-center">
//                   Point camera at your skin to preview
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // =========================================================
// // CLEAN ACCORDION COMPONENT (Dark Theme)
// // =========================================================
// function AccordionItem({
//   title,
//   isOpen,
//   onToggle,
//   children,
// }: {
//   title: string;
//   isOpen: boolean;
//   onToggle: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="border-b-2 border-white/10 last:border-0">
//       <button
//         onClick={onToggle}
//         className="w-full py-6 flex items-center justify-between group outline-none"
//       >
//         <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-[#fe8204] transition-colors">
//           {title}
//         </span>
//         <motion.div
//           animate={{ rotate: isOpen ? 180 : 0 }}
//           transition={{ duration: 0.2 }}
//         >
//           <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-[#fe8204] transition-colors" />
//         </motion.div>
//       </button>
//       <AnimatePresence initial={false}>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="overflow-hidden"
//           >
//             <div className="pb-6">{children}</div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Minus,
  ZoomIn,
  X,
  Star,
  Droplets,
  ChevronDown,
  ShieldCheck,
  Loader2,
  Clock,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  Camera,
  Box,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import { FormattedProduct, Variant } from "@/src/lib/shopify";

// Bypass React's strict custom element checks for Model Viewer
const ModelViewer = "model-viewer" as any;

interface TattooProductDetailProps {
  product: FormattedProduct;
}

const getDistance = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAngle = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

// =========================================================
// INTERACTIVE AR OVERLAY COMPONENT
// =========================================================
const InteractiveTattoo = ({ src }: { src: string }) => {
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const pinchRef = useRef({
    initialDist: 0,
    initialScale: 1,
    initialAngle: 0,
    initialRotate: 0,
  });
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        initialX: transform.x,
        initialY: transform.y,
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
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
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setTransform((prev) => ({
        ...prev,
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      }));
    } else if (e.touches.length === 2) {
      const currentDist = getDistance(e.touches);
      const currentAngle = getAngle(e.touches);

      const scaleDelta = currentDist / pinchRef.current.initialDist;
      const angleDelta = currentAngle - pinchRef.current.initialAngle;

      setTransform((prev) => ({
        ...prev,
        scale: pinchRef.current.initialScale * scaleDelta,
        rotate: pinchRef.current.initialRotate + angleDelta,
      }));
    }
  };

  const onTouchEnd = () => setIsDragging(false);

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

type ViewState =
  | { type: "3d"; source: any }
  | { type: "skintone"; source: any }
  | { type: "gallery"; source: any; index: number };

export default function TattooProductDetail({
  product,
}: TattooProductDetailProps) {
  const { addToCart, buyNow } = useCart();

  // =========================================================
  // DATA PARSING & MEDIA HIERARCHY
  // =========================================================
  const models = product.media?.models || [];
  const swatches = product.skinToneSwatches || [];
  const rawGallery = product.media?.gallery || [];
  const featuredUrl = product.media?.featuredImage;

  // Filter out swatches and the featured image from standard gallery to prevent duplicates
  const swatchUrls = swatches.map((s: any) => s.imageUrl);
  const filteredGallery = rawGallery.filter(
    (img: any) => img.url !== featuredUrl && !swatchUrls.includes(img.url),
  );

  const standardImages = [
    ...(featuredUrl ? [{ url: featuredUrl, altText: product.title }] : []),
    ...filteredGallery,
  ];
  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  // Determine Default Media View on Load
  const getInitialViewState = (): ViewState => {
    if (models.length > 0) return { type: "3d", source: models[0] };
    if (swatches.length > 0) return { type: "skintone", source: swatches[0] };
    if (standardImages.length > 0)
      return { type: "gallery", source: standardImages[0], index: 0 };
    return { type: "gallery", source: { url: "/placeholder.png" }, index: 0 };
  };

  // =========================================================
  // UI & STATE MANAGEMENT
  // =========================================================
  const [isMounted, setIsMounted] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(getInitialViewState());
  const [activeSkinTone, setActiveSkinTone] = useState<string | null>(
    swatches[0]?.hexCode || null,
  );

  const [isZoomed, setIsZoomed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "description",
  );

  // 3D & AR States
  const [modelLoaded, setModelLoaded] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [isCameraAROpen, setIsCameraAROpen] = useState(false);
  const modelViewerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cart & Variant States
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const variants = product.allVariants || [];
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.find((v) => v.availableForSale) || variants[0] || null,
  );

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : product.checkout.price;
  const compareAtPrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : product.checkout.compareAtPrice;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  
  const discount =
    product.checkout.discountPercentage ||
    (isOnSale && compareAtPrice > 0
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0);

  // =========================================================
  // EFFECTS
  // =========================================================
  useEffect(() => {
    setIsMounted(true);

    // Load model-viewer dynamically
    if (models.length > 0) {
      import("@google/model-viewer").then(() => {
        customElements.whenDefined("model-viewer").then(() => {
          const mv = modelViewerRef.current as any;
          if (mv) {
            mv.addEventListener("load", () => setModelLoaded(true));
            if (typeof mv.canActivateAR !== "undefined") {
              setArSupported(mv.canActivateAR);
            }
          }
        });
      });
    }
  }, [models]);

  // Lock body scroll when Modals are open
  useEffect(() => {
    if (isZoomed || isCameraAROpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isZoomed, isCameraAROpen]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      if (!isCameraAROpen || !videoRef.current) return;

      if (!navigator?.mediaDevices?.getUserMedia) {
        toast.error("Camera access requires a secure connection (HTTPS).");
        setIsCameraAROpen(false);
        return;
      }

      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        console.error("Camera access denied or failed:", err);
        toast.error("Unable to access camera. Please check permissions.");
        setIsCameraAROpen(false);
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraAROpen]);

  // =========================================================
  // HANDLERS
  // =========================================================
  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1,
    );
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.variantId)
      return toast.error("Please select an option");
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.variantId, quantity);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.variantId)
      return toast.error("Please select an option");
    setIsBuyingNow(true);
    try {
      const checkoutUrl = await buyNow(selectedVariant.variantId, quantity);
      if (checkoutUrl) window.location.href = checkoutUrl;
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleTriggerAR = () => {
    if (viewState.type === "3d") {
      const mv = modelViewerRef.current as any;
      if (mv?.canActivateAR) {
        mv.activateAR();
      } else {
        toast.error("3D AR is not supported on this device.");
      }
    } else {
      if (product.media?.arOverlayImage) {
        setIsCameraAROpen(true);
      } else {
        toast.info("Stay tuned! AR Try-On for this product is coming soon.", {
          position: "bottom-center",
          duration: 4000,
          style: {
            background: "#27272a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        });
      }
    }
  };

  const thumbnails = [];
  if (models.length > 0) {
    thumbnails.push({
      type: "3d",
      thumbUrl: standardImages[0]?.url || "/placeholder.png",
      source: models[0],
    });
  }
  if (swatches.length > 0) {
    const activeSwatch =
      swatches.find((s: any) => s.hexCode === activeSkinTone) || swatches[0];
    thumbnails.push({
      type: "skintone",
      thumbUrl: activeSwatch.imageUrl,
      source: activeSwatch,
    });
  }
  standardImages.forEach((img, index) => {
    thumbnails.push({
      type: "gallery",
      thumbUrl: img.url || "/placeholder.png",
      source: img,
      index,
    });
  });

  if (!isMounted) return null;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-[140px] lg:pt-[160px] pb-20 selection:bg-[#fe8204] selection:text-white font-sans">
      <div className="container max-w-[1400px] mx-auto px-4">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 lg:mb-8">
          <a href="/" className="hover:text-white transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/collections/"
            className="hover:text-white transition-colors"
          >
            Shop ALL
          </a>
          <span>/</span>
          <span className="text-white truncate max-w-[150px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 xl:gap-16 items-start">
          {/* ========================================================= */}
          {/* LEFT: REDESIGNED DYNAMIC MEDIA VIEWER CONTAINER           */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-32">
            {/* Redesigned Card Matching Sample Frame */}
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4] max-h-[640px] rounded-[32px] bg-[#141414] border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl group">
              
              {/* Persistent Background Layer for all Skin Tones to achieve instant non-loading switch */}
              {swatches.length > 0 && (
                <div 
                  className={clsx(
                    "absolute inset-0 p-4 md:p-6 transition-opacity duration-300 pointer-events-none z-0",
                    viewState.type === "skintone" ? "opacity-100" : "opacity-0"
                  )}
                >
                  {swatches.map((swatch: any) => (
                    <Image
                      key={swatch.hexCode}
                      src={swatch.imageUrl}
                      alt="Skin Tone Stack"
                      fill
                      priority={true}
                      className={clsx(
                        "object-contain p-4 md:p-6 transition-opacity duration-150 absolute inset-0",
                        activeSkinTone === swatch.hexCode ? "opacity-100" : "opacity-0"
                      )}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={
                    viewState.type +
                    (viewState.type === "gallery" ? viewState.index : "")
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full relative z-10"
                >
                  {/* 3D Model Render */}
                  {viewState.type === "3d" && (
                    <div className="w-full h-full p-6">
                      {!modelLoaded && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#141414]">
                          <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                        </div>
                      )}
                      <ModelViewer
                        ref={modelViewerRef}
                        src={
                          viewState.source.sources?.find(
                            (s: any) => s.format === "glb",
                          )?.url
                        }
                        ios-src={
                          viewState.source.sources?.find(
                            (s: any) => s.format === "usdz",
                          )?.url
                        }
                        alt="3D product model"
                        ar="true"
                        ar-modes="webxr scene-viewer quick-look"
                        camera-controls="true"
                        auto-rotate="true"
                        rotation-per-second="30deg"
                        shadow-intensity="1"
                        environment-image="neutral"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "transparent",
                        }}
                      >
                        <button slot="ar-button" className="hidden">
                          AR
                        </button>
                      </ModelViewer>
                    </div>
                  )}

                  {/* Standard Gallery Content (Skin tones handled by persistent stack above) */}
                  {viewState.type === "gallery" && (
                    <div className="w-full h-full p-4 md:p-6">
                      <Image
                        src={viewState.source.url}
                        alt={product.title}
                        fill
                        priority={true}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges Overlay */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                {product.styling?.badges
                  ?.filter(Boolean)
                  .map((badge: any, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black rounded-md shadow-md"
                      style={{ backgroundColor: badge.color || "#fff" }}
                    >
                      {badge.label}
                    </span>
                  ))}
              </div>

              {/* Utility Floating Bar - Top Right */}
              <div className="absolute top-6 right-6 flex gap-2.5 z-20">
                <button
                  onClick={handleTriggerAR}
                  className="px-4 py-2.5 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 text-white transition-all duration-200 shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {viewState.type === "3d" ? "AR View" : "Try On"}
                  </span>
                </button>
                {(viewState.type === "skintone" ||
                  viewState.type === "gallery") && (
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="w-9 h-9 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg"
                    aria-label="Zoom image"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* REDESIGNED FLOATING SKIN TONE OVERLAY PANEL - Glassmorphic Bottom Stack */}
              {swatches.length > 0 && viewState.type === "skintone" && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center bg-black/30 backdrop-blur-xl border border-white/10 px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-[82%] max-w-[280px] text-center transition-all duration-300">
                  <span className="text-[9px] font-black tracking-widest uppercase text-white/50 mb-2.5 block select-none">
                    Skin Tone Toggle
                  </span>
                  
                  <div className="flex items-center justify-center gap-2 w-full">
                    {swatches.map((swatch: any) => (
                      <button
                        key={swatch.hexCode}
                        onClick={() => {
                          setActiveSkinTone(swatch.hexCode);
                          setViewState({ type: "skintone", source: swatch });
                        }}
                        className={clsx(
                          "w-7 h-7 rounded-md border transition-all duration-200 shrink-0",
                          activeSkinTone === swatch.hexCode
                            ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                            : "border-white/10 hover:border-white/40 opacity-70 hover:opacity-100"
                        )}
                        style={{ backgroundColor: swatch.hexCode }}
                        aria-label="Select skin color"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* VIBE CHECK / 360 TEXT INDICATOR OVERLAY (Visible during 3D states) */}
              {viewState.type === "3d" && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center bg-black/30 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-xl shadow-lg pointer-events-none select-none text-center">
                  <span className="text-[10px] font-black tracking-widest uppercase text-white tracking-wider">
                    Vibe Check
                  </span>
                  <div className="flex flex-col items-center justify-center text-neutral-400 mt-0.5">
                    <span className="text-[9px] font-black tracking-widest">360°</span>
                    <svg className="w-6 h-2 text-neutral-400 mt-0.5 animate-pulse" viewBox="0 0 24 8" fill="none">
                      <path d="M2 6C6 2 18 2 22 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M19 5L22 6L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Formatted Horizontal Thumbnails Stack */}
            {thumbnails.length > 1 && (
              <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar pb-1 pt-1 justify-start">
                {thumbnails.map((thumb: any, idx: number) => {
                  const isActive =
                    (thumb.type === "3d" && viewState.type === "3d") ||
                    (thumb.type === "skintone" &&
                      viewState.type === "skintone") ||
                    (thumb.type === "gallery" &&
                      viewState.type === "gallery" &&
                      viewState.index === thumb.index);

                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setViewState(
                          thumb.type === "gallery"
                            ? {
                                type: "gallery",
                                source: thumb.source,
                                index: thumb.index,
                              }
                            : { type: thumb.type as any, source: thumb.source },
                        )
                      }
                      className={clsx(
                        "relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#141414] border-2 transition-all duration-200",
                        isActive
                          ? "border-[#fe8204] shadow-md"
                          : "border-white/10 hover:border-white/30",
                      )}
                    >
                      {thumb.type === "3d" && (
                        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                          <Box className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <Image
                        src={thumb.thumbUrl || "/placeholder.png"}
                        alt="Navigation Thumbnail"
                        fill
                        className="object-contain p-1.5"
                        sizes="64px"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: PRODUCT INFO (Standard Untouched Frame)            */}
          {/* ========================================================= */}
          <div className="flex flex-col py-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-black text-[#fe8204] uppercase tracking-widest bg-[#fe8204]/10 px-2.5 py-1 rounded-md">
                  {product.vendor}
                </span>
                {product.styling?.tattooColorType && (
                  <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">
                    {product.styling.tattooColorType}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.1] mb-4">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-[#fe8204]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest pt-0.5">
                  4.9 (120 Reviews)
                </p>
              </div>
            </div>

            {/* Price & Inventory */}
            <div className="mb-8 border-b border-white/10 pb-8">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  ${price.toFixed(2)}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-xl font-bold text-neutral-500 line-through mb-0.5">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500/20 text-red-400 px-2.5 py-1 text-xs font-black uppercase tracking-widest rounded-md mb-1.5 border border-red-500/20">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {product.inventory?.stockLevel > 0 &&
              product.inventory.stockLevel < 10 ? (
                <div className="flex items-center gap-1.5 text-red-400 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    Low Stock: Only {product.inventory.stockLevel} left!
                  </span>
                </div>
              ) : product.inventory?.inStock ? (
                <span className="text-[11px] font-bold uppercase tracking-widest text-green-400 mt-2 block">
                  ✓ In Stock & Ready to Ship
                </span>
              ) : null}
            </div>

            {/* Variants */}
            {variants.length > 1 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-300">
                    Select Option
                  </h3>
                  {selectedVariant && !selectedVariant.availableForSale && (
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v) => (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx(
                        "px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 border-2",
                        selectedVariant?.variantId === v.variantId
                          ? "border-[#fe8204] bg-[#fe8204] text-white shadow-[0_0_15px_rgba(254,130,4,0.3)]"
                          : "border-white/20 bg-transparent text-neutral-300 hover:border-white hover:text-white",
                      )}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Droplets, text: "Waterproof" },
                { icon: Clock, text: "Lasts 1-2 Weeks" },
                { icon: ShieldCheck, text: "Skin Safe" },
                { icon: Sparkles, text: "Realistic Look" },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <feat.icon className="w-5 h-5 text-[#fe8204]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-300">
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="flex items-center justify-between border-2 border-white/20 rounded-xl bg-transparent h-[60px] w-full sm:w-[140px] shrink-0">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-black text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-12 h-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex-1 h-[60px] border-2 p-5 border-white text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingBag className="w-5 h-5" />
                  )}
                  Add to Cart
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow || !selectedVariant?.availableForSale}
                className="w-full h-[60px] bg-[#fe8204] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#e07103] transition-colors duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(254,130,4,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuyingNow ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                {selectedVariant?.availableForSale
                  ? "Buy It Now"
                  : "Out of Stock"}
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t-2 border-white/10">
              <AccordionItem
                title="Description"
                isOpen={activeAccordion === "description"}
                onToggle={() => toggleAccordion("description")}
              >
                <div
                  className="prose prose-sm prose-invert max-w-none text-neutral-400 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml || product.description,
                  }}
                />
              </AccordionItem>

              <AccordionItem
                title="Tattoo Details"
                isOpen={activeAccordion === "details"}
                onToggle={() => toggleAccordion("details")}
              >
                <div className="space-y-4">
                  {product.attributes?.themes?.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
                        Themes
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.themes.map((theme, i) => (
                          <span
                            key={i}
                            className="bg-white/10 text-neutral-200 px-3 py-1 rounded-md text-[11px] font-bold uppercase"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.placements?.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
                        Best Placements
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.placements.map((placement, i) => (
                          <span
                            key={i}
                            className="bg-white/10 text-neutral-200 px-3 py-1 rounded-md text-[11px] font-bold uppercase"
                          >
                            {placement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.tags?.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
                        Tags
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-transparent border border-white/20 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>

              <AccordionItem
                title="How To Apply"
                isOpen={activeAccordion === "apply"}
                onToggle={() => toggleAccordion("apply")}
              >
                <ol className="space-y-3 text-sm text-neutral-400 font-medium list-decimal pl-4">
                  <li>
                    Ensure your skin is clean, dry, and free of makeup or
                    lotions.
                  </li>
                  <li>Remove the clear protective top sheet.</li>
                  <li>Press the tattoo design firmly onto your skin.</li>
                  <li>
                    Hold a wet cloth or sponge against the back of the tattoo
                    for 30 seconds.
                  </li>
                  <li>Gently peel off the paper backing. Let it dry!</li>
                </ol>
              </AccordionItem>

              <AccordionItem
                title="Shipping & Returns"
                isOpen={activeAccordion === "shipping"}
                onToggle={() => toggleAccordion("shipping")}
              >
                <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                  Orders process within 1-2 business days. Free shipping on
                  orders over $50. Not completely satisfied? We accept returns
                  within 30 days of purchase for a full refund.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAGNIFIER / ZOOM MODAL                                    */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isZoomed &&
          (viewState.type === "skintone" || viewState.type === "gallery") && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 cursor-zoom-out"
              onClick={() => setIsZoomed(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                className="absolute top-6 right-6 md:top-8 md:right-8 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Close zoom"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative flex items-center justify-center w-full h-full max-h-[85vh]">
                <Image
                  src={
                    viewState.type === "skintone"
                      ? viewState.source.imageUrl
                      : viewState.source.url
                  }
                  alt={product.title}
                  width={1200}
                  height={1200}
                  className="w-auto h-full max-h-full object-contain rounded-xl drop-shadow-2xl cursor-default"
                  onClick={(e) => e.stopPropagation()}
                  priority={true}
                />
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* WEBRTC 2D CAMERA AR MODAL                                 */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCameraAROpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            <button
              onClick={() => setIsCameraAROpen(false)}
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Live Camera Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {product.media?.arOverlayImage && (
              <InteractiveTattoo src={product.media.arOverlayImage} />
            )}

            {/* Instructional HUD */}
            <div className="absolute bottom-12 left-0 w-full z-20 flex justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full">
                <p className="text-white text-xs font-bold tracking-widest uppercase text-center">
                  Point camera at your skin to preview
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// CLEAN ACCORDION COMPONENT (Dark Theme)
// =========================================================
function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b-2 border-white/10 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between group outline-none"
      >
        <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-[#fe8204] transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-500 group-hover:text-[#fe8204] transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}