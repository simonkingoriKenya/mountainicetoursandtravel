import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ridgeBadge from "@/assets/mountainicemikes-logo-ridge-badge.png";

export function PublicFooter() {
  return (
    <footer className="bg-foreground px-6 py-12 text-background md:px-14">
      <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[1.2fr_1fr_1fr] md:items-end">
        <div>
          <Link to="/" aria-label="MountainIceMikes Tours and Travel home"><img src={ridgeBadge} alt="MountainIceMikes Tours and Travel" width={1200} height={912} className="h-auto w-[148px] object-contain" /></Link>
          <p className="mt-3 max-w-sm text-xs leading-5 text-background/65">Kenya journeys made thoughtfully, from the mountain up.</p>
        </div>
        <div className="text-xs text-background/75">
          <p className="uppercase text-background">Migradia Limited</p>
          <p className="mt-2 flex items-center gap-2"><MapPin size={13} className="text-accent" /> Nanyuki · Kenya</p>
          <Link to="/about" className="mt-3 inline-block underline decoration-accent underline-offset-4 hover:text-accent">Our approach & crew welfare</Link>
        </div>
        <div className="text-xs md:text-right">
          <Link to="/contact" className="inline-flex items-center gap-2 text-accent">Talk with our team <ArrowUpRight size={14} /></Link>
          <p className="mt-2 text-background/55">A direct WhatsApp number is awaiting business configuration.</p>
          <p className="mt-4 text-background/55">© {new Date().getFullYear()} MountainIceMikes Tours and Travel</p>
        </div>
      </div>
    </footer>
  );
}
