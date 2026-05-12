import { NextResponse } from 'next/server';
import { getProducts } from '@/src/lib/shopify';

export async function GET() {
  //const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.justtattoos.com';
  const productsRes = await getProducts({ first: 250 });
  const products = productsRes?.formattedData || [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${products.map(product => `  <url>
    <loc>${siteUrl}/products/${product.handle}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}