

'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
                        How we collect, use, and protect your personal information at JustTattoos.
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
                                <a href="#collection" className="hover:text-white hover:translate-x-1 transition-all duration-300">1. Info Collected</a>
                                <a href="#usage" className="hover:text-white hover:translate-x-1 transition-all duration-300">2. Use of Information</a>
                                <a href="#consent" className="hover:text-white hover:translate-x-1 transition-all duration-300">3. Consent & Choices</a>
                                <a href="#management" className="hover:text-white hover:translate-x-1 transition-all duration-300">4. Info Management</a>
                                <a href="#payments" className="hover:text-white hover:translate-x-1 transition-all duration-300">5. Payment Processing</a>
                                <a href="#third-party" className="hover:text-white hover:translate-x-1 transition-all duration-300">6. Third-Party Links</a>
                                <a href="#security" className="hover:text-white hover:translate-x-1 transition-all duration-300">7. Security</a>
                                <a href="#cookies" className="hover:text-white hover:translate-x-1 transition-all duration-300">8. Cookies</a>
                                <a href="#children" className="hover:text-white hover:translate-x-1 transition-all duration-300">9. Children's Privacy</a>
                                <a href="#rights" className="text-[#FE8204] hover:text-[#e67503] hover:translate-x-1 transition-all duration-300">10. U.S. Privacy Rights</a>
                                <a href="#changes" className="hover:text-white hover:translate-x-1 transition-all duration-300">11. Policy Changes</a>
                                <a href="#contact" className="hover:text-white hover:translate-x-1 transition-all duration-300">Contact Us</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Content */}
                    <article className="w-full lg:w-3/4 max-w-4xl space-y-16 text-lg text-zinc-400 font-medium leading-relaxed">
                        
                        {/* Overview */}
                        <div id="overview" className="space-y-6">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Overview</h2>
                            <p>
                                We respect your privacy and are committed to protecting it through our compliance with this Privacy Policy (“Policy”). This Policy describes the types of information we may collect from you or that you may provide (“Personal Information”) on the JustTattoos website (“Website” or “Service”) and any of its related products and services (collectively, “Services”), and our practices for collecting, using, maintaining, protecting, and disclosing that Personal Information.
                            </p>
                            <p>
                                This Policy is a legally binding agreement between you (“User”, “you” or “your”) and JustTattoos (“we”, “us” or “our”). By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Policy.
                            </p>
                            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl text-zinc-300 border-l-4 border-[#FE8204]">
                                <strong className="text-white">Important Note:</strong> This Policy applies only to users located in the <strong className="text-white">United States</strong> and does not apply to companies or individuals that we do not own, control, employ, or manage.
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Section 1: Collection */}
                        <div id="collection" className="space-y-8">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 1: Information Collected</h2>
                            <p>You may browse the Website without providing identifying information. Certain features, however, may require you to provide Personal Information such as your name or email address. We collect information when individuals:</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-zinc-900/50 border border-white/5 shadow-lg p-6 rounded-2xl hover:border-white/20 transition-all duration-300 group">
                                    <h4 className="text-white font-bold mb-2 text-xl group-hover:text-[#FE8204] transition-colors">1. Make a Purchase</h4>
                                    <p className="text-base text-zinc-400">We collect your name, shipping/billing address, email, phone number, and payment details.</p>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/5 shadow-lg p-6 rounded-2xl hover:border-white/20 transition-all duration-300 group">
                                    <h4 className="text-white font-bold mb-2 text-xl group-hover:text-[#FE8204] transition-colors">2. Create an Account</h4>
                                    <p className="text-base text-zinc-400">Includes first name, last name, email, optional photo, order history, rewards, and favorites.</p>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/5 shadow-lg p-6 rounded-2xl hover:border-white/20 transition-all duration-300 group">
                                    <h4 className="text-white font-bold mb-2 text-xl group-hover:text-[#FE8204] transition-colors">3. Sign Up for Alerts</h4>
                                    <p className="text-base text-zinc-400">With your consent, we collect email/phone numbers to send updates, promotions, and store communications.</p>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/5 shadow-lg p-6 rounded-2xl hover:border-white/20 transition-all duration-300 group">
                                    <h4 className="text-white font-bold mb-2 text-xl group-hover:text-[#FE8204] transition-colors">4. Contact Support</h4>
                                    <p className="text-base text-zinc-400">We collect your name, email, phone, addresses, and order number to assist you efficiently.</p>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/5 shadow-lg p-6 rounded-2xl hover:border-white/20 transition-all duration-300 group">
                                    <h4 className="text-white font-bold mb-2 text-xl group-hover:text-[#FE8204] transition-colors">5. Browse the Website</h4>
                                    <p className="text-base text-zinc-400">We automatically collect technical data (IP, browser, clicks, pages visited) using cookies and pixels.</p>
                                </div>
                                <div className="bg-zinc-900/50 border border-white/5 shadow-lg p-6 rounded-2xl hover:border-white/20 transition-all duration-300 group">
                                    <h4 className="text-white font-bold mb-2 text-xl group-hover:text-[#FE8204] transition-colors">6. Surveys & Reviews</h4>
                                    <p className="text-base text-zinc-400">We may collect name, interests, and preferences if you participate in promotions or reviews.</p>
                                </div>
                            </div>

                            <div className="pt-6 space-y-8">
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Third-Party Advertising & Tracking</h4>
                                    <p>We work with third-party service providers that use cookies and similar technologies to help deliver advertising and measure campaign performance. These providers may collect pseudonymous information related to your activity. You can learn more and opt out at: <br/>
                                    <a href="http://optout.aboutads.info/#!/" target="_blank" rel="noopener noreferrer" className="text-white font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors pb-0.5 inline-block mt-2">optout.aboutads.info</a></p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Google Analytics</h4>
                                    <p>We use Google Analytics to understand Website usage and performance. You may opt out using Google’s browser add-on: <br/>
                                    <a href="https://tools.google.com/dlpage/gaoptout/" target="_blank" rel="noopener noreferrer" className="text-white font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors pb-0.5 inline-block mt-2">tools.google.com/dlpage/gaoptout</a></p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Section 2: Use of Info */}
                        <div id="usage" className="space-y-6">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 2: Use of Information</h2>
                            <p>We use Personal Information to:</p>
                            <ul className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] space-y-4 text-zinc-300">
                                <li className="flex items-start gap-3"><span className="text-[#FE8204] font-bold">✔</span> Process orders and provide services</li>
                                <li className="flex items-start gap-3"><span className="text-[#FE8204] font-bold">✔</span> Communicate order updates</li>
                                <li className="flex items-start gap-3"><span className="text-[#FE8204] font-bold">✔</span> Improve Website functionality and user experience</li>
                                <li className="flex items-start gap-3"><span className="text-[#FE8204] font-bold">✔</span> Personalize communications and marketing</li>
                                <li className="flex items-start gap-3"><span className="text-[#FE8204] font-bold">✔</span> Prevent fraud and abuse</li>
                                <li className="flex items-start gap-3"><span className="text-[#FE8204] font-bold">✔</span> Deliver advertising and promotions</li>
                                <li className="flex items-start gap-3"><span className="text-[#FE8204] font-bold">✔</span> Comply with legal obligations</li>
                            </ul>
                            <p>Information is retained only as long as reasonably necessary or required by law.</p>
                        </div>

                        {/* Section 3: Consent & Choices */}
                        <div id="consent" className="space-y-6">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 3: Consent & Choices</h2>
                            <div className="space-y-4">
                                <p><strong className="text-white">Cookies:</strong> You may manage cookie preferences using browser settings or the Website’s cookie preference tools (if available).</p>
                                <p><strong className="text-white">Email:</strong> You may unsubscribe from marketing emails at any time using the link provided in the emails.</p>
                                <div className="pt-2">
                                    <p className="bg-zinc-900 border border-white/10 text-zinc-300 p-5 rounded-2xl inline-block shadow-lg">
                                        <strong className="text-white">Text Messages:</strong> Reply <strong className="text-[#FE8204]">STOP</strong> to opt out of SMS communications. Text messaging consent data is never shared with third parties.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Management */}
                        <div id="management" className="space-y-6">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 4: Information Management</h2>
                            <h4 className="text-xl font-bold text-white mb-2">Disclosure</h4>
                            <p>We may disclose Personal Information to service providers assisting us in operations, to protect rights/safety, to comply with legal obligations, or in connection with business transactions (mergers/acquisitions). Service providers may only use Personal Information to perform services on our behalf.</p>
                            
                            <h4 className="text-xl font-bold text-white mb-2 mt-8">Managing Your Information</h4>
                            <p>You may request access, correction, or deletion of Personal Information by contacting <a href="mailto:support@justtattoos.com" className="text-white font-bold border-b-2 border-[#FE8204] hover:text-[#FE8204] transition-colors pb-0.5">support@justtattoos.com</a>. We may retain certain information as required by law.</p>
                        </div>

                        {/* Section 5 & 6 */}
                        <div id="payments" className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 5: Payment Processing</h2>
                                <p>Payments are processed by third-party payment processors that comply with PCI-DSS security standards. We only share payment data as necessary to process transactions and refunds. Common processors include:</p>
                                <ul className="list-disc pl-5 space-y-2 mt-4 text-base text-zinc-300">
                                    <li><strong className="text-white">Shopify:</strong> <a href="https://www.shopify.com/legal/privacy/customers" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE8204] transition-colors underline underline-offset-4 decoration-white/20">shopify.com/legal/privacy/customers</a></li>
                                    <li><strong className="text-white">PayPal:</strong> <a href="https://www.paypal.com/us/legalhub/home" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE8204] transition-colors underline underline-offset-4 decoration-white/20">paypal.com/us/legalhub/home</a></li>
                                </ul>
                            </div>

                            <div id="third-party" className="space-y-4">
                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 6: Third-Party Services</h2>
                                <p>Third-party services may have their own privacy policies. Once you leave our Website or interact with third-party services, this Policy no longer applies.</p>
                            </div>
                        </div>

                        {/* Section 7, 8, 9 */}
                        <div id="security" className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 7: Security</h2>
                                <p>We use reasonable administrative, technical, and physical safeguards to protect Personal Information. However, no system is completely secure. In the event of a data breach, we will notify affected users as required by law.</p>
                            </div>

                            <div id="cookies" className="space-y-4">
                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 8: Cookies (Summary)</h2>
                                <p>We use cookies for Website functionality, analytics, performance, personalization, and advertising. Social media cookies may track activity across websites. You may disable cookies through browser settings, though some features may not function properly.</p>
                            </div>

                            <div id="children" className="space-y-4">
                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 9: Children's Privacy</h2>
                                <p>Our Website is intended for adults. We do not knowingly collect Personal Information from children under 13. If such data is discovered, it will be deleted promptly in compliance with COPPA.</p>
                            </div>
                        </div>

                        {/* Section 10: U.S. Privacy Rights */}
                        <div id="rights" className="bg-zinc-900 border border-[#FE8204]/20 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-[#FE8204]/5 space-y-4 relative overflow-hidden">
                            {/* Subtle background flare */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE8204]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <h2 className="text-3xl font-black tracking-tight text-white uppercase relative z-10">Section 10: U.S. Privacy Rights</h2>
                            <h4 className="text-xl font-bold text-white mb-2 relative z-10">California Privacy Rights (CCPA / CPRA)</h4>
                            <p className="text-zinc-300 relative z-10">California residents may have rights to access, correct, delete, and limit the use of their Personal Information. <strong className="text-[#FE8204]">We do not sell Personal Information.</strong> Requests may be submitted to our support team.</p>
                        </div>

                        {/* Section 11 & Acceptance */}
                        <div id="changes" className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">Section 11: Changes to this Policy</h2>
                                <p>We may update this Privacy Policy from time to time. Updates take effect upon posting on the Website.</p>
                            </div>
                            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl text-zinc-300 border-l-4 border-white/40">
                                <strong className="text-white">Acceptance of this Policy:</strong> By using the Website and Services, you acknowledge that you have read and agree to this Privacy Policy.
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Privacy & Contact Section */}
                        <div id="contact" className="text-center bg-zinc-900/30 border border-white/5 p-10 md:p-16 rounded-[2.5rem] space-y-6">
                            <div className="mx-auto w-16 h-16 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-xl">
                                <svg className="w-7 h-7 text-[#FE8204]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Questions & Contact</h2>
                            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                                If you wish to access, correct, amend, or delete personal information, or have any questions regarding this Privacy Policy, please reach out to us.
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