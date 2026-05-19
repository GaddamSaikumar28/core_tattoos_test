import { NextResponse } from 'next/server';

export async function GET() {
  //const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.justtattoos.com';
  // Cleaned of duplicates, but includes your custom app routes like AR/VR
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
    '/collections', 
    '/tracking'
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths.map(route => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}