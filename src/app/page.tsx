import { Suspense } from "react";
import { cache } from "react";
import {
  getHomePageNewArrivals,
  getHomePageCollections,
} from "@/src/lib/shopify/index";

import ShowcaseCarousel        from "../components/home/ShowcaseCarousel";
import DynamicReviews          from "../components/home/DynamicReviews";
import NewsletterSection       from "../components/home/NewsletterSection";
import TattooStudio            from "../components/home/TattooStudio";
import CommunityGallerySection from "@/src/components/home/CommunityGallery";
import HowItWorks              from "@/src/components/home/HowItWorks";
// import BookWrapper             from "@/src/components/3DBook/BookWrapper";
import HeroCardCarousel        from "../components/sections/HeroCardCarousel";
import type { TattooProduct }  from "@/src/components/3DBook/UI";

// const getHeroCollections = cache(getHomePageHeroCollections);

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

// async function BookWithData() {
//   try {
//     const raw = await getHeroCollections();
//     const products: TattooProduct[] = (raw ?? []).map(toBookProduct);
//     return (
//       <div className="w-full h-[800px] relative">
//         <BookWrapper products={products} />
//       </div>
//     );
//   } catch (error) {
//     console.error("Failed to fetch book products:", error);
//     return (
//       <div className="w-full h-[800px] relative">
//         <BookWrapper />
//       </div>
//     );
//   }
// }

// function BookSkeleton() {
//   return (
//     <div className="w-full h-[800px] bg-[#050505] flex items-center justify-center relative overflow-hidden">
//       <div
//         className="absolute inset-0"
//         style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,122,0,0.08) 0%, transparent 70%)" }}
//       />
//       <div className="flex flex-col items-center gap-4 z-10">
//         <div className="w-16 h-16 rounded-full border border-[#FF7A00]/20 animate-pulse" />
//         <p className="text-[#FF7A00] tracking-[0.3em] text-lg" style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
//           LOADING LOOKBOOK
//         </p>
//       </div>
//     </div>
//   );
// }

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
      <HeroCardCarousel />

      {/* <Suspense fallback={<BookSkeleton />}>
        <BookWithData />
      </Suspense> */}

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
      <DynamicReviews />
      <NewsletterSection />
    </div>
  );
}