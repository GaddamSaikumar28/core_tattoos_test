"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import { FormattedProduct, Variant } from "@/src/lib/shopify";
import { ViewState, AngleView } from "./types";
import { getHexLuminance } from "./touchHelpers";

export function useProductDetail(product: FormattedProduct) {
  const { addToCart, buyNow } = useCart();

  // ─────────────────────────────────────────────────────────
  // A. DATA PARSING
  // Derives structured arrays from the raw product object.
  // These values never change after mount (product is stable).
  // ─────────────────────────────────────────────────────────

  const models      = product.media?.models        || [];
  const swatches    = product.skinToneSwatches      || [];
  const rawGallery  = product.media?.gallery        || [];
  const featuredUrl = product.media?.featuredImage;

  // Remove swatch images and the featured image from the gallery
  // to avoid showing duplicates in the thumbnail strip.
  const swatchUrls      = swatches.map((s: any) => s.imageUrl);
  const filteredGallery = rawGallery.filter(
    (img: any) => img.url !== featuredUrl && !swatchUrls.includes(img.url),
  );

  // Final ordered gallery: featured first, then the rest.
  const standardImages = [
    ...(featuredUrl ? [{ url: featuredUrl, altText: product.title }] : []),
    ...filteredGallery,
  ];

  // ── Angle Views (Fixed TS Type Mismatch Error) ───────────
  const has3DModel = models.length > 0;

  // Runtime type-guard filter ensuring null urls are omitted and types align
  const rawAngleViews: AngleView[] = useMemo(() => {
    return (product.media?.angleViews || []).filter(
      (view: any): view is AngleView => typeof view?.imageUrl === "string"
    );
  }, [product.media?.angleViews]);

  /**
   * Angle view thumbnails are available only if:
   * 1. A 3D model file exists (has3DModel)
   * 2. The product has at least one angle view entry
   * Otherwise this is an empty array and the UI hides the section.
   */
  const angleViews: AngleView[] = useMemo(() => {
    if (!has3DModel || rawAngleViews.length === 0) return [];
    return rawAngleViews;
  }, [has3DModel, rawAngleViews]);

  // Determine the default active panel based on available media.
  const getInitialViewState = (): ViewState => {
    if (models.length > 0)         return { type: "3d",       source: models[0] };
    if (swatches.length > 0)       return { type: "skintone", source: swatches[0] };
    if (standardImages.length > 0) return { type: "gallery",  source: standardImages[0], index: 0 };
    return { type: "gallery", source: { url: "/placeholder.png" }, index: 0 };
  };

  // ─────────────────────────────────────────────────────────
  // B. STATE DECLARATIONS
  // ─────────────────────────────────────────────────────────

  // Prevents SSR hydration mismatch — component renders null until mounted.
  const [isMounted, setIsMounted] = useState(false);

  // Which media panel is currently shown in the main canvas.
  const [viewState, setViewState] = useState<ViewState>(getInitialViewState());

  // Tracks the selected skin tone hex (used to highlight the active swatch).
  const [activeSkinTone, setActiveSkinTone] = useState<string | null>(
    swatches[0]?.hexCode || null,
  );

  // Zoom lightbox visibility.
  const [isZoomed, setIsZoomed] = useState(false);

  // Which accordion panel is open (null = all collapsed).
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");

  // Wishlist heart toggle (local UI state only, no persistence).
  const [isWishlisted, setIsWishlisted] = useState(false);

  // ── 3D Model & AR ────────────────────────────────────────
  const [modelLoaded, setModelLoaded]       = useState(false);
  const [arSupported, setArSupported]       = useState(false);
  const [isCameraAROpen, setIsCameraAROpen] = useState(false);

  /**
   * Camera facing mode — "environment" = back camera (default for AR),
   * "user" = front camera (selfie mode).
   */
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const modelViewerRef = useRef<HTMLElement>(null);
  const videoRef       = useRef<HTMLVideoElement>(null);

  // Tracks the currently active MediaStream so we can restart it on camera switch.
  const activeStreamRef = useRef<MediaStream | null>(null);

  // ── Cart & Variants ──────────────────────────────────────
  const [quantity, setQuantity]       = useState(1);
  const [isAdding, setIsAdding]       = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const variants = product.allVariants || [];
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.find((v) => v.availableForSale) || variants[0] || null,
  );

  // ─────────────────────────────────────────────────────────
  // C. COMPUTED VALUES
  // ─────────────────────────────────────────────────────────

  // ── Pricing ──────────────────────────────────────────────
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

  const savingsAmount = isOnSale ? (compareAtPrice - price).toFixed(0) : 0;

  // ── Social Proof / Scarcity ───────────────────────────────
  const [viewingNow, setViewingNow] = useState(1500); 
  
  useEffect(() => {
    setViewingNow(Math.floor(Math.random() * (3000 - 1500 + 1) + 1500));
  }, []);

  const stockLevel   = product.inventory?.stockLevel ?? 153;
  const soldThisWeek = Math.max(100, 1000 - stockLevel);
  const scarcityPct  = Math.min((soldThisWeek / (soldThisWeek + stockLevel)) * 100, 95);

  // ── Sorted Skin Tone Swatches (light → dark) ──────────────
  const sortedSwatches = useMemo(
    () =>
      [...swatches].sort(
        (a: any, b: any) =>
          getHexLuminance(b.hexCode) - getHexLuminance(a.hexCode),
      ),
    [swatches],
  );

  // ── Thumbnail Strip ───────────────────────────────────────
  const thumbnails: any[] = useMemo(() => {
    const list: any[] = [];

    if (models.length > 0) {
      list.push({
        type: "3d",
        thumbUrl: standardImages[0]?.url || "/placeholder.png",
        source: models[0],
      });
    }

    if (swatches.length > 0) {
      const activeSwatch =
        swatches.find((s: any) => s.hexCode === activeSkinTone) || swatches[0];
      list.push({
        type: "skintone",
        thumbUrl: activeSwatch.imageUrl,
        source: activeSwatch,
      });
    }

    // Inject Angle Views into thumbnails list
    // angleViews.forEach((view, index) => {
    //   list.push({
    //     type: "angle",
    //     thumbUrl: view.imageUrl,
    //     source: view,
    //     index,
    //   });
    // });

    standardImages.forEach((img, index) => {
      list.push({
        type: "gallery",
        thumbUrl: img.url || "/placeholder.png",
        source: img,
        index,
      });
    });

    return list;
  }, [activeSkinTone, models, swatches, standardImages, angleViews]);

  // ── Current image source (used by zoom modal) ─────────────
  const currentImageSrc = useMemo(() => {
    if (viewState.type === "skintone" || viewState.type === "angle") {
      return viewState.source.imageUrl;
    }
    return viewState.source?.url || "/placeholder.png";
  }, [viewState]);

  // ─────────────────────────────────────────────────────────
  // D. EFFECTS
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    setIsMounted(true);
    if (models.length > 0) {
      import("@google/model-viewer").then(() => {
        customElements.whenDefined("model-viewer").then(() => {
          const mv = modelViewerRef.current as any;
          if (mv) {
            mv.addEventListener("load", () => setModelLoaded(true));
            if (typeof mv.canActivateAR !== "undefined") setArSupported(mv.canActivateAR);
          }
        });
      });
    }
  }, [models]);

  useEffect(() => {
    document.body.style.overflow = isZoomed || isCameraAROpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isZoomed, isCameraAROpen]);

  const startCameraStream = useCallback(async () => {
    if (!videoRef.current) return;

    if (!navigator?.mediaDevices?.getUserMedia) {
      toast.error("Camera access requires a secure connection (HTTPS).");
      setIsCameraAROpen(false);
      return;
    }

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((t) => t.stop());
      activeStreamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      activeStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      toast.error("Unable to access camera. Please check permissions.");
      setIsCameraAROpen(false);
    }
  }, [facingMode]);

  useEffect(() => {
    if (isCameraAROpen) {
      startCameraStream();
    } else {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((t) => t.stop());
        activeStreamRef.current = null;
      }
    }
  }, [isCameraAROpen, startCameraStream]);

  // ─────────────────────────────────────────────────────────
  // E. HANDLERS
  // ─────────────────────────────────────────────────────────

  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1,
    );
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.variantId) return toast.error("Please select an option");
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.variantId, quantity);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.variantId) return toast.error("Please select an option");
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
          style: { background: "#111", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
        });
      }
    }
  };

  const handleSwitchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }, []);

  useEffect(() => {
    if (isCameraAROpen) {
      startCameraStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleAccordion = (id: string) =>
    setActiveAccordion((prev) => (prev === id ? null : id));

  // ─────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────

  return {
    models,
    swatches,
    sortedSwatches,
    standardImages,
    angleViews,
    isMounted,
    viewState,
    setViewState,
    activeSkinTone,
    setActiveSkinTone,
    currentImageSrc,
    thumbnails,
    isZoomed,
    setIsZoomed,
    isCameraAROpen,
    setIsCameraAROpen,
    modelViewerRef,
    videoRef,
    modelLoaded,
    arSupported,
    facingMode,
    handleSwitchCamera,
    activeAccordion,
    isWishlisted,
    setIsWishlisted,
    quantity,
    isAdding,
    isBuyingNow,
    variants,
    selectedVariant,
    setSelectedVariant,
    price,
    compareAtPrice,
    isOnSale,
    discount,
    savingsAmount,
    viewingNow,
    stockLevel,
    soldThisWeek,
    scarcityPct,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
    handleTriggerAR,
    toggleAccordion,
  };
}