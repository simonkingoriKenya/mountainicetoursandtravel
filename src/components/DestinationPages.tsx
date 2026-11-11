import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Compass, MapPin, Mountain, ShieldCheck } from "lucide-react";
import lenanaPhoto from "@/assets/lenana-alpine-route.jpg";
import safariPhoto from "@/assets/amboseli-elephant-camp.jpg";
import crewPhoto from "@/assets/ethical-mountain-crew.jpg";
import { Button } from "@/components/ui/button";
import { EnquiryLink, PageIntro, PublicPage } from "@/components/PublicPage";
import type { DestinationContent } from "@/lib/site-content";
import { formatPrice, tours } from "@/lib/tours";

export type DestinationCategory = "mountains" | "safaris" | "services";
export type DestinationEntry = { slug: string; title: string };

const destinationImages = {
  mountain: { src: lenanaPhoto, alt: "Alpine trail beneath Mount Kenya’s rugged summit range" },
  safari: { src: safariPhoto, alt: "Elephants crossing the Amboseli plains below Kilimanjaro" },
  crew: { src: crewPhoto, alt: "Mountain crew preparing expedition equipment together" },
} as const;

const categoryPaths: Record<DestinationCategory, "/mountains" | "/safaris" | "/services"> = {
  mountains: "/mountains",
  safaris: "/safaris",
  services: "/services",
};

export function DestinationIndexPage({ category, title, eyebrow, summary, entries }: {
  category: DestinationCategory;
  title: string;
  eyebrow: string;
  summary: string;
  entries: readonly DestinationEntry[];
}) {
  return <PublicPage>
    <PageIntro eyebrow={eyebrow} title={title} summary={summary} />
    <section className="px-5 py-12 sm:px-8 md:px-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, index) => {
          const image = destinationImages[category === "mountains" ? "mountain" : category === "safaris" ? "safari" : index % 2 === 0 ? "crew" : "safari"];
          return <article key={entry.slug} className="group flex min-h-full flex-col bg-background">
            <Link to={`/${category}/$slug`} params={{ slug: entry.slug }} aria-label={`Explore ${entry.title}`} className="block">
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase text-foreground">{String(index + 1).padStart(2, "0")} / {category}</span>
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h2 className="editorial-type text-xl font-semibold leading-snug">{entry.title}</h2>
              <Link to={`/${category}/$slug`} params={{ slug: entry.slug }} className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold uppercase text-primary hover:text-accent">Explore details <ArrowUpRight size={15} /></Link>
            </div>
          </article>;
        })}
      </div>
      <div className="mx-auto mt-12 flex max-w-[1200px] flex-col items-start justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">Not sure where to begin? Share your dates, group and interests with our Nanyuki team.</p>
        <Button asChild className="rounded-none bg-accent text-foreground hover:bg-accent/90"><Link to="/contact">Plan with the team <ArrowRight size={15} /></Link></Button>
      </div>
    </section>
  </PublicPage>;
}

export function DestinationDetailPage({ category, groupTitle, destination }: {
  category: DestinationCategory;
  groupTitle: string;
  destination: DestinationContent;
}) {
  const image = destinationImages[destination.image];
  const includedTours = tours.filter((tour) => destination.tourSlugs.includes(tour.slug));
  return <PublicPage>
    <PageIntro eyebrow={destination.eyebrow} title={destination.title} summary={destination.summary} backTo={categoryPaths[category]} backLabel={groupTitle} />
    <section className="px-5 py-10 sm:px-8 md:px-14 md:py-16">
      <div className="mx-auto grid max-w-[1200px] gap-9 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary md:aspect-[16/9]">
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            <span className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/90 px-3 py-2 text-[10px] uppercase text-foreground"><MapPin size={13} className="text-accent" /> East Africa · Field planned</span>
          </div>
          <div className="mt-8 max-w-3xl">
            <h2 className="editorial-type text-2xl font-semibold">The journey</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{destination.overview}</p>
          </div>
        </div>
        <aside className="border-t-2 border-accent pt-5 lg:border-t-0 lg:border-l lg:border-border lg:pl-8">
          <p className="text-[10px] uppercase text-muted-foreground">Before you set out</p>
          <ul className="mt-4 divide-y divide-border">
            {destination.highlights.map((highlight) => <li key={highlight} className="flex gap-3 py-4 text-sm leading-6"><Compass size={16} className="mt-1 shrink-0 text-accent" /><span>{highlight}</span></li>)}
          </ul>
          <div className="mt-6 border-t border-border pt-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase"><ShieldCheck size={15} className="text-primary" /> Considered planning</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Final route details, availability and any park charges are confirmed for your dates before booking.</p>
            <EnquiryLink service={destination.title} className="mt-5 w-full justify-center" />
          </div>
        </aside>
      </div>
      {includedTours.length > 0 && <div className="mx-auto mt-14 max-w-[1200px] border-t border-border pt-8 md:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase text-muted-foreground">Available journeys</p><h2 className="editorial-type mt-2 text-2xl font-semibold">Choose a route to discuss.</h2></div><span className="text-[10px] uppercase text-muted-foreground">Rates shown only when confirmed</span></div>
        <div className="mt-6 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {includedTours.map((tour) => <article key={tour.slug} className="bg-background p-5 sm:p-6">
            <p className="text-[10px] uppercase text-muted-foreground">{tour.destination} · {tour.days} days{tour.peak ? ` · ${tour.peak}` : ""}</p>
            <h3 className="editorial-type mt-3 text-lg font-semibold">{tour.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{tour.summary}</p>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold">{tour.startingUsd > 0 ? `${formatPrice(tour.startingUsd, "USD")}${tour.highestUsd ? `–${formatPrice(tour.highestUsd, "USD")}` : ""}` : "Quote on request"}</span>
              <EnquiryLink service={`${tour.destination} — ${tour.title}`} label="Ask" className="h-9 px-3" />
            </div>
          </article>)}
        </div>
      </div>}
    </section>
  </PublicPage>;
}

export function AboutPage() {
  return <PublicPage>
    <PageIntro eyebrow="MountainIceMikes · Nanyuki, Kenya" title="A local team, shaped by the mountain." summary="MountainIceMikes Tours and Travel builds thoughtful mountain, safari and field-support journeys across East Africa." />
    <section className="px-5 py-10 sm:px-8 md:px-14 md:py-16">
      <div className="mx-auto grid max-w-[1200px] gap-9 md:grid-cols-[.9fr_1.1fr] md:gap-14">
        <div className="relative aspect-[4/5] max-h-[620px] overflow-hidden bg-secondary"><img src={crewPhoto} alt="Mountain crew preparing camp and expedition equipment together" className="h-full w-full object-cover" /><span className="absolute bottom-3 left-3 bg-background/90 px-3 py-2 text-[10px] uppercase text-foreground">Nanyuki · Kenya</span></div>
        <div className="flex flex-col justify-center">
          <p className="text-[10px] uppercase text-muted-foreground">A field-first way of travelling</p>
          <h2 className="editorial-type mt-4 text-3xl font-semibold leading-tight md:text-4xl">Good journeys begin with the people who know the place.</h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">From high-altitude routes to open savannah, our team brings local knowledge and practical planning to each trip. We shape the details around your dates, experience and group, and confirm route conditions, access and park charges before booking.</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">MountainIceMikes Tours and Travel operates under Migradia Limited, with a home base in Nanyuki and a focus on careful guiding, field readiness and respect for the people who make each journey possible.</p>
          <div id="our-approach" className="mt-9 scroll-mt-8 border-t border-border pt-6">
            <h3 className="editorial-type text-xl font-semibold">Safety and crew welfare</h3>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
              {["Certified local alpine guides", "Wilderness first-aid readiness", "Pulse oximetry on high-altitude climbs", "KWS-aware route planning", "Fair wages and transparent crew payments", "Warm gear and porter weight caps"].map((item) => <p key={item} className="flex gap-2"><ShieldCheck size={15} className="mt-1 shrink-0 text-primary" />{item}</p>)}
            </div>
          </div>
          <div id="founder" className="mt-9 scroll-mt-8 border-t border-border pt-6">
            <p className="text-[10px] uppercase text-muted-foreground">Founder & Lead Guide · 9+ years in the field</p>
            <h3 className="editorial-type mt-2 text-2xl font-semibold">Kevin Nderitu</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">An alpine guide and photographer whose experience informs how every trip is planned: with attention to the conditions, the crew and the person taking the first step.</p>
          </div>
          <Button asChild className="mt-8 w-fit rounded-none bg-accent text-foreground hover:bg-accent/90"><Link to="/contact">Talk with our team <ArrowRight size={15} /></Link></Button>
        </div>
      </div>
    </section>
  </PublicPage>;
}
