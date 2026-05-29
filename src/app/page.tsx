import { Suspense } from "react";
import { cache } from "react";
import {
  getHomePageHeroCollections,
  getHomePageNewArrivals,
  getHomePageCollections,
} from "@/src/lib/shopify/index";

import ShowcaseCarousel        from "../components/home/ShowcaseCarousel";
import DynamicReviews          from "../components/home/DynamicReviews";
import FaqSection              from "../components/home/FaqSection";
import NewsletterSection       from "../components/home/NewsletterSection";
import TattooStudio            from "../components/home/TattooStudio";
import Hero                    from "../components/hero";
import CommunityGallerySection from "@/src/components/home/CommunityGallery";
import HowItWorks              from "@/src/components/home/HowItWorks";
import SafeForSkinSection      from "@/src/components/home/SafeForSkin";
import BookWrapper             from "@/src/components/3DBook/BookWrapper";
import type { TattooProduct }  from "@/src/components/3DBook/UI";

const getHeroCollections = cache(getHomePageHeroCollections);

function toBookProduct(p: any): TattooProduct {
  return {
    id:             p.id,
    title:          p.title,
    handle:         p.handle,
    price:          p.checkout?.price ?? 0,
    compareAtPrice: p.checkout?.compareAtPrice ?? undefined,
    frontImage:     p.media?.featuredImage ?? "https://picsum.photos/seed/jt-cover/800/1200",
    backImage:      p.media?.hoverImage    ?? p.media?.featuredImage ?? "https://picsum.photos/seed/jt-back/800/1200",
    themes:         p.attributes?.themes    ?? [],
    placements:     p.attributes?.placements ?? [],
    colorType:      p.styling?.tattooColorType ?? "Color",
    badge:          p.styling?.badges?.[0]?.label,
  };
}

async function HeroWithData() {
  try {
    const products = await getHeroCollections();
    return <Hero initialProducts={products} />;
  } catch (error) {
    console.error("Failed to fetch hero products:", error);
    return <Hero initialProducts={[]} />;
  }
}

async function BookWithData() {
  try {
    const raw = await getHeroCollections();
    const products: TattooProduct[] = (raw ?? []).map(toBookProduct);
    return (
      <div className="w-full h-[800px] relative">
        <BookWrapper products={products} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch book products:", error);
    return (
      <div className="w-full h-[800px] relative">
        <BookWrapper />
      </div>
    );
  }
}

function HeroSkeleton() {
  return (
    <div className="relative w-full h-[100dvh] min-h-[800px] bg-[var(--color-bg-base)] overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-base)]/95 via-[#111]/40 to-[var(--color-bg-base)] z-0" />
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center justify-between pt-24 pb-32">
        <div className="w-full lg:w-5/12 flex flex-col gap-6 md:gap-8 animate-pulse">
          <div className="w-24 h-6 bg-white/5 rounded-full border border-white/10" />
          <div className="flex flex-col gap-3 mt-2">
            <div className="h-16 md:h-24 w-[90%] bg-white/10 rounded-xl" />
            <div className="h-16 md:h-24 w-[70%] bg-white/10 rounded-xl" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="h-14 w-full sm:w-48 bg-white/10 rounded-full" />
            <div className="h-14 w-full sm:w-40 bg-white/5 border border-white/10 rounded-full" />
          </div>
        </div>
        <div className="w-full lg:w-7/12 h-[50vh] lg:h-[80vh] flex items-center justify-center">
          <div className="relative w-[260px] h-[360px] sm:w-[320px] sm:h-[440px] animate-pulse">
            <div className="absolute inset-0 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BookSkeleton() {
  return (
    <div className="w-full h-[800px] bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,122,0,0.08) 0%, transparent 70%)" }}
      />
      <div className="flex flex-col items-center gap-4 z-10">
        <div className="w-16 h-16 rounded-full border border-[#FF7A00]/20 animate-pulse" />
        <p className="text-[#FF7A00] tracking-[0.3em] text-lg" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
          LOADING LOOKBOOK
        </p>
      </div>
    </div>
  );
}

// FIX: Swapped force-dynamic for Incremental Static Regeneration (ISR).
// This serves cached HTML to 99% of visitors while revalidating in the background.
export const revalidate = 60;

export default function HomePage() {
  async function fetchNewArrivalsAction() {
    "use server";
    return getHomePageNewArrivals(10);
  }

  async function fetchCollectionsAction() {
    "use server";
    return getHomePageCollections(10);
  }

  return (
    <div className="w-full flex flex-col items-center overflow-visible bg-[var(--color-bg-base)]">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroWithData />
      </Suspense>

      <Suspense fallback={<BookSkeleton />}>
        <BookWithData />
      </Suspense>

      <ShowcaseCarousel
        overline="JUST DROPPED"
        titleHighlight="NEW"
        titleMain="ARRIVALS"
        viewAllLink="/collections/new-arrival"
        fetchFunction={fetchNewArrivalsAction}
        mode="product"
      />

      <ShowcaseCarousel
        overline="CURATED FOR YOU"
        titleHighlight="OUR"
        titleMain="COLLECTIONS"
        subtitle="1,000+ premium designs across every style, mood, and placement."
        viewAllLink="/collections"
        fetchFunction={fetchCollectionsAction}
        mode="collection"
      />

      <TattooStudio />
      <CommunityGallerySection />
      <HowItWorks />
      <SafeForSkinSection />
      <DynamicReviews />
      <FaqSection />
      <NewsletterSection />
    </div>
  );
}