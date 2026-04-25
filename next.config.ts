import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    //unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        // This catches anything after /blogs/ 
        // e.g., /blogs/news or /blogs/news/my-first-post
        source: '/blogs/:path*', 
        
        // This silently proxies the traffic to your native Shopify blog behind the scenes
        // destination: 'https://justtattoos.myshopify.com/blogs/:path*', 
        destination: 'https://checkout.justtattoos.com/blogs/:path*',
      },
    ];
  },
};

export default config;
