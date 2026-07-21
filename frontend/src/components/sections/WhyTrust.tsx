import { site } from '../../content/site';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

// One icon per trust card, matched by index. Icons are presentational, so they
// live here in the component, not in the content file.
const iconClass = 'h-6 w-6 stroke-steel';
const icons = [
  <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M21 21v-2a4 4 0 00-3-3.9" /></svg>,
  <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></svg>,
  <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" /><path d="M9 21h6" /><path d="M10 17v4" /><path d="M14 17v4" /></svg>,
  <svg viewBox="0 0 24 24" className={iconClass} fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 17l-5.5 2.5 1-6.3L3 8.9 9 8z" /></svg>,
];

export function WhyTrust() {
  return (
    <section className="bg-mist py-20">
      <Container>
        <SectionHeading eyebrow="Why homeowners choose us" title="Why trust True Alberta Roofing" center />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.trust.map((item, i) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white p-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mist">
                {icons[i % icons.length]}
              </div>
              <h3 className="text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-body">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-11 text-center">
          <Button href="/contact">Get My Free Estimate</Button>
        </div>
      </Container>
    </section>
  );
}
