import { Link } from 'react-router-dom';
import { site } from '../../content/site';
import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="bg-ink pb-8 pt-16 text-slate-400">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-3 font-head text-xl font-extrabold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-steel">
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-white" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l9-7 9 7" />
                  <path d="M5 10v9h14v-9" />
                </svg>
              </span>
              <span>True<span className="text-steel-light">Alberta</span>Roofing</span>
            </Link>
            <p className="max-w-xs text-sm">{site.footerNote}</p>
          </div>

          <div>
            <h4 className="mb-4 font-head font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}><Link to={item.href} className="hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-head font-semibold text-white">Services</h4>
            <ul className="space-y-2 text-sm">
              {site.services.map((s) => (
                <li key={s.key}><Link to="/services" className="hover:text-white">{s.name}</Link></li>
              ))}
              <li><Link to="/contact" className="hover:text-white">Free estimates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-head font-semibold text-white">Get in touch</h4>
            <ul className="space-y-2 text-sm">
              <li><a href={`tel:${site.business.phone}`} className="hover:text-white">{site.business.phone}</a></li>
              <li><a href={`mailto:${site.business.email}`} className="hover:text-white">{site.business.email}</a></li>
              <li>{site.business.cities.join(' · ')}</li>
              <li className="font-medium text-slate-300">Hours: {site.business.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-11 flex flex-col justify-between gap-2 border-t border-slate-800 pt-6 text-xs sm:flex-row">
          <span>© {new Date().getFullYear()} {site.business.name}. All rights reserved.</span>
          <span>Licensed &amp; insured · WCB covered</span>
        </div>
      </Container>
    </footer>
  );
}
