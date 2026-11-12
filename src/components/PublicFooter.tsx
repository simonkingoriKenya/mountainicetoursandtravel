import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ridgeBadge from "@/assets/mountainicemikes-logo-ridge-badge.png";
import { fieldServiceMenu, mountainMenu, safariMenu } from "@/lib/site-content";

export function PublicFooter() {
  return (
    <footer className="bg-foreground px-6 py-12 text-background md:px-14">
      <div className="mx-auto grid max-w-[1320px] gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label="MountainIceMikes Tours and Travel home"><img src={ridgeBadge} alt="MountainIceMikes Tours and Travel" width={1200} height={912} className="h-auto w-[148px] object-contain" /></Link>
          <p className="mt-3 max-w-sm text-xs leading-5 text-background/65">Kenya journeys made thoughtfully, from the mountain up.</p>
        </div>
        <div className="text-xs text-background/75">
          <p className="mb-3 uppercase text-background">Mountains & treks</p>
          {mountainMenu.map((item) => <Link key={item.slug} to="/mountains/$slug" params={{ slug: item.slug }} className="mb-2 block hover:text-accent">{item.title}</Link>)}
        </div>
        <div className="text-xs text-background/75">
          <p className="mb-3 uppercase text-background">Safaris & field services</p>
          {safariMenu.map((item) => <Link key={item.slug} to="/safaris/$slug" params={{ slug: item.slug }} className="mb-2 block hover:text-accent">{item.title}</Link>)}
          {fieldServiceMenu.map((item) => <Link key={item.slug} to="/services/$slug" params={{ slug: item.slug }} className="mb-2 block hover:text-accent">{item.title}</Link>)}
        </div>
        <div className="text-xs text-background/75">
          <p className="uppercase text-background">MountainIceMikes · Migradia Limited</p>
          <p className="mt-2 flex items-center gap-2"><MapPin size={13} className="text-accent" /> Nanyuki · Kenya</p>
          <div className="mt-4 grid gap-2">
            <Link to="/about" className="hover:text-accent">About us</Link>
            <Link to="/reviews" className="hover:text-accent">Reviews</Link>
            <Link to="/blog" className="hover:text-accent">From the field</Link>
          </div>
          <Link to="/contact" search={{ service: undefined }} className="mt-5 inline-flex items-center gap-2 text-accent">Talk with our team <ArrowUpRight size={14} /></Link>
          <p className="mt-4 text-background/55">© {new Date().getFullYear()} MountainIceMikes Tours and Travel</p>
        </div>
      </div>
    </footer>
  );
}
