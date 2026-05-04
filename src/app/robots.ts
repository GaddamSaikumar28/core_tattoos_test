// import { MetadataRoute } from 'next';

// export default function robots(): MetadataRoute.Robots {
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';

//   return {
//     rules: {
//       userAgent: '*',
//       allow: '/',
//       disallow: [
//         '/cart',
//         '/checkout',
//         '/account',
//         '/account/*',
//         '/admin',
//         '/api',
//         '/api/*',
//         '/search'
//       ],
//     },
//     sitemap: `${siteUrl}/sitemap.xml`,
//     host: siteUrl,
//   };
// }

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/cart',
        '/checkout',
        '/checkouts/',
        '/carts',
        '/orders',
        '/account',
        '/account/*',
        '/admin',
        '/api',
        '/api/*',
        '/search',
        // --- SHOPIFY STANDARD SEO BLOCKS (From Audit Issue 01) ---
        '/collections/*sort_by*',
        '/*/collections/*sort_by*',
        '/collections/*+*',
        '/collections/*filter*',
        '/blogs/*+*',
        '/policies/'
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}