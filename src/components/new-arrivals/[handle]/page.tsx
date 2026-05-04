import { notFound } from 'next/navigation';
import { getProduct, getProductRecommendations } from '@/src/lib/shopify';
// import TattooProductDetail from '@/src/components/TattooProductDetail';
// import { RelatedProducts } from '@/src/components/RelatedProducts';

import TattooProductDetail from '@/src/components/sections/TattooProductDetail';
import { RelatedProducts } from '@/src/components/sections/RelatedProducts';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ handle: string }>;
};

// =========================================================
// 1. DYNAMIC SEO METADATA GENERATION
// =========================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;

  const product = await getProduct(handle);

  if (!product) {
    return { 
      title: 'Product Not Found | Just Tattoos',
      description: 'The requested new arrival could not be found.'
    };
  }

  return {
    title: `New: ${product.title} | Just Tattoos`,
    description: product.description || `Be the first to wear our newest temporary tattoo: ${product.title}.`,
    openGraph: {
      title: `New Arrival: ${product.title} | Just Tattoos`,
      description: product.description || `Check out our newest premium temporary tattoo!`,
      images: product.media.featuredImage ? [
        {
          url: product.media.featuredImage,
          width: 800,
          height: 800,
          alt: product.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `New: ${product.title}`,
      description: product.description,
      images: product.media.featuredImage ? [product.media.featuredImage] : [],
    }
  };
}

// =========================================================
// 2. MAIN SERVER COMPONENT
// =========================================================
export default async function NewArrivalDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;

  // 1. Fetch data directly from Shopify
  const product = await getProduct(handle);

  // 2. Safely 404 if the handle doesn't exist
  if (!product) {
    notFound();
  }

  // 3. Fetch Shopify's AI recommendations
  const relatedProducts = await getProductRecommendations(product.id);

  return (
    <div className="bg-white min-h-screen">
      {/* TattooProductDetail handles the UI natively. 
        It will automatically show the "New Arrival" badge if 
        you pass that logic from your mapShopifyProductsForProduction function!
      */}
      <TattooProductDetail product={product} />

      {/* Related Products Carousel */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}