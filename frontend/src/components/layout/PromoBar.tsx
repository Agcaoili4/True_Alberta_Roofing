import { site } from '../../content/site';
import { Container } from '../ui/Container';

// The steel offer strip at the very top. Renders nothing when the client
// switches the promo off (site.promo.enabled === false).
export function PromoBar() {
  if (!site.promo.enabled) return null;

  return (
    <div className="bg-steel text-white text-sm">
      <Container className="flex h-11 items-center justify-center gap-3 text-center">
        <span className="hidden sm:inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
          Limited time
        </span>
        <span>{site.promo.text}</span>
      </Container>
    </div>
  );
}
