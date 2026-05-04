'use client';

import React from 'react';

export default function RefundPolicy() {
    return (
        <main className="w-full bg-white text-black overflow-hidden selection:bg-[#FE8204] selection:text-white">
            
            {/* Custom Minimalist Hero Section */}
            <header className="bg-gray-50 pt-32 pb-20 md:pt-40 md:pb-28 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-block px-4 py-1.5 bg-black text-white text-sm font-bold tracking-widest uppercase rounded-full mb-6">
                        Customer Care
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 uppercase">
                        Refund & Credit Policy
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                        We know things don’t always go as planned, and we’re here to help.
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
                                <a href="#refunds-credits" className="hover:text-black hover:translate-x-1 transition-all">Refunds & Credits</a>
                                <a href="#final-sale" className="hover:text-black hover:translate-x-1 transition-all">Final Sale Items</a>
                                <a href="#defective" className="hover:text-black hover:translate-x-1 transition-all">Defective or Damaged</a>
                                <a href="#how-to-request" className="hover:text-[#FE8204] hover:translate-x-1 transition-all">How to Request</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content */}
                    <article className="w-full lg:w-3/4 max-w-4xl space-y-16 text-lg text-gray-600 font-medium leading-relaxed">
                        
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
                                <button 
                                    className="w-full sm:w-auto inline-block bg-white border-2 border-black text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
                                    onClick={() => {
                                        // This assumes you have a support widget (like Intercom/Gorgias) that opens on click
                                        alert("Support widget triggered!"); 
                                    }}
                                >
                                    Use Support Widget
                                </button>
                            </div>
                        </div>

                    </article>
                </div>
            </section>
        </main>
    );
}