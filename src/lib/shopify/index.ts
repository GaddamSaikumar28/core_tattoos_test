
'use server';


import { getProductsQuery, getCollectionNamesQuery, searchProductsQuery , getAboutPageQuery, getHowItWorksPageQuery, getFaqSectionQuery, getSafeForSkinSectionQuery} from './queries';
import { getProductByHandleQuery, getProductRecommendationsQuery } from './queries';
import { getCollectionProductsQuery } from './queries';
import { 
  getCartQuery, 
  createCartMutation, 
  addToCartMutation, 
  removeFromCartMutation, 
  updateCartMutation,
  updateCartBuyerIdentityMutation
} from './queries';
// --- SHARED TYPES FOR PRODUCTION ---
// export interface Variant {
//   variantId: string;
//   title: string;
//   price: number;
//   compareAtPrice: number | null;
//   currency: string;
//   sku: string | null;
//   availableForSale: boolean;
//   quantityAvailable: number | null;
//   selectedOptions: { name: string; value: string }[];
// }

export interface Variant {
  variantId: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  sku: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: { name: string; value: string }[];
  image?: { url: string; altText: string; width: number; height: number } | null; // ADD THIS LINE
}
export interface SkinToneSwatch {
  hexCode: string;
  imageUrl: string;
}
export interface FormattedProduct {
  id: string;
  handle: string;
  slug: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  checkout: {
    defaultVariantId: string | null;
    price: number;
    compareAtPrice: number | null;
    currency: string;
    discountPercentage: number | null;
  };
  inventory: {
    availableForSale: boolean;
    inStock: boolean;
    stockLevel: number;
  };
  media: {
    featuredImage: string | null;
    hoverImage: string | null;
    gallery: any[];
    videos: any[];
    models: any[];
    arOverlayImage: string | null;
    angleViews: TattooAngleView[];
  };
  attributes: {
    placements: string[];
    themes: string[];
    sizes: string[];
    rawCollections: string[];
    tags: string[];
  };
  styling: {
    badges: { type: string; label: string; color: string }[];
    tattooColorType: string;
    uiBackgroundColor: string;
    cardTheme: string;
    aspectRatio: string;
  };
  skinToneSwatches: SkinToneSwatch[];
  allVariants: Variant[];
}
export interface TattooAngleView {
  name: string;
  degree: number;
  imageUrl: string | null;
}
export interface SearchResult {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
  category?: string;
}

interface CollectionName {
  title: string;
  handle: string;
}

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || '2024-01';

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  if (!domain || !storefrontAccessToken) {
    throw new Error(`Missing Shopify environment variables.`);
  }

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      console.error('Shopify GraphQL Errors:', body.errors);
      throw body.errors[0];
    }

    return { status: result.status, body };
  } catch (e) {
    console.error('Shopify Fetch Error:', e);
    throw { error: e, query };
  }
}

export async function getProducts({
  query,
  first = 12,
  after,
  reverse,
  sortKey
}: {
  query?: string;
  first?: number;
  after?: string;
  reverse?: boolean;
  sortKey?: string;
} = {}) {
  const res = await shopifyFetch<any>({
    query: getProductsQuery,
    tags: ['products'], 
    variables: {
      first,
      after,
      reverse: reverse || false,
      sortKey: sortKey || 'CREATED_AT',
      ...(query && { query })
    },
    //cache: 'no-store',
  });

  const productsData = res.body?.data?.products;

  if (!productsData?.edges) {
    return { formattedData: [] as FormattedProduct[], pageInfo: { hasNextPage: false, endCursor: null } };
  }

  return {
    formattedData: await mapShopifyProductsForProduction(productsData) as FormattedProduct[],
    pageInfo: productsData.pageInfo,
  };
}

export async function getCollectionNames(): Promise<CollectionName[]> {
  const res = await shopifyFetch<any>({
    query: getCollectionNamesQuery,
    tags: ['collections'],
    variables: { first: 250 },
    //cache: 'no-store',
  });

  if (!res.body?.data?.collections?.edges) return [];

  return res.body.data.collections.edges.map(({ node }: any) => ({
    title: node.title,
    handle: node.handle
  })).filter((collection: CollectionName) => 
      !collection.title.toLowerCase().includes('home')
    );
}

export async function searchShopifyProducts(searchQuery: string): Promise<SearchResult[]> {
  const sanitizedQuery = searchQuery.replace(/[^\w\s-]/g, '').trim();
  if (!sanitizedQuery) return [];
  const variables = {
    // The asterisk (*) acts as a wildcard so 'tat' matches 'tattoo'
    //query: `${searchQuery}*` 
    query: `${sanitizedQuery}*`
  };

  try {
    const res = await shopifyFetch<any>({
      // query: searchProductsQuery,
      // // We don't want to highly cache search queries as they are highly variable
      // //cache: 'no-store', 
      // variables
      query: searchProductsQuery,
      // 2. PERFORMANCE: 'no-store' hits the API every keystroke. 
      // Using 'force-cache' with a short revalidate saves quota and speeds up UI heavily.
      cache: 'force-cache',
      tags: ['search'],
      variables: {
        ...variables,
        // Passing 'next' options directly if shopifyFetch supports it
      }

    });

    if (!res.body?.data?.products?.edges) return [];

    return res.body.data.products.edges.map(({ node }: any) => {
      // 3. DEFENSIVE CHECKS: Ensure price and images exist so the UI doesn't crash
      const minPrice = node.priceRange?.minVariantPrice?.amount || "0";
      const imageUrl = node.images?.edges?.[0]?.node?.url || '/assets/images/placeholder.png';

      return {
        id: node.id,
        handle: node.handle,
        title: node.title,
        price: parseFloat(minPrice).toFixed(2),
        image: imageUrl,
        category: node.productType || 'Product',
      };
    });


  } catch (error) {
    // console.error("Failed to search products:", error);
    // return []; // Graceful failure so the UI dropdown doesn't crash
    console.error("Failed to search products in Shopify API:", error);
    // Throwing instead of returning [] allows the frontend try/catch to actually catch it
    throw new Error("Search functionality unavailable");
  }
}

// --- 1. CONFIGURATION & CONSTANTS ---
const TATTOO_CATEGORIES = {
  placements: ["Hand", "Foot", "Ankle & Wrist", "Back, Torso & Chest Pieces", "Leg and Arm Pieces", "Finger", "Sleeve", "Spine", "Body Part"],
  themes: ["Animal", "Fantasy", "Nature", "Spiritual", "Symbols and Quotes", "Connection/Couple Art", "Floral", "Insects", "Celestial Art", "Japanese Art", "Tribal Art", "Dog", "Cat", "Eagle", "Fish"],
  sizes: ["Small", "Medium", "Large"]
};
 const UI_COLORS = [

  '#7F8C8D', 
  '#95A5A6', // Soft Gunmetal (Lighter, metallic grey)
  '#696969', // Dim Grey (True, balanced mid-dark grey)
  '#7A7571', // Warm Taupe Grey (Brown/red-leaning grey, very organic)
  '#363636',  // Heavy Graphite / Onyx (Almost black, high contrast)
  '#b2b2b2',
  '#919191',
  '#919291'
];

// --- 2. UTILITY FUNCTIONS ---
const calculateDiscount = (price: number, compareAtPrice: number | null): number | null => {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.round(discount); 
};

// --- 3. MAIN MAPPING FUNCTION ---
export async function mapShopifyProductsForProduction(shopifyJson: any) {
  if (!shopifyJson?.edges) return [];

  return shopifyJson.edges.map(({ node }: any) => {
    const collections = node.collections?.edges?.map((c: any) => c.node.title) || [];
    const rawTags = node.tags || [];
    
    const allMedia = node.media?.edges?.map((m: any) => m.node) || [];
    const images: any[] = [];
    const videos: any[] = [];
    const models: any[] = [];
    const legacyImages = node.images?.edges?.map((img: any) => img.node) || [];
    const mediaToProcess = allMedia.length > 0 ? allMedia : legacyImages;
    
    mediaToProcess.forEach((mediaItem: any) => {
      if (mediaItem.mediaContentType === 'MODEL_3D') {
        models.push({
          sources: mediaItem.sources || [],
        });
      }

      else if (mediaItem.mediaContentType === 'VIDEO' || mediaItem.sources) {
        videos.push({
          url: mediaItem.sources?.[0]?.url,
          previewImage: mediaItem.previewImage?.url || null,
        });
      } else {
        images.push({
          url: mediaItem.url || mediaItem.image?.url,
          altText: mediaItem.altText || node.title,
          width: mediaItem.width || mediaItem.image?.width,
          height: mediaItem.height || mediaItem.image?.height
        });
      }
    });

    const rawSwatches = node.skinToneSwatches?.references?.edges || [];
    const skinToneSwatches = rawSwatches.map(({ node: swatchNode }: any) => {
      return {
        hexCode: swatchNode.hexCode?.value || null,
        imageUrl: swatchNode.previewImage?.reference?.image?.url || null,
      };
    }).filter((swatch: SkinToneSwatch) => swatch.hexCode && swatch.imageUrl);
    const arOverlayUrl = node.arOverlayImage?.reference?.image?.url || null;
    const rawAngles = node.tattooAngleViews?.references?.edges || [];
    const angleViews: TattooAngleView[] = rawAngles.map(({ node: angleNode }: any) => {
      return {
        name: angleNode.angleName?.value || "Side View",
        degree: angleNode.angleDegree?.value ? parseInt(angleNode.angleDegree.value, 10) : 0,
        imageUrl: angleNode.angleImage?.reference?.image?.url || null,
      };
    }).filter((view: TattooAngleView) => view.imageUrl);
    const variants = node.variants?.edges?.map((v: any) => ({
      variantId: v.node.id, 
      title: v.node.title,
      price: parseFloat(v.node.price?.amount || "0"),
      compareAtPrice: v.node.compareAtPrice ? parseFloat(v.node.compareAtPrice.amount) : null,
      currency: v.node.price?.currencyCode || "USD",
      sku: v.node.sku || null,
      availableForSale: v.node.availableForSale || false,
      quantityAvailable: v.node.quantityAvailable ?? null,
      selectedOptions: v.node.selectedOptions || [],
      image: v.node.image ? {
        url: v.node.image.url,
        altText: v.node.image.altText || v.node.title,
        width: v.node.image.width,
        height: v.node.image.height
      } : null
    })) || [];

    const defaultVariant = variants[0] || {};
    const isOnSale = defaultVariant.compareAtPrice && defaultVariant.price 
      ? defaultVariant.compareAtPrice > defaultVariant.price 
      : false;

    const isColored = collections.includes('Colored Art') || rawTags.includes('Color');

    return {
      id: node.id,
      handle: node.handle,        
      slug: node.handle,          
      title: node.title,
      vendor: node.vendor || "Unknown Artist",
      description: node.description,
      descriptionHtml: node.descriptionHtml,

      checkout: {
        defaultVariantId: defaultVariant.variantId || null, 
        price: defaultVariant.price || 0,
        compareAtPrice: defaultVariant.compareAtPrice || null,
        currency: defaultVariant.currency || "USD",
        discountPercentage: calculateDiscount(defaultVariant.price || 0, defaultVariant.compareAtPrice || null),
      },

      inventory: {
        availableForSale: node.availableForSale !== undefined ? node.availableForSale : (defaultVariant.availableForSale || false),
        inStock: defaultVariant.quantityAvailable !== null ? defaultVariant.quantityAvailable > 0 : true,
        stockLevel: defaultVariant.quantityAvailable || 0,
      },

      media: {
        featuredImage: node.featuredImage?.url || images[0]?.url || null,
        hoverImage: images[1]?.url || null, 
        gallery: images,                    
        videos: videos,  
        models: models,
        arOverlayImage: arOverlayUrl,
        angleViews: angleViews                   
      },

      attributes: {
        placements: collections.filter((c: string) => TATTOO_CATEGORIES.placements.includes(c)),
        themes: collections.filter((c: string) => TATTOO_CATEGORIES.themes.includes(c)),
        sizes: collections.filter((c: string) => TATTOO_CATEGORIES.sizes.includes(c)),
        rawCollections: collections,
        tags: rawTags,
      },

      styling: {
        badges: [
          collections.includes('New Arrivals') ? { type: 'new', label: 'New Arrival', color: '#000000' } : null,
          isOnSale ? { type: 'sale', label: 'Sale', color: '#FF3366' } : null,
          (defaultVariant.variantId && !defaultVariant.availableForSale) ? { type: 'sold_out', label: 'Sold Out', color: '#999999' } : null
        ].filter(Boolean), 
        tattooColorType: isColored ? 'Color' : 'Black & Grey',
        uiBackgroundColor: UI_COLORS[Math.floor(Math.random() * UI_COLORS.length)],
        cardTheme: "light",
        aspectRatio: (images[0] && images[0].height > images[0].width * 1.5) ? 'tall' : 'standard',
      },
      skinToneSwatches: skinToneSwatches,
      allVariants: variants
    };
  });
}

export async function getProduct(handle: string): Promise<FormattedProduct | null> {
  if (!handle) {
    console.warn("getProduct called with undefined handle");
    return null;
  }

  const res = await shopifyFetch<any>({
    query: getProductByHandleQuery,
    tags: ['products', handle],
    variables: { handle },
    cache: 'no-store',
  });

  if (!res.body?.data?.product) return null;

  // We wrap the single product in an edges array so our mapper can process it
  const mapped = await mapShopifyProductsForProduction({ edges: [{ node: res.body.data.product }] });
  return mapped[0] as FormattedProduct;
}

// 2. Fetch AI-driven Related Products
export async function getProductRecommendations(productId: string): Promise<FormattedProduct[]> {
  const res = await shopifyFetch<any>({
    query: getProductRecommendationsQuery,
    tags: ['products', 'recommendations', productId],
    variables: { productId },
        //cache: 'no-store'
  });
  

  if (!res.body?.data?.productRecommendations) return [];

  // Wrap the recommendations in an edges array for the mapper
  const edges = res.body.data.productRecommendations.map((node: any) => ({ node }));
  return await mapShopifyProductsForProduction({ edges }) as FormattedProduct[];
}

export interface CartItem {
  id: string; // The unique ID of the line item in the cart
  quantity: number;
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
  merchandise: {
    id: string; // The actual variant ID
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: { url: string; altText: string } | null;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string } | null;
  };
  lines: CartItem[];
}

// --- CART API HELPERS ---

// Formats the raw Shopify GraphQL Cart into a clean object
const reshapeCart = (cart: any): Cart => {
  if (!cart) return cart;
  return {
    ...cart,
    lines: cart.lines?.edges?.map((edge: any) => edge.node) || [],
  };
};

export async function createCart(variantId: string, quantity: number): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: createCartMutation,
    variables: { lineItems: [{ merchandiseId: variantId, quantity }] },
    //cache: 'no-store', // Carts should never be cached
  });
  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const res = await shopifyFetch<any>({
    query: getCartQuery,
    variables: { cartId },
    //cache: 'no-store',
  });
  if (!res.body.data.cart) return null; // Cart expired or deleted
  return reshapeCart(res.body.data.cart);
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: addToCartMutation,
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    //cache: 'no-store',
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: updateCartMutation,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    //cache: 'no-store',
  });
  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function removeFromCart(cartId: string, lineId: string): Promise<Cart> {
  const res = await shopifyFetch<any>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds: [lineId] },
    //cache: 'no-store',
  });
  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

// Associates a guest cart with a logged-in user's Shopify Account
export async function updateCartBuyerIdentity(cartId: string, customerAccessToken: string, email?: string,
  shippingAddress?: ShopifyAddress): Promise<Cart> {
    const buyerIdentity: any = { customerAccessToken };

  // 1. Explicitly attach the email so it pre-fills the checkout contact field
    if (email) {
      buyerIdentity.email = email;
    }

  // 2. Map the saved customer address to Shopify's expected DeliveryAddressInput
    if (shippingAddress) {
      buyerIdentity.deliveryAddressPreferences = [{
        deliveryAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address1: shippingAddress.address1,
          address2: shippingAddress.address2 || "",
          city: shippingAddress.city,
          province: shippingAddress.province,
          country: shippingAddress.country,
          zip: shippingAddress.zip,
          phone: shippingAddress.phone || "",
          company: shippingAddress.company || ""
        }
      }];
    }

  const res = await shopifyFetch<any>({
    query: updateCartBuyerIdentityMutation,
    variables: { 
      cartId, 
      buyerIdentity
    },
    cache: 'no-store',
  });
  return reshapeCart(res.body.data.cartBuyerIdentityUpdate.cart);
}


export async function getHomePageNewArrivals(limit: number = 4): Promise<FormattedProduct[]> {
  // Shopify automatically converts "Home Page New Arrivals" to this handle
  const collectionHandle = 'home-page-new-arrivals'; 

  try {
    const res = await shopifyFetch<any>({
      query: getCollectionProductsQuery,
      tags: ['collections', 'products', collectionHandle], // Great for Next.js cache invalidation
      variables: {
        handle: collectionHandle,
        first: limit,
      },
      cache: 'no-store',
    });

    // The data shape for a collection query nests the products array
    const productsData = res.body?.data?.collection?.products;

    if (!productsData?.edges) {
      console.warn(`No products found in collection: ${collectionHandle}`);
      return [];
    }

    // Pass the raw edges directly into your existing production mapper
    const formattedProducts = await mapShopifyProductsForProduction(productsData);
    
    return formattedProducts as FormattedProduct[];

  } catch (error) {
    console.error(`Error fetching collection ${collectionHandle}:`, error);
    return [];
  }
}



export async function getHomePageCollections(limit: number = 15): Promise<FormattedProduct[]> {
  // The exact handle of your new collection
  const collectionHandle = 'home-page-collections'; 

  try {
    const res = await shopifyFetch<any>({
      query: getCollectionProductsQuery,
      tags: ['collections', 'products', collectionHandle], // Caches based on this specific collection
      variables: {
        handle: collectionHandle,
        first: limit,
      },
      cache: 'no-store',
    });

    // Extract the nested products array from the collection response
    const productsData = res.body?.data?.collection?.products;

    if (!productsData?.edges) {
      console.warn(`No products found in collection: ${collectionHandle}`);
      return [];
    }

    // Run the raw Shopify data through your production mapper
    const formattedProducts = await mapShopifyProductsForProduction(productsData);
    
    return formattedProducts as FormattedProduct[];

  } catch (error) {
    console.error(`Error fetching collection ${collectionHandle}:`, error);
    return [];
  }
}



// export async function getHomePageHeroCollections(limit: number = 15): Promise<FormattedProduct[]> {
//   // The exact handle of your new collection
//   const collectionHandle = 'home-page-hero-collections'; 

//   try {
//     const res = await shopifyFetch<any>({
//       query: getCollectionProductsQuery,
//       tags: ['collections', 'products', collectionHandle], // Caches based on this specific collection
//       variables: {
//         handle: collectionHandle,
//         first: limit,
//       },
//       cache: 'no-store',
//     });

//     // Extract the nested products array from the collection response
//     const productsData = res.body?.data?.collection?.products;

//     if (!productsData?.edges) {
//       console.warn(`No products found in collection: ${collectionHandle}`);
//       return [];
//     }

//     // Run the raw Shopify data through your production mapper
//     const formattedProducts = await mapShopifyProductsForProduction(productsData);
    
//     return formattedProducts as FormattedProduct[];

//   } catch (error) {
//     console.error(`Error fetching collection ${collectionHandle}:`, error);
//     return [];
//   }
// }
// Paste this into your NEW index.ts file
export async function getHomePageHeroCollections(limit: number = 15): Promise<FormattedProduct[]> {
  const collectionHandle = 'home-page-collections'; 

  try {
    const res = await shopifyFetch<any>({
      query: getCollectionProductsQuery,
      tags: ['collections', 'products', collectionHandle], 
      variables: {
        handle: collectionHandle,
        first: limit,
      },
      cache: 'no-store',
    });

    const productsData = res.body?.data?.collection?.products;

    if (!productsData?.edges) {
      console.warn(`No products found in collection: ${collectionHandle}`);
      return [];
    }

    const formattedProducts = await mapShopifyProductsForProduction(productsData);
    return formattedProducts as FormattedProduct[];

  } catch (error) {
    console.error(`Error fetching collection ${collectionHandle}:`, error);
    return [];
  }
}
// Add to index.ts

import { 
  customerCreateMutation, 
  customerAccessTokenCreateMutation, 
  customerAccessTokenDeleteMutation,
  getCustomerQuery, 
  customerRecoverMutation 
} from './queries';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
}

// 1. SIGN UP
export async function createCustomer(input: any) {
  const res = await shopifyFetch<any>({
    query: customerCreateMutation,
    variables: { input },
    //cache: 'no-store'
  });
  
  const data = res.body?.data?.customerCreate;
  if (data?.customerUserErrors?.length > 0) {
    throw new Error(data.customerUserErrors[0].message);
  }
  return data?.customer;
}

// 2. LOGIN (Generate Token)
export async function createCustomerAccessToken(input: any) {
  const res = await shopifyFetch<any>({
    query: customerAccessTokenCreateMutation,
    variables: { input },
    //cache: 'no-store'
  });

  const data = res.body?.data?.customerAccessTokenCreate;
  if (data?.customerUserErrors?.length > 0) {
    throw new Error(data.customerUserErrors[0].message);
  }
  return data?.customerAccessToken;
}

// 3. FETCH CUSTOMER BY TOKEN
export async function getCustomer(customerAccessToken: string) {
  const res = await shopifyFetch<any>({
    query: getCustomerQuery,
    variables: { customerAccessToken },
    //cache: 'no-store'
  });
  return res.body?.data?.customer;
}

// 4. FORGOT PASSWORD
export async function recoverCustomerPassword(email: string) {
  const res = await shopifyFetch<any>({
    query: customerRecoverMutation,
    variables: { email },
    //cache: 'no-store'
  });
  const data = res.body?.data?.customerRecover;
  if (data?.customerUserErrors?.length > 0) {
    throw new Error(data.customerUserErrors[0].message);
  }
  return true;
}

// 5. LOGOUT (Delete Token)
export async function deleteCustomerAccessToken(customerAccessToken: string) {
  await shopifyFetch<any>({
    query: customerAccessTokenDeleteMutation,
    variables: { customerAccessToken },
    //cache: 'no-store'
  });
  return true;
}

// src/lib/shopify/index.ts
// Add these imports at the top if not already there:
import { getCustomerOrdersQuery, customerUpdateMutation } from './queries';

// Fetch Orders
export async function getCustomerOrders(customerAccessToken: string) {
  const res = await shopifyFetch<any>({
    query: getCustomerOrdersQuery,
    variables: { customerAccessToken },
    //cache: 'no-store'
  });
  
  const orders = res.body?.data?.customer?.orders?.edges?.map((edge: any) => edge.node) || [];
  return orders;
}

// Update Profile (Can be used for name, email, phone, or password)
export async function updateCustomerProfile(customerAccessToken: string, customerData: any) {
  const res = await shopifyFetch<any>({
    query: customerUpdateMutation,
    variables: { 
      customerAccessToken,
      customer: customerData 
    },
    //cache: 'no-store'
  });

  const data = res.body?.data?.customerUpdate;
  if (data?.customerUserErrors?.length > 0) {
    throw new Error(data.customerUserErrors[0].message);
  }
  
  return {
    customer: data?.customer,
    // If password/email is changed, Shopify might return a new token
    newToken: data?.customerAccessToken?.accessToken 
  };
}

// src/lib/shopify/index.ts
// Add imports at the top
import { 
  getCustomerAddressesQuery, 
  customerAddressCreateMutation, 
  customerAddressUpdateMutation, 
  customerAddressDeleteMutation, 
  customerDefaultAddressUpdateMutation 
} from './queries';

export interface ShopifyAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}

// 1. Fetch Addresses
export async function getCustomerAddresses(customerAccessToken: string) {
  const res = await shopifyFetch<any>({
    query: getCustomerAddressesQuery,
    variables: { customerAccessToken },
    //cache: 'no-store'
  });
  
  const customer = res.body?.data?.customer;
  const addresses = customer?.addresses?.edges?.map((edge: any) => edge.node) || [];
  const defaultAddressId = customer?.defaultAddress?.id || null;
  
  return { addresses, defaultAddressId };
}

// 2. Create Address
export async function createCustomerAddress(customerAccessToken: string, address: Omit<ShopifyAddress, 'id'>) {
  const res = await shopifyFetch<any>({
    query: customerAddressCreateMutation,
    variables: { customerAccessToken, address },
    //cache: 'no-store'
  });

  const data = res.body?.data?.customerAddressCreate;
  if (data?.customerUserErrors?.length > 0) throw new Error(data.customerUserErrors[0].message);
  return data?.customerAddress;
}

// 3. Update Address
export async function updateCustomerAddress(customerAccessToken: string, id: string, address: Omit<ShopifyAddress, 'id'>) {
  const res = await shopifyFetch<any>({
    query: customerAddressUpdateMutation,
    variables: { customerAccessToken, id, address },
    //cache: 'no-store'
  });

  const data = res.body?.data?.customerAddressUpdate;
  if (data?.customerUserErrors?.length > 0) throw new Error(data.customerUserErrors[0].message);
  return data?.customerAddress;
}

// 4. Delete Address
export async function deleteCustomerAddress(customerAccessToken: string, id: string) {
  const res = await shopifyFetch<any>({
    query: customerAddressDeleteMutation,
    variables: { customerAccessToken, id },
    //cache: 'no-store'
  });

  const data = res.body?.data?.customerAddressDelete;
  if (data?.customerUserErrors?.length > 0) throw new Error(data.customerUserErrors[0].message);
  return true;
}

// 5. Set Default Address
export async function setDefaultCustomerAddress(customerAccessToken: string, addressId: string) {
  const res = await shopifyFetch<any>({
    query: customerDefaultAddressUpdateMutation,
    variables: { customerAccessToken, addressId },
    //cache: 'no-store'
  });

  const data = res.body?.data?.customerDefaultAddressUpdate;
  if (data?.customerUserErrors?.length > 0) throw new Error(data.customerUserErrors[0].message);
  return true;
}


// Add to the bottom of index.ts

export async function getAboutPageData(handle: string = 'about-page-dxkfa8ev') {
  const res = await shopifyFetch<any>({
    query: getAboutPageQuery,
    tags: ['about-page-dxkfa8ev'], // Useful for Next.js cache invalidation
    variables: { handle }
  });

  const mo = res.body?.data?.metaobject;

  if (!mo) {
    console.warn(`About page metaobject with handle "${handle}" not found.`);
    return null;
  }

  return {
    // Images
    heroImage: mo.hero_image?.reference?.image?.url || '/assets/images/placeholder.jpg',
    introImage: mo.intro_image?.reference?.image?.url || '/assets/images/placeholder.jpg',
    whoWeAreImage: mo.who_we_are_image?.reference?.image?.url || '/assets/images/placeholder.jpg',

    // Hero & Intro
    heroTitle: mo.hero_title?.value || 'ABOUT US',
    introHeading: mo.intro_heading?.value || 'Tattoos for Every Version of You',
    introParagraph: mo.intro_paragraph?.value || '',

    // Who We Are
    whoWeAreHeading: mo.who_we_are_heading?.value || 'Who We Are',
    whoWeAreParagraph1: mo.who_we_are_paragraph_1?.value || '',
    whoWeAreParagraph2: mo.who_we_are_paragraph_2?.value || '',
    whoWeAreButtonText: mo.who_we_are_button_text?.value || 'Shop Now',

    // Commitments
    commitmentsTitle: mo.commitments_title?.value || 'Our Commitments',
    commitmentsSubtitle: mo.commitments_subtitle?.value || '',

    // AODA
    aodaTitle: mo.aoda_title?.value || 'AODA',
    aodaParagraph1: mo.aoda_paragraph_1?.value || '',
    aodaParagraph2: mo.aoda_paragraph_2?.value || '',
    aodaContactLabel: mo.aoda_contact_label?.value || 'Learn more or request accommodations:',
    aodaEmail: mo.aoda_email?.value || 'support@justtattoos.com',

    // Land Ack
    landAckTitle: mo.land_ack_title?.value || 'Land Acknowledgement',
    landAckParagraph1: mo.land_ack_paragraph_1?.value || '',
    landAckParagraph2: mo.land_ack_paragraph_2?.value || '',
    landAckParagraph3: mo.land_ack_paragraph_3?.value || '',
  };
}


export async function getHowItWorksPageData(handle: string = 'how-it-works') {
  const res = await shopifyFetch<any>({
    query: getHowItWorksPageQuery,
    tags: ['how_it_works_page'],
    variables: { handle },
    ////cache: 'no-store' // Keeps it fresh while we test
  });

  const mo = res.body?.data?.metaobject;

  if (!mo) {
    console.warn(`How It Works page metaobject with handle "${handle}" not found.`);
    return null;
  }

  return {
    heroTitle: mo.hero_title?.value || 'HOW IT WORKS',
    heroImage: mo.hero_image?.reference?.image?.url || '/assets/images/Tattoo_Peeling-2996730.webp',
    introHeading: mo.intro_heading?.value || 'Your Ink, Your Way',
    introParagraph: mo.intro_paragraph?.value || '',
    
    // We combine the individual steps back into an array here
    steps: [
      {
        id: 1,
        title: mo.step_1_title?.value || 'Prime',
        description: mo.step_1_description?.value || '',
        image: mo.step_1_image?.reference?.image?.url || '/assets/images/placeholder.jpg',
        alt: mo.step_1_image?.reference?.image?.altText || 'Step 1'
      },
      {
        id: 2,
        title: mo.step_2_title?.value || 'Place',
        description: mo.step_2_description?.value || '',
        image: mo.step_2_image?.reference?.image?.url || '/assets/images/placeholder.jpg',
        alt: mo.step_2_image?.reference?.image?.altText || 'Step 2'
      },
      {
        id: 3,
        title: mo.step_3_title?.value || 'Peel',
        description: mo.step_3_description?.value || '',
        image: mo.step_3_image?.reference?.image?.url || '/assets/images/placeholder.jpg',
        alt: mo.step_3_image?.reference?.image?.altText || 'Step 3'
      }
    ]
  };
}


export async function getFaqSectionData(handle: string = 'faq-section') {
  const res = await shopifyFetch<any>({
    query: getFaqSectionQuery,
    tags: ['faq_section'],
    variables: { handle },
    ////cache: 'no-store' // Keeps it fresh while testing
  });

  const mo = res.body?.data?.metaobject;
  if (!mo) {
    console.warn(`FAQ Section metaobject with handle "${handle}" not found.`);
    return null;
  }

  // Format the nested references into a clean array
  const faqs = mo.faqs?.references?.edges?.map((edge: any) => ({
    question: edge.node.question?.value || '',
    answer: edge.node.answer?.value || ''
  })) || [];

  return {
    headerText: mo.header_text?.value || 'Got',
    headerHighlight: mo.header_highlight?.value || 'Questions?',
    subheading: mo.subheading?.value || '',
    supportTitle: mo.support_title?.value || 'Still need help?',
    supportDescription: mo.support_description?.value || '',
    supportButtonText: mo.support_button_text?.value || 'Contact Support',
    supportButtonLink: mo.support_button_link?.value || '/contact',
    faqs
  };
}


import { getHelpCenterPageQuery } from './queries';

export async function getHelpCenterPageData(handle: string = 'help-center-page') {
  const res = await shopifyFetch<any>({
    query: getHelpCenterPageQuery,
    tags: ['help_center_page'],
    variables: { handle },
   // //cache: 'no-store'
  });

  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  return {
    heroTitle: mo.hero_title?.value || 'How can we help?',
    heroDescription: mo.hero_description?.value || '',
    contactTitle: mo.contact_title?.value || 'Get in Touch',
    email: mo.email?.value || 'support@justtattoos.com',
    chatText: mo.chat_text?.value || 'Available 9am - 5pm EST',
    formTitle: mo.form_title?.value || 'Send us a message',
    successMessage: mo.success_message?.value || 'Message sent successfully!',
  };
}


import { getShippingPageQuery } from './queries';

export async function getShippingPageData(handle: string = 'shipping-page') {
  const res = await shopifyFetch<any>({
    query: getShippingPageQuery,
    tags: ['shipping_page'],
    variables: { handle },
    ////cache: 'no-store' // Keeps it fresh while testing
  });

  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  const policyBlocks = mo.policy_blocks?.references?.edges?.map((edge: any) => ({
    title: edge.node.title?.value || '',
    content: edge.node.content?.value || '',
    highlightNote: edge.node.highlight_note?.value || null
  })) || [];

  return {
    heroTitle: mo.hero_title?.value || 'SHIPPING & DELIVERY',
    heroImage: mo.hero_image?.reference?.image?.url || '/assets/images/fallback.webp',
    
    card1Title: mo.card_1_title?.value || 'Fast Processing',
    card1Text: mo.card_1_text?.value || '',
    card2Title: mo.card_2_title?.value || 'Where We Ship',
    card2Text: mo.card_2_text?.value || '',
    card3Title: mo.card_3_title?.value || 'Order Tracking',
    card3Text: mo.card_3_text?.value || '',
    
    policiesHeader: mo.policies_header?.value || 'Shipping Policy Details',
    policyBlocks,
    
    ctaTitle: mo.cta_title?.value || 'Have a question?',
    ctaText: mo.cta_text?.value || '',
    ctaButtonText: mo.cta_button_text?.value || 'Contact Support',
    ctaLink: mo.cta_link?.value || 'mailto:support@justtattoos.com',
  };
}


// Replace the previous getReturnsPageData function with this:
import { getReturnsPageQuery } from './queries';

export async function getReturnsPageData(handle: string = 'returns-page') {
  const res = await shopifyFetch<any>({
    query: getReturnsPageQuery,
    tags: ['returns_page'],
    variables: { handle },
    ////cache: 'no-store' 
  });

  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  return {
    heroTitle: mo.hero_title?.value || 'RETURNS & REFUNDS',
    heroImage: mo.hero_image?.reference?.image?.url || '/assets/images/ReturnsHero.jpg',
    heroMobileImage: mo.hero_mobile_image?.reference?.image?.url || '/assets/images/ReturnsHeroMobile.jpg',
    heroTextColor: mo.hero_text_color?.value || '#FE8204',
    
    card1Title: mo.card_1_title?.value || '14-Day Window',
    card1Text: mo.card_1_text?.value || "Reach out within 14 days of receiving your order for help with a credit or occasional refund.",
    card2Title: mo.card_2_title?.value || 'Hygiene First',
    card2Text: mo.card_2_text?.value || "For safety and sanitary reasons, we do not accept physical returns of our products.",
    card3Title: mo.card_3_title?.value || 'Simple Process',
    card3Text: mo.card_3_text?.value || "Have an issue? Just email us with photos and your order number. We've got your back.",
    
    policyTitle: mo.policy_title?.value || 'The Policy',
    policyP1: mo.policy_p1?.value || "Not all situations unfold as intended, and we understand completely.",
    policyP2: mo.policy_p2?.value || "We are happy to help you with any Just Tattoos products within <strong>14 days</strong> from the day it was received. Although physical product returns are not accepted due to hygienic reasons, assistance can still be provided through a Just Tattoos credit, or occasionally a refund.",
    policyP3: mo.policy_p3?.value || "Refunds requested after 14 days of the received date may still be eligible for a Just Tattoos credit, though we do not accept refunds for orders that are over 90 days old.",
    policyNote: mo.policy_note?.value || "<strong>Note:</strong> Original shipping charges will not be refunded. Just Tattoos may refuse a refund request if we find evidence of abuse.",
    
    issuesTitle: mo.issues_title?.value || 'Issues & Defects',
    issuesIntro: mo.issues_intro?.value || "If you run into an issue with applying your tattoo or if the products you got are damaged/defective, reach out to us! It may be eligible for a one-time resend or credit.",
    issuesEmailHeading: mo.issues_email_heading?.value || "How to request a refund or credit:",
    issuesEmailText: mo.issues_email_text?.value || "It’s super simple! Send us an email at",
    issuesEmailAddress: mo.issues_email_address?.value || "support@justtattoos.com",
    issuesList1: mo.issues_list_1?.value || "<strong>Your order number</strong>",
    issuesList2: mo.issues_list_2?.value || "<strong>Clear photos</strong> of each product you’re reaching out about (with the QR code visible; one group photo is fine as long as all codes are clear).",
    issuesList3: mo.issues_list_3?.value || "<strong>A brief explanation</strong> of the issue, defect, or reason you're hoping to get a refund.",
    issuesOutro: mo.issues_outro?.value || "Our team will review your request and get back to you with the next steps! 😊",
    
    paymentTitle: mo.payment_title?.value || 'Payment Issues',
    paymentIntro: mo.payment_intro?.value || "Having trouble checking out? We're sorry to hear that! Keep these 4 things in mind if your payment isn't going through:",
    paymentItem1Title: mo.payment_item_1_title?.value || "1. Accepted Methods",
    paymentItem1Text: mo.payment_item_1_text?.value || "Ensure you are using an accepted payment method: <strong>Visa, MasterCard, AMEX, or PayPal</strong>.",
    paymentItem2Title: mo.payment_item_2_title?.value || "2. Sufficient Balance",
    paymentItem2Text: mo.payment_item_2_text?.value || "Double-check the funds in your account. Certain prepaid cards (like Visa Pre-Paid Gift cards and Visa Debits) may not work if there isn't sufficient money to cover the total.",
    paymentItem3Title: mo.payment_item_3_title?.value || "3. Missing CVV Number",
    paymentItem3Text: mo.payment_item_3_text?.value || "If your card doesn't have a CVV number on the back, your transaction may be unsuccessful.",
    paymentItem4Title: mo.payment_item_4_title?.value || "4. Billing Address Match",
    paymentItem4Text: mo.payment_item_4_text?.value || "Check that the Billing Address you entered perfectly matches the one connected to your card. Sometimes autofill programs (like Google Chrome) enter info for another card or format it incorrectly.",

    chargesTitle: mo.charges_title?.value || 'Charges & Cancellations',
    
    // Condensed block 1
    chargesSection1Content: mo.charges_section_1_content?.value || `
        <h3 class="text-2xl font-bold text-black mb-4">When will I be charged?</h3>
        <p class="mb-4">Your account is automatically charged at the time of purchase. For security reasons, Just Tattoos does not store your credit card information and uses a one-time authorization during checkout.</p>
        <div class="space-y-4 mt-6 border-l-2 border-gray-200 pl-6">
            <div>
                <h4 class="text-black font-bold">1. Authorization</h4>
                <p class="text-base">Verifies your card is valid and has funds. The period varies by provider.</p>
            </div>
            <div>
                <h4 class="text-black font-bold">2. Capture</h4>
                <p class="text-base">Occurs daily at noon. Your charge may appear as “pending” (no interest charged) and may take up to 5 business days to post.</p>
            </div>
            <div>
                <h4 class="text-black font-bold">3. Settlement</h4>
                <p class="text-base">Happens 2–3 business days after capture. Your bank confirms the charge and it appears on your statement.</p>
            </div>
        </div>
        <p class="mt-4 text-base bg-gray-50 p-4 rounded-xl inline-block"><strong>🛒 PayPal®:</strong> Orders placed using PayPal are charged immediately at checkout.</p>
    `,

    // Condensed block 2
    chargesSection2Content: mo.charges_section_2_content?.value || `
        <h3 class="text-2xl font-bold text-black mb-4">Canceled Orders</h3>
        <p>If you cancel an order, your card will be refunded in full. An authorization hold may be placed when you order to verify funds; if canceled, the hold expires according to your bank’s policy (usually within 5 days).</p>
        <ul class="list-disc pl-5 space-y-2 mt-4 text-base">
            <li><strong>Before Capture:</strong> We can void the order, and no charge will be processed.</li>
            <li><strong>After Capture / Before Settlement:</strong> We can cancel and issue a refund. This appears after both the charge and refund settle (2–3 business days).</li>
            <li><strong>After Settlement:</strong> We can still refund your order, unless it has already shipped (in which case standard return protocols apply).</li>
        </ul>
    `
  };
}

import { getGlobalSettingsQuery } from './queries';

export async function getGlobalSettingsData() {
  try {
    const res = await shopifyFetch<any>({
      query: getGlobalSettingsQuery,
      tags: ['header_and_footer'],
      //variables: 'global-settings',
      ////cache: 'no-store' 
    });

    const mo = res.body?.data?.metaobject;
    
    return {
      headerLogo: mo?.header_logo?.reference?.image?.url || '/assets/icons/DesktopLogo.svg',
      footerLogo: mo?.footer_logo?.reference?.image?.url || '/assets/icons/DesktopLogo.svg',
      splashLogo: mo?.splash_logo?.reference?.image?.url || '/assets/icons/DesktopLogo.svg',
      splashLeftImage: mo?.splash_left_image?.reference?.image?.url || '/assets/icons/butterflys.svg',
      splashRightImage: mo?.splash_right_image?.reference?.image?.url || '/assets/icons/butterfly2s2.svg',
      
      instagramLink: mo?.instagram_link?.value || '#',
      facebookLink: mo?.facebook_link?.value || '#',
      twitterLink: mo?.twitter_link?.value || '#',
      youtubeLink: mo?.youtube_link?.value || '#',
    };
  } catch (error) {
    console.error('[Global Settings] Error fetching global settings:', error);
    return null;
  }
}


import { getHomeFeatureSectionQuery } from './queries';

export async function getHomeFeatureSectionData(handle: string = 'home_feature_section') {
   //console.log("in get home feature selection component");
  const res = await shopifyFetch<any>({
    query: getHomeFeatureSectionQuery,
    tags: ['home_feature_section'],
    variables: { handle },
    ////cache: 'no-store'
  });
  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  return {
    headerTitle1: mo.header_title_1?.value || 'Real Art.',
    headerTitle2: mo.header_title_2?.value || 'Real Fast.',
    headerDescription: mo.header_description?.value || '',
    
    image1: mo.image_1?.reference?.image?.url || '/assets/images/placeholder.png',
    
    card1Title: mo.card_1_title?.value || '',
    card1Text: mo.card_1_text?.value || '',
    card1ButtonText: mo.card_1_button_text?.value || 'Read our story',
    card1Link: mo.card_1_link?.value || '/about',
    
    card2Title: mo.card_2_title?.value || '',
    card2Text: mo.card_2_text?.value || '',
    card2ButtonText: mo.card_2_button_text?.value || 'How it works',
    card2Link: mo.card_2_link?.value || '/how-it-works',
    
    image2: mo.image_2?.reference?.image?.url || '/assets/images/placeholder.png',
  };
}

import { getHomeFreeGiftSectionQuery } from './queries';

export async function getHomeFreeGiftSectionData(handle: string = 'home_free_gift_section') {
  const res = await shopifyFetch<any>({
    query: getHomeFreeGiftSectionQuery,
    tags: ['home_free_gift_section'],
    variables: { handle },
   // //cache: 'no-store'
  });

  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  return {
    headerTitle: mo.header_title?.value || 'Free gift with your order',
    headerDescription: mo.header_description?.value || '',
    headerSubtext: mo.header_subtext?.value || '',
    
    image: mo.image?.reference?.image?.url || '/assets/images/placeholder.png',
    
    cardTitle: mo.card_title?.value || 'A Little Something Extra',
    cardText: mo.card_text?.value || '',
    buttonText: mo.button_text?.value || 'Shop collections',
    buttonLink: mo.button_link?.value || '/collections',
  };
}

// --- ADD TO BOTTOM OF index.ts ---

import { getBlogArticlesQuery, getArticleByHandleQuery } from './queries';

export async function getBlogArticles(blogHandle: string = 'news') {
  const res = await shopifyFetch<any>({
    query: getBlogArticlesQuery,
    variables: { blogHandle },
    ////cache: 'no-store',
    tags: ['blog', blogHandle],
  });
 // console.log('Shopify Response: of blog handles', JSON.stringify(res.body?.data, null, 2));
  return res.body?.data?.blog;
}

export async function getArticle(blogHandle: string, articleHandle: string) {
  const res = await shopifyFetch<any>({
    query: getArticleByHandleQuery,
    variables: { blogHandle, articleHandle },
    tags: ['blog', articleHandle],
  });
  return res.body?.data?.blog?.articleByHandle;
}

import { getBlogsQuery } from './queries';

export async function getBlogs() {
  const res = await shopifyFetch<any>({
    query: getBlogsQuery,
    tags: ['blogs'],
    ////cache: 'no-store',
  });
  
  // Return a clean array of blog nodes
 // console.log("Fetched blogs:", JSON.stringify(res.body?.data?.blogs, null, 2));
  return res.body?.data?.blogs?.edges?.map((edge: any) => edge.node) || [];
}

import { getMenuQuery } from './queries';

export async function getMenu(handle: string) {
  const res = await shopifyFetch<any>({
    query: getMenuQuery,
    variables: { handle },
    tags: ['menu', handle],
    ////cache: 'no-store',
  });
  //console.log(`Fetched menu in index file"${handle}":`, res.body?.data?.menu);
  return res.body?.data?.menu;
}

export async function getCollectionProducts({
  handle,
  first = 12,
  after,
  sortKey,
  reverse
}: {
  handle: string;
  first?: number;
  after?: string;
  sortKey?: string;
  reverse?: boolean;
}) {
  // 1. Safe cursor check for production Next.js route params
  const safeAfter = (after && after !== 'undefined' && after !== 'null' && after.trim() !== '') 
    ? after 
    : undefined;

  // 2. Build the variables object dynamically. 
  // If sortKey or reverse are missing, they simply won't exist in this object, 
  // and GraphQL will safely ignore them since they are optional.
  const queryVariables: any = {
    handle,
    first,
  };

  if (safeAfter) queryVariables.after = safeAfter;
  if (sortKey) queryVariables.sortKey = sortKey;
  if (reverse !== undefined) queryVariables.reverse = reverse;

  const res = await shopifyFetch<any>({
    query: getCollectionProductsQuery,
    variables: queryVariables,
    cache: 'no-store'
  });

  const collectionData = res.body?.data?.collection;
  const productsData = res.body?.data?.collection?.products;

  if (!productsData?.edges) {
    return { 
      formattedData: [], 
      pageInfo: { hasNextPage: false, endCursor: null }, 
      collectionImage: collectionData?.image || null 
    };
  }

  return {
    formattedData: await mapShopifyProductsForProduction(productsData),
    pageInfo: productsData.pageInfo,
    collectionImage: collectionData?.image || null
  };
}
// export async function getCollectionProducts({
//   handle,
//   first = 12,
//   after,
//   sortKey,
//   reverse
// }: {
//   handle: string;
//   first?: number;
//   after?: string;
//   sortKey?: string;
//   reverse?: boolean;
// }) {
// const safeAfter = (after && after !== 'undefined' && after !== 'null' && after.trim() !== '') 
//     ? after 
//     : undefined;

//   const res = await shopifyFetch<any>({
//     query: getCollectionProductsQuery,
//     variables: { handle, first, after: safeAfter,
//       ...(sortKey && { sortKey }),
//       ...(reverse !== undefined && { reverse }) },
//     cache: 'no-store'
//   });
//   const collectionData = res.body?.data?.collection;
//   const productsData = res.body?.data?.collection?.products;

//   if (!productsData?.edges) {
//     return { formattedData: [], pageInfo: { hasNextPage: false, endCursor: null }, collectionImage: collectionData?.image || null };
//   }

//   return {
//     formattedData: await mapShopifyProductsForProduction(productsData),
//     pageInfo: productsData.pageInfo,
//     collectionImage: collectionData?.image || null
//   };
// }

import { getCollectionQuery } from './queries';

// 2. Paste this lightweight function
export async function getCollection(handle: string) {
  const res = await shopifyFetch<any>({
    query: getCollectionQuery,
    variables: { handle },
    tags: ['collections', handle],
    //cache: 'no-store',
    // Notice we DO NOT use 'no-store' here so Next.js can cache the SEO data instantly
  });

  return res.body?.data?.collection || null;
}


// src/lib/shopify/index.ts
import { getCommunityGallerySectionQuery } from './queries';
export async function getCommunityGallerySectionData(handle: string = 'community_gallery_section') {
  const res = await shopifyFetch<any>({
    query: getCommunityGallerySectionQuery,
    tags: ['community_gallery_section'],
    variables: { handle },
    // //cache: 'no-store',
  });

  //console.log(res);
  //console.log("Fetched Community Gallery MO:", JSON.stringify(res.body?.data?.metaobject, null, 2));
  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  // Map over the references edges to cleanly extract just the image data
  const rawImages = mo.images?.references?.edges || [];
  const parsedImages = rawImages
    .map((edge: any) => {
      const img = edge.node?.image;
      if (!img) return null;
      return {
        url: img.url,
        alt: img.altText || 'Community image',
        width: img.width,
        height: img.height,
      };
    })
    .filter(Boolean);

  return {
    tagText: mo.tag_text?.value || '@COMMUNITY',
    tagLink: mo.tag_link?.value || '#',
    subtitle: mo.subtitle?.value || '',
    titleWhite: mo.title_white?.value || 'COMMUNITY',
    titleColored: mo.title_colored?.value || 'GALLERY',
    footerText: mo.footer_text?.value || '',
    buttonText: mo.button_text?.value || 'Share Your Look',
    buttonLink: mo.button_link?.value || '#',
    images: parsedImages,
  };
}


import { getHowItWorksSectionQuery } from './queries';
export async function getHowItWorksData(handle: string = 'how_it_works_section') {
  const res = await shopifyFetch<any>({
    query: getHowItWorksSectionQuery,
    tags: ['how_it_works_section'],
    variables: { handle },
     //cache: 'no-store',
  });

  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  const rawSteps = mo.steps?.references?.edges || [];
  const parsedSteps = rawSteps.map((edge: any) => {
    const node = edge.node;
    const img = node.image?.reference?.image;
    return {
      title: node.title?.value || '',
      description: node.description?.value || '',
      image: img ? { url: img.url, alt: img.altText || '', width: img.width, height: img.height } : null,
    };
  });

  return {
    tagText: mo.tag_text?.value || 'SIMPLE PROCESS',
    subtitle: mo.subtitle?.value || 'Four effortless steps to premium body art.',
    titleWhite: mo.title_white?.value || 'HOW IT',
    titleColored: mo.title_colored?.value || 'WORKS',
    buttonText: mo.button_text?.value || 'Start Your Journey',
    buttonLink: mo.button_link?.value || '#',
    steps: parsedSteps,
  };
}


export async function getSafeForSkinData(handle: string = 'safe_for_skin_section') {
  const res = await shopifyFetch<any>({
    query: getSafeForSkinSectionQuery,
    tags: ['safe_for_skin_section'],
    variables: { handle },
  });

  const mo = res.body?.data?.metaobject;
  if (!mo) return null;

  // Safely parse JSON fields
  const parseJSON = (str: string | undefined, fallback: any) => {
    try { return str ? JSON.parse(str) : fallback; } 
    catch (e) { return fallback; }
  };

  return {
    tagText: mo.tag_text?.value || 'SAFETY & ETHICS',
    titleWhite: mo.title_white?.value || 'SAFE FOR YOUR',
    titleColored: mo.title_colored?.value || 'SKIN.',
    description: mo.description?.value || '',
    formulaTitle: mo.formula_title?.value || 'Our Formula',
    complianceText: mo.compliance_text?.value || '',
    features: parseJSON(mo.features?.value, []),
    ingredients: parseJSON(mo.ingredients?.value, []),
    stats: parseJSON(mo.stats?.value, []),
  };
}