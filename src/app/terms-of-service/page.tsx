
'use client';

import React from 'react';

export default function TermsOfService() {
    // Array of payment methods to map into visual badges
    const paymentMethods = [
        "Visa", "Mastercard", "PayPal", "Direct Debit", 
        "Apple Pay", "Google Pay", "Amazon Pay"
    ];

    return (
        <main className="w-full bg-black text-white overflow-hidden selection:bg-[#FE8204] selection:text-white relative">
            
            {/* Immersive Ambient Glow for Transparent Header Integration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[#FE8204] opacity-[0.04] blur-[150px] pointer-events-none z-0" />

            {/* Custom Minimalist Hero Section */}
            <header className="relative z-10 bg-zinc-950/50 backdrop-blur-3xl pt-32 pb-20 md:pt-40 md:pb-28 border-b border-white/5">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 text-zinc-300 text-xs font-black tracking-[0.2em] uppercase rounded-full mb-8 shadow-lg">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase text-white leading-[1.1]">
                        Terms of Service <br className="hidden md:block" /> & Privacy
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
                        Everything you need to know about your rights, our responsibilities, and how we operate at JustTattoos.
                    </p>
                </div>
            </header>

            {/* Main Content with Sticky Sidebar */}
            <section className="container mx-auto px-6 py-16 md:py-24 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 relative">
                    
                    {/* Sticky Sidebar Navigation (Desktop Only) */}
                    <aside className="hidden lg:block w-1/4 shrink-0">
                        <div className="sticky top-32 space-y-4 border-l-2 border-white/10 pl-6 py-2">
                            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-zinc-500 mb-6">Contents</h3>
                            <nav className="flex flex-col space-y-4 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                                <a href="#overview" className="hover:text-white hover:translate-x-1 transition-all duration-300">Overview</a>
                                <a href="#store-terms" className="hover:text-white hover:translate-x-1 transition-all duration-300">1. Store Terms</a>
                                <a href="#general" className="hover:text-white hover:translate-x-1 transition-all duration-300">2. General Conditions</a>
                                <a href="#disputes" className="hover:text-white hover:translate-x-1 transition-all duration-300">4. Dispute Resolution</a>
                                <a href="#billing" className="hover:text-white hover:translate-x-1 transition-all duration-300">7. Billing & Payments</a>
                                <a href="#wholesale" className="text-[#FE8204] hover:text-[#e67503] hover:translate-x-1 transition-all duration-300">24. Wholesale Terms</a>
                                <a href="#privacy" className="hover:text-white hover:translate-x-1 transition-all duration-300">Privacy Requests</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content */}
                    <article className="w-full lg:w-3/4 max-w-4xl space-y-16 text-lg text-zinc-400 font-medium leading-relaxed">
                        
                        {/* Overview */}
                        <div id="overview" className="space-y-6">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Overview</h2>
                            <p>
                                This website is operated by JustTattoos. Throughout the site, the terms “we”, “us” and “our” refer to JustTattoos. JustTattoos offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                            </p>
                            <p>
                                By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following Terms of Service (“Terms”), including any additional terms and policies referenced herein. These Terms apply to all users of the site, including browsers, customers, merchants, vendors, and contributors of content.
                            </p>
                            <p className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl text-zinc-300 border-l-4 border-[#FE8204]">
                                Our store is hosted on Shopify Inc., which provides the e-commerce platform that allows us to sell our products and services to you.
                            </p>
                        </div>

                        <hr className="border-white/10" />

                        {/* Section 1 & 2 */}
                        <div id="store-terms" className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Section 1: Online Store Terms</h2>
                                <p>By agreeing to these Terms, you represent that you are at least the age of majority in your state of residence. You may not use our products for any illegal or unauthorized purpose or violate any laws in your jurisdiction. Any violation of these Terms will result in immediate termination of service.</p>
                            </div>
                            
                            <div id="general" className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Section 2: General Conditions</h2>
                                <p>We reserve the right to refuse service to anyone for any reason at any time. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service without express written permission.</p>
                            </div>
                        </div>

                        {/* Section 3, 4, 5, 6 */}
                        <div id="disputes" className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Section 3 & 5: Information & Modifications</h2>
                                <p>We are not responsible if information on this site is not accurate, complete, or current. Any reliance on the material on this site is at your own risk. Prices and availability of products are subject to change without notice. We reserve the right to modify or discontinue the Service at any time.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Section 4: Dispute Resolution</h2>
                                <p>All disputes arising from or relating to these Terms, your purchase of JustTattoos products, or communications with JustTattoos shall be resolved through binding arbitration in the United States, administered by the American Arbitration Association (AAA). <strong className="text-white">Both parties waive the right to a jury trial or to participate in a class action.</strong> (Exceptions, opt-out rights, fees, enforcement, and FAA governance remain unchanged.)</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Section 6: Products or Services</h2>
                                <p>Certain products may be available exclusively online and in limited quantities. Products are subject to return or exchange only according to our Return Policy. We reserve the right to limit product quantities and discontinue products at any time. For large orders of 100 units or more, processing and delivery times may vary. Please contact <a href="mailto:support@justtattoos.com" className="text-white font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors pb-0.5">support@justtattoos.com</a> for assistance.</p>
                            </div>
                        </div>

                        {/* Section 7: Billing and Payments */}
                        <div id="billing" className="space-y-8 bg-zinc-900/50 border border-white/5 p-8 md:p-12 rounded-[2rem]">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 7: Billing & Account Info</h2>
                            <p>We reserve the right to refuse or cancel orders at our discretion. You agree to provide accurate billing and account information and to update it as needed.</p>
                            
                            <div className="pt-4">
                                <h3 className="text-xs font-black tracking-[0.2em] uppercase text-zinc-500 mb-6">Accepted Payment Methods</h3>
                                <div className="flex flex-wrap gap-3">
                                    {paymentMethods.map((method, index) => (
                                        <span 
                                            key={index} 
                                            className="px-4 py-2 bg-zinc-950 border border-white/10 text-zinc-300 text-sm font-bold tracking-wide rounded-xl shadow-sm hover:border-white/30 transition-colors"
                                        >
                                            {method}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 13, 14, 20, 22, 23 */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Section 13 & 14: Prohibited Uses & Force Majeure</h2>
                                <p>You are prohibited from using the site or its content for unlawful purposes, violating U.S. laws or regulations, infringing intellectual property, spreading malicious software, or interfering with site security.</p>
                                <p>JustTattoos is not liable for delays or failures caused by events beyond reasonable control, including natural disasters, government actions, labor disputes, or communication failures.</p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Section 20 & 23: Governing Law & Messaging</h2>
                                <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict-of-law principles. Text messaging terms remain unchanged and apply only to users who opt in within the United States.</p>
                            </div>
                        </div>

                        {/* Section 24: Wholesale */}
                        <div id="wholesale" className="bg-zinc-900 border border-[#FE8204]/20 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-[#FE8204]/5 space-y-6 relative overflow-hidden">
                            {/* Subtle background flare */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE8204]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex flex-col md:flex-row md:items-center gap-4 uppercase relative z-10">
                                Section 24: Wholesale Terms
                                <span className="w-fit px-3 py-1 bg-[#FE8204] text-white text-[10px] font-black tracking-widest uppercase rounded-full">Domestic Only</span>
                            </h2>
                            <p className="text-zinc-300 relative z-10">Wholesale sales apply only within the United States. All wholesale products are sold “AS IS”, without warranties of any kind.</p>
                            <ul className="space-y-4 mt-6 relative z-10">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#FE8204] mt-1 font-bold">✔</span>
                                    <span className="text-zinc-200">All orders must be prepaid.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#FE8204] mt-1 font-bold">✔</span>
                                    <span className="text-zinc-200">Orders over 100 units may experience processing delays.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#FE8204] mt-1 font-bold">✔</span>
                                    <span className="text-zinc-200">No physical returns due to hygienic reasons. Refunds or credits must be requested within 14 days.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#FE8204] mt-1 font-bold">✔</span>
                                    <span className="text-zinc-200">Shipping costs are non-refundable. JustTattoos reserves the right to refuse refunds in cases of abuse.</span>
                                </li>
                            </ul>
                        </div>

                        <hr className="border-white/10" />

                        {/* Privacy & Contact Section */}
                        <div id="privacy" className="text-center bg-zinc-900/30 border border-white/5 p-10 md:p-16 rounded-[2.5rem] space-y-6">
                            <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-xl">
                                <svg className="w-7 h-7 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Questions & Privacy Requests</h2>
                            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                                If you wish to access, correct, amend, or delete personal information, or have questions regarding these Terms (Section 22), please reach out to our support team.
                            </p>
                            <div className="pt-6">
                                <a 
                                    href="mailto:support@justtattoos.com" 
                                    className="inline-block bg-white text-black px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#FE8204] hover:text-white hover:shadow-lg hover:shadow-[#FE8204]/20 transition-all duration-300"
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