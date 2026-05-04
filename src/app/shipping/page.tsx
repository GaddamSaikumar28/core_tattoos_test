

// import React from 'react';
// import Link from 'next/link';
// import SharedHeroBanner from '@/src/components/layout/SharedHeroBanner';
// import { getShippingPageData } from '@/src/lib/shopify'; // Update path if needed

// export default async function Shipping() {
//     // IMPORTANT: Make sure this handle matches exactly what Shopify generated!
//     const data = await getShippingPageData('shipping-page');

//     if (!data) {
//         return <div className="p-20 text-center font-bold">Loading Shipping Info...</div>;
//     }

//     return (
//         <main className="w-full bg-white text-black overflow-hidden">
//             {/* Hero Section */}
//             <SharedHeroBanner 
//                 title={data.heroTitle}
//                 image={data.heroImage}
//                 mobileImage={data.heroImage} // Using the same image for mobile here
//                 useMobileImage={true}
//                 textColor="#FE8204"
//             />

//             {/* Quick Overview Cards */}
//             <section className="container mx-auto px-6 py-20 md:py-24">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//                     {/* Card 1 */}
//                     <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300">
//                         <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//                             <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                         </div>
//                         <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card1Title}</h3>
//                         <p className="text-gray-600 font-medium leading-relaxed">
//                             {data.card1Text}
//                         </p>
//                     </div>

//                     {/* Card 2 */}
//                     <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300">
//                         <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//                             <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                         </div>
//                         <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card2Title}</h3>
//                         <p className="text-gray-600 font-medium leading-relaxed">
//                             {data.card2Text}
//                         </p>
//                     </div>

//                     {/* Card 3 */}
//                     <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300">
//                         <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
//                             <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                         </div>
//                         <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card3Title}</h3>
//                         <p className="text-gray-600 font-medium leading-relaxed">
//                             {data.card3Text}
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* Detailed Shipping Policies */}
//             <section className="container mx-auto px-6 pb-24 md:pb-32">
//                 <div className="max-w-4xl mx-auto space-y-16">
                    
//                     {/* Header */}
//                     <div className="border-b-2 border-black pb-6">
//                         <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">
//                             {data.policiesHeader}
//                         </h2>
//                     </div>

//                     {/* Dynamic Policy Blocks */}
//                     {data.policyBlocks.map((block: any, index: number) => (
//                         <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12">
//                             <h3 className="w-full md:w-1/3 text-2xl font-bold tracking-tight">
//                                 {block.title}
//                             </h3>
//                             <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-4">
//                                 {/* Split multi-line text into actual paragraphs */}
//                                 {block.content.split('\n').map((paragraph: string, pIndex: number) => (
//                                     paragraph.trim() ? <p key={pIndex}>{paragraph}</p> : null
//                                 ))}
                                
//                                 {/* Optional Highlight Note */}
//                                 {block.highlightNote && (
//                                     <p className="bg-gray-50 p-6 rounded-2xl border-l-4 border-[#FE8204] text-black">
//                                         <strong>Important Note:</strong> {block.highlightNote}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     ))}

//                 </div>
//             </section>

//             {/* Need Help Footer CTA */}
//             <section className="bg-black text-white py-20">
//                 <div className="container mx-auto px-6 text-center max-w-2xl">
//                     <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
//                         {data.ctaTitle}
//                     </h2>
//                     <p className="text-gray-400 font-medium text-lg mb-8 whitespace-pre-line">
//                         {data.ctaText}
//                     </p>
//                     <Link 
//                         href={data.ctaLink} 
//                         className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:text-white hover:shadow-lg transition-all duration-300"
//                     >
//                         {data.ctaButtonText}
//                     </Link>
//                 </div>
//             </section>
//         </main>
//     );
// }




import React from 'react';
import Link from 'next/link';
import SharedHeroBanner from '@/src/components/layout/SharedHeroBanner';
import { getShippingPageData } from '@/src/lib/shopify'; // Update path if needed

export default async function ShippingPage() {
    // 1. Fetch dynamic data from Shopify
    const data = await getShippingPageData('shipping-page');

    if (!data) {
        return <div className="p-20 text-center font-bold">Loading Shipping Info...</div>;
    }

    return (
        <main className="w-full bg-white text-black overflow-hidden selection:bg-[#FE8204] selection:text-white">
            
            {/* --- 1. Dynamic Hero Section --- */}
            <SharedHeroBanner 
                title={data.heroTitle || "Shipping Policy"}
                image={data.heroImage}
                mobileImage={data.heroImage} 
                useMobileImage={true}
                textColor="#FE8204"
            />

            {/* --- 2. Intro Text (From your custom design) --- */}
            <section className="bg-gray-50 py-12 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-block px-4 py-1.5 bg-black text-white text-sm font-bold tracking-widest uppercase rounded-full mb-6">
                        Customer Care
                    </div>
                    <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                        Everything you need to know about how JustTattoos processes and ships your orders.
                    </p>
                    <p className="mt-4 text-sm font-bold text-gray-400 tracking-widest uppercase">
                        Last Updated: February 1st, 2026
                    </p>
                </div>
            </section>

            {/* --- 3. Dynamic Quick Overview Cards --- */}
            <section className="container mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1 */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card1Title}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">{data.card1Text}</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{data.card2Title}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">{data.card2Text}</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-gray-50 p-10 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-8 h-8 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                                <a href="#processing" className="hover:text-black hover:translate-x-1 transition-all">1. Order Processing</a>
                                <a href="#destinations" className="hover:text-black hover:translate-x-1 transition-all">2. Destinations</a>
                                <a href="#methods" className="hover:text-black hover:translate-x-1 transition-all">3. Methods & Estimates</a>
                                <a href="#rates" className="hover:text-black hover:translate-x-1 transition-all">4. Shipping Rates</a>
                                <a href="#tracking" className="hover:text-black hover:translate-x-1 transition-all">5. Order Tracking</a>
                                <a href="#accuracy" className="hover:text-black hover:translate-x-1 transition-all">6. Address Accuracy</a>
                                <a href="#special-addresses" className="hover:text-black hover:translate-x-1 transition-all">7. P.O. Boxes & APO/FPO</a>
                                <a href="#issues" className="hover:text-[#FE8204] hover:translate-x-1 transition-all">8. Lost, Stolen & Damaged</a>
                                <a href="#split" className="hover:text-black hover:translate-x-1 transition-all">9. Split Shipments</a>
                                <a href="#taxes" className="hover:text-black hover:translate-x-1 transition-all">10. Taxes</a>
                                {data.policyBlocks && data.policyBlocks.length > 0 && (
                                    <a href="#additional-policies" className="hover:text-black hover:translate-x-1 transition-all">11. Additional Policies</a>
                                )}
                                <a href="#contact" className="hover:text-black hover:translate-x-1 transition-all mt-4 pt-4 border-t border-gray-100">Contact Us</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content Wrapper */}
                    <article className="w-full lg:w-3/4 max-w-4xl space-y-16 text-lg text-gray-600 font-medium leading-relaxed">
                        
                        {/* Intro */}
                        <div>
                            <p>
                                This Shipping Policy explains how JustTattoos (“JustTattoos”, “we”, “us”, “our”) processes and ships orders placed through our website (the “Site”). By placing an order, you agree to the terms outlined below.
                            </p>
                        </div>

                        {/* Section 1: Order Processing */}
                        <div id="processing" className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-black">1. Order Processing Times</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl">
                                    <h4 className="text-black font-bold mb-2 text-xl">Standard Processing</h4>
                                    <p className="text-base">Orders are typically processed within <strong>1–3 business days</strong> (excluding weekends and U.S. federal holidays), unless otherwise stated.</p>
                                </div>
                                <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl">
                                    <h4 className="text-black font-bold mb-2 text-xl">High Volume / Promotions</h4>
                                    <p className="text-base">Processing times may be longer during peak seasons, promotions, or new product launches.</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl md:col-span-2">
                                    <h4 className="text-black font-bold mb-2 text-xl">Changes or Cancellations</h4>
                                    <p className="text-base">If you need to change or cancel an order, contact us immediately at <a href="mailto:support@justtattoos.com" className="text-black font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors">support@justtattoos.com</a>. Once an order has been processed or shipped, changes may not be possible.</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Sections 2, 3, 4 */}
                        <div className="space-y-12">
                            <div id="destinations" className="bg-[#FE8204]/10 border-l-4 border-[#FE8204] p-6 text-black rounded-r-2xl">
                                <h2 className="text-2xl font-bold tracking-tight mb-2">2. Shipping Destinations</h2>
                                <p>We currently ship <strong>within the United States only</strong>.</p>
                            </div>

                            <div id="methods" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-black">3. Methods, Carriers & Estimates</h2>
                                <ul className="space-y-4">
                                    <li className="flex gap-4"><strong className="text-black min-w-[120px]">Carriers:</strong> <span>Orders may be shipped via USPS, UPS, FedEx, or other reputable carriers, depending on availability and destination.</span></li>
                                    <li className="flex gap-4"><strong className="text-black min-w-[120px]">Estimates:</strong> <span>Delivery timeframes are estimates provided by the carrier and begin once the order has been processed.</span></li>
                                    <li className="flex gap-4"><strong className="text-black min-w-[120px]">Guarantees:</strong> <span>Delivery dates are <em>not</em> guaranteed unless an explicit guaranteed shipping option is offered and selected at checkout.</span></li>
                                </ul>
                            </div>

                            <div id="rates" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-black">4. Shipping Rates</h2>
                                <p>Shipping costs are calculated and displayed at checkout. From time to time, we may offer flat-rate shipping or free shipping promotions. All promotions and shipping rates are subject to change and are governed by the terms shown at the time of purchase.</p>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Sections 5, 6, 7 */}
                        <div className="space-y-12">
                            <div id="tracking" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-black">5. Order Tracking</h2>
                                <p>Once your order ships, you will receive a shipping confirmation email (and/or SMS if you opted in) that includes tracking information. Tracking details may take <strong>24–48 hours to update</strong> after the shipping label is created.</p>
                            </div>

                            <div id="accuracy" className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-black">6. Address Accuracy & Undeliverable Packages</h2>
                                <p>Please review your shipping address carefully before completing checkout.</p>
                                <ul className="list-disc pl-5 space-y-2 text-base text-gray-600">
                                    <li>If a package is returned to us due to an incorrect, incomplete, or undeliverable address, you may be responsible for reshipping costs.</li>
                                    <li>If you notice an address error, contact <a href="mailto:support@justtattoos.com" className="text-black font-bold hover:text-[#FE8204]">support@justtattoos.com</a> immediately. Address changes may not be possible once processed.</li>
                                </ul>
                            </div>

                            <div id="special-addresses" className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-black">7. P.O. Boxes, APO/FPO, & Special Addresses</h2>
                                <p>We may ship to P.O. Boxes and APO/FPO addresses, depending on the carrier and shipping method selected. If a carrier is unable to deliver to the provided address, we may contact you to request an alternate address or cancel and refund the order.</p>
                            </div>
                        </div>

                        {/* Section 8: Lost, Stolen or Damaged */}
                        <div id="issues" className="bg-black text-white p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">8. Lost, Stolen, or Damaged Packages</h2>
                                <p className="text-gray-400">We understand shipping issues are frustrating, and we are here to help guide you through the process.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="border-l-2 border-gray-700 pl-4">
                                    <h4 className="text-lg font-bold text-white mb-1">Carrier Delays</h4>
                                    <p className="text-gray-300 text-base">Once a package is handed off to the carrier, delivery timing is controlled by them. Delays caused by weather, holidays, or events are outside our control.</p>
                                </div>
                                <div className="border-l-2 border-[#FE8204] pl-4">
                                    <h4 className="text-lg font-bold text-white mb-1">Lost Packages</h4>
                                    <p className="text-gray-300 text-base">If tracking shows no movement for an extended period or indicates it may be lost, please contact us. We may assist with a carrier investigation where applicable.</p>
                                </div>
                                <div className="border-l-2 border-gray-700 pl-4">
                                    <h4 className="text-lg font-bold text-white mb-2">Stolen Packages</h4>
                                    <p className="text-gray-300 text-base mb-3">If tracking shows “delivered” but the package is missing:</p>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li>— Check around your property and with neighbors or building staff.</li>
                                        <li>— Confirm the shipping address on your order.</li>
                                        <li>— Contact the carrier for delivery confirmation or GPS details.</li>
                                        <li>— File a police report if necessary.</li>
                                    </ul>
                                </div>
                                <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                                    <h4 className="text-lg font-bold text-[#FE8204] mb-2">Damaged Packages</h4>
                                    <p className="text-gray-200 text-base mb-3">If your order arrives damaged, email us within <strong>48 hours of delivery</strong> and include:</p>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        <li className="flex items-center gap-2"><span className="text-[#FE8204]">✔</span> Your order number</li>
                                        <li className="flex items-center gap-2"><span className="text-[#FE8204]">✔</span> Photos of the damaged item(s)</li>
                                        <li className="flex items-center gap-2"><span className="text-[#FE8204]">✔</span> Photos of the packaging and shipping label</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Sections 9 & 10 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div id="split" className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-black">9. Split Shipments</h2>
                                <p>If your order includes multiple items, they may ship separately. In such cases, you will receive multiple tracking numbers as they become available.</p>
                            </div>
                            <div id="taxes" className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-black">10. Taxes</h2>
                                <p>Sales tax (if applicable) is calculated at checkout based on your shipping address and current applicable tax laws.</p>
                            </div>
                        </div>

                        {/* --- 5. Dynamic Policy Blocks from Shopify (Appended at the bottom) --- */}
                        {data.policyBlocks && data.policyBlocks.length > 0 && (
                            <>
                                <hr className="border-gray-100" />
                                <div id="additional-policies" className="space-y-12">
                                    <div className="border-b-2 border-black pb-6">
                                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-black">
                                            {data.policiesHeader || "Additional Policies"}
                                        </h2>
                                    </div>
                                    
                                    {data.policyBlocks.map((block: any, index: number) => (
                                        <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12">
                                            <h3 className="w-full md:w-1/3 text-2xl font-bold tracking-tight text-black">
                                                {block.title}
                                            </h3>
                                            <div className="w-full md:w-2/3 text-lg text-gray-600 font-medium leading-relaxed space-y-4">
                                                {block.content.split('\n').map((paragraph: string, pIndex: number) => (
                                                    paragraph.trim() ? <p key={pIndex}>{paragraph}</p> : null
                                                ))}
                                                {block.highlightNote && (
                                                    <p className="bg-gray-50 p-6 rounded-2xl border-l-4 border-[#FE8204] text-black">
                                                        <strong>Important Note:</strong> {block.highlightNote}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Section 11: Contact */}
                        <div id="contact" className="text-center bg-gray-50 p-10 md:p-16 rounded-[2.5rem] space-y-6 mt-12 border border-gray-100">
                            <h2 className="text-3xl font-bold tracking-tight text-black">11. Questions & Contact</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                If you have any further questions about our shipping procedures, delivery times, or a specific order, please reach out to our team.
                            </p>
                            <div className="pt-4">
                                <a 
                                    href="mailto:support@justtattoos.com" 
                                    className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:shadow-lg transition-all duration-300"
                                >
                                    support@justtattoos.com
                                </a>
                            </div>
                        </div>

                    </article>
                </div>
            </section>

            {/* --- 6. Dynamic Footer CTA --- */}
            <section className="bg-black text-white py-20">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                        {data.ctaTitle}
                    </h2>
                    <p className="text-gray-400 font-medium text-lg mb-8 whitespace-pre-line">
                        {data.ctaText}
                    </p>
                    <Link 
                        href={data.ctaLink} 
                        className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:text-white hover:shadow-lg transition-all duration-300"
                    >
                        {data.ctaButtonText}
                    </Link>
                </div>
            </section>

        </main>
    );
}