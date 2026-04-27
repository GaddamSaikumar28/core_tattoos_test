// FILE: app/blogs/[blogHandle]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogArticles } from "@/src/lib/shopify"; // Adjust import path if needed
import { Metadata } from "next";

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: { blogHandle: string } }): Promise<Metadata> {
  const blog = await getBlogArticles(params.blogHandle);
  console.log("Fetched blog for metadata:", blog); // Debugging log to check fetched data for metadata
  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.seo?.title || `${blog.title} | Just Tattoos`,
    description: blog.seo?.description || `Read the latest articles on ${blog.title}`,
  };
}

// 2. The Main Page Component
export default async function BlogListingPage({ params }: { params: { blogHandle: string } }) {
  const blog = await getBlogArticles(params.blogHandle);

  if (!blog) return notFound();

  const articles = blog.articles.edges.map((edge: any) => edge.node);

  return (
    <div className="w-full min-h-screen bg-[#fafafa] mt-15 py-16 px-10 lg:px-20">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-heading uppercase text-black mb-4">
            {blog.title}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Stay up to date with the latest news, tattoo aftercare, and authentic ink inspiration.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article: any) => (
            <Link 
              key={article.id} 
              href={`/blogs/${params.blogHandle}/${article.handle}`}
              className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                {article.image ? (
                  <Image
                    src={article.image.url}
                    alt={article.image.altText || article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-sm text-brand-orange font-semibold mb-3">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </p>
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                {article.excerptHtml && (
                  <div 
                    className="text-gray-600 line-clamp-3 mb-6"
                    dangerouslySetInnerHTML={{ __html: article.excerptHtml }}
                  />
                )}
                
                <div className="mt-auto">
                  <span className="text-btn text-black border-b-2 border-primary pb-1 group-hover:text-primary transition-colors">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}