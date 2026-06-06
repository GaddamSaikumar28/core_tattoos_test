import type { Metadata } from "next";
import localFont from "next/font/local";
import { unstable_cache } from "next/cache";
import "./globals.css";

import SplashScreen from "../components/layout/SplashScreen";
import Footer from "../components/layout/Footer";
import { Toaster } from "sonner";
import { CartProvider } from "../context/CartContext";
import FooterWrapper from "../components/layout/FooterWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "../context/AuthContext";
import Script from "next/script"; 
import { getGlobalSettingsData } from "@/src/lib/shopify";
import CartDrawerWrapper from "../components/cart/CartDrawerWrapper";
import MetaPixel from "../components/shared/MetaPixel";
import Header from "../components/Header";

const almarena = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Almarena-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Almarena-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-almarena",
  display: "swap",
});

// Cache global settings to prevent Shopify API calls on every layout render
const getCachedGlobalSettings = unstable_cache(
  async () => {
    const settings = await getGlobalSettingsData();
    return settings;
  },
  ["global-settings-data"],
  { revalidate: 3600 } // Cache for 1 hour
);

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.justtattoos.com"),
  title: "Just Tattoos",
  description: "Authentic tattoo lifestyle and apparel.",
  verification: {
    google: "d01qN_aI17S2zOhlv4J36BQcOWOYndmIqB1twf3xkgM",
  },
  other: {
    "facebook-domain-verification": "pxy8rtt4m4qc86h0j1nmxcs4prlwbe",
  },
  icons: {
    icon: [{ url: "/favicon.svg?v=1", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg?v=1"],
    apple: [{ url: "/favicon.svg?v=1", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCachedGlobalSettings();
  
  const globalData = settings || {
    headerLogo: "/assets/icons/DesktopLogo.svg",
    footerLogo: "/assets/icons/DesktopLogo.svg",
    splashLogo: "/assets/icons/DesktopLogo.svg",
    splashLeftImage: "/assets/icons/butterflys.svg",
    splashRightImage: "/assets/icons/butterfly2s2.svg",
    instagramLink: "#",
    facebookLink: "#",
    twitterLink: "#",
    youtubeLink: "#",
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.justtattoos.com";

  return (
    <html
      lang="en"
      className={almarena.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg?v=1" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=1" />
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      </head>
      
      <body className="antialiased flex flex-col min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)] selection:bg-[var(--color-brand-orange)] selection:text-white">
        
        {/* OPTIMIZATION 1: Non-blocking GTM Scripts */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-98T2GW3HED" 
          strategy="afterInteractive" 
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-98T2GW3HED');
            `,
          }}
        />

        {/* OPTIMIZATION 2: Next.js Script for inline logic to prevent hydration mismatch */}
        <Script
          id="splash-screen-logic"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                (function() {
                  if (sessionStorage.getItem('hasSeenSplash') === 'true') {
                    document.documentElement.classList.add('splash-completed');
                  }
                })();
              `,
          }}
        />

        <SpeedInsights />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "Just Tattoos",
                  url: siteUrl,
                  logo: `${siteUrl}/assets/icons/DesktopLogo.svg`,
                  sameAs: [
                    globalData.facebookLink,
                    globalData.instagramLink,
                    globalData.twitterLink,
                    globalData.youtubeLink,
                  ].filter(Boolean),
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "Just Tattoos",
                  publisher: {
                    "@id": `${siteUrl}/#organization`,
                  },
                },
              ],
            }),
          }}
        />

        <MetaPixel />
        
        <CartProvider>
          <AuthProvider>
            <SplashScreen
              logoUrl={globalData.splashLogo}
              leftImageUrl={globalData.splashLeftImage}
              rightImageUrl={globalData.splashRightImage}
            />

            <Header logoUrl={globalData.headerLogo} />

            <main className="flex-grow relative z-0">{children}</main>

            <FooterWrapper
              logoUrl={globalData.footerLogo}
              socialLinks={{
                instagram: globalData.instagramLink,
                facebook: globalData.facebookLink,
                twitter: globalData.twitterLink,
                youtube: globalData.youtubeLink,
              }}
            />

            <CartDrawerWrapper />
          </AuthProvider>

          <Toaster position="bottom-right" richColors theme="dark" />
        </CartProvider>
      </body>
    </html>
  );
}