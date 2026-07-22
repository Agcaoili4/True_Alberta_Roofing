import { Link } from 'react-router-dom';
import { site } from '../../content/site';
import { Container } from '../ui/Container';

export function CtaBand() {
  return (
    <section className="bg-steel text-white">
      <Container className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-4xl">Free estimates — no pressure, no obligation</h2>
        <p className="mt-3 text-lg text-white/90">Book a visit and ask about our current new-roof offer.</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-head font-bold text-steel-dark transition-colors hover:bg-white/90"
          >
            Get My Free Estimate
          </Link>
          <a href={`tel:${site.business.phone}`} className="font-head font-bold text-white">
            or call {site.business.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
