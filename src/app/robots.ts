import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.justtattoos.com';

  // We extract this list to a variable since *, AhrefsBot, and AhrefsSiteAudit all use the exact same massive list.
  const commonDisallows = [
    '/a/downloads/-/*',
    '/admin',
    '/cart',
    '/orders',
    '/checkouts/',
    '/checkout',
    '/97366081834/checkouts',
    '/97366081834/orders',
    '/carts',
    '/account',
    '/collections/*sort_by*',
    '/*/collections/*sort_by*',
    '/collections/*+*',
    '/collections/*%2B*',
    '/collections/*%2b*',
    '/*/collections/*+*',
    '/*/collections/*%2B*',
    '/*/collections/*%2b*',
    '*/collections/*filter*&*filter*',
    '/blogs/*+*',
    '/blogs/*%2B*',
    '/blogs/*%2b*',
    '/*/blogs/*+*',
    '/*/blogs/*%2B*',
    '/*/blogs/*%2b*',
    '/*?*oseid=*',
    '/*preview_theme_id*',
    '/*preview_script_id*',
    '/policies/',
    '/*/policies/',
    '/*/*?*ls=*&ls=*',
    '/*/*?*ls%3D*%3Fls%3D*',
    '/*/*?*ls%3d*%3fls%3d*',
    '/search',
    '/sf_private_access_tokens',
    '/services/login_with_shop',
    '/apple-app-site-association',
    '/.well-known/shopify/monorail',
    '/cdn/wpm/*.js',
    '/recommendations/products',
    '/*/recommendations/products',
    '/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote',
    '/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote',
    '/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote',
    '/*/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote'
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: commonDisallows,
      },
      {
        userAgent: 'adsbot-google',
        disallow: [
          '/checkouts/',
          '/checkout',
          '/carts',
          '/orders',
          '/97366081834/checkouts',
          '/97366081834/orders',
          '/*?*oseid=*',
          '/*preview_theme_id*',
          '/*preview_script_id*',
          '/cdn/wpm/*.js',
          '/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote',
          '/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote',
          '/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote',
          '/*/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote',
          '/sf_private_access_tokens',
          '/services/login_with_shop'
        ],
      },
      {
        userAgent: 'Nutch',
        disallow: ['/'],
      },
      {
        userAgent: 'AhrefsBot',
        crawlDelay: 10,
        disallow: commonDisallows,
      },
      {
        userAgent: 'AhrefsSiteAudit',
        crawlDelay: 10,
        disallow: commonDisallows,
      },
      {
        userAgent: 'MJ12bot',
        crawlDelay: 10,
      },
      {
        userAgent: 'Pinterest',
        crawlDelay: 1,
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,  
  };
}