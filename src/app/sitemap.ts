// // import { MetadataRoute } from 'next';
// // import { getProducts, getCollectionNames, getBlogs } from '@/src/lib/shopify';

// // export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
// //   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';

// //   // 1. Map Core Static Pages (Based on your app directory structure)
// //   const staticPaths = [
// //     '',
// //     '/about',
// //     '/contact',
// //     '/help',
// //     '/how-it-works',
// //     '/privacy-policy',
// //     '/refund-policy',
// //     '/returns',
// //     '/shipping',
// //     '/shipping-policy',
// //     '/terms-of-service',
// //     '/new-arrivals',
// //     '/sale',
// //     '/collections',
// //     '/blogs'
// //   ];

// //   const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((route) => ({
// //     url: `${siteUrl}${route}`,
// //     lastModified: new Date().toISOString(),
// //     changeFrequency: 'weekly',
// //     priority: route === '' ? 1.0 : 0.8,
// //   }));

// //   try {
// //     // 2. Fetch dynamic Shopify data in parallel for high performance
// //     const [productsRes, collections, blogs] = await Promise.all([
// //       getProducts({ first: 250 }), // Fetches max allowed products per Shopify API
// //       getCollectionNames(),
// //       getBlogs().catch(() => []),  // Fail gracefully if blogs aren't setup
// //     ]);

// //     // 3. Map Products
// //     const productRoutes: MetadataRoute.Sitemap = (productsRes?.formattedData || []).map((product) => ({
// //       url: `${siteUrl}/products/${product.handle}`,
// //       lastModified: new Date().toISOString(), 
// //       changeFrequency: 'daily',
// //       priority: 0.9,
// //     }));

// //     // 4. Map Collections
// //     const collectionRoutes: MetadataRoute.Sitemap = (collections || []).map((collection) => ({
// //       url: `${siteUrl}/collections/${collection.handle}`,
// //       lastModified: new Date().toISOString(),
// //       changeFrequency: 'weekly',
// //       priority: 0.8,
// //     }));

// //     // 5. Map Blog Listings
// //     const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog: any) => ({
// //       url: `${siteUrl}/blogs/${blog.handle}`,
// //       lastModified: new Date().toISOString(),
// //       changeFrequency: 'weekly',
// //       priority: 0.7,
// //     }));

// //     return [
// //       ...staticRoutes,
// //       ...productRoutes,
// //       ...collectionRoutes,
// //       ...blogRoutes,
// //     ];

// //   } catch (error) {
// //     console.error("Error generating sitemap:", error);
// //     // If the Shopify API fails during build/fetch, still return the static pages
// //     return staticRoutes;
// //   }
// // }


// import { MetadataRoute } from 'next';
// import { getProducts, getCollectionNames, getBlogs } from '@/src/lib/shopify';

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';

//   // 1. Map Core Commercial Pages (High Priority)
//   const corePaths = [
//     '',
//     '/about',
//     '/contact',
//     '/help',
//     '/how-it-works',
//     '/collections',
//     '/collections/sale',
//     '/collections/new-arrival',
//     '/blogs'
//   ];

//   const coreRoutes: MetadataRoute.Sitemap = corePaths.map((route) => ({
//     url: `${siteUrl}${route}`,
//     lastModified: new Date().toISOString(),
//     changeFrequency: 'weekly',
//     priority: route === '' ? 1.0 : 0.8,
//   }));

//   // 2. Map Policy Pages (Lowered to 0.1 as per Audit Page 9)
//   const policyPaths = [
//     '/privacy-policy',
//     '/returns',
//     '/shipping',
//     '/terms-of-service',
//   ];

//   const policyRoutes: MetadataRoute.Sitemap = policyPaths.map((route) => ({
//     url: `${siteUrl}${route}`,
//     lastModified: new Date().toISOString(),
//     changeFrequency: 'monthly',
//     priority: 0.1, // FIX: Audit requested these be lowered to 0.1
//   }));

//   try {
//     // 3. Fetch dynamic Shopify data in parallel
//     const [productsRes, collections, blogs] = await Promise.all([
//       getProducts({ first: 250 }), 
//       getCollectionNames(),
//       getBlogs().catch(() => []),  
//     ]);

//     // 4. Map Products (/products/[handle])
//     const productRoutes: MetadataRoute.Sitemap = (productsRes?.formattedData || []).map((product) => ({
//       url: `${siteUrl}/products/${product.handle}`,
//       lastModified: new Date().toISOString(), 
//       changeFrequency: 'daily',
//       priority: 0.9,
//     }));

//     // 5. Map Collections (/collections/[handle])
//     const collectionRoutes: MetadataRoute.Sitemap = (collections || []).map((collection) => ({
//       url: `${siteUrl}/collections/${collection.handle}`,
//       lastModified: new Date().toISOString(),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     }));

//     // 6. Map Blog Listings (/blogs/[handle])
//     const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog: any) => ({
//       url: `${siteUrl}/blogs/${blog.handle}`,
//       lastModified: new Date().toISOString(),
//       changeFrequency: 'weekly',
//       priority: 0.7,
//     }));

//     // Prevent duplicate mapping of sale/new-arrival if Shopify returns them natively
//     const filteredCollectionRoutes = collectionRoutes.filter(
//         (route) => route.url !== `${siteUrl}/collections/sale` && route.url !== `${siteUrl}/collections/new-arrival`
//     );

//     return [
//       ...coreRoutes,
//       ...policyRoutes,
//       ...productRoutes,
//       ...filteredCollectionRoutes,
//       ...blogRoutes,
//     ];

//   } catch (error) {
//     console.error("Error generating sitemap:", error);
//     return [...coreRoutes, ...policyRoutes];
//   }
// }

import { MetadataRoute } from 'next';
import { getProducts, getCollectionNames, getBlogs } from '@/src/lib/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';

  const corePaths = [
    '', '/about', '/contact', '/help', '/how-it-works', 
    '/collections', '/collections/sale', '/collections/new-arrival', '/blogs',
    '/privacy-policy', '/returns', '/shipping', '/terms-of-service'
  ];

  // 🚀 FIX: Removed changeFrequency and priority completely as requested
  const staticRoutes: MetadataRoute.Sitemap = corePaths.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  try {
    const [productsRes, collections, blogs] = await Promise.all([
      getProducts({ first: 250 }), 
      getCollectionNames(),
      getBlogs().catch(() => []),  
    ]);

    const productRoutes: MetadataRoute.Sitemap = (productsRes?.formattedData || []).map((product) => ({
      url: `${siteUrl}/products/${product.handle}`,
      lastModified: new Date().toISOString(), 
    }));

    const collectionRoutes: MetadataRoute.Sitemap = (collections || []).map((collection) => ({
      url: `${siteUrl}/collections/${collection.handle}`,
      lastModified: new Date().toISOString(),
    }));

    const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog: any) => ({
      url: `${siteUrl}/blogs/${blog.handle}`,
      lastModified: new Date().toISOString(),
    }));

    const filteredCollectionRoutes = collectionRoutes.filter(
        (route) => route.url !== `${siteUrl}/collections/sale` && route.url !== `${siteUrl}/collections/new-arrival`
    );

    return [...staticRoutes, ...productRoutes, ...filteredCollectionRoutes, ...blogRoutes];

  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}