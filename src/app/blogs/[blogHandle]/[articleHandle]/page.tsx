// // // // // FILE: app/blogs/[blogHandle]/[articleHandle]/page.tsx
// // // // import Image from "next/image";
// // // // import Link from "next/link";
// // // // import { notFound } from "next/navigation";
// // // // import { getArticle } from "@/src/lib/shopify/index"; // Adjust import path if needed
// // // // import { Metadata } from "next";

// // // // // 1. Dynamic SEO Metadata for individual articles
// // // // export async function generateMetadata({ 
// // // //   params 
// // // // }: { 
// // // //   params: { blogHandle: string, articleHandle: string } 
// // // // }): Promise<Metadata> {
// // // //   const article = await getArticle(params.blogHandle, params.articleHandle);
// // // //   if (!article) return { title: 'Article Not Found' };

// // // //   return {
// // // //     title: article.seo?.title || `${article.title} | Just Tattoos`,
// // // //     description: article.seo?.description || `Read ${article.title} on Just Tattoos`,
// // // //   };
// // // // }

// // // // // 2. The Main Article Component
// // // // export default async function SingleArticlePage({ 
// // // //   params 
// // // // }: { 
// // // //   params: { blogHandle: string, articleHandle: string } 
// // // // }) {
// // // //   const article = await getArticle(params.blogHandle, params.articleHandle);

// // // //   if (!article) return notFound();

// // // //   return (
// // // //     <article className="w-full min-h-screen bg-white pb-20">
      
// // // //       {/* Hero Image Section */}
// // // //       <div className="relative w-full h-[40vh] md:h-[60vh] bg-secondary flex items-end">
// // // //         {article.image && (
// // // //           <Image
// // // //             src={article.image.url}
// // // //             alt={article.image.altText || article.title}
// // // //             fill
// // // //             priority
// // // //             className="object-cover opacity-60"
// // // //           />
// // // //         )}
// // // //         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        
// // // //         <div className="relative z-20 w-full max-w-[900px] mx-auto px-6 pb-12 md:pb-16 text-center text-white">
// // // //           <Link 
// // // //             href={`/blogs/${params.blogHandle}`}
// // // //             className="text-brand-orange uppercase font-bold tracking-widest text-sm mb-4 inline-block hover:text-white transition-colors"
// // // //           >
// // // //             &larr; Back to {params.blogHandle}
// // // //           </Link>
// // // //           <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-6 leading-tight">
// // // //             {article.title}
// // // //           </h1>
// // // //           <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-300">
// // // //             {article.authorV2?.name && <span>By {article.authorV2.name}</span>}
// // // //             <span>•</span>
// // // //             <time>
// // // //               {new Date(article.publishedAt).toLocaleDateString('en-US', {
// // // //                 month: 'long', day: 'numeric', year: 'numeric'
// // // //               })}
// // // //             </time>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Article Content */}
// // // //       <div className="w-full max-w-[800px] mx-auto px-6 py-16">
// // // //         {/* Using Tailwind arbitrary values to style the raw HTML coming from Shopify.
// // // //           This ensures your images, links, and text formatting from the Shopify editor look great.
// // // //         */}
// // // //         <div 
// // // //           className="
// // // //             text-lg text-gray-800 leading-relaxed font-sans
// // // //             [&>p]:mb-6 
// // // //             [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-black [&>h2]:mt-12 [&>h2]:mb-6
// // // //             [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-10 [&>h3]:mb-4
// // // //             [&>img]:w-full [&>img]:rounded-xl [&>img]:my-10
// // // //             [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
// // // //             [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
// // // //             [&>a]:text-primary [&>a]:underline [&>a]:font-semibold
// // // //             [&>blockquote]:border-l-4 [&>blockquote]:border-brand-orange [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-8
// // // //           "
// // // //           dangerouslySetInnerHTML={{ __html: article.contentHtml }}
// // // //         />
// // // //       </div>

// // // //     </article>
// // // //   );
// // // // }





// // // import Image from "next/image";
// // // import Link from "next/link";
// // // import { notFound } from "next/navigation";
// // // import { getArticle } from "@/src/lib/shopify/index";
// // // import { Metadata } from "next";
// // // import { Breadcrumbs } from "@/src/components/shared/Breadcrumbs";

// // // export async function generateMetadata({ params }: { params: { blogHandle: string, articleHandle: string } }): Promise<Metadata> {
// // //   const article = await getArticle(params.blogHandle, params.articleHandle);
// // //   if (!article) return { title: 'Article Not Found' };

// // //   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
// // //   const canonicalUrl = `${siteUrl}/blogs/${params.blogHandle}/${params.articleHandle}`;

// // //   return {
// // //     title: article.seo?.title || `${article.title} | Just Tattoos`,
// // //     description: article.seo?.description || `Read ${article.title} on Just Tattoos`,
// // //     alternates: { canonical: canonicalUrl },
// // //     openGraph: {
// // //       title: article.seo?.title || article.title,
// // //       description: article.seo?.description || `Read ${article.title}`,
// // //       url: canonicalUrl,
// // //       type: 'article', // <-- Specific OG tag for articles
// // //       publishedTime: article.publishedAt,
// // //       authors: article.authorV2?.name ? [article.authorV2.name] : [],
// // //       images: article.image?.url ? [{ url: article.image.url, alt: article.image.altText || article.title }] : [],
// // //     },
// // //     twitter: { card: 'summary_large_image' }
// // //   };
// // // }

// // // export default async function SingleArticlePage({ params }: { params: { blogHandle: string, articleHandle: string } }) {
// // //   const article = await getArticle(params.blogHandle, params.articleHandle);
// // //   if (!article) return notFound();

// // //   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
// // //   const articleUrl = `${siteUrl}/blogs/${params.blogHandle}/${params.articleHandle}`;

// // //   // --- SEO Phase 4: Construct BlogPosting JSON-LD ---
// // //   const blogPostingSchema = {
// // //     '@context': 'https://schema.org',
// // //     '@type': 'BlogPosting',
// // //     headline: article.seo?.title || article.title,
// // //     image: article.image ? [article.image.url] : [],
// // //     datePublished: article.publishedAt,
// // //     dateModified: article.publishedAt, // Update this if your GraphQL fetches updatedAt
// // //     author: [{
// // //         '@type': 'Person',
// // //         name: article.authorV2?.name || 'Just Tattoos Team',
// // //     }],
// // //     publisher: {
// // //       '@type': 'Organization',
// // //       name: 'Just Tattoos',
// // //       logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/icons/DesktopLogo.svg` }
// // //     },
// // //     description: article.seo?.description || article.title,
// // //     mainEntityOfPage: { '@type': 'WebPage', '@id:': articleUrl }
// // //   };

// // //   return (
// // //     <article className="w-full min-h-screen bg-white pb-20">
      
// // //       {/* Inject Blog Schema */}
// // //       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

// // //       <div className="relative w-full h-[40vh] md:h-[60vh] bg-secondary flex items-end">
// // //         {article.image && (
// // //           <Image
// // //             src={article.image.url}
// // //             alt={article.image.altText || `${article.title} cover image`}
// // //             fill
// // //             priority
// // //             className="object-cover opacity-60"
// // //           />
// // //         )}
// // //         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        
// // //         <div className="relative z-20 w-full max-w-[900px] mx-auto px-6 pb-12 md:pb-16 text-center text-white">
// // //           {/* SEO Phase 4: Breadcrumbs embedded gracefully over the hero image */}
// // //           <div className="flex justify-center mb-6">
// // //             <Breadcrumbs items={[
// // //               { label: 'Home', url: '/' },
// // //               { label: 'Blogs', url: '/blogs' },
// // //               { label: params.blogHandle, url: `/blogs/${params.blogHandle}` },
// // //               { label: article.title, url: articleUrl } // Self-referencing node
// // //             ]} />
// // //           </div>
          
// // //           <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-6 leading-tight">{article.title}</h1>
// // //           <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-300">
// // //             {article.authorV2?.name && <span>By {article.authorV2.name}</span>}
// // //             <span>•</span>
// // //             <time>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="w-full max-w-[800px] mx-auto px-6 py-16">
// // //         <div 
// // //           className="text-lg text-gray-800 leading-relaxed font-sans [&>p]:mb-6 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-black [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-10 [&>h3]:mb-4 [&>img]:w-full [&>img]:rounded-xl [&>img]:my-10 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>a]:text-primary [&>a]:underline [&>a]:font-semibold [&>blockquote]:border-l-4 [&>blockquote]:border-brand-orange [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-8"
// // //           dangerouslySetInnerHTML={{ __html: article.contentHtml }}
// // //         />
// // //       </div>
// // //     </article>
// // //   );
// // // }
// // import Image from "next/image";
// // import Link from "next/link";
// // import { notFound } from "next/navigation";
// // import { getArticle } from "@/src/lib/shopify/index";
// // import { Metadata } from "next";
// // import { Breadcrumbs } from "@/src/components/shared/Breadcrumbs";

// // // 1. Define Props with Promise for Next.js 15
// // type Props = { 
// //   params: Promise<{ blogHandle: string, articleHandle: string }> 
// // };

// // export async function generateMetadata({ params }: Props): Promise<Metadata> {
// //   const { blogHandle, articleHandle } = await params; // <-- Await the params!
// //   const article = await getArticle(blogHandle, articleHandle);
// //   console.log("Fetched article for metadata: in article page", article); // Debugging log to check fetched data for metadatainde
// //   if (!article) return { title: 'Article Not Found' };

// //   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
// //   const canonicalUrl = `${siteUrl}/blogs/${blogHandle}/${articleHandle}`;

// //   return {
// //     title: article.seo?.title || `${article.title} | Just Tattoos`,
// //     description: article.seo?.description || `Read ${article.title} on Just Tattoos`,
// //     alternates: { canonical: canonicalUrl },
// //     openGraph: {
// //       title: article.seo?.title || article.title,
// //       description: article.seo?.description || `Read ${article.title}`,
// //       url: canonicalUrl,
// //       type: 'article',
// //       publishedTime: article.publishedAt,
// //       authors: article.authorV2?.name ? [article.authorV2.name] : [],
// //       images: article.image?.url ? [{ url: article.image.url, alt: article.image.altText || article.title }] : [],
// //     },
// //     twitter: { card: 'summary_large_image' }
// //   };
// // }

// // export default async function SingleArticlePage({ params }: Props) {
// //   const { blogHandle, articleHandle } = await params; // <-- Await the params!
// //   const article = await getArticle(blogHandle, articleHandle);
  
// //   if (!article) return notFound();

// //   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
// //   const articleUrl = `${siteUrl}/blogs/${blogHandle}/${articleHandle}`;

// //   const blogPostingSchema = {
// //     '@context': 'https://schema.org',
// //     '@type': 'BlogPosting',
// //     headline: article.seo?.title || article.title,
// //     image: article.image ? [article.image.url] : [],
// //     datePublished: article.publishedAt,
// //     dateModified: article.publishedAt,
// //     author: [{
// //         '@type': 'Person',
// //         name: article.authorV2?.name || 'Just Tattoos Team',
// //     }],
// //     publisher: {
// //       '@type': 'Organization',
// //       name: 'Just Tattoos',
// //       logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/icons/DesktopLogo.svg` }
// //     },
// //     description: article.seo?.description || article.title,
// //     mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl }
// //   };

// //   return (
// //     <article className="w-full min-h-screen mt-20 bg-white pb-20">
// //       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

// //       <div className="relative w-full h-[40vh] md:h-[60vh] bg-secondary flex items-end">
// //         {article.image && (
// //           <Image
// //             src={article.image.url}
// //             alt={article.image.altText || `${article.title} cover image`}
// //             fill
// //             priority
// //             className="object-cover opacity-60"
// //           />
// //         )}
// //         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        
// //         <div className="relative z-20 w-full max-w-[900px] mx-auto px-6 pb-12 md:pb-16 text-center text-white">
// //           <div className="flex justify-center mb-6">
// //             <Breadcrumbs items={[
// //               { label: 'Home', url: '/' },
// //               { label: 'Blogs', url: '/blogs' },
// //               { label: blogHandle, url: `/blogs/${blogHandle}` },
// //               { label: article.title, url: articleUrl }
// //             ]} />
// //           </div>
          
// //           <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-6 leading-tight">{article.title}</h1>
// //           <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-300">
// //             {article.authorV2?.name && <span>By {article.authorV2.name}</span>}
// //             <span>•</span>
// //             <time>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="w-full max-w-[800px] mx-auto px-6 py-16">
// //         <div 
// //           className="text-lg text-gray-800 leading-relaxed font-sans [&>p]:mb-6 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-black [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-10 [&>h3]:mb-4 [&>img]:w-full [&>img]:rounded-xl [&>img]:my-10 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>a]:text-primary [&>a]:underline [&>a]:font-semibold [&>blockquote]:border-l-4 [&>blockquote]:border-brand-orange [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-8"
// //           dangerouslySetInnerHTML={{ __html: article.contentHtml }}
// //         />
// //       </div>
// //     </article>
// //   );
// // }



// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { getArticle } from "@/src/lib/shopify/index";
// import { Metadata } from "next";
// import { Breadcrumbs } from "@/src/components/shared/Breadcrumbs";

// // 1. Define Props with Promise for Next.js 15
// type Props = { 
//   params: Promise<{ blogHandle: string, articleHandle: string }> 
// };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { blogHandle, articleHandle } = await params;
//   const article = await getArticle(blogHandle, articleHandle);
//   console.log("Fetched article for metadata: in article page", article);
//   if (!article) return { title: 'Article Not Found' };

//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
//   const canonicalUrl = `${siteUrl}/blogs/${blogHandle}/${articleHandle}`;

//   return {
//     title: article.seo?.title || `${article.title} | Just Tattoos`,
//     description: article.seo?.description || `Read ${article.title} on Just Tattoos`,
//     alternates: { canonical: canonicalUrl },
//     openGraph: {
//       title: article.seo?.title || article.title,
//       description: article.seo?.description || `Read ${article.title}`,
//       url: canonicalUrl,
//       type: 'article',
//       publishedTime: article.publishedAt,
//       authors: article.authorV2?.name ? [article.authorV2.name] : [],
//       images: article.image?.url ? [{ url: article.image.url, alt: article.image.altText || article.title }] : [],
//     },
//     twitter: { card: 'summary_large_image' }
//   };
// }

// export default async function SingleArticlePage({ params }: Props) {
//   const { blogHandle, articleHandle } = await params;
//   const article = await getArticle(blogHandle, articleHandle);
  
//   if (!article) return notFound();

//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
//   const articleUrl = `${siteUrl}/blogs/${blogHandle}/${articleHandle}`;

//   const blogPostingSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'BlogPosting',
//     headline: article.seo?.title || article.title,
//     image: article.image ? [article.image.url] : [],
//     datePublished: article.publishedAt,
//     dateModified: article.publishedAt,
//     author: [{
//         '@type': 'Person',
//         name: article.authorV2?.name || 'Just Tattoos Team',
//     }],
//     publisher: {
//       '@type': 'Organization',
//       name: 'Just Tattoos',
//       logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/icons/DesktopLogo.svg` }
//     },
//     description: article.seo?.description || article.title,
//     mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl }
//   };

//   return (
//     <article className="w-full min-h-screen mt-20 bg-white pb-20">
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

//       {/* Hero Section */}
//       <div className="relative w-full h-[50vh] md:h-[60vh] bg-secondary flex items-end">
//         {article.image && (
//           <Image
//             src={article.image.url}
//             alt={article.image.altText || `${article.title} cover image`}
//             fill
//             priority
//             className="object-cover opacity-50"
//           />
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent z-10" />
        
//         <div className="relative z-20 w-full max-w-[900px] mx-auto px-6 pb-12 md:pb-16 text-center text-white">
//           <div className="flex justify-center mb-6">
//             <Breadcrumbs items={[
//               { label: 'Home', url: '/' },
//               { label: 'Blogs', url: '/blogs' },
//               { label: blogHandle, url: `/blogs/${blogHandle}` },
//               { label: article.title, url: articleUrl }
//             ]} />
//           </div>
          
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading mb-6 leading-tight">{article.title}</h1>
//           <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-200">
//             {article.authorV2?.name && <span>By <span className="text-brand-orange">{article.authorV2.name}</span></span>}
//             <span className="text-brand-orange">•</span>
//             <time>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="w-full max-w-[800px] mx-auto px-6 py-16">
//         <div 
//           className="text-lg text-gray-700 leading-relaxed font-sans [&>p]:mb-6 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-secondary [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-secondary [&>h3]:mt-10 [&>h3]:mb-4 [&>img]:w-full [&>img]:rounded-[24px] [&>img]:my-10 [&>img]:shadow-md [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>a]:text-primary [&>a]:underline [&>a]:font-semibold [&>a:hover]:text-brand-orange [&>a]:transition-colors [&>blockquote]:border-l-4 [&>blockquote]:border-brand-orange [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-secondary [&>blockquote]:bg-[#fafafa] [&>blockquote]:p-4 [&>blockquote]:rounded-r-lg [&>blockquote]:my-8"
//           dangerouslySetInnerHTML={{ __html: article.contentHtml }}
//         />
//       </div>
//     </article>
//   );
// }







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

  // const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
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

  //const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://justtattoos.com';
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
    <article className="w-full min-h-screen bg-white pt-28 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

      {/* Top Router / Breadcrumbs (Aligned identically to listing pages) */}
      <div className="w-full max-w-[1300px] mx-auto px-6 md:px-10 lg:px-20 mb-8">
        <Breadcrumbs items={[
          { label: 'Home', url: '/' },
          { label: 'Blogs', url: '/blogs' },
          { label: blogHandle, url: `/blogs/${blogHandle}` },
          { label: article.title, url: articleUrl }
        ]} />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-secondary flex items-center justify-center">
        {article.image && (
          <Image
            src={article.image.url}
            alt={article.image.altText || `${article.title} cover image`}
            fill
            priority
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-secondary/40 z-10" />
        
        <div className="relative z-20 w-full max-w-[900px] mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading mb-6 leading-tight">{article.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-200">
            {article.authorV2?.name && <span>By <span className="text-brand-orange">{article.authorV2.name}</span></span>}
            <span className="text-brand-orange">•</span>
            <time>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[800px] mx-auto px-6 py-16">
        <div 
          className="text-lg text-gray-700 leading-relaxed font-sans [&>p]:mb-6 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-secondary [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-secondary [&>h3]:mt-10 [&>h3]:mb-4 [&>img]:w-full [&>img]:rounded-[24px] [&>img]:my-10 [&>img]:shadow-md [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>a]:text-primary [&>a]:underline [&>a]:font-semibold [&>a:hover]:text-brand-orange [&>a]:transition-colors [&>blockquote]:border-l-4 [&>blockquote]:border-brand-orange [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-secondary [&>blockquote]:bg-[#fafafa] [&>blockquote]:p-4 [&>blockquote]:rounded-r-lg [&>blockquote]:my-8"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </div>
    </article>
  );
}