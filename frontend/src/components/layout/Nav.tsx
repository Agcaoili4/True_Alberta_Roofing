import { useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../content/site';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

// The little roof mark used in the brand lockup.
function BrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-steel">
      <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-white" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v9h14v-9" />
      </svg>
    </span>
  );
}

export function Nav() {
  // Does the mobile menu show? This is the piece of state the hamburger flips.
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-[74px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-head text-xl font-extrabold text-ink">
          <BrandMark />
          <span>True<span className="text-steel">Alberta</span>Roofing</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <Link key={item.href} to={item.href} className="font-medium text-slate-700 transition-colors hover:text-steel">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop phone + CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <a href={`tel:${site.business.phone}`} className="font-head font-bold text-ink">
            {site.business.phone}
          </a>
          <Button href="/contact">Free Estimate</Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-ink" fill="none" strokeWidth={2} strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </Container>

      {/* Mobile menu panel — only in the tree when open */}
      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="py-2 font-medium text-slate-700"
              >
                {item.label}
              </Link>
            ))}
            <a href={`tel:${site.business.phone}`} className="py-2 font-head font-bold text-ink">
              {site.business.phone}
            </a>
            <Button href="/contact" className="mt-2 justify-center">Free Estimate</Button>
          </Container>
        </div>
      )}
    </header>
  );
}
