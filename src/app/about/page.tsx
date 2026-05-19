import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAboutPageData } from '@/src/lib/shopify'; // Adjust path if your index.ts is elsewhere

export default async function AboutUs() {
    // Fetch dynamic content from Shopify. 
    // IMPORTANT: Make sure 'about-page' exactly matches the handle of the entry you created in Shopify Admin!
    const content = await getAboutPageData('about-page-dxkfa8ev'); 

    // Fallback if the fetch fails or you forgot to publish the metaobject
    if (!content) return <div className="p-20 text-center text-white bg-black min-h-screen">Loading About Us content...</div>;

    return (
        // Switched to bg-black and text-white for the global dark theme
        <main className="w-full bg-black text-white overflow-hidden min-h-screen">
            
            {/* 🚀 PREMIUM HERO BANNER REPLACEMENT */}
            {/* Note: Added pt-24 md:pt-32 to account for your transparent header overlapping the top */}
            <div className="container max-w-[1400px] mx-auto px-4 pt-24 md:pt-32">
                <div className="relative w-full h-[280px] md:h-[380px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group bg-zinc-900 flex items-center">
                
                    {/* Background Image using Next.js Image */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <Image
                            src={content.heroImage}
                            alt={content.heroTitle}
                            fill
                            priority
                            className="object-cover object-center opacity-60 transition-transform duration-1000 ease-out group-hover:scale-105"
                            sizes="(max-width: 1400px) 100vw, 1400px"
                        />
                    </div>

                    {/* Precision Gradient Overlays for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

                    {/* Hero Content */}
                    <div className="relative z-10 px-8 md:px-16 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md mb-6 shadow-lg">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FE8204] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FE8204]"></span>
                            </span>
                            <span className="text-[#FE8204] text-[10px] font-black uppercase tracking-[0.2em]">
                                About Us
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-xl leading-none">
                            {content.heroTitle}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Intro Section: Every Version of You */}
            <section className="container mx-auto px-6 py-20 md:py-32">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight whitespace-pre-line text-zinc-100">
                            {content.introHeading}
                        </h2>
                        <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed whitespace-pre-line">
                            {content.introParagraph}
                        </p>
                    </div>
                    <div className="md:w-1/2 w-full relative h-[400px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <Image 
                            src={content.introImage} 
                            alt={content.introHeading.replace('\n', ' ')} 
                            fill 
                            className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </section>

            {/* Who We Are Section */}
            {/* Switched to a deep zinc background to contrast slightly with the pure black main background */}
            <section className="bg-zinc-950 py-20 md:py-32 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
                        <div className="md:w-1/2 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100">
                                {content.whoWeAreHeading}
                            </h2>
                            <p className="text-lg text-zinc-400 font-medium leading-relaxed whitespace-pre-line">
                                {content.whoWeAreParagraph1}
                            </p>
                            <p className="text-lg text-zinc-400 font-medium leading-relaxed whitespace-pre-line">
                                {content.whoWeAreParagraph2}
                            </p>
                            <div className="pt-4">
                                <Link 
                                    href="/shop" 
                                    className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:text-white hover:shadow-lg hover:shadow-[#FE8204]/20 transition-all duration-300"
                                >
                                    {content.whoWeAreButtonText}
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 w-full relative h-[450px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl border border-white/10">
                            <Image 
                                src={content.whoWeAreImage} 
                                alt={content.whoWeAreHeading} 
                                fill 
                                className="object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Commitments & Values Section */}
            <section className="container mx-auto px-6 py-20 md:py-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-100">{content.commitmentsTitle}</h2>
                    <p className="text-lg text-zinc-400 font-medium">{content.commitmentsSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* AODA Card */}
                    <div className="bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-3xl shadow-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                        <div className="mb-6 inline-flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full border border-white/5">
                            <svg className="w-6 h-6 text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider text-zinc-100">{content.aodaTitle}</h3>
                        <div className="text-zinc-400 font-medium leading-relaxed space-y-4 flex-grow whitespace-pre-line">
                            <p>{content.aodaParagraph1}</p>
                            <p>{content.aodaParagraph2}</p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-sm text-zinc-500 font-medium mb-2">{content.aodaContactLabel}</p>
                            <a 
                                href={`mailto:${content.aodaEmail}`} 
                                className="text-lg font-bold border-b-2 border-white pb-1 hover:text-[#FE8204] hover:border-[#FE8204] transition-colors"
                            >
                                {content.aodaEmail}
                            </a>
                        </div>
                    </div>

                    {/* Land Acknowledgement Card */}
                    <div className="bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-3xl shadow-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                        <div className="mb-6 inline-flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full border border-white/5">
                            <svg className="w-6 h-6 text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider text-zinc-100">{content.landAckTitle}</h3>
                        <div className="text-zinc-400 font-medium leading-relaxed space-y-4 flex-grow text-sm md:text-base whitespace-pre-line">
                            <p>{content.landAckParagraph1}</p>
                            <p>{content.landAckParagraph2}</p>
                            <p>{content.landAckParagraph3}</p>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}