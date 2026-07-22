// Interface for the site content structure
// Mainly the shape of the data that will be used to populate
export interface SiteContent{
    business: {
        name: string;
        phone: string;
        email: string;
        cities: string[];
        hours: string;
    };
    promo: {
        enabled: boolean;
        text: string;
    };
    nav: { label: string; href: string }[];
    hero: {
        eyebrow: string;
        headline: string;
        sub: string;
        ctaLabel: string;
    };
    valueProp:{
        eyebrow: string;
        heading: string;
        sub: string;
    }
    services: { key: 'asphalt' | 'standing-seam-metal'; name: string; blurb: string }[];
    trust: { title: string; body: string }[];
    footerNote: string;
}

// The actual site content dat
export const site: SiteContent = {
    business: {
        name : 'True Alberta Roofing',
        phone: '(403) 630-4558',
        email: 'hello@truealbertaroofing.ca', // TODO: real value
        // implemented array of addresses
        cities: ['Calgary', 'Airdrie', 'Okotoks', 'Cochrane'], // TODO: real value
        hours: 'Mon–Sat, 8am–6pm', // TODO: real
},
  promo: { enabled: true, text: 'Ask about our current new-roof offer when you book your free estimate' }, // TODO: real offer or disable
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  hero: {
    eyebrow: 'Family owned · Serving Calgary',
    headline: 'Built by Trust, Backed with Quality and Experience',
    sub: 'Asphalt shingles and custom standing seam metal, installed right the first time - by the same local crew for two decades.',
    ctaLabel: 'Get My Free Estimate',
  },
  valueProp: {
    eyebrow: 'Your roofing partner across Alberta',
    heading: 'Two services, done to a standard we put our family name on',
    sub: "We keep the focus narrow so the quality stays high — shingles and custom metal, nothing we can't stand behind.",
  },

  services: [
    { key: 'asphalt', name: 'Asphalt Shingles', blurb: 'Durable, cost-effective shingle roofs installed to last through Alberta hail, wind, and snow. Wide range of colors and profiles.' },
    { key: 'standing-seam-metal', name: 'Custom Standing Seam Metal', blurb: 'Premium standing seam metal roofing, fabricated and fitted to your home. Clean lines, decades of life, and serious curb appeal.' },
  ],
  trust: [
    { title: 'Family owned & operated', body: 'You deal with the owners, start to finish — not a call center.' },
    { title: '20+ years experience', body: 'Two decades on Alberta roofs, now under our own name.' },
    { title: 'Licensed, insured & WCB', body: 'Fully covered on every job — no risk to you.' },
    { title: 'Honest, upfront pricing', body: 'Clear written quotes — no surprise line items later.' },
    { title: 'Built for Alberta weather', body: 'Hail, wind, and deep-freeze ready, every install.' },
    { title: 'Workmanship warranty', body: 'We stand behind every roof we put on.' },
  ],
  footerNote: 'Family-owned roofing serving Calgary and surrounding Alberta communities. Asphalt shingles and custom standing seam metal, done right.',

};