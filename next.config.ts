// // import type { NextConfig } from "next";

// // const config: NextConfig = {
// //   images: {
// //     unoptimized: true,
// //     remotePatterns: [
// //       {
// //         protocol: "https",
// //         hostname: "images.unsplash.com",
// //         pathname: "/**",
// //       },
// //       {
// //         protocol: 'https',
// //         hostname: 'cdn.shopify.com',
// //         pathname: '/s/files/**',
// //       },
// //     ],
// //     formats: ['image/avif', 'image/webp'],
// //   },
// //   async redirects() {
// //     return [
// //       {
// //         source: '/shipping-policy',
// //         destination: '/shipping',
// //         permanent: true, // 301 Redirect (Passes SEO juice)
// //       },
// //       {
// //         source: '/refund-policy',
// //         destination: '/returns',
// //         permanent: true,
// //       },
// //       {
// //         source: '/sale',
// //         destination: '/collections/sale',
// //         permanent: true,
// //       },
// //       {
// //         source: '/new-arrivals',
// //         destination: '/collections/new-arrival',
// //         permanent: true,
// //       },
// //     ];
// //   },
// // };

// // export default config;



// import type { NextConfig } from "next";

// // =========================================================
// // TYPESCRIPT INTERFACES FOR SHOPIFY GRAPHQL
// // =========================================================
// interface ShopifyRedirect {
//   source: string;
//   destination: string;
//   permanent: boolean;
// }

// // Update this interface at the top of next.config.ts
// interface ShopifyRedirect {
//   source: string;
//   destination: string;
//   permanent: boolean;
//   has?: Array<{ type: string; value: string }>;
// }

// interface ShopifyProductEdge {
//   node: {
//     handle: string;
//     variants?: {
//       edges: Array<{
//         node: {
//           sku: string | null;
//         };
//       }>;
//     };
//   };
// }

// interface ShopifyGraphQLResponse {
//   data?: {
//     products?: {
//       pageInfo: {
//         hasNextPage: boolean;
//         endCursor: string | null;
//       };
//       edges: ShopifyProductEdge[];
//     };
//   };
//   errors?: Array<{ message: string }>;
// }

// // =========================================================
// // DYNAMIC REDIRECT MATCHER
// // =========================================================
// /**
//  * Dynamically fetches all products from Shopify to map old SKU-based URLs
//  * to the new SEO-friendly handles.
//  * * FALLBACK BUILT-IN: Fully typed to prevent build crashes.
//  */
// async function getDynamicShopifyRedirects(): Promise<ShopifyRedirect[]> {
//   const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
//   const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
//   //console.log("🚀 Starting dynamic redirect fetch from Shopify...");
//   // FALLBACK 1: Missing Environment Variables
//   if (!domain || !token) {
//     //console.warn("⚠️ Missing Shopify env variables. Skipping dynamic redirects so build doesn't break.");
//     return [];
//   }

//   const endpoint = `https://${domain}/api/2024-01/graphql.json`;
//   let hasNextPage = true;
//   let cursor: string | null = null;
  
//   // Strongly typed array instead of any[]
//   const dynamicRedirects: ShopifyRedirect[] = [];

//   try {
//     // Loop to handle pagination
//     while (hasNextPage) {
//       console.log(`Fetching batch of products... (Cursor: ${cursor || "Start"})`);
//       const query = `
//         query getProductsForRedirects($cursor: String) {
//           products(first: 250, after: $cursor) {
//             pageInfo {
//               hasNextPage
//               endCursor
//             }
//             edges {
//               node {
//                 handle
//                 variants(first: 1) {
//                   edges {
//                     node {
//                       sku
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `;

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Storefront-Access-Token": token,
//         },
//         body: JSON.stringify({ query, variables: { cursor } }),
//       });

//       // FALLBACK 2: API Error Response
//       if (!res.ok) {
//         //console.warn(`⚠️ Shopify API returned status ${res.status}. Skipping dynamic redirects.`);
//         return [];
//       }

//       // Cast the response to our strict TypeScript Interface
//       const json = (await res.json()) as ShopifyGraphQLResponse;
//       const data = json?.data?.products;

//       // FALLBACK 3: Empty or malformed data
//       if (!data || !data.edges) {
//         //console.log("⚠️ No product data found in Shopify response.");
//         break;
//       }
//       //if (!data || !data.edges) break;
//       //console.log(`📦 Received ${data.edges.length} products in this batch.`);
//       for (const edge of data.edges) {
//         const newHandle = edge.node.handle;
//         const sku = edge.node.variants?.edges?.[0]?.node?.sku;

//         if (sku && newHandle) {
          
//           // Format the SKU to match the old URL format (lowercase, replace spaces with dashes)
//           const oldSkuSlug = sku.toLowerCase().trim().replace(/\s+/g, '-');
//           //console.log(`Evaluating -> SKU Slug: /${oldSkuSlug} | New Handle: /${newHandle}`);
//           // Only create a redirect if the Shopify admin has updated the handle
//           if (oldSkuSlug !== newHandle.toLowerCase()) {
//             //console.log(`   ✅ Redirect created: /products/${oldSkuSlug} -> /products/${newHandle}`);
//             dynamicRedirects.push({
//               source: `/products/${oldSkuSlug}`,
//               destination: `/products/${newHandle}`,
//               permanent: true, // 301 Permanent Redirect for SEO
//             });
//           } else {
//             console.log(`   ⏭️ Skipped: SKU and Handle are identical.`);
//           }
//         } else {
//           console.log(`   ❌ Skipped: Missing SKU or Handle for product: ${newHandle || "Unknown"}`);
//         }
//       }

//       hasNextPage = data.pageInfo.hasNextPage;
//       cursor = data.pageInfo.endCursor;
//     }
//     //console.log(`\n🎉 DONE! Successfully mapped ${dynamicRedirects.length} total redirects.`);
//     //console.log("Full Redirects Array:", JSON.stringify(dynamicRedirects, null, 2));
//     //console.log(`✅ Successfully mapped ${dynamicRedirects.length} dynamic product redirects from Shopify.`);
//     return dynamicRedirects;

//   } catch (error: unknown) {
//     // FALLBACK 4: Network failure or complete crash (Typed as unknown to satisfy strict TS)
//     //console.error("❌ Failed to fetch dynamic Shopify redirects (Build Continuing Safely):", error);
//     return []; // Return empty array to keep the build alive
//   }
// }

// // =========================================================
// // NEXT.JS CONFIGURATION
// // =========================================================
// const config: NextConfig = {
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "cdn.shopify.com",
//         pathname: "/s/files/**",
//       },
//     ],
//     formats: ["image/avif", "image/webp"],
//   },
  
//   async redirects(): Promise<ShopifyRedirect[]> {
//     // Await the dynamic redirects safely
//     const shopifyProductRedirects = await getDynamicShopifyRedirects();

//     return [
//       // 1. Static App Redirects
//       {
//         source: '/shipping-policy',
//         destination: '/shipping',
//         permanent: true,
//       },
//       {
//         source: '/refund-policy',
//         destination: '/returns',
//         permanent: true,
//       },
//       {
//         source: '/sale',
//         destination: '/collections/sale',
//         permanent: true,
//       },
//       {
//         source: '/new-arrivals',
//         destination: '/collections/new-arrival',
//         permanent: true,
//       },
//       {
//         source: '/:path*',
//         has: [
//           {
//             type: 'host',
//             value: 'justtattoos.com',
//           },
//         ],
//         destination: 'https://www.justtattoos.com/:path*',
//         permanent: true,
//       },

//       // 2. Dynamic Shopify Product Redirects mapped above
//       ...shopifyProductRedirects,
//     ];
//   },
// };

// export default config;

import type { NextConfig } from "next";

// =========================================================
// TYPESCRIPT INTERFACES FOR SHOPIFY GRAPHQL
// =========================================================
interface ShopifyRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

interface ShopifyProductEdge {
  node: {
    handle: string;
    variants?: {
      edges: Array<{
        node: {
          sku: string | null;
        };
      }>;
    };
  };
}

interface ShopifyGraphQLResponse {
  data?: {
    products?: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      edges: ShopifyProductEdge[];
    };
  };
  errors?: Array<{ message: string }>;
}

// =========================================================
// DYNAMIC REDIRECT MATCHER
// =========================================================
/**
 * Dynamically fetches all products from Shopify to map old SKU-based URLs
 * to the new SEO-friendly handles.
 * * FALLBACK BUILT-IN: Fully typed to prevent build crashes.
 */
async function getDynamicShopifyRedirects(): Promise<ShopifyRedirect[]> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  // FALLBACK 1: Missing Environment Variables
  if (!domain || !token) {
    return [];
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;
  let hasNextPage = true;
  let cursor: string | null = null;
  
  const dynamicRedirects: ShopifyRedirect[] = [];

  try {
    // Loop to handle pagination
    while (hasNextPage) {
      const query = `
        query getProductsForRedirects($cursor: String) {
          products(first: 250, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                handle
                variants(first: 1) {
                  edges {
                    node {
                      sku
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query, variables: { cursor } }),
      });

      // FALLBACK 2: API Error Response
      if (!res.ok) {
        return [];
      }

      const json = (await res.json()) as ShopifyGraphQLResponse;
      const data = json?.data?.products;

      // FALLBACK 3: Empty or malformed data
      if (!data || !data.edges) {
        break;
      }

      for (const edge of data.edges) {
        const newHandle = edge.node.handle;
        const sku = edge.node.variants?.edges?.[0]?.node?.sku;

        if (sku && newHandle) {
          const oldSkuSlug = sku.toLowerCase().trim().replace(/\s+/g, '-');
          
          if (oldSkuSlug !== newHandle.toLowerCase()) {
            dynamicRedirects.push({
              source: `/products/${oldSkuSlug}`,
              destination: `/products/${newHandle}`,
              permanent: true, 
            });
          }
        }
      }

      hasNextPage = data.pageInfo.hasNextPage;
      cursor = data.pageInfo.endCursor;
    }

    return dynamicRedirects;

  } catch (error: unknown) {
    // FALLBACK 4: Network failure or complete crash 
    return []; 
  }
}

// =========================================================
// NEXT.JS CONFIGURATION
// =========================================================
const config: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  
  async redirects() {
    const shopifyProductRedirects = await getDynamicShopifyRedirects();

    return [
      // 1. Static App Redirects
      {
        source: '/shipping-policy',
        destination: '/shipping',
        permanent: true,
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
      
      // 2. SEO Site-Wide Domain Redirect (justtattoos.com -> www.justtattoos.com)
      {
        source: '/:path*',
        has: [
          {
            type: 'host' as const, // <--- THIS IS THE FIX. Forces TypeScript to recognize literal type.
            value: 'justtattoos.com',
          },
        ],
        destination: 'https://www.justtattoos.com/:path*',
        permanent: true,
      },

      // 3. Dynamic Shopify Product Redirects mapped above
      ...shopifyProductRedirects,
    ];
  },
};

export default config;