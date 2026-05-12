import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  url: string;
};


export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  //const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.justtattoos.com";
  // 1. Generate the JSON-LD Schema perfectly formatted for Google
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${siteUrl}${item.url}`,
    })),
  };

  // 2. Render the Visible UI
  return (
    <>
      {/* Inject Schema securely into the DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visible Breadcrumb UI */}
      <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto whitespace-nowrap pb-2">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 font-medium tracking-wide">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-bold" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.url} className="hover:text-[var(--color-brand-orange)] transition-colors">
                    {item.label}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-400 shrink-0" />
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}