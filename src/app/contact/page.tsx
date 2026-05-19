
import React from "react";
import { getHelpCenterPageData } from "@/src/lib/shopify"; // Update path if needed
import FaqSection from "@/src/components/home/FaqSection";
import HelpCenterClient from "./HelpCenterClient";

export default async function HelpCenterPage() {
  // Be sure to match your exact Shopify handle
  const data = await getHelpCenterPageData("help-center-page");

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-20 font-bold">
        Loading Help Center...
      </div>
    );
  }

  return (
    // Removed mt-20 to allow the hero section to flow behind the transparent header.
    // Applied global dark theme background and selection colors.
    <div className="min-h-screen bg-black text-white selection:bg-[#FE8204] selection:text-white">
      {/* The interactive form and top content */}
      <HelpCenterClient data={data} />
      
      {/* The Server-side FAQ section safely rendered at the bottom */}
      <FaqSection />
    </div>
  );
}