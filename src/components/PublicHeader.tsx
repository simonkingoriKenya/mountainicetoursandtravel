import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import trekLogo from "@/assets/mountainicemikes-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { mountainMenu, safariMenu } from "@/lib/site-content";

const menus = [
  { title: "Mountains", path: "/mountains", items: mountainMenu },
  { title: "Safaris", path: "/safaris", items: safariMenu },
] as const;

function DestinationMenuLink({ category, slug, children, className, role, onClick }: {
  category: "mountains" | "safaris" | "services";
  slug: string;
  children: React.ReactNode;
  className?: string;
  role?: "menuitem";
  onClick?: () => void;
}) {
  const props = { children, className, role, onClick };
  if (category === "mountains") return <Link to="/mountains/$slug" params={{ slug }} {...props} />;
  if (category === "safaris") return <Link to="/safaris/$slug" params={{ slug }} {...props} />;
  return <Link to="/services/$slug" params={{ slug }} {...props} />;
}

export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const foreground = overlay ? "text-primary-foreground" : "text-foreground";
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setMobileCategory(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileCategory(null);
  }, [location.pathname]);

  return (
    <header className={`${overlay ? "absolute inset-x-0 top-0 z-40 border-b border-primary-foreground/20" : "relative z-40 border-b border-border bg-background"} ${foreground}`}>
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:h-24 md:px-10">
        <Link to="/" className="flex shrink-0 items-center" aria-label="MountainIceMikes Tours and Travel home">
          <img src={trekLogo.url} alt="MountainIceMikes Tours and Travel" width={1200} height={912} className="h-[68px] w-[90px] object-contain md:h-[84px] md:w-[110px]" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-0 text-[10px] uppercase xl:flex">
          <Link to="/" className={`px-3 py-3 transition hover:text-accent ${location.pathname === "/" ? "text-accent" : ""}`}>Home</Link>
          <Link to="/about" className={`px-3 py-3 transition hover:text-accent ${isActive("/about") ? "text-accent" : ""}`}>About Us</Link>
          {menus.map((menu) => (
            <div key={menu.path} className="relative" onMouseEnter={() => setOpenMenu(menu.path)} onMouseLeave={() => setOpenMenu(null)}>
              <Button
                type="button"
                variant="ghost"
                aria-haspopup="true"
                aria-expanded={openMenu === menu.path}
                onClick={() => setOpenMenu(openMenu === menu.path ? null : menu.path)}
                onFocus={() => setOpenMenu(menu.path)}
                className={`h-11 gap-1 rounded-none px-3 ${foreground} hover:text-accent ${isActive(menu.path) ? "text-accent" : ""}`}
              >
                {menu.title}<ChevronDown size={13} aria-hidden="true" />
              </Button>
              {openMenu === menu.path && (
                <div className="absolute left-0 top-full z-50 max-h-[75vh] min-w-64 overflow-y-auto border border-border bg-background p-2 text-foreground shadow-xl" role="menu">
                  <Link to={menu.path} role="menuitem" className="block border-b border-border px-3 py-3 font-semibold text-primary hover:text-accent" onClick={() => setOpenMenu(null)}>
                    Explore all {menu.title.toLowerCase()} <span aria-hidden="true">→</span>
                  </Link>
                  {menu.items.map((item) => (
                    <DestinationMenuLink key={item.slug} category={menu.path.slice(1) as "mountains" | "safaris" | "services"} slug={item.slug} role="menuitem" className="block px-3 py-2.5 text-xs normal-case transition hover:bg-secondary hover:text-primary" onClick={() => setOpenMenu(null)}>
                      {item.title}
                    </DestinationMenuLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/reviews" className={`px-3 py-3 transition hover:text-accent ${isActive("/reviews") ? "text-accent" : ""}`}>Reviews</Link>
          <Link to="/blog" className={`px-3 py-3 transition hover:text-accent ${isActive("/blog") ? "text-accent" : ""}`}>Blog</Link>
          <Link to="/contact" search={{ service: undefined }} className={`px-3 py-3 transition hover:text-accent ${location.pathname === "/contact" ? "text-accent" : ""}`}>Contact</Link>
        </nav>

        <div className="hidden xl:block">
          <Button asChild className="rounded-none bg-accent text-foreground hover:bg-accent/90"><Link to="/contact" search={{ service: undefined }}>Plan a trip <ArrowRight size={15} /></Link></Button>
        </div>
        <Button variant="ghost" className={`size-11 p-0 ${foreground} xl:hidden`} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background p-5 text-foreground xl:hidden">
        <div className="grid gap-1">
          <Link to="/" className="border-b border-border py-3 text-sm uppercase">Home</Link>
          <Link to="/about" className="border-b border-border py-3 text-sm uppercase">About Us</Link>
          {menus.map((menu) => <div key={menu.path} className="border-b border-border">
            <div className="flex items-center justify-between">
              <Link to={menu.path} className={`py-3 text-sm uppercase ${isActive(menu.path) ? "text-primary" : ""}`}>{menu.title}</Link>
              <Button type="button" variant="ghost" aria-label={`Show ${menu.title} pages`} aria-expanded={mobileCategory === menu.path} onClick={() => setMobileCategory(mobileCategory === menu.path ? null : menu.path)} className="size-11 p-0">
                <ChevronDown size={16} className={mobileCategory === menu.path ? "rotate-180" : ""} />
              </Button>
            </div>
            {mobileCategory === menu.path && <div className="grid gap-1 pb-3 pl-3">
              <Link to={menu.path} className="py-2 text-sm font-semibold text-primary">Explore all {menu.title.toLowerCase()}</Link>
              {menu.items.map((item) => <DestinationMenuLink key={item.slug} category={menu.path.slice(1) as "mountains" | "safaris" | "services"} slug={item.slug} className="py-2 text-sm text-muted-foreground">{item.title}</DestinationMenuLink>)}
            </div>}
          </div>)}
          <Link to="/reviews" className="border-b border-border py-3 text-sm uppercase">Reviews</Link>
          <Link to="/blog" className="border-b border-border py-3 text-sm uppercase">Blog</Link>
          <Link to="/contact" search={{ service: undefined }} className="py-3 text-sm uppercase">Contact</Link>
          <Button asChild className="mt-2 rounded-none bg-accent text-foreground hover:bg-accent/90"><Link to="/contact" search={{ service: undefined }}>Plan a trip <ArrowRight size={15} /></Link></Button>
        </div>
      </nav>}
    </header>
  );
}