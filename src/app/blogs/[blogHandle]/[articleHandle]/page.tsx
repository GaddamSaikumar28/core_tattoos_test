// FILE: app/blogs/[blogHandle]/[articleHandle]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/src/lib/shopify/index"; // Adjust import path if needed
import { Metadata } from "next";

// 1. Dynamic SEO Metadata for individual articles
export async function generateMetadata({ 
  params 
}: { 
  params: { blogHandle: string, articleHandle: string } 
}): Promise<Metadata> {
  const article = await getArticle(params.blogHandle, params.articleHandle);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.seo?.title || `${article.title} | Just Tattoos`,
    description: article.seo?.description || `Read ${article.title} on Just Tattoos`,
  };
}

// 2. The Main Article Component
export default async function SingleArticlePage({ 
  params 
}: { 
  params: { blogHandle: string, articleHandle: string } 
}) {
  const article = await getArticle(params.blogHandle, params.articleHandle);

  if (!article) return notFound();

  return (
    <article className="w-full min-h-screen bg-white pb-20">
      
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-secondary flex items-end">
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.image.altText || article.title}
            fill
            priority
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        
        <div className="relative z-20 w-full max-w-[900px] mx-auto px-6 pb-12 md:pb-16 text-center text-white">
          <Link 
            href={`/blogs/${params.blogHandle}`}
            className="text-brand-orange uppercase font-bold tracking-widest text-sm mb-4 inline-block hover:text-white transition-colors"
          >
            &larr; Back to {params.blogHandle}
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-300">
            {article.authorV2?.name && <span>By {article.authorV2.name}</span>}
            <span>•</span>
            <time>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="w-full max-w-[800px] mx-auto px-6 py-16">
        {/* Using Tailwind arbitrary values to style the raw HTML coming from Shopify.
          This ensures your images, links, and text formatting from the Shopify editor look great.
        */}
        <div 
          className="
            text-lg text-gray-800 leading-relaxed font-sans
            [&>p]:mb-6 
            [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-black [&>h2]:mt-12 [&>h2]:mb-6
            [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-10 [&>h3]:mb-4
            [&>img]:w-full [&>img]:rounded-xl [&>img]:my-10
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
            [&>a]:text-primary [&>a]:underline [&>a]:font-semibold
            [&>blockquote]:border-l-4 [&>blockquote]:border-brand-orange [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-8
          "
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </div>

    </article>
  );
}