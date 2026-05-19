import { getHowItWorksData } from "@/src/lib/shopify";
import HowItWorksClient from './HowItWorksClient';

export default async function HowItWorksSection() {
  const data = await getHowItWorksData('how_it_works_section');

  if (!data) {
    return (
      <div className="w-full bg-neutral-900 text-white p-10 text-center text-sm">
        How It Works data missing. Check handle: how_it_works_section
      </div>
    );
  }

  return <HowItWorksClient data={data} />;
}