
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getBlogs } from "@/src/lib/shopify/index";
import { Breadcrumbs } from "@/src/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Our Blogs | Just Tattoos",
  description: "Explore our collection of tattoo news, artist features, and aftercare tutorials.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs`, 
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
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#FE8204] selection:text-white pt-32 md:pt-40 pb-24 px-6 md:px-10 lg:px-20 relative overflow-hidden">
      
      {/* Immersive Ambient Glow for Transparent Header Integration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[#FE8204] opacity-[0.04] blur-[150px] pointer-events-none z-0" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Breadcrumbs Container */}
        <div className="mb-12 opacity-80 hover:opacity-100 transition-opacity">
          <Breadcrumbs items={[{ label: 'Home', url: '/' }, { label: 'Blogs', url: '/blogs' }]} />
        </div>

        {/* Premium Hero Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-lg">
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Insights & Stories
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
            Explore <span className="text-[#FE8204]">Our Topics</span>
          </h1>
          <p className="text-zinc-400 font-medium text-lg leading-relaxed">
            Dive into the world of ink. Select a category below to read our latest articles, artist highlights, and essential aftercare guides.
          </p>
        </div>

        {/* Content States */}
        {blogs.length === 0 ? (
          <div className="text-center py-24 text-zinc-500 bg-zinc-900/30 rounded-[2rem] border border-dashed border-white/10 font-medium">
            No blog categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {blogs.map((blog: any, index: number) => {
              const placeholderSrc = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
              return (
                <Link 
                  key={blog.id} 
                  href={`/blogs/${blog.handle}`} 
                  className="group flex flex-col bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FE8204]/5 relative"
                >
                  {/* Category Card Header Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-950">
                    <Image
                      src={placeholderSrc}
                      alt={`${blog.title} category cover image`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index <= 2}
                      className="object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                    />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-5 left-5 bg-black/60 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Category</span>
                    </div>
                  </div>

                  {/* Card Main Body Content */}
                  <div className="p-8 flex flex-col flex-grow relative">
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-3 group-hover:text-[#FE8204] transition-colors duration-300 tracking-tight line-clamp-1">
                      {blog.title}
                    </h2>
                    
                    <p className="text-zinc-400 mb-8 line-clamp-2 text-sm font-medium leading-relaxed">
                      {blog.seo?.description || `Explore all the latest posts and updates in the ${blog.title} category.`}
                    </p>
                    
                    {/* Interaction Footer Trigger Button */}
                    <div className="mt-auto pt-2">
                      <span className="inline-flex items-center text-sm font-bold text-zinc-200 border-b-2 border-[#FE8204] pb-1 group-hover:text-[#FE8204] transition-all duration-300 uppercase tracking-wider text-xs">
                        View Articles <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                      </span>
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