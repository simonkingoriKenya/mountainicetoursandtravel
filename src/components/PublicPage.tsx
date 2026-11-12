import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";

export function PublicPage({ children }: { children: ReactNode }) {
  return <div className="min-h-[100dvh] bg-background text-foreground"><a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:p-3" href="#main-content">Skip to content</a><PublicHeader /><main id="main-content">{children}</main><PublicFooter /></div>;
}

type PublicBasePath = "/" | "/mountains" | "/safaris" | "/services" | "/blog" | "/reviews";

export function PageIntro({ eyebrow, title, summary, backTo = "/", backLabel = "Home" }: { eyebrow: string; title: string; summary: string; backTo?: PublicBasePath; backLabel?: string }) {
  return <section className="bg-primary px-6 pb-14 pt-12 text-primary-foreground md:px-14 md:pb-20 md:pt-16">
    <div className="mx-auto max-w-[1200px]">
      <nav aria-label="Breadcrumb" className="mb-8 text-[10px] uppercase tracking-[0.12em] text-primary-foreground/70"><Link to="/" className="hover:text-accent">Home</Link><span className="px-2">/</span><Link to={backTo} className="hover:text-accent">{backLabel}</Link><span className="px-2">/</span><span aria-current="page" className="text-primary-foreground">{title}</span></nav>
      <p className="text-[11px] uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
      <h1 className="editorial-type mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/80 md:text-lg">{summary}</p>
    </div>
  </section>;
}

export function EnquiryLink({ service, label = "Enquire about this journey", className = "" }: { service: string; label?: string; className?: string }) {
  return <Button asChild className={`rounded-none bg-accent text-foreground hover:bg-accent/90 ${className}`}><Link to="/contact" search={{ service }}>{label}<ArrowRight size={15} /></Link></Button>;
}
