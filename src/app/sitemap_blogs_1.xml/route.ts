import { NextResponse } from 'next/server';
import { getBlogs, getBlogArticles } from '@/src/lib/shopify';

export async function GET() {
  //const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.justtattoos.com';
  const blogsRes = await getBlogs().catch(() => []);
  
  let urls: string[] = [];

  if (blogsRes && Array.isArray(blogsRes)) {
    for (const blog of blogsRes) {
      // 1. Add the main blog index page
      urls.push(`${siteUrl}/blogs/${blog.handle}`);
      
      // 2. Fetch the individual articles inside the blog
      try {
        const blogData = await getBlogArticles(blog.handle);
        if (blogData?.articles?.edges) {
          blogData.articles.edges.forEach((edge: any) => {
            const article = edge.node;
            urls.push(`${siteUrl}/blogs/${blog.handle}/${article.handle}`);
          });
        }
      } catch (err) {
        console.error(`Failed to fetch articles for blog: ${blog.handle}`, err);
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}