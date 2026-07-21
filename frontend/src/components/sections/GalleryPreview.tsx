import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

const seam = { backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,.12) 0 1.5px, transparent 1.5px 22px)' };

// Six placeholder before/after tiles. Real projects come from Sanity in a later plan.
export function GalleryPreview() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Our work"
          title="Before & after"
          sub="Real roofs across Alberta. The client keeps this gallery updated themselves."
          center
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 w-1/2" style={{ background: 'linear-gradient(160deg,#8a97a5,#5f6c7b)' }} />
              <div className="absolute inset-y-0 right-0 w-1/2" style={{ background: 'linear-gradient(160deg,#3a4a5c,#243040)' }}>
                <div className="absolute inset-0" style={seam} />
              </div>
              <span className="absolute bottom-2 left-2 rounded bg-ink/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Before</span>
              <span className="absolute bottom-2 right-2 rounded bg-ink/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">After</span>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/gallery" variant="ghost">See all projects</Button>
        </div>
      </Container>
    </section>
  );
}
