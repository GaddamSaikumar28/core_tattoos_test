
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
 import { getCollection } from '@/src/lib/shopify';

// 1. Import your custom UI components
import SalePage from '@/src/components/shared/Sale';
import NewArrivalsPage from '@/src/components/shared/NewArrivals';

// Import your default collection UI for all other categories (Floral, Animal, etc.)
// Make sure you have this component pointing to your old `collectionspage.tsx`
// import DefaultCollectionPage from '@/src/components/shared/DefaultCollection'; 
import DefaultCollection from '@/src/components/shared/DefaultCollection';
type Props = {
  params: Promise<{ handle: string }>;
};

// =========================================================
// 2. STRICT SEO METADATA & CANONICAL ENFORCEMENT
// =========================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params; // Next.js 15 requires awaiting params
  
  // Fetch collection details specifically for the SEO meta tags
  const collection = await getCollection(handle);

  if (!collection) {
    return { title: 'Collection Not Found | Just Tattoos' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const canonicalUrl = `${siteUrl}/collections/${handle}`;

  return {
    title: collection.seo?.title || `${collection.title} | Just Tattoos`,
    description: collection.seo?.description || collection.description || `Shop the ${collection.title} collection at Just Tattoos.`,
    alternates: {
      canonical: canonicalUrl, // Fixes Issue 06 from the SEO Audit
    },
    openGraph: {
      title: collection.seo?.title || collection.title,
      description: collection.seo?.description || collection.description,
      url: canonicalUrl,
      type: 'website',
    }
  };
}

// =========================================================
// 3. MAIN SWITCHBOARD COMPONENT
// =========================================================
export default async function CollectionSwitchboardPage({ params }: Props) {
  const { handle } = await params;

  // We can fetch the collection here just to verify it actually exists in Shopify
  const collection = await getCollection(handle);
  if (!collection) return notFound();

  // --- SWITCHBOARD LOGIC ---

  // 1. If URL is /collections/sale, load the Sale UI
  if (handle === 'sale') {
    return <SalePage />;
  }

  // 2. If URL is /collections/new-arrivals, load the New Arrivals UI
  if (handle === 'new-arrival') {
    return <NewArrivalsPage />;
  }

  // 3. Fallback: If it's anything else (like /collections/floral), 
  // it loads your standard dynamic collection template.
  // We pass the handle so the default component knows which products to fetch.
  return <DefaultCollection handle={handle} />; 
}