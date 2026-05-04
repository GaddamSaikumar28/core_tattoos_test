

// import React from 'react';
// import SharedHeroBanner from '@/src/components/layout/SharedHeroBanner';
// import { getReturnsPageData } from '@/src/lib/shopify'; // Adjust path if needed

// export default async function Returns() {
//     let data = null;

//     // Production-ready error handling
//     try {
//         data = await getReturnsPageData('returns-page');
//     } catch (error) {
//         // Log the error to your server console or an error monitoring service (e.g., Sentry, Datadog)
//         console.error('[Returns Page] Failed to fetch metaobject data:', error);
//     } finally {
//         // Optional: Any tracking, monitoring, or cleanup metrics can be fired here
//         // console.log('[Returns Page] Data fetch operation completed.');
//     }

//     // Graceful fallback if data is completely missing or the fetch failed
//     if (!data) {
//         return (
//             <main className="w-full bg-white text-black min-h-[60vh] flex flex-col items-center justify-center overflow-hidden px-6 text-center">
//                 <h1 className="text-3xl font-bold mb-4">Content Unavailable</h1>
//                 <p className="text-gray-600">We are currently unable to load the returns policy. Please refresh the page or try again later.</p>
//             </main>
//         );
//     }

//     return (
//         <main className="w-full bg-white text-black overflow-hidden">
//             {/* Hero Section */}
//             <SharedHeroBanner 
//                 title={data.heroTitle}
//                 image={data.heroImage}
//                 mobileImage={data.heroMobileImage}
//                 useMobileImage={true}
//                 textColor={data.heroTextColor}
//             />

//             {/* The Quick Truths (Summary Cards) */}
//             <section className="container mx-auto px-6 py-20 md:py-24">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//                     {/* Card 1: Timeframe */}
//                     <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300">
//                         <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//                             <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                         </div>
//                         <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card1Title}</h3>
//                         <p className="text-gray-600 font-medium leading-relaxed">{data.card1Text}</p>
//                     </div>

//                     {/* Card 2: Hygiene Rule */}
//                     <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300">
//                         <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//                             <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
//                         </div>
//                         <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card2Title}</h3>
//                         <p className="text-gray-600 font-medium leading-relaxed">{data.card2Text}</p>
//                     </div>

//                     {/* Card 3: Easy Support */}
//                     <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300">
//                         <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//                             <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
//                         </div>
//                         <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card3Title}</h3>
//                         <p className="text-gray-600 font-medium leading-relaxed">{data.card3Text}</p>
//                     </div>
//                 </div>
//             </section>

//             {/* Detailed Policies */}
//             <section className="container mx-auto px-6 pb-24 md:pb-32">
//                 <div className="max-w-5xl mx-auto space-y-20">
                    
//                     {/* General Refund Policy */}
//                     <div className="flex flex-col md:flex-row gap-8 md:gap-16">
//                         <div className="w-full md:w-1/3">
//                             <h2 className="text-3xl font-bold tracking-tight sticky top-24">{data.policyTitle}</h2>
//                         </div>
//                         <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-6">
//                             <p>{data.policyP1}</p>
//                             <p dangerouslySetInnerHTML={{ __html: data.policyP2 }}></p>
//                             <p>{data.policyP3}</p>
//                             <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-black text-black text-base mt-4">
//                                 <p dangerouslySetInnerHTML={{ __html: data.policyNote }}></p>
//                             </div>
//                         </div>
//                     </div>

//                     <hr className="border-gray-100" />

//                     {/* Defective Products & How to Reach Out */}
//                     <div className="flex flex-col md:flex-row gap-8 md:gap-16">
//                         <div className="w-full md:w-1/3">
//                             <h2 className="text-3xl font-bold tracking-tight sticky top-24">{data.issuesTitle}</h2>
//                         </div>
//                         <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-6">
//                             <p>{data.issuesIntro}</p>
                            
//                             <h3 className="text-xl font-bold text-black mt-8 mb-4">{data.issuesEmailHeading}</h3>
//                             <p>{data.issuesEmailText} <a href={`mailto:${data.issuesEmailAddress}`} className="text-black font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors">{data.issuesEmailAddress}</a> and include the following:</p>
                            
//                             <ul className="bg-gray-50 p-8 rounded-3xl space-y-4 text-black">
//                                 <li className="flex items-start gap-3">
//                                     <span className="text-[#FE8204] mt-1">✔</span>
//                                     <span dangerouslySetInnerHTML={{ __html: data.issuesList1 }}></span>
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="text-[#FE8204] mt-1">✔</span>
//                                     <span dangerouslySetInnerHTML={{ __html: data.issuesList2 }}></span>
//                                 </li>
//                                 <li className="flex items-start gap-3">
//                                     <span className="text-[#FE8204] mt-1">✔</span>
//                                     <span dangerouslySetInnerHTML={{ __html: data.issuesList3 }}></span>
//                                 </li>
//                             </ul>
//                             <p className="text-base">{data.issuesOutro}</p>
//                         </div>
//                     </div>

//                     <hr className="border-gray-100" />

//                     {/* Payment Issues */}
//                     <div className="flex flex-col md:flex-row gap-8 md:gap-16">
//                         <div className="w-full md:w-1/3">
//                             <h2 className="text-3xl font-bold tracking-tight sticky top-24">{data.paymentTitle}</h2>
//                         </div>
//                         <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-8">
//                             <p>{data.paymentIntro}</p>
                            
//                             <div className="space-y-6">
//                                 <div>
//                                     <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem1Title}</h4>
//                                     <p dangerouslySetInnerHTML={{ __html: data.paymentItem1Text }}></p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem2Title}</h4>
//                                     <p>{data.paymentItem2Text}</p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem3Title}</h4>
//                                     <p>{data.paymentItem3Text}</p>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem4Title}</h4>
//                                     <p>{data.paymentItem4Text}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <hr className="border-gray-100" />

//                     {/* Charge Timelines & Cancellations (Consolidated Metaobjects) */}
//                     <div className="flex flex-col md:flex-row gap-8 md:gap-16">
//                         <div className="w-full md:w-1/3">
//                             <h2 className="text-3xl font-bold tracking-tight sticky top-24">{data.chargesTitle}</h2>
//                         </div>
//                         <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-8">
                            
//                             {/* Render Consolidated Block 1 (When will I be charged) */}
//                             <div dangerouslySetInnerHTML={{ __html: data.chargesSection1Content }}></div>

//                             {/* Render Consolidated Block 2 (Cancellations) */}
//                             <div className="pt-6" dangerouslySetInnerHTML={{ __html: data.chargesSection2Content }}></div>

//                         </div>
//                     </div>

//                 </div>
//             </section>
//         </main>
//     );
// }


import React from 'react';
import Link from 'next/link';
import SharedHeroBanner from '@/src/components/layout/SharedHeroBanner';
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
            <main className="w-full bg-white text-black min-h-[60vh] flex flex-col items-center justify-center overflow-hidden px-6 text-center mt-20">
                <h1 className="text-3xl font-bold mb-4">Content Unavailable</h1>
                <p className="text-gray-600">We are currently unable to load the returns policy. Please refresh the page or try again later.</p>
            </main>
        );
    }

    return (
        <main className="w-full bg-white text-black overflow-hidden selection:bg-[#FE8204] selection:text-white">
            
            {/* --- 1. Dynamic Hero Section --- */}
            <SharedHeroBanner 
                title={data.heroTitle || "Refund & Credit Policy"}
                image={data.heroImage}
                mobileImage={data.heroMobileImage}
                useMobileImage={true}
                textColor={data.heroTextColor}
            />

            {/* --- 2. Intro Text (From your custom design) --- */}
            <section className="bg-gray-50 py-12 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-block px-4 py-1.5 bg-black text-white text-sm font-bold tracking-widest uppercase rounded-full mb-6">
                        Customer Care
                    </div>
                    <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                        We know things don’t always go as planned, and we’re here to help.
                    </p>
                </div>
            </section>

            {/* --- 3. The Quick Truths (Dynamic Summary Cards) --- */}
            <section className="container mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1: Timeframe */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card1Title}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">{data.card1Text}</p>
                    </div>

                    {/* Card 2: Hygiene Rule */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card2Title}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">{data.card2Text}</p>
                    </div>

                    {/* Card 3: Easy Support */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card3Title}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">{data.card3Text}</p>
                    </div>
                </div>
            </section>

            {/* --- 4. Main Content with Sticky Sidebar --- */}
            <section className="container mx-auto px-6 pb-24 md:pb-32">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 relative">
                    
                    {/* Sticky Sidebar Navigation (Desktop Only) */}
                    <aside className="hidden lg:block w-1/4 shrink-0">
                        <div className="sticky top-32 space-y-4 border-l-2 border-gray-100 pl-6">
                            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Contents</h3>
                            <nav className="flex flex-col space-y-3 text-base font-bold text-gray-500">
                                {/* Hardcoded Links */}
                                <a href="#refunds-credits" className="hover:text-black hover:translate-x-1 transition-all">Refunds & Credits</a>
                                <a href="#final-sale" className="hover:text-black hover:translate-x-1 transition-all">Final Sale Items</a>
                                <a href="#defective" className="hover:text-black hover:translate-x-1 transition-all">Defective or Damaged</a>
                                <a href="#how-to-request" className="hover:text-[#FE8204] hover:translate-x-1 transition-all">How to Request</a>
                                
                                {/* Dynamic Links */}
                                {data.policyTitle && (
                                    <a href="#dynamic-policy" className="hover:text-black hover:translate-x-1 transition-all mt-4 pt-4 border-t border-gray-100">
                                        {data.policyTitle}
                                    </a>
                                )}
                                {data.issuesTitle && (
                                    <a href="#dynamic-issues" className="hover:text-black hover:translate-x-1 transition-all">
                                        {data.issuesTitle}
                                    </a>
                                )}
                                {data.paymentTitle && (
                                    <a href="#dynamic-payment" className="hover:text-black hover:translate-x-1 transition-all">
                                        {data.paymentTitle}
                                    </a>
                                )}
                                {data.chargesTitle && (
                                    <a href="#dynamic-charges" className="hover:text-black hover:translate-x-1 transition-all">
                                        {data.chargesTitle}
                                    </a>
                                )}
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content Wrapper */}
                    <article className="w-full lg:w-3/4 max-w-5xl space-y-16 text-lg text-gray-600 font-medium leading-relaxed">
                        
                        {/* ========================================== */}
                        {/* PART A: HARDCODED CUSTOM UI SECTIONS       */}
                        {/* ========================================== */}

                        {/* Section 1: Refunds & Credits */}
                        <div id="refunds-credits" className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-black">Refunds & Credits</h2>
                            <p>
                                If you’re not fully satisfied with your Just Tattoos purchase, we’re happy to assist within <strong>14 days</strong> from the date your order is delivered.
                            </p>
                            
                            <div className="bg-[#FE8204]/10 border-l-4 border-[#FE8204] p-6 text-black rounded-r-2xl my-6">
                                <strong>Important Note:</strong> Due to hygienic and safety reasons, <strong>we do not accept physical returns.</strong> However, depending on the situation, we may offer a store credit or a refund, when applicable.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                    <h4 className="text-black font-black text-xl mb-2">Within 14 Days</h4>
                                    <p className="text-base">Eligible for a full refund or a store credit to use on future purchases.</p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                    <h4 className="text-black font-black text-xl mb-2">After 14 Days</h4>
                                    <p className="text-base">Requests made after 14 days may still qualify for store credit. Orders older than <strong>90 days</strong> are not eligible for any refunds or credits.</p>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-500 mt-4">
                                * At this time, refunds can only be processed for orders shipped within the United States.
                            </p>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Section 2: Final Sale Items */}
                        <div id="final-sale" className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-black">Final Sale Items</h2>
                            <p>
                                The following products are <strong>final sale</strong> and are strictly not eligible for refunds or credits:
                            </p>
                            
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                <li className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">✕</span>
                                    <span className="text-black font-medium">Tattoo accessories & tools</span>
                                </li>
                                <li className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">✕</span>
                                    <span className="text-black font-medium">Tattoo marker products</span>
                                </li>
                                <li className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">✕</span>
                                    <span className="text-black font-medium">Digital or E-Gift Cards</span>
                                </li>
                                <li className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">✕</span>
                                    <span className="text-black font-medium">Sale or clearance items</span>
                                </li>
                                <li className="flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">✕</span>
                                    <span className="text-black font-medium">Tattoo bundles or kits</span>
                                </li>
                            </ul>

                            <div className="bg-gray-50 p-6 rounded-2xl text-black mt-6 space-y-2">
                                <p><strong>Please note:</strong> Original shipping costs are non-refundable.</p>
                                <p className="text-sm text-gray-500">Just Tattoos reserves the right to decline refund requests if misuse or abuse of the policy is detected.</p>
                            </div>
                        </div>

                        {/* Section 3: Defective or Damaged */}
                        <div id="defective" className="bg-black text-white p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-white">Defective or Damaged Products</h2>
                            <p className="text-gray-300">
                                If your order arrives damaged, defective, or you experience an issue with application, we’ve got you covered. Eligible cases may qualify for a <strong>one-time replacement or store credit</strong>.
                            </p>
                            
                            <div className="pt-4">
                                <h4 className="text-sm font-bold tracking-widest uppercase text-[#FE8204] mb-4">To help us resolve this quickly, please include:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FE8204]">✔</span>
                                        <span className="text-gray-200">Your order number</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FE8204]">✔</span>
                                        <span className="text-gray-200">Clear photos of the product</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-[#FE8204]">✔</span>
                                        <span className="text-gray-200">A brief description of the issue</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-gray-400 text-sm mt-4 italic">Our support team will review your request and let you know the next steps.</p>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Section 4: How to Request */}
                        <div id="how-to-request" className="text-center bg-gray-50 p-10 md:p-16 rounded-[2.5rem] space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-black">How to Request a Refund or Credit</h2>
                            <p className="text-lg max-w-2xl mx-auto mb-8">
                                It’s easy! Just reach out to us, and once we review your case, we’ll follow up with a resolution as soon as possible. Be sure to include your order number, photos of the item(s), and the reason for your request.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                <a 
                                    href="mailto:support@justtattoos.com" 
                                    className="w-full sm:w-auto inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:shadow-lg transition-all duration-300"
                                >
                                    Email Support
                                </a>
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">OR</span>
                                {/* Client-side script execution isn't supported directly in server components, so we use a standard anchor or wrap it in a minimal client component if needed. For now, it's styled as a button. */}
                                <a 
                                    href="/contact"
                                    className="w-full sm:w-auto inline-block bg-white border-2 border-black text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 text-center"
                                >
                                    Contact Us Page
                                </a>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* ========================================== */}
                        {/* PART B: DYNAMIC SHOPIFY DATA SECTIONS      */}
                        {/* ========================================== */}

                        {/* General Refund Policy */}
                        <div id="dynamic-policy" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-black sticky top-24">{data.policyTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-6">
                                <p>{data.policyP1}</p>
                                <p dangerouslySetInnerHTML={{ __html: data.policyP2 }}></p>
                                <p>{data.policyP3}</p>
                                <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-black text-black text-base mt-4">
                                    <p dangerouslySetInnerHTML={{ __html: data.policyNote }}></p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Defective Products & How to Reach Out */}
                        <div id="dynamic-issues" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-black sticky top-24">{data.issuesTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-6">
                                <p>{data.issuesIntro}</p>
                                
                                <h3 className="text-xl font-bold text-black mt-8 mb-4">{data.issuesEmailHeading}</h3>
                                <p>{data.issuesEmailText} <a href={`mailto:${data.issuesEmailAddress}`} className="text-black font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors">{data.issuesEmailAddress}</a> and include the following:</p>
                                
                                <ul className="bg-gray-50 p-8 rounded-3xl space-y-4 text-black">
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

                        <hr className="border-gray-100" />

                        {/* Payment Issues */}
                        <div id="dynamic-payment" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-black sticky top-24">{data.paymentTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-8">
                                <p>{data.paymentIntro}</p>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem1Title}</h4>
                                        <p dangerouslySetInnerHTML={{ __html: data.paymentItem1Text }}></p>
                                    </div>
                                    <div>
                                        <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem2Title}</h4>
                                        <p>{data.paymentItem2Text}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem3Title}</h4>
                                        <p>{data.paymentItem3Text}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-black font-bold text-xl mb-2">{data.paymentItem4Title}</h4>
                                        <p>{data.paymentItem4Text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Charge Timelines & Cancellations */}
                        <div id="dynamic-charges" className="flex flex-col md:flex-row gap-8 md:gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-3xl font-bold tracking-tight text-black sticky top-24">{data.chargesTitle}</h2>
                            </div>
                            <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-8">
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