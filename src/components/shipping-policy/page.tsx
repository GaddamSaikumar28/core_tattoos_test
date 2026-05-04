'use client';

import React from 'react';

export default function ShippingPolicy() {
    return (
        <main className="w-full bg-white text-black overflow-hidden selection:bg-[#FE8204] selection:text-white">
            
            {/* Custom Minimalist Hero Section */}
            <header className="bg-gray-50 pt-32 pb-20 md:pt-40 md:pb-28 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-block px-4 py-1.5 bg-black text-white text-sm font-bold tracking-widest uppercase rounded-full mb-6">
                        Customer Care
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase">
                        Shipping Policy
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                        Everything you need to know about how JustTattoos processes and ships your orders.
                    </p>
                    <p className="mt-6 text-sm font-bold text-gray-400 tracking-widest uppercase">
                        Last Updated: February 1st, 2026
                    </p>
                </div>
            </header>

            {/* Main Content with Sticky Sidebar */}
            <section className="container mx-auto px-6 py-16 md:py-24">
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
                                <a href="#contact" className="hover:text-black hover:translate-x-1 transition-all">Contact Us</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content */}
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

                        {/* Section 2, 3, 4: Destinations, Methods, Rates */}
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

                        {/* Section 5, 6, 7: Tracking, Accuracy, PO Boxes */}
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
                                    <p className="text-gray-400 text-sm mt-3 italic">* JustTattoos is not responsible for theft after confirmed delivery, but we will make reasonable efforts to assist with the investigation.</p>
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

                        {/* Section 9 & 10: Split Shipments & Taxes */}
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

                        {/* Section 11: Contact */}
                        <div id="contact" className="text-center bg-gray-50 p-10 md:p-16 rounded-[2.5rem] space-y-6 mt-12">
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
        </main>
    );
}