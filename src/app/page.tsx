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
import BookWrapper             from "@/src/components/3DBook/BookWrapper";
import HeroCardCarousel        from "../components/sections/HeroCardCarousel";
import type { TattooProduct }  from "@/src/components/3DBook/UI";

const dummyBookProducts: TattooProduct[] = Array.from({ length: 14 }, (_, i) => i + 1)
  .filter((num) => num !== 4) // Exclude number 4
  .map((num) => ({
    id:             `local-tattoo-${num}`,
    title:          `Lookbook Design ${num}`,
    handle:         `lookbook-design-${num}`,
    price:          19,
    compareAtPrice: 25,
    // frontImage maps to the image of the tattoo ON the skin
    frontImage:     `/assets/HeroImages/card${num}.webp`,
    // backImage maps to the pure tattoo design
    backImage:      `/assets/HeroImages/card${num}_tattoo.webp`,
    themes:         ["Curated", "Lookbook"],
    placements:     ["Arm", "Forearm", "Leg"],
    colorType:      "Black & Grey",
    badge:          num === 1 ? "Bestseller" : undefined,
  }));

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
      <div className="w-full h-[800px] relative">
        <BookWrapper products={dummyBookProducts} />
      </div>

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