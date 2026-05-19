
import { Suspense } from "react";
import { 
  getHomePageHeroCollections, 
  getHomePageNewArrivals, 
  getHomePageCollections 
} from "@/src/lib/shopify/index";

// Import Sections
import ShowcaseCarousel from "../components/home/ShowcaseCarousel"; 
import DynamicReviews from "../components/home/DynamicReviews";
import FaqSection from "../components/home/FaqSection";
import NewsletterSection from "../components/home/NewsletterSection";
import TattooStudio from "../components/home/TattooStudio";
import Hero from "../components/hero";
import CommunityGallerySection from "@/src/components/home/CommunityGallery";
import HowItWorks from "@/src/components/home/HowItWorks";
// 1. Hero Data Fetcher
import SafeForSkinSection from "@/src/components/home/SafeForSkin";
async function HeroWithData() {
  try {
    const products = await getHomePageHeroCollections();
    return <Hero initialProducts={products} />;
  } catch (error) {
    console.error("Failed to fetch hero products:", error);
    return <Hero initialProducts={[]} />;
  }
}

// 2. Hero Skeleton
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
          <div className="h-5 w-48 bg-white/5 rounded mt-2" />
          <div className="flex flex-col gap-2 mt-2">
            <div className="h-4 w-full max-w-sm bg-white/5 rounded" />
            <div className="h-4 w-full max-w-[300px] bg-white/5 rounded" />
            <div className="h-4 w-full max-w-[340px] bg-white/5 rounded" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="h-14 w-full sm:w-48 bg-white/10 rounded-full" />
            <div className="h-14 w-full sm:w-40 bg-white/5 border border-white/10 rounded-full" />
          </div>
        </div>

        <div className="w-full lg:w-7/12 h-[50vh] lg:h-[80vh] relative mt-12 lg:mt-0 flex items-center justify-center">
          <div className="relative w-[260px] h-[360px] sm:w-[320px] sm:h-[440px] md:w-[380px] md:h-[520px] animate-pulse">
            <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl translate-x-[35%] translate-y-[-15%] scale-[0.85] rotate-6" />
            <div className="absolute inset-0 bg-[#1A1A1A] border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-end p-6">
               <div className="w-full">
                 <div className="w-20 h-3 bg-white/10 rounded mb-2" />
                 <div className="w-3/4 h-6 bg-white/20 rounded" />
               </div>
            </div>
          </div>
        </div>
        
      </div>
      <div className="absolute bottom-0 left-0 w-full h-12 md:h-14 bg-white/5 border-t border-white/10" />
    </div>
  );
}

export default function HomePage() {

  // ✨ FIX: Wrap Shopify calls in Server Actions ✨
  // This allows the Client Component to safely trigger backend functions
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
      
      {/* 4. New Arrivals */}
      <ShowcaseCarousel 
        overline="JUST DROPPED"
        titleHighlight="NEW"
        titleMain="ARRIVALS"
        viewAllLink="/collections/new-arrival"
        fetchFunction={fetchNewArrivalsAction} // Passed as Server Action
        mode="product"
      />

      {/* 5. Our Collections */}
      <ShowcaseCarousel 
        overline="CURATED FOR YOU"
        titleHighlight="OUR"
        titleMain="COLLECTIONS"
        subtitle="1,000+ premium designs across every style, mood, and placement."
        viewAllLink="/collections"
        fetchFunction={fetchCollectionsAction} // Passed as Server Action
        mode="collection"
      />
      <TattooStudio />
      <CommunityGallerySection />
      <HowItWorks />
      <SafeForSkinSection />
      {/* <Features />
      <HowItWorks /> 
      <FreeGiftComponent /> */}
      <DynamicReviews />
      <FaqSection />
      <NewsletterSection />
    </div>
  );
}