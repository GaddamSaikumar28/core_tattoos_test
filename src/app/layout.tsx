import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import SplashScreen from "../components/layout/SplashScreen";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Toaster } from "sonner";
import { CartProvider } from "../context/CartContext";
import FooterWrapper from "../components/layout/FooterWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import { CartDrawer } from "../components/cart/CartDrawer";
import { AuthProvider } from "../context/AuthContext";
import Script from "next/script";
import { getGlobalSettingsData } from "@/src/lib/shopify";
import CartDrawerWrapper from "../components/cart/CartDrawerWrapper";

// --- SEO ADDITION: Import Google Analytics ---
import { GoogleAnalytics } from "@next/third-parties/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

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

// --- SEO ADDITION: metadataBase and verification added ---
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://justtattoos.com",
  ),
  title: "Just Tattoos",
  description: "Authentic tattoo lifestyle and apparel.",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION, // Fulfills Point 5
  },
  other: {
    "facebook-domain-verification": "pxy8rtt4m4qc86h0j1nmxcs4prlwbe",
  },
  icons: {
    // 1. Primary Favicon (SVG)
    icon: [
      {
        url: "/favicon.svg?v=1", // Versioning forces a cache refresh
        type: "image/svg+xml",
      },
    ],
    // 2. Shortcut icon for older browsers/bookmarks
    shortcut: ["/favicon.svg?v=1"],
    // 3. Apple Touch Icon for iPhone home screens
    apple: [
      {
        url: "/favicon.svg?v=1",
        type: "image/svg+xml",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getGlobalSettingsData();
  // Define a safe fallback just in case the API completely fails
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

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${almarena.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg?v=1" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=1" />
        <link
          rel="preconnect"
          href="https://cdn.shopify.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <SpeedInsights />
        {/* --- SEO ADDITION: Global Organization & WebSite Schema (Point 11) --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
                  name: "Just Tattoos",
                  url: process.env.NEXT_PUBLIC_SITE_URL,
                  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/icons/DesktopLogo.svg`,
                  sameAs: [
                    globalData.facebookLink,
                    globalData.instagramLink,
                    globalData.twitterLink,
                    globalData.youtubeLink,
                  ].filter(Boolean),
                },
                {
                  "@type": "WebSite",
                  "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
                  url: process.env.NEXT_PUBLIC_SITE_URL,
                  name: "Just Tattoos",
                  publisher: {
                    "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
                  },
                },
              ],
            }),
          }}
        />
        <script
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

        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '923695433974920');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=923695433974920&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

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

          <Toaster position="bottom-right" richColors />
        </CartProvider>

        <Script
          src="https://cdn.your-messaging-app.com/widget.js"
          strategy="lazyOnload"
        />

        {/* --- SEO ADDITION: GA4 Tracking (Fulfills Point 6) --- */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
