import type { ReactNode } from 'react';
import { PromoBar } from './PromoBar';
import { Nav } from './Nav';
import { Footer } from './Footer';

// Wraps every page: promo bar, sticky nav, the routed page content, footer.
// The skip link lets keyboard users jump past the nav straight to <main>.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-ink focus:shadow"
      >
        Skip to content
      </a>
      <PromoBar />
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
