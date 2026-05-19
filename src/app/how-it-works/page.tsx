import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getHowItWorksPageData } from '@/src/lib/shopify'; // Adjust path if needed

export default async function HowItWorks() {
    // Fetch data directly from Shopify
    const data = await getHowItWorksPageData('how-it-works');

    if (!data) {
        return <div className="p-20 text-center text-white bg-black min-h-screen">Loading How It Works content...</div>;
    }

    return (
        // Switched to bg-black and text-white, removed mt-10
        <main className="w-full bg-black text-white overflow-hidden min-h-screen">
            
            {/* 🚀 PREMIUM HERO BANNER REPLACEMENT */}
            <div className="container max-w-[1400px] mx-auto px-4 pt-24 md:pt-32">
                <div className="relative w-full h-[280px] md:h-[380px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group bg-zinc-900 flex items-center">
                    
                    {/* Background Image using Next.js Image */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <Image
                            src={data.heroImage}
                            alt={data.heroTitle}
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
                                Guide
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-xl leading-none">
                            {data.heroTitle}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Intro Header */}
            <section className="container mx-auto px-6 pt-20 pb-10 md:pt-32 md:pb-16 text-center max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 uppercase whitespace-pre-line text-zinc-100">
                    {data.introHeading}
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed whitespace-pre-line">
                    {data.introParagraph}
                </p>
            </section>

            {/* Steps Section */}
            <section className="container mx-auto px-6 pb-24 md:pb-40">
                <div className="flex flex-col gap-24 md:gap-32">
                    {data.steps.map((step, index) => {
                        const isEven = index % 2 !== 0;

                        return (
                            <div 
                                key={step.id} 
                                className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 group ${isEven ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Image Container - Updated to dark mode border/shadow */}
                                <div className="w-full md:w-1/2 relative h-[350px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-zinc-900 border border-white/10">
                                    <Image 
                                        src={step.image} 
                                        alt={step.alt} 
                                        fill 
                                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>

                                {/* Content Container */}
                                <div className="w-full md:w-1/2 relative flex flex-col justify-center">
                                    {/* Massive Background Number - Updated for dark mode */}
                                    <span className="absolute -top-16 -left-8 md:-top-24 md:-left-12 text-[10rem] md:text-[14rem] font-black text-white/5 leading-none select-none z-0">
                                        0{step.id}
                                    </span>
                                    
                                    {/* Foreground Text */}
                                    <div className="relative z-10 space-y-6">
                                        {/* Step badge updated to white bg with black text for contrast */}
                                        <div className="inline-block px-4 py-1.5 bg-white text-black text-sm font-bold tracking-widest uppercase rounded-full mb-2">
                                            Step {step.id}
                                        </div>
                                        <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-100">
                                            {step.title}
                                        </h3>
                                        <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-lg whitespace-pre-line">
                                            {step.description}
                                        </p>
                                        
                                        <div className="pt-6">
                                            <Link 
                                                href="/collections" 
                                                className="group/btn inline-flex items-center gap-3 border-b-2 border-white pb-2 text-lg font-bold uppercase tracking-wider text-white hover:text-[#FE8204] hover:border-[#FE8204] transition-all duration-300"
                                            >
                                                Shop Tattoos
                                                <svg 
                                                    className="w-5 h-5 transform group-hover/btn:translate-x-2 transition-transform duration-300" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}