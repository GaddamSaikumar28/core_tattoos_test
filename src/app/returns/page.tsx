
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added for the new hero banner
import { getReturnsPageData } from '@/src/lib/shopify'; // Adjust path if needed

export default async function ReturnsPage() {
    let data = null;

    // Production-ready error handling
    try {
        data = await getReturnsPageData('returns-page');
    } catch (error) {
        console.error('[Returns Page] Failed to fetch metaobject data:', error);
    }

    // Graceful fallback if data is completely missing or the fetch failed
    if (!data) {
        return (
            <main className="w-full bg-black text-white min-h-[60vh] flex flex-col items-center justify-center overflow-hidden px-6 text-center pt-20">
                <h1 className="text-3xl font-bold mb-4">Content Unavailable</h1>
                <p className="text-zinc-400">We are currently unable to load the returns policy. Please refresh the page or try again later.</p>
            </main>
        );
    }

    return (
        <main className="w-full bg-black text-white overflow-hidden min-h-screen selection:bg-[#FE8204] selection:text-white">
            
            {/* --- 1. 🚀 PREMIUM HERO BANNER REPLACEMENT --- */}
            <div className="container max-w-[1400px] mx-auto px-4 pt-24 md:pt-32">
                <div className="relative w-full h-[280px] md:h-[380px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group bg-zinc-900 flex items-center">
                    
                    {/* Background Image using Next.js Image */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {data.heroImage && (
                            <Image
                                src={data.heroImage}
                                alt={data.heroTitle || "Refund & Credit Policy"}
                                fill
                                priority
                                className="object-cover object-center opacity-60 transition-transform duration-1000 ease-out group-hover:scale-105"
                                sizes="(max-width: 1400px) 100vw, 1400px"
                            />
                        )}
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
                                Policies
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-xl leading-none">
                            {data.heroTitle || "Refund & Credit Policy"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* --- 2. Intro Text --- */}
            <section className="bg-zinc-950 mt-12 py-12 border-y border-white/5">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-block px-4 py-1.5 bg-white text-black text-sm font-bold tracking-widest uppercase rounded-full mb-6">
                        Customer Care
                    </div>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
                        We know things don’t always go as planned, and we’re here to help.
                    </p>
                </div>
            </section>

            {/* --- 3. The Quick Truths (Dynamic Summary Cards) --- */}
            <section className="container mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1: Timeframe */}
                    <div className="bg-zinc-900 p-10 rounded-[2rem] text-center hover:shadow-2xl hover:border-white/20 transition-all duration-300 border border-white/10">
                        <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight text-zinc-100">{data.card1Title}</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed">{data.card1Text}</p>
                    </div>

                    {/* Card 2: Hygiene Rule */}
                    <div className="bg-zinc-900 p-10 rounded-[2rem] text-center hover:shadow-2xl hover:border-white/20 transition-all duration-300 border border-white/10">
                        <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight text-zinc-100">{data.card2Title}</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed">{data.card2Text}</p>
                    </div>

                    {/* Card 3: Easy Support */}
                    <div className="bg-zinc-900 p-10 rounded-[2rem] text-center hover:shadow-2xl hover:border-white/20 transition-all duration-300 border border-white/10">
                        <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight text-zinc-100">{data.card3Title}</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed">{data.card3Text}</p>
                    </div>
                </div>
            </section>

            {/* --- 4. Main Content with Sticky Sidebar --- */}
            <section className="container mx-auto px-6 pb-24 md:pb-32">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 relative">
                    
                    {/* Sticky Sidebar Navigation (Desktop Only) */}
                    <aside className="hidden lg:block w-1/4 shrink-0">
                        <div className="sticky top-32 space-y-4 border-l-2 border-white/10 pl-6">
                            <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Contents</h3>
                            <nav className="flex flex-col space-y-3 text-base font-bold text-zinc-400">
                                {/* Hardcoded Links */}
                                <a href="#refunds-credits" className="hover:text-white hover:translate-x-1 transition-all">Refunds & Credits</a>
                                <a href="#final-sale" className="hover:text-white hover:translate-x-1 transition-all">Final Sale Items</a>
                                <a href="#defective" className="hover:text-white hover:translate-x-1 transition-all">Defective or Damaged</a>
                                <a href="#how-to-request" className="hover:text-[#FE8204] hover:translate-x-1 transition-all">How to Request</a>
                                
                                {/* Dynamic Links */}
                                {data.policyTitle && (
                                    <a href="#dynamic-policy" className="hover:text-white hover:translate-x-1 transition-all mt-4 pt-4 border-t border-white/10">
                                        {data.policyTitle}
                                    </a>
                                )}
                                {data.issuesTitle && (
                                    <a href="#dynamic-issues" className="hover:text-white hover:translate-x-1 transition-all">
                                        {data.issuesTitle}
                                    </a>
                                )}
                                {data.paymentTitle && (
                                    <a href="#dynamic-payment" className="hover:text-white hover:translate-x-1 transition-all">
                                        {data.paymentTitle}
                                    </a>
                                )}
                                {data.chargesTitle && (
                                    <a href="#dynamic-charges" className="hover:text-white hover:translate-x-1 transition-all">
                                        {data.chargesTitle}
                                    </a>
                                )}
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content Wrapper */}
                    <article className="w-full lg:w-3/4 max-w-5xl space-y-16 text-lg text-zinc-400 font-medium leading-relaxed">
                        
                        {/* ========================================== */}
                        {/* PART A: HARDCODED CUSTOM UI SECTIONS       */}
                        {/* ========================================== */}

                        {/* Section 1: Refunds & Credits */}
                        <div id="refunds-credits" className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Refunds & Credits</h2>
                            <p>
                                If you’re not fully satisfied with your Just Tattoos purchase, we’re happy to assist within <strong className="text-white">14 days</strong> from the date your order is delivered.
                            </p>
                            
                            <div className="bg-[#FE8204]/20 border-l-4 border-[#FE8204] p-6 text-zinc-100 rounded-r-2xl my-6">
                                <strong>Important Note:</strong> Due to hygienic and safety reasons, <strong>we do not accept physical returns.</strong> However, depending on the situation, we may offer a store credit or a refund, when applicable.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">
                                    <h4 className="text-zinc-100 font-black text-xl mb-2">Within 14 Days</h4>
                                    <p className="text-base text-zinc-400">Eligible for a full refund or a store credit to use on future purchases.</p>
                                </div>
                                <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">
                                    <h4 className="text-zinc-100 font-black text-xl mb-2">After 14 Days</h4>
                                    <p className="text-base text-zinc-400">Requests made after 14 days may still qualify for store credit. Orders older than <strong className="text-white">90 days</strong> are not eligible for any refunds or credits.</p>
                                </div>
                            </div>
                            
                            <p className="text-sm text-zinc-500 mt-4">
                                * At this time, refunds can only be processed for orders shipped within the United States.
                            </p>
                        </div>

                        <hr className="border-white/10" />

                        {/* Section 2: Final Sale Items */}
                        <div id="final-sale" className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Final Sale Items</h2>
                            <p>
                                The following products are <strong className="text-white">final sale</strong> and are strictly not eligible for refunds or credits:
                            </p>
                            
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                <li className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/50 text-red-400 text-xs font-bold">✕</span>
                                    <span className="text-zinc-200 font-medium">Tattoo accessories & tools</span>
                                </li>
                                <li className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/50 text-red-400 text-xs font-bold">✕</span>
                                    <span className="text-zinc-200 font-medium">Tattoo marker products</span>
                                </li>
                                <li className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/50 text-red-400 text-xs font-bold">✕</span>
                                    <span className="text-zinc-200 font-medium">Digital or E-Gift Cards</span>
                                </li>
                                <li className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/50 text-red-400 text-xs font-bold">✕</span>
                                    <span className="text-zinc-200 font-medium">Sale or clearance items</span>
                                </li>
                                <li className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-900/50 text-red-400 text-xs font-bold">✕</span>
                                    <span className="text-zinc-200 font-medium">Tattoo bundles or kits</span>
                                </li>
                            </ul>

                            <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 text-zinc-300 mt-6 space-y-2">
                                <p><strong className="text-white">Please note:</strong> Original shipping costs are non-refundable.</p>
                                <p className="text-sm text-zinc-500">Just Tattoos reserves the right to decline refund requests if misuse or abuse of the policy is detected.</p>
                            </div>
                        </div>

                        {/* Section 3: Defective or Damaged */}
                        <div id="defective" className="bg-zinc-900 border border-white/10 text-white p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-white">Defective or Damaged Products</h2>
                            <p className="text-zinc-300">
                                If your order arrives damaged, defective, or you experience an issue with application, we’ve got you covered. Eligible cases may qualify for a <strong className="text-white">one-time replacement or store credit</strong>.
                            </p>
                            
                            <div className="pt-4">
                                <h4 className="text-sm font-bold tracking-widest uppercase text-[#FE8204] mb-4">To help us resolve this quickly, please include:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FE8204]">✔</span>
                                        <span className="text-zinc-200">Your order number</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FE8204]">✔</span>
                                        <span className="text-zinc-200">Clear photos of the product</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FE8204]">✔</span>
                                        <span className="text-zinc-200">A brief description of the issue</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-zinc-500 text-sm mt-4 italic">Our support team will review your request and let you know the next steps.</p>
                        </div>

                        <hr className="border-white/10" />

                        {/* Section 4: How to Request */}
                        <div id="how-to-request" className="text-center bg-zinc-900 border border-white/10 p-10 md:p-16 rounded-[2.5rem] space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-100">How to Request a Refund or Credit</h2>
                            <p className="text-lg max-w-2xl mx-auto mb-8 text-zinc-400">
                                It’s easy! Just reach out to us, and once we review your case, we’ll follow up with a resolution as soon as possible. Be sure to include your order number, photos of the item(s), and the reason for your request.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                <a 
                                    href="mailto:support@justtattoos.com" 
                                    className="w-full sm:w-auto inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:text-white hover:shadow-lg hover:shadow-[#FE8204]/20 transition-all duration-300"
                                >
                                    Email Support
                                </a>
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">OR</span>
                                <a 
                                    href="/contact"
                                    className="w-full sm:w-auto inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 text-center"
                                >
                                    Contact Us Page
                                </a>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* ========================================== */}
                        {/* PART B: DYNAMIC SHOPIFY DATA SECTIONS      */}
                        {/* ========================================== */}

                        {/* General Refund Policy */}
                        <div id="dynamic-policy" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sticky top-24">{data.policyTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-zinc-400 font-medium leading-relaxed space-y-6">
                                <p>{data.policyP1}</p>
                                <p dangerouslySetInnerHTML={{ __html: data.policyP2 }}></p>
                                <p>{data.policyP3}</p>
                                <div className="bg-zinc-900 p-6 rounded-2xl border-l-4 border-white text-zinc-200 text-base mt-4">
                                    <p dangerouslySetInnerHTML={{ __html: data.policyNote }}></p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Defective Products & How to Reach Out */}
                        <div id="dynamic-issues" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sticky top-24">{data.issuesTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-zinc-400 font-medium leading-relaxed space-y-6">
                                <p>{data.issuesIntro}</p>
                                
                                <h3 className="text-xl font-bold text-zinc-100 mt-8 mb-4">{data.issuesEmailHeading}</h3>
                                <p>{data.issuesEmailText} <a href={`mailto:${data.issuesEmailAddress}`} className="text-white font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors">{data.issuesEmailAddress}</a> and include the following:</p>
                                
                                <ul className="bg-zinc-900 border border-white/10 p-8 rounded-3xl space-y-4 text-zinc-300">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FE8204] mt-1">✔</span>
                                        <span dangerouslySetInnerHTML={{ __html: data.issuesList1 }}></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FE8204] mt-1">✔</span>
                                        <span dangerouslySetInnerHTML={{ __html: data.issuesList2 }}></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#FE8204] mt-1">✔</span>
                                        <span dangerouslySetInnerHTML={{ __html: data.issuesList3 }}></span>
                                    </li>
                                </ul>
                                <p className="text-base">{data.issuesOutro}</p>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Payment Issues */}
                        <div id="dynamic-payment" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sticky top-24">{data.paymentTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-zinc-400 font-medium leading-relaxed space-y-8">
                                <p>{data.paymentIntro}</p>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-zinc-100 font-bold text-xl mb-2">{data.paymentItem1Title}</h4>
                                        <p dangerouslySetInnerHTML={{ __html: data.paymentItem1Text }}></p>
                                    </div>
                                    <div>
                                        <h4 className="text-zinc-100 font-bold text-xl mb-2">{data.paymentItem2Title}</h4>
                                        <p>{data.paymentItem2Text}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-zinc-100 font-bold text-xl mb-2">{data.paymentItem3Title}</h4>
                                        <p>{data.paymentItem3Text}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-zinc-100 font-bold text-xl mb-2">{data.paymentItem4Title}</h4>
                                        <p>{data.paymentItem4Text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Charge Timelines & Cancellations */}
                        <div id="dynamic-charges" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sticky top-24">{data.chargesTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-zinc-400 font-medium leading-relaxed space-y-8">
                                <div dangerouslySetInnerHTML={{ __html: data.chargesSection1Content }}></div>
                                <div className="pt-6" dangerouslySetInnerHTML={{ __html: data.chargesSection2Content }}></div>
                            </div>
                        </div>

                    </article>
                </div>
            </section>
        </main>
    );
}