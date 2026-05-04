import { NextResponse } from 'next/server';
import { getCollectionNames } from '@/src/lib/shopify';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  
  const collectionsRes = await getCollectionNames();
  
  // Hard-block the typoes and hidden collections
  const hidden = ['boddy-part', 'frontpage'];
  
  // Create a mutable array of valid collections
  const collections = (collectionsRes || []).filter(
    (c: any) => !hidden.includes(c.handle.toLowerCase())
  );

  // FIX: Added the 'title' property to satisfy TypeScript's CollectionName type
  //collections.push({ title: 'Sale', handle: 'sale' });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${collections.map((collection: any) => `  <url>
    <loc>${siteUrl}/collections/${collection.handle}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}