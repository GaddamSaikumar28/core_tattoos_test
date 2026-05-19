import { getSafeForSkinData } from "@/src/lib/shopify";
import SafeForSkinClient from "./SafeForSkinClient";

export default async function SafeForSkinSection() {
  const data = await getSafeForSkinData('safe_for_skin_section');

  if (!data) {
    return (
      <div className="w-full bg-neutral-900 text-white p-10 text-center text-sm">
        Safe For Skin data missing. Check handle: safe_for_skin_section
      </div>
    );
  }

  return <SafeForSkinClient data={data} />;
}