import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/src/lib/shopify/index";
import { Metadata } from "next";
import { Breadcrumbs } from "@/src/components/shared/Breadcrumbs";

type Props = { 
  params: Promise<{ blogHandle: string, articleHandle: string }> 
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);
  if (!article) return { title: 'Article Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.justtattoos.com';
  const canonicalUrl = `${siteUrl}/blogs/${blogHandle}/${articleHandle}`;

  return {
    title: article.seo?.title || `${article.title} | Just Tattoos`,
    description: article.seo?.description || `Read ${article.title} on Just Tattoos`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.seo?.title || article.title,
      description: article.seo?.description || `Read ${article.title}`,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: article.authorV2?.name ? [article.authorV2.name] : [],
      images: article.image?.url ? [{ url: article.image.url, alt: article.image.altText || article.title }] : [],
    },
    twitter: { card: 'summary_large_image' }
  };
}

export default async function SingleArticlePage({ params }: Props) {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);
  
  if (!article) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.justtattoos.com";
  const articleUrl = `${siteUrl}/blogs/${blogHandle}/${articleHandle}`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.seo?.title || article.title,
    image: article.image ? [article.image.url] : [],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: [{
        '@type': 'Person',
        name: article.authorV2?.name || 'Just Tattoos Team',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Just Tattoos',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/icons/DesktopLogo.svg` }
    },
    description: article.seo?.description || article.title,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl }
  };

  return (
    <article className="w-full min-h-screen bg-black text-white selection:bg-[#FE8204] selection:text-white pb-24 relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

      {/* Premium Hero Bleed Container (Flows seamlessly under transparent headers) */}
      <div className="relative w-full pt-32 md:pt-40 pb-16 md:pb-24 bg-zinc-950 border-b border-white/5 overflow-hidden">
        
        {/* Full Screen Image Backdrop */}
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.image.altText || `${article.title} cover image`}
            fill
            priority
            className="object-cover opacity-20 z-0 select-none pointer-events-none"
          />
        )}
        
        {/* Cinematic Linear Shadow Gradient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-zinc-950/40 z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[#FE8204] opacity-[0.03] blur-[130px] pointer-events-none z-10" />

        <div className="relative z-20 w-full max-w-[1300px] mx-auto px-6 md:px-10 lg:px-20">
          
          {/* Breadcrumbs Styled Elegantly Over Backdrop */}
          <div className="mb-10 opacity-70 hover:opacity-100 transition-opacity">
            <Breadcrumbs items={[
              { label: 'Home', url: '/' },
              { label: 'Blogs', url: '/blogs' },
              { label: blogHandle, url: `/blogs/${blogHandle}` },
              { label: article.title, url: articleUrl }
            ]} />
          </div>

          {/* Core Post Title Details Wrapper */}
          <div className="max-w-[900px]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-[1.1]">
              {article.title}
            </h1>
            
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg text-xs font-bold uppercase tracking-wider text-zinc-300">
              {article.authorV2?.name && (
                <>
                  <span>By <span className="text-[#FE8204] font-black">{article.authorV2.name}</span></span>
                  <span className="text-zinc-600">•</span>
                </>
              )}
              <time className="text-zinc-400">
                {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Article Body Section */}
      <div className="w-full max-w-[850px] mx-auto px-6 py-16 md:py-24 relative z-20">
        <div 
          className="text-base md:text-lg text-zinc-300 leading-relaxed font-sans 
            [&>p]:mb-6 [&>p]:leading-relaxed
            [&>h2]:text-2xl md:[&>h2]:text-4xl [&>h2]:font-black [&>h2]:text-white [&>h2]:mt-14 [&>h2]:mb-6 [&>h2]:tracking-tight [&>h2]:uppercase
            [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-zinc-100 [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:tracking-tight
            [&>img]:w-full [&>img]:rounded-[2rem] [&>img]:my-12 [&>img]:border [&>img]:border-white/10 [&>img]:shadow-2xl
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-zinc-300
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:text-zinc-300
            [&>a]:text-[#FE8204] [&>a]:underline [&>a]:font-bold [&>a:hover]:text-white [&>a]:transition-colors
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#FE8204] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-zinc-200 [&>blockquote]:bg-zinc-900/50 [&>blockquote]:backdrop-blur-sm [&>blockquote]:p-6 [&>blockquote]:rounded-r-2xl [&>blockquote]:my-10"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </div>
    </article>
  );
}