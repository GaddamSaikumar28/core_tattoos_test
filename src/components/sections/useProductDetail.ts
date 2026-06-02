"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import { FormattedProduct, Variant } from "@/src/lib/shopify";
import { ViewState } from "./types";

export function useProductDetail(product: FormattedProduct) {
  const { addToCart, buyNow } = useCart();

  // ─────────────────────────────────────────────────────────
  // A. DATA PARSING
  // Derives structured arrays from the raw product object.
  // These values never change after mount (product is stable).
  // ─────────────────────────────────────────────────────────

  const models       = product.media?.models        || [];
  const swatches     = product.skinToneSwatches      || [];
  const rawGallery   = product.media?.gallery        || [];
  const featuredUrl  = product.media?.featuredImage;

  // Remove swatch images and the featured image from the gallery
  // to avoid showing duplicates in the thumbnail strip.
  const swatchUrls     = swatches.map((s: any) => s.imageUrl);
  const filteredGallery = rawGallery.filter(
    (img: any) => img.url !== featuredUrl && !swatchUrls.includes(img.url),
  );

  // Final ordered gallery: featured first, then the rest.
  const standardImages = [
    ...(featuredUrl ? [{ url: featuredUrl, altText: product.title }] : []),
    ...filteredGallery,
  ];

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
  const [modelLoaded, setModelLoaded]   = useState(false); // hides spinner once model resolves
  const [arSupported, setArSupported]   = useState(false); // set by model-viewer capability check
  const [isCameraAROpen, setIsCameraAROpen] = useState(false); // 2D camera AR modal

  const modelViewerRef = useRef<HTMLElement>(null);     // ref to <model-viewer> element
  const videoRef       = useRef<HTMLVideoElement>(null); // ref to camera <video> element

  // ── Cart & Variants ──────────────────────────────────────
  const [quantity, setQuantity]       = useState(1);
  const [isAdding, setIsAdding]       = useState(false);       // spinner on "Add to Cart"
  const [isBuyingNow, setIsBuyingNow] = useState(false);       // spinner on "Buy Now"

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
  // Random "viewing now" number is stable for the component lifetime (useMemo []).
  const viewingNow = useMemo(
    () => Math.floor(Math.random() * (3000 - 1500 + 1) + 1500),
    [],
  );

  const stockLevel    = product.inventory?.stockLevel ?? 153;
  const soldThisWeek  = Math.max(100, 1000 - stockLevel);
  const scarcityPct   = Math.min((soldThisWeek / (soldThisWeek + stockLevel)) * 100, 95);

  // ── Thumbnail Strip ───────────────────────────────────────
  // Re-derives whenever activeSkinTone changes (swatch thumb updates).
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

    standardImages.forEach((img, index) => {
      list.push({
        type: "gallery",
        thumbUrl: img.url || "/placeholder.png",
        source: img,
        index,
      });
    });

    return list;
  }, [activeSkinTone, models, swatches, standardImages]);

  // ── Current image source (used by zoom modal) ─────────────
  const currentImageSrc =
    viewState.type === "skintone"
      ? viewState.source.imageUrl
      : viewState.source.url;

  // ─────────────────────────────────────────────────────────
  // D. EFFECTS
  // ─────────────────────────────────────────────────────────

  // Flip isMounted → triggers first render + lazy-loads model-viewer.
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

  // Lock body scroll when the zoom lightbox or camera AR modal is open.
  useEffect(() => {
    document.body.style.overflow = isZoomed || isCameraAROpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isZoomed, isCameraAROpen]);

  // Start / stop the back camera stream when the AR modal opens / closes.
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
        if (videoRef.current) videoRef.current.srcObject = activeStream;
      } catch {
        toast.error("Unable to access camera. Please check permissions.");
        setIsCameraAROpen(false);
      }
    };

    startCamera();

    // Cleanup: stop all tracks to release the camera on unmount / modal close.
    return () => {
      if (activeStream) activeStream.getTracks().forEach((t) => t.stop());
    };
  }, [isCameraAROpen]);

  // ─────────────────────────────────────────────────────────
  // E. HANDLERS
  // ─────────────────────────────────────────────────────────

  /** Increment or decrement quantity (minimum 1). */
  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1,
    );
  };

  /** Add selected variant × quantity to the Shopify cart. */
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

  /** Create a Shopify checkout and redirect immediately. */
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

  /**
   * Trigger AR experience.
   *   • 3D panel  → activates native WebXR / Quick Look via model-viewer
   *   • 2D panels → opens the camera AR modal (or shows "coming soon" toast)
   */
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

  /** Toggle a single accordion open; clicking the open one collapses it. */
  const toggleAccordion = (id: string) =>
    setActiveAccordion((prev) => (prev === id ? null : id));

  // ─────────────────────────────────────────────────────────
  // RETURN — everything the JSX layer needs
  // ─────────────────────────────────────────────────────────

  return {
    // Parsed data
    models,
    swatches,
    standardImages,

    // Mount guard
    isMounted,

    // Media panel state
    viewState,
    setViewState,
    activeSkinTone,
    setActiveSkinTone,
    currentImageSrc,
    thumbnails,

    // Lightbox / modals
    isZoomed,
    setIsZoomed,
    isCameraAROpen,
    setIsCameraAROpen,

    // Refs (passed down to JSX elements)
    modelViewerRef,
    videoRef,

    // 3D model
    modelLoaded,
    arSupported,

    // Product info UI state
    activeAccordion,
    isWishlisted,
    setIsWishlisted,

    // Cart state
    quantity,
    isAdding,
    isBuyingNow,
    variants,
    selectedVariant,
    setSelectedVariant,

    // Computed pricing
    price,
    compareAtPrice,
    isOnSale,
    discount,
    savingsAmount,

    // Social proof / scarcity
    viewingNow,
    stockLevel,
    soldThisWeek,
    scarcityPct,

    // Handlers
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
    handleTriggerAR,
    toggleAccordion,
  };
}