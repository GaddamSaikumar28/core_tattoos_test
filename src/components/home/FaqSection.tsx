
import React from 'react';
import { getFaqSectionData } from '@/src/lib/shopify'; // Update path if needed
import FaqClient from './FaqClient';

export default async function FaqSection() {
  const data = await getFaqSectionData('faq-section');

  if (!data) {
    return (
      <section className="bg-[#050505] w-full px-4 py-16 text-center text-gray-500">
        Loading FAQs...
      </section>
    );
  }

  return (
    <section className="bg-[#050505] w-full px-4 py-16 md:px-8 lg:px-16 md:py-24 overflow-hidden relative selection:bg-[var(--color-brand-orange)] selection:text-white">
      {/* Optional: Subtle background glow effect for premium feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.04] blur-[120px] pointer-events-none"></div>
      
      {/* Pass the dynamic data to the interactive client component */}
      <FaqClient data={data} />
    </section>
  );
}