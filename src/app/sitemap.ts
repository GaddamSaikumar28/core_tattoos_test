import { MetadataRoute } from 'next';
import { getProducts, getCollectionNames, getBlogs, getBlogArticles } from '@/src/lib/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';

  // 1. STATIC PAGES (Cleaned of duplicates per the SEO Audit)
  const staticPaths = [
    '',
    '/about',
    '/contact',
    '/help',
    '/how-it-works',
    '/privacy-policy',
    '/returns',
    '/shipping',
    '/terms-of-service',
    '/sale',
    '/collections'
  ];

  // Map static paths without priority or changeFrequency bloat
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  try {
    // 2. FETCH TOP-LEVEL SHOPIFY DATA using your exact index.ts functions
    const [productsRes, collectionsRes, blogsRes] = await Promise.all([
      getProducts({ first: 250 }),
      getCollectionNames(),
      getBlogs().catch(() => []),
    ]);

    // 3. PRODUCT ROUTES
    const productRoutes: MetadataRoute.Sitemap = (productsRes?.formattedData || []).map((product) => ({
      url: `${siteUrl}/products/${product.handle}`,
      lastModified: new Date().toISOString(),
    }));

    // 4. COLLECTION ROUTES (Filtering out typoes and hidden collections)
    const collectionRoutes: MetadataRoute.Sitemap = (collectionsRes || [])
      .filter((collection) => {
        const hidden = ['boddy-part', 'frontpage']; // Blocks the typo collection
        return !hidden.includes(collection.handle.toLowerCase());
      })
      .map((collection) => ({
        url: `${siteUrl}/collections/${collection.handle}`,
        lastModified: new Date().toISOString(),
      }));

    // 5. BLOG & ARTICLE ROUTES 
    const blogRoutes: MetadataRoute.Sitemap = [];
    const articleRoutes: MetadataRoute.Sitemap = [];

    if (blogsRes && Array.isArray(blogsRes)) {
      for (const blog of blogsRes) {
        // A. Add the main blog index page (e.g., /blogs/news)
        blogRoutes.push({
          url: `${siteUrl}/blogs/${blog.handle}`,
          lastModified: new Date().toISOString(),
        });

        // B. Fetch the actual articles using your specific getBlogArticles() function
        try {
          const blogData = await getBlogArticles(blog.handle);
          
          if (blogData?.articles?.edges) {
            blogData.articles.edges.forEach((edge: any) => {
              const article = edge.node;
              // Add each article (e.g., /blogs/news/my-first-post)
              articleRoutes.push({
                url: `${siteUrl}/blogs/${blog.handle}/${article.handle}`,
                lastModified: new Date().toISOString(),
              });
            });
          }
        } catch (err) {
          console.error(`Failed to fetch articles for blog: ${blog.handle}`, err);
        }
      }
    }

    // 6. COMBINE AND RETURN
    return [
      ...staticRoutes,
      ...productRoutes,
      ...collectionRoutes,
      ...blogRoutes,
      ...articleRoutes,
    ];

  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Safe Fallback: At least return the static pages if Shopify API fails
    return staticRoutes; 
  }
}