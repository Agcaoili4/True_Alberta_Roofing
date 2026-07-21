import { site } from '../../content/site';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';

// Diagonal "standing seam" texture for the placeholder roof.
const seam = { backgroundImage: 'repeating-linear-gradient(118deg, rgba(255,255,255,.12) 0 1.5px, transparent 1.5px 30px)' };

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-page">
      <Container className="grid items-center gap-14 py-16 md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-steel">{site.hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">{site.hero.headline}</h1>
          <p className="mt-5 max-w-[42ch] text-lg text-body">{site.hero.sub}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">
              {site.hero.ctaLabel}
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
              </svg>
            </Button>
            <Button href={`tel:${site.business.phone}`} variant="ghost">
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-steel" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.5-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" />
              </svg>
              Call {site.business.phone}
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Chip>Licensed &amp; insured</Chip>
            <Chip>Workmanship warranty</Chip>
            <Chip>Free estimates</Chip>
          </div>
        </div>

        {/* Placeholder photo — swapped for a real hero image via Sanity later */}
        <div className="relative h-[360px] overflow-hidden rounded-2xl border border-white/60 shadow-2xl md:h-[440px]" aria-hidden="true">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(165deg,#d6e8f6 0%,#a9cdea 42%,#7fb0d8 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-[60%]" style={{ background: 'linear-gradient(120deg,#263341,#3c4a5a)', clipPath: 'polygon(0 42%,100% 0,100% 100%,0 100%)' }}>
            <div className="absolute inset-0" style={seam} />
          </div>
          <div className="absolute right-4 top-4 rounded-xl bg-white px-4 py-3 text-center shadow-lg">
            <b className="block font-head text-2xl font-extrabold leading-none text-steel">20+</b>
            <span className="text-[11px] uppercase tracking-wide text-muted">Years</span>
          </div>
          <div className="absolute bottom-4 left-4 rounded-lg bg-ink/60 px-3 py-1.5 text-xs text-white backdrop-blur">
            Your project photo goes here
          </div>
        </div>
      </Container>
    </section>
  );
}
