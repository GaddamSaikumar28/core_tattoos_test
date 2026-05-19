// src/components/CommunityGallery/index.tsx

import { getCommunityGallerySectionData } from "@/src/lib/shopify";
import CommunityGalleryClient from './CommunityGalleryClient';
export default async function CommunityGallerySection() {
  const data = await getCommunityGallerySectionData('community_gallery_section');
  //console.log('Fetched Community Gallery Data:', data); // Debug log to verify data structure

  if (!data) {
    return (
      <div className="w-full bg-neutral-900 text-white p-10 text-center text-sm">
        Community Gallery data missing. Check handle: community_gallery_section
      </div>
    );
  }

  return <CommunityGalleryClient data={data} />;
}