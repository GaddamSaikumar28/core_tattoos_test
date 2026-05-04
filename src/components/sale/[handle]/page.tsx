import { notFound } from 'next/navigation';
import { getProduct, getProductRecommendations } from '@/src/lib/shopify';
// import TattooProductDetail from '@/src/components/TattooProductDetail';
// import { RelatedProducts } from '@/src/components/RelatedProducts';

import TattooProductDetail from '@/src/components/sections/TattooProductDetail';
import { RelatedProducts } from '@/src/components/sections/RelatedProducts';
import { Metadata } from 'next';

type Props = {
  // Next.js 15+ requires params to be a Promise
  params: Promise<{ handle: string }>;
};

// =========================================================
// 1. DYNAMIC SEO METADATA GENERATION
// =========================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;

  // Fetch the product using the handle from the URL
  const product = await getProduct(handle);

  if (!product) {
    return { 
      title: 'Product Not Found | Just Tattoos',
      description: 'The requested sale item could not be found.'
    };
  }

  return {
    title: `Sale: ${product.title} | Just Tattoos`,
    description: product.description || `Shop our flash sale on the premium ${product.styling.tattooColorType} temporary tattoo: ${product.title}.`,
    openGraph: {
      title: `Sale: ${product.title} | Just Tattoos`,
      description: product.description || `Grab this premium temporary tattoo before the sale ends!`,
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
      title: `Sale: ${product.title}`,
      description: product.description,
      images: product.media.featuredImage ? [product.media.featuredImage] : [],
    }
  };
}

// =========================================================
// 2. MAIN SERVER COMPONENT
// =========================================================
export default async function SaleProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;

  // 1. Fetch the main product data from Shopify instantly on the server
  const product = await getProduct(handle);

  // 2. Handle 404 securely if the user types a random/expired sale URL
  if (!product) {
    notFound();
  }

  // 3. Fetch Shopify's AI-driven related products (Upsells/Cross-sells)
  const relatedProducts = await getProductRecommendations(product.id);

  return (
    <div className="bg-white min-h-screen">
      {/* We reuse the exact same TattooProductDetail component we built earlier.
        It inherently handles the pricing logic, so if the product has a 
        compareAtPrice, it will automatically show the sale styling!
      */}
      <TattooProductDetail product={product} />

      {/* Related Products Carousel at the bottom.
      */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}