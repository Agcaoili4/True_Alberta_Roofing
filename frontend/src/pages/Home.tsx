import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { WhyTrust } from '../components/sections/WhyTrust';
import { GalleryPreview } from '../components/sections/GalleryPreview';
import { CtaBand } from '../components/sections/CtaBand';

// Version B home flow (ADR-0005): hero -> value prop + services ->
// why-trust grid -> before/after gallery -> repeated CTA.
export function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyTrust />
      <GalleryPreview />
      <CtaBand />
    </>
  );
}
