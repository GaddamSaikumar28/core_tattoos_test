
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogArticles } from "@/src/lib/shopify";
import { Metadata } from "next";
import { Breadcrumbs } from "@/src/components/shared/Breadcrumbs";

type Props = {
  params: Promise<{ blogHandle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogHandle } = await params;
  const blog = await getBlogArticles(blogHandle);
  if (!blog) return { title: 'Blog Not Found' };

  // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.justtattoos.com";
  const canonicalUrl = `${siteUrl}/blogs/${blogHandle}`;

  return {
    title: blog.seo?.title || `${blog.title} | Just Tattoos`,
    description: blog.seo?.description || `Read the latest articles on ${blog.title}`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: blog.seo?.title || `${blog.title} | Just Tattoos`,
      url: canonicalUrl,
      type: 'website',
    }
  };
}

export default async function BlogListingPage({ params }: Props) {
  const { blogHandle } = await params;
  const blog = await getBlogArticles(blogHandle);
  
  if (!blog) return notFound();
  
  const articles = blog.articles.edges.map((edge: any) => edge.node);

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#FE8204] selection:text-white pt-32 md:pt-40 pb-24 px-6 md:px-10 lg:px-20 relative overflow-hidden">
      
      {/* Immersive Ambient Glow for Transparent Header Integration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[#FE8204] opacity-[0.04] blur-[150px] pointer-events-none z-0" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        
        {/* Breadcrumbs Container */}
        <div className="mb-12 opacity-80 hover:opacity-100 transition-opacity">
          <Breadcrumbs items={[
            { label: 'Home', url: '/' }, 
            { label: 'Blogs', url: '/blogs' },
            { label: blog.title, url: `/blogs/${blogHandle}` }
          ]} />
        </div>

        {/* Premium Hero Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-lg">
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Latest in {blog.title}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
            {blog.title}
          </h1>
          <p className="text-zinc-400 font-medium text-lg leading-relaxed">
            Stay up to date with the latest news, tattoo aftercare, and authentic ink inspiration.
          </p>
        </div>

        {/* Content States */}
        {articles.length === 0 ? (
          <div className="text-center py-24 text-zinc-500 bg-zinc-900/30 rounded-[2rem] border border-dashed border-white/10 font-medium">
            No articles found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {articles.map((article: any, index: number) => (
              <Link 
                key={article.id} 
                href={`/blogs/${blogHandle}/${article.handle}`} 
                className="group flex flex-col bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FE8204]/5 relative"
              >
                {/* Article Card Header Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-950">
                  {article.image ? (
                    <Image
                      src={article.image.url}
                      alt={article.image.altText || `${article.title} cover image`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index <= 2}
                      className="object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest text-xs bg-zinc-950">
                      No Image
                    </div>
                  )}
                  
                  {/* Floating Date Badge */}
                  <div className="absolute top-5 left-5 bg-black/60 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md">
                    <span className="text-[10px] font-black text-[#FE8204] uppercase tracking-widest">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Card Main Body Content */}
                <div className="p-8 flex flex-col flex-grow relative">
                  <h3 className="text-2xl md:text-2xl font-bold text-zinc-100 mb-4 group-hover:text-[#FE8204] transition-colors duration-300 tracking-tight line-clamp-2">
                    {article.title}
                  </h3>
                  
                  {article.excerptHtml && (
                    <div 
                      className="text-zinc-400 line-clamp-3 mb-8 text-sm font-medium leading-relaxed [&>p]:m-0" 
                      dangerouslySetInnerHTML={{ __html: article.excerptHtml }} 
                    />
                  )}
                  
                  {/* Interaction Footer Trigger Button */}
                  <div className="mt-auto pt-2">
                    <span className="inline-flex items-center text-sm font-bold text-zinc-200 border-b-2 border-[#FE8204] pb-1 group-hover:text-[#FE8204] transition-all duration-300 uppercase tracking-wider text-xs">
                      Read Article <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}