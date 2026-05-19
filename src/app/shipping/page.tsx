
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added for the premium hero banner
import { getShippingPageData } from '@/src/lib/shopify'; // Update path if needed

export default async function ShippingPage() {
    // 1. Fetch dynamic data from Shopify
    const data = await getShippingPageData('shipping-page');

    if (!data) {
        return (
            <div className="p-20 text-center font-bold bg-black text-white min-h-screen flex items-center justify-center">
                Loading Shipping Info...
            </div>
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
                                alt={data.heroTitle || "Shipping Policy"}
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
                            {data.heroTitle || "Shipping Policy"}
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
                        Everything you need to know about how JustTattoos processes and ships your orders.
                    </p>
                    <p className="mt-4 text-sm font-bold text-zinc-500 tracking-widest uppercase">
                        Last Updated: February 1st, 2026
                    </p>
                </div>
            </section>

            {/* --- 3. Dynamic Quick Overview Cards --- */}
            <section className="container mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1 */}
                    <div className="bg-zinc-900 p-10 rounded-[2rem] text-center hover:shadow-2xl hover:border-white/20 transition-all duration-300 border border-white/10">
                        <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight text-zinc-100">{data.card1Title}</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed">{data.card1Text}</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-zinc-900 p-10 rounded-[2rem] text-center hover:shadow-2xl hover:border-white/20 transition-all duration-300 border border-white/10">
                        <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight text-zinc-100">{data.card2Title}</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed">{data.card2Text}</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-zinc-900 p-10 rounded-[2rem] text-center hover:shadow-2xl hover:border-white/20 transition-all duration-300 border border-white/10">
                        <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                                <a href="#processing" className="hover:text-white hover:translate-x-1 transition-all">1. Order Processing</a>
                                <a href="#destinations" className="hover:text-white hover:translate-x-1 transition-all">2. Destinations</a>
                                <a href="#methods" className="hover:text-white hover:translate-x-1 transition-all">3. Methods & Estimates</a>
                                <a href="#rates" className="hover:text-white hover:translate-x-1 transition-all">4. Shipping Rates</a>
                                <a href="#tracking" className="hover:text-white hover:translate-x-1 transition-all">5. Order Tracking</a>
                                <a href="#accuracy" className="hover:text-white hover:translate-x-1 transition-all">6. Address Accuracy</a>
                                <a href="#special-addresses" className="hover:text-white hover:translate-x-1 transition-all">7. P.O. Boxes & APO/FPO</a>
                                <a href="#issues" className="hover:text-[#FE8204] hover:translate-x-1 transition-all">8. Lost, Stolen & Damaged</a>
                                <a href="#split" className="hover:text-white hover:translate-x-1 transition-all">9. Split Shipments</a>
                                <a href="#taxes" className="hover:text-white hover:translate-x-1 transition-all">10. Taxes</a>
                                {data.policyBlocks && data.policyBlocks.length > 0 && (
                                    <a href="#additional-policies" className="hover:text-white hover:translate-x-1 transition-all">11. Additional Policies</a>
                                )}
                                <a href="#contact" className="hover:text-white hover:translate-x-1 transition-all mt-4 pt-4 border-t border-white/10">Contact Us</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content Wrapper */}
                    <article className="w-full lg:w-3/4 max-w-4xl space-y-16 text-lg text-zinc-400 font-medium leading-relaxed">
                        
                        {/* Intro */}
                        <div>
                            <p>
                                This Shipping Policy explains how JustTattoos (“JustTattoos”, “we”, “us”, “our”) processes and ships orders placed through our website (the “Site”). By placing an order, you agree to the terms outlined below.
                            </p>
                        </div>

                        {/* Section 1: Order Processing */}
                        <div id="processing" className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-100">1. Order Processing Times</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-zinc-900 border border-white/10 shadow-sm p-6 rounded-2xl">
                                    <h4 className="text-zinc-100 font-bold mb-2 text-xl">Standard Processing</h4>
                                    <p className="text-base text-zinc-400">Orders are typically processed within <strong className="text-white">1–3 business days</strong> (excluding weekends and U.S. federal holidays), unless otherwise stated.</p>
                                </div>
                                <div className="bg-zinc-900 border border-white/10 shadow-sm p-6 rounded-2xl">
                                    <h4 className="text-zinc-100 font-bold mb-2 text-xl">High Volume / Promotions</h4>
                                    <p className="text-base text-zinc-400">Processing times may be longer during peak seasons, promotions, or new product launches.</p>
                                </div>
                                <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl md:col-span-2">
                                    <h4 className="text-zinc-100 font-bold mb-2 text-xl">Changes or Cancellations</h4>
                                    <p className="text-base text-zinc-400">If you need to change or cancel an order, contact us immediately at <a href="mailto:support@justtattoos.com" className="text-white font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors">support@justtattoos.com</a>. Once an order has been processed or shipped, changes may not be possible.</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Sections 2, 3, 4 */}
                        <div className="space-y-12">
                            <div id="destinations" className="bg-[#FE8204]/20 border-l-4 border-[#FE8204] p-6 text-zinc-200 rounded-r-2xl">
                                <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">2. Shipping Destinations</h2>
                                <p>We currently ship <strong className="text-white">within the United States only</strong>.</p>
                            </div>

                            <div id="methods" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100">3. Methods, Carriers & Estimates</h2>
                                <ul className="space-y-4 text-zinc-400">
                                    <li className="flex gap-4 flex-col sm:flex-row"><strong className="text-zinc-100 min-w-[120px]">Carriers:</strong> <span>Orders may be shipped via USPS, UPS, FedEx, or other reputable carriers, depending on availability and destination.</span></li>
                                    <li className="flex gap-4 flex-col sm:flex-row"><strong className="text-zinc-100 min-w-[120px]">Estimates:</strong> <span>Delivery timeframes are estimates provided by the carrier and begin once the order has been processed.</span></li>
                                    <li className="flex gap-4 flex-col sm:flex-row"><strong className="text-zinc-100 min-w-[120px]">Guarantees:</strong> <span>Delivery dates are <em>not</em> guaranteed unless an explicit guaranteed shipping option is offered and selected at checkout.</span></li>
                                </ul>
                            </div>

                            <div id="rates" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100">4. Shipping Rates</h2>
                                <p>Shipping costs are calculated and displayed at checkout. From time to time, we may offer flat-rate shipping or free shipping promotions. All promotions and shipping rates are subject to change and are governed by the terms shown at the time of purchase.</p>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Sections 5, 6, 7 */}
                        <div className="space-y-12">
                            <div id="tracking" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100">5. Order Tracking</h2>
                                <p>Once your order ships, you will receive a shipping confirmation email (and/or SMS if you opted in) that includes tracking information. Tracking details may take <strong className="text-white">24–48 hours to update</strong> after the shipping label is created.</p>
                            </div>

                            <div id="accuracy" className="bg-zinc-900 p-8 rounded-3xl border border-white/10 space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-100">6. Address Accuracy & Undeliverable Packages</h2>
                                <p>Please review your shipping address carefully before completing checkout.</p>
                                <ul className="list-disc pl-5 space-y-2 text-base text-zinc-400">
                                    <li>If a package is returned to us due to an incorrect, incomplete, or undeliverable address, you may be responsible for reshipping costs.</li>
                                    <li>If you notice an address error, contact <a href="mailto:support@justtattoos.com" className="text-white font-bold hover:text-[#FE8204]">support@justtattoos.com</a> immediately. Address changes may not be possible once processed.</li>
                                </ul>
                            </div>

                            <div id="special-addresses" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-100">7. P.O. Boxes, APO/FPO, & Special Addresses</h2>
                                <p>We may ship to P.O. Boxes and APO/FPO addresses, depending on the carrier and shipping method selected. If a carrier is unable to deliver to the provided address, we may contact you to request an alternate address or cancel and refund the order.</p>
                            </div>
                        </div>

                        {/* Section 8: Lost, Stolen or Damaged */}
                        <div id="issues" className="bg-zinc-900 border border-white/10 text-white p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">8. Lost, Stolen, or Damaged Packages</h2>
                                <p className="text-zinc-400">We understand shipping issues are frustrating, and we are here to help guide you through the process.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="border-l-2 border-zinc-700 pl-4">
                                    <h4 className="text-lg font-bold text-white mb-1">Carrier Delays</h4>
                                    <p className="text-zinc-300 text-base">Once a package is handed off to the carrier, delivery timing is controlled by them. Delays caused by weather, holidays, or events are outside our control.</p>
                                </div>
                                <div className="border-l-2 border-[#FE8204] pl-4">
                                    <h4 className="text-lg font-bold text-white mb-1">Lost Packages</h4>
                                    <p className="text-zinc-300 text-base">If tracking shows no movement for an extended period or indicates it may be lost, please contact us. We may assist with a carrier investigation where applicable.</p>
                                </div>
                                <div className="border-l-2 border-zinc-700 pl-4">
                                    <h4 className="text-lg font-bold text-white mb-2">Stolen Packages</h4>
                                    <p className="text-zinc-300 text-base mb-3">If tracking shows “delivered” but the package is missing:</p>
                                    <ul className="space-y-2 text-sm text-zinc-400">
                                        <li>— Check around your property and with neighbors or building staff.</li>
                                        <li>— Confirm the shipping address on your order.</li>
                                        <li>— Contact the carrier for delivery confirmation or GPS details.</li>
                                        <li>— File a police report if necessary.</li>
                                    </ul>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <h4 className="text-lg font-bold text-[#FE8204] mb-2">Damaged Packages</h4>
                                    <p className="text-zinc-200 text-base mb-3">If your order arrives damaged, email us within <strong className="text-white">48 hours of delivery</strong> and include:</p>
                                    <ul className="space-y-2 text-sm text-zinc-300">
                                        <li className="flex items-center gap-2"><span className="text-[#FE8204]">✔</span> Your order number</li>
                                        <li className="flex items-center gap-2"><span className="text-[#FE8204]">✔</span> Photos of the damaged item(s)</li>
                                        <li className="flex items-center gap-2"><span className="text-[#FE8204]">✔</span> Photos of the packaging and shipping label</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Sections 9 & 10 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div id="split" className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-100">9. Split Shipments</h2>
                                <p>If your order includes multiple items, they may ship separately. In such cases, you will receive multiple tracking numbers as they become available.</p>
                            </div>
                            <div id="taxes" className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-100">10. Taxes</h2>
                                <p>Sales tax (if applicable) is calculated at checkout based on your shipping address and current applicable tax laws.</p>
                            </div>
                        </div>

                        {/* --- 5. Dynamic Policy Blocks from Shopify (Appended at the bottom) --- */}
                        {data.policyBlocks && data.policyBlocks.length > 0 && (
                            <>
                                <hr className="border-white/10" />
                                <div id="additional-policies" className="space-y-12">
                                    <div className="border-b-2 border-white/10 pb-6">
                                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-zinc-100">
                                            {data.policiesHeader || "Additional Policies"}
                                        </h2>
                                    </div>
                                    
                                    {data.policyBlocks.map((block: any, index: number) => (
                                        <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12">
                                            <h3 className="w-full md:w-1/3 text-2xl font-bold tracking-tight text-zinc-100">
                                                {block.title}
                                            </h3>
                                            <div className="w-full md:w-2/3 text-lg text-zinc-400 font-medium leading-relaxed space-y-4">
                                                {block.content.split('\n').map((paragraph: string, pIndex: number) => (
                                                    paragraph.trim() ? <p key={pIndex}>{paragraph}</p> : null
                                                ))}
                                                {block.highlightNote && (
                                                    <p className="bg-zinc-900 p-6 rounded-2xl border-l-4 border-[#FE8204] text-zinc-200">
                                                        <strong className="text-white">Important Note:</strong> {block.highlightNote}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Section 11: Contact */}
                        <div id="contact" className="text-center bg-zinc-900 p-10 md:p-16 rounded-[2.5rem] space-y-6 mt-12 border border-white/10">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-100">11. Questions & Contact</h2>
                            <p className="text-lg max-w-2xl mx-auto text-zinc-400">
                                If you have any further questions about our shipping procedures, delivery times, or a specific order, please reach out to our team.
                            </p>
                            <div className="pt-4">
                                <a 
                                    href="mailto:support@justtattoos.com" 
                                    className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:text-white hover:shadow-lg hover:shadow-[#FE8204]/20 transition-all duration-300"
                                >
                                    support@justtattoos.com
                                </a>
                            </div>
                        </div>

                    </article>
                </div>
            </section>

            {/* --- 6. Dynamic Footer CTA --- */}
            <section className="bg-black border-t border-white/10 text-white py-20">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-zinc-100">
                        {data.ctaTitle}
                    </h2>
                    <p className="text-zinc-400 font-medium text-lg mb-8 whitespace-pre-line">
                        {data.ctaText}
                    </p>
                    <Link 
                        href={data.ctaLink} 
                        className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:text-white hover:shadow-lg hover:shadow-[#FE8204]/20 transition-all duration-300"
                    >
                        {data.ctaButtonText}
                    </Link>
                </div>
            </section>

        </main>
    );
}