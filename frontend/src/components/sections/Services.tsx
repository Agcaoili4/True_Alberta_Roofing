import { Link } from 'react-router-dom';
import { site } from '../../content/site';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function Services() {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          eyebrow={site.valueProp.eyebrow}
          title={site.valueProp.heading}
          sub={site.valueProp.sub}
          center
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {site.services.map((s) => (
            <div key={s.key} className="rounded-2xl border border-line bg-page p-8 transition-shadow hover:shadow-xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-mist">
                {s.key === 'asphalt' ? (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-steel" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10l9-6 9 6" /><path d="M5 9v10h14V9" /><path d="M8 19v-5h8v5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-steel" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20l4-16" /><path d="M10 20l4-16" /><path d="M16 20l4-16" /><path d="M3 20h18" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-ink">{s.name}</h3>
              <p className="mt-2 text-body">{s.blurb}</p>
              <Link to="/services" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-steel hover:text-steel-dark">
                Learn more
                <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
