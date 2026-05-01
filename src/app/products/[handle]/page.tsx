import { notFound } from 'next/navigation';
import { getProduct, getProductRecommendations } from '@/src/lib/shopify';
import TattooProductDetail from '@/src/components/sections/TattooProductDetail';
import { RelatedProducts } from '@/src/components/sections/RelatedProducts';
import { Breadcrumbs } from '@/src/components/shared/Breadcrumbs';
import { Metadata } from 'next';

type Props = { params: Promise<{ handle: string }> };

// =========================================================
// 1. STRICT SEO METADATA & CANONICAL ENFORCEMENT
// =========================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    return { title: 'Product Not Found | Just Tattoos' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const canonicalUrl = `${siteUrl}/products/${product.handle}`;
  const plainTextDescription = product.description.replace(/<[^>]+>/g, '').substring(0, 155) + '...';

  return {
    title: `${product.title} | Just Tattoos`,
    description: plainTextDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.title,
      description: plainTextDescription,
      url: canonicalUrl,
      images: product.media.featuredImage ? [{ url: product.media.featuredImage, width: 800, height: 800, alt: product.title }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    }
  };
}

// =========================================================
// 2. UNIFIED PRODUCT RENDERER
// =========================================================
// export default async function GlobalProductPage({ params }: Props) {
//   const resolvedParams = await params;
//   const product = await getProduct(resolvedParams.handle);

//   if (!product) notFound();

//   const relatedProducts = await getProductRecommendations(product.id);

//   return (
//     <div className="bg-white min-h-screen">
//       {/* TattooProductDetail inherently handles pricing. 
//         If a user clicked from /sale, it will STILL show the sale price natively!
//       */}
//       <TattooProductDetail product={product} />

//       {relatedProducts && relatedProducts.length > 0 && (
//         <RelatedProducts products={relatedProducts} />
//       )}
//     </div>
//   );
// }


export default async function GlobalProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) notFound();

  const relatedProducts = await getProductRecommendations(product.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';

  // --- 1. Construct the Strict Product JSON-LD (Point 10) ---
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description.replace(/<[^>]+>/g, ''), // Strip HTML
    image: product.media.featuredImage ? [product.media.featuredImage] : [],
    brand: { '@type': 'Brand', name: 'Just Tattoos' },
    // Only grab SKU if it exists
    ...(product.allVariants?.[0]?.sku && { sku: product.allVariants[0].sku }),
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.handle}`,
      //priceCurrency: 'USD',
      priceCurrency: product.checkout.currency || 'USD',
      //price: product?.priceRange?.minVariantPrice.amount,
      price: product.checkout.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inventory.availableForSale 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Just Tattoos' }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* --- 2. Inject Product Schema --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* --- 3. Render Breadcrumbs (UI + Schema) --- */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs 
          items={[
            { label: 'Home', url: '/' },
            { label: 'Temporary Tattoos', url: '/collections' },
            { label: product.title, url: `/products/${product.handle}` }
          ]} 
        />
      </div>

      <TattooProductDetail product={product} />

      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}