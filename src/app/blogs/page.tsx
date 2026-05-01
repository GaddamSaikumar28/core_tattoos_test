// // FILE: app/blogs/page.tsx
// import Image from "next/image";
// import Link from "next/link";
// import { Metadata } from "next";
// import { getBlogs } from "@/src/lib/shopify/index"; // Adjust path if needed

// export const metadata: Metadata = {
//   title: "Our Blogs | Just Tattoos",
//   description: "Explore our collection of tattoo news, artist features, and aftercare tutorials.",
// };

// // High-quality placeholder images specifically curated for a tattoo vibe
// const PLACEHOLDER_IMAGES = [
//   "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop", // Tattoo machine/art
//   "https://images.unsplash.com/photo-1562962230-16e4623d36e6?q=80&w=800&auto=format&fit=crop", // Sketching/Design
//   "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=800&auto=format&fit=crop", // Artistic vibe
//   "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop", // Studio vibe
// ];

// export default async function AllBlogsPage() {
//   // Fetch all blogs (e.g., 'News', 'Tutorials')
//   const blogs = await getBlogs();
//   console.log("Fetched blogs:", blogs); // Debugging log to check fetched data  
//   return (
//     <div className="w-full min-h-screen bg-[#fafafa] py-20 mt-15 px-10 lg:px-20">
//       <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        
//         {/* Header Section */}
//         <div className="text-center max-w-3xl mx-auto mb-16">
//           {/* <h1 className="text-5xl md:text-6xl font-bold font-heading uppercase text-black mb-6">
//             Explore <span className="text-primary">Our Topics</span>
//           </h1> */}
//           <h1 className="text-5xl md:text-6xl font-bold font-heading uppercase text-black mb-6">
//                 Explore <span className="text-brand-orange">Our Topics</span>
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Dive into the world of ink. Select a category below to read our latest articles, artist highlights, and essential aftercare guides.
//           </p>
//         </div>

//         {/* Blogs Grid */}
//         {blogs.length === 0 ? (
//           <div className="text-center py-20 text-gray-500">
//             No blog categories found.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {blogs.map((blog: any, index: number) => {
//               // Cycle through the placeholder images based on the index
//               const placeholderSrc = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

//               return (
//                 <Link 
//                   key={blog.id} 
//                   href={`/blogs/${blog.handle}`}
//                   className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
//                 >
//                   {/* Image Container */}
//                   <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900">
//                     <Image
//                       src={placeholderSrc}
//                       alt={`${blog.title} category cover`}
//                       fill
//                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                       className="object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500 opacity-80"
//                     />
//                     {/* Overlay Label for extra premium feel */}
//                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full">
//                       <span className="text-xs font-bold text-black uppercase tracking-wider">
//                         Category
//                       </span>
//                     </div>
//                   </div>

//                   {/* Content Container */}
//                   <div className="p-8 flex flex-col flex-grow">
//                     <h2 className="text-3xl font-bold text-black mb-3 group-hover:text-brand-orange transition-colors">
//                       {blog.title}
//                     </h2>
                    
//                     <p className="text-gray-600 mb-8 line-clamp-2 text-sm">
//                       {blog.seo?.description || `Explore all the latest posts and updates in the ${blog.title} category.`}
//                     </p>
                    
//                     <div className="mt-auto">
//                       <div className="inline-flex items-center text-btn text-black border-b-2 border-primary pb-1 group-hover:text-brand-orange transition-colors">
//                         View Articles 
//                         <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }






import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getBlogs } from "@/src/lib/shopify/index";
import { Breadcrumbs } from "@/src/components/shared/Breadcrumbs"; // <-- SEO Phase 4

export const metadata: Metadata = {
  title: "Our Blogs | Just Tattoos",
  description: "Explore our collection of tattoo news, artist features, and aftercare tutorials.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs`, // <-- SEO Phase 3
  }
};

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562962230-16e4623d36e6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
];

export default async function AllBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="w-full min-h-screen bg-[#fafafa] py-20 mt-15 px-10 lg:px-20">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        
        {/* SEO Phase 4: Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Home', url: '/' }, { label: 'Blogs', url: '/blogs' }]} />
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-heading uppercase text-black mb-6">
                Explore <span className="text-brand-orange">Our Topics</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Dive into the world of ink. Select a category below to read our latest articles, artist highlights, and essential aftercare guides.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No blog categories found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any, index: number) => {
              const placeholderSrc = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
              return (
                <Link key={blog.id} href={`/blogs/${blog.handle}`} className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900">
                    <Image
                      src={placeholderSrc}
                      alt={`${blog.title} category cover image`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index <= 2} // <-- SEO Phase 5: Fast LCP for first row
                      className="object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500 opacity-80"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full">
                      <span className="text-xs font-bold text-black uppercase tracking-wider">Category</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h2 className="text-3xl font-bold text-black mb-3 group-hover:text-brand-orange transition-colors">{blog.title}</h2>
                    <p className="text-gray-600 mb-8 line-clamp-2 text-sm">{blog.seo?.description || `Explore all the latest posts and updates in the ${blog.title} category.`}</p>
                    <div className="mt-auto">
                      <div className="inline-flex items-center text-btn text-black border-b-2 border-primary pb-1 group-hover:text-brand-orange transition-colors">
                        View Articles &rarr;
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}