import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import trekLogo from "@/assets/mountainicemikes-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { fieldServiceMenu, mountainMenu, safariMenu } from "@/lib/site-content";

const menus = [
  { title: "Mountains", path: "/mountains", items: mountainMenu },
  { title: "Safaris", path: "/safaris", items: safariMenu },
  { title: "Field services", path: "/services", items: fieldServiceMenu },
] as const;

const aboutItems = [
  { title: "About MountainIceMikes", hash: "" },
  { title: "Our approach & crew welfare", hash: "our-approach" },
  { title: "Founder & lead guide", hash: "founder" },
] as const;

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

        <nav aria-label="Main navigation" className="hidden items-center gap-1 text-[11px] uppercase md:flex">
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
                    <Link key={item.slug} to={`${menu.path}/${item.slug}`} role="menuitem" className="block px-3 py-2.5 text-xs normal-case transition hover:bg-secondary hover:text-primary" onClick={() => setOpenMenu(null)}>
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="relative" onMouseEnter={() => setOpenMenu("about")} onMouseLeave={() => setOpenMenu(null)}>
            <Button type="button" variant="ghost" aria-haspopup="true" aria-expanded={openMenu === "about"} onClick={() => setOpenMenu(openMenu === "about" ? null : "about")} onFocus={() => setOpenMenu("about")} className={`h-11 gap-1 rounded-none px-3 ${foreground} hover:text-accent ${isActive("/about") ? "text-accent" : ""}`}>
              About <ChevronDown size={13} aria-hidden="true" />
            </Button>
            {openMenu === "about" && <div className="absolute left-0 top-full z-50 min-w-64 border border-border bg-background p-2 text-foreground shadow-xl" role="menu">
              {aboutItems.map((item) => <Link key={item.title} to="/about" hash={item.hash || undefined} role="menuitem" className="block px-3 py-2.5 text-xs normal-case transition hover:bg-secondary hover:text-primary" onClick={() => setOpenMenu(null)}>{item.title}</Link>)}
            </div>}
          </div>
          <Link to="/contact" className={`px-3 py-3 transition hover:text-accent ${location.pathname === "/contact" ? "text-accent" : ""}`}>Contact</Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild className="rounded-none bg-accent text-foreground hover:bg-accent/90"><Link to="/contact">Plan a trip <ArrowRight size={15} /></Link></Button>
        </div>
        <Button variant="ghost" className={`size-11 p-0 ${foreground} md:hidden`} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background p-5 text-foreground md:hidden">
        <div className="grid gap-1">
          {menus.map((menu) => <div key={menu.path} className="border-b border-border">
            <div className="flex items-center justify-between">
              <Link to={menu.path} className={`py-3 text-sm uppercase ${isActive(menu.path) ? "text-primary" : ""}`}>{menu.title}</Link>
              <Button type="button" variant="ghost" aria-label={`Show ${menu.title} pages`} aria-expanded={mobileCategory === menu.path} onClick={() => setMobileCategory(mobileCategory === menu.path ? null : menu.path)} className="size-11 p-0">
                <ChevronDown size={16} className={mobileCategory === menu.path ? "rotate-180" : ""} />
              </Button>
            </div>
            {mobileCategory === menu.path && <div className="grid gap-1 pb-3 pl-3">
              <Link to={menu.path} className="py-2 text-sm font-semibold text-primary">Explore all {menu.title.toLowerCase()}</Link>
              {menu.items.map((item) => <Link key={item.slug} to={`${menu.path}/${item.slug}`} className="py-2 text-sm text-muted-foreground">{item.title}</Link>)}
            </div>}
          </div>)}
          <div className="border-b border-border">
            <div className="flex items-center justify-between"><Link to="/about" className="py-3 text-sm uppercase">About</Link>
              <Button type="button" variant="ghost" aria-label="Show About pages" aria-expanded={mobileCategory === "about"} onClick={() => setMobileCategory(mobileCategory === "about" ? null : "about")} className="size-11 p-0"><ChevronDown size={16} className={mobileCategory === "about" ? "rotate-180" : ""} /></Button>
            </div>
            {mobileCategory === "about" && <div className="grid gap-1 pb-3 pl-3">{aboutItems.map((item) => <Link key={item.title} to="/about" hash={item.hash || undefined} className="py-2 text-sm text-muted-foreground">{item.title}</Link>)}</div>}
          </div>
          <Link to="/contact" className="py-3 text-sm uppercase">Contact</Link>
          <Button asChild className="mt-2 rounded-none bg-accent text-foreground hover:bg-accent/90"><Link to="/contact">Plan a trip <ArrowRight size={15} /></Link></Button>
        </div>
      </nav>}
    </header>
  );
}