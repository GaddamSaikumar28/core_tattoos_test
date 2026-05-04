import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    //unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/shipping-policy',
        destination: '/shipping',
        permanent: true, // 301 Redirect (Passes SEO juice)
      },
      {
        source: '/refund-policy',
        destination: '/returns',
        permanent: true,
      },
      {
        source: '/sale',
        destination: '/collections/sale',
        permanent: true,
      },
      {
        source: '/new-arrivals',
        destination: '/collections/new-arrival',
        permanent: true,
      },
    ];
  },
};

export default config;
