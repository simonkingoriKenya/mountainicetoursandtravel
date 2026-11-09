import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Compass, FileText, HeartHandshake, Menu, Mountain, Phone, ShieldCheck, Tent, Truck, Users, X } from "lucide-react";
import lenanaPhoto from "@/assets/lenana-alpine-route.jpg";
import safariPhoto from "@/assets/amboseli-elephant-camp.jpg";
import crewPhoto from "@/assets/ethical-mountain-crew.jpg";
import ridgeBadge from "@/assets/mountainicemikes-logo-ridge-badge.png";
import { Button } from "@/components/ui/button";
import { dayRates, formatPrice, type Currency, type VisitorClass, currencies, tours, tourEstimate } from "@/lib/tours";
import { getOpsApi } from "@/lib/ops-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MountainIceMikes Tours and Travel | Kenya, From the Ground Up" },
      { name: "description", content: "Mount Kenya climbs, East African safaris and practical expedition support led by local mountain people." },
      { property: "og:title", content: "MountainIceMikes Tours and Travel" },
      { property: "og:description", content: "Thoughtful East African journeys with local guides, mountain safety and ethical porter welfare at their core." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [visitorClass, setVisitorClass] = useState<VisitorClass>("non_resident");
  const [groupSize, setGroupSize] = useState(2);
  const [rentDays, setRentDays] = useState(4);
  const [selectedGear, setSelectedGear] = useState(2);
  const [rentQuantity, setRentQuantity] = useState(1);
  const [activeService, setActiveService] = useState("All journeys");
  const [menuOpen, setMenuOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [toast, setToast] = useState("");

  const featuredTours = useMemo(() => tours.filter((tour) => activeService === "All journeys" || tour.service === activeService), [activeService]);
  const curated = tours.find((tour) => tour.slug === "sirimon-chogoria");
  const estimate = curated
    ? tourEstimate(curated, groupSize, currency, visitorClass)
    : { amount: "—", label: "Park fees checked separately" };
  const gear = dayRates[selectedGear] ?? { name: "Equipment", rateUsd: 0, stock: 0 };

  function alertToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3600);
  }

  async function submitInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await getOpsApi().createInquiry({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        service: String(formData.get("service") ?? "Mount Kenya — Sirimon–Chogoria"),
        travel_dates: String(formData.get("dates") ?? ""),
        party_size: Number(formData.get("partySize") ?? 1),
        nationality: visitorClass,
        message: String(formData.get("message") ?? ""),
        source: "website",
      });
    } catch {
      alertToast("We couldn’t submit that just now. Please contact us directly.");
      return;
    }
    setInquiryOpen(false);
    alertToast("Your trip enquiry has been sent. We’ll be in touch.");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-40 border-b border-primary-foreground/20 text-primary-foreground">
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link to="/" className="flex items-center gap-3" aria-label="MountainIceMikes Tours and Travel home">
            <img src={ridgeBadge} alt="" width={1200} height={912} className="h-[88px] w-[116px] object-contain"/>
          </Link>
          <nav className="hidden items-center gap-7 text-xs uppercase md:flex">
            <a href="#journeys" className="transition hover:text-accent">Journeys</a>
            <a href="#safari" className="transition hover:text-accent">Safaris</a>
            <a href="#services" className="transition hover:text-accent">Field services</a>
            <a href="#our-team" className="transition hover:text-accent">Our team</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <select aria-label="Select currency" className="h-9 bg-transparent px-2 text-xs text-primary-foreground" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
              {currencies.map((value) => <option className="text-foreground" key={value}>{value}</option>)}
            </select>
            <Button className="bg-accent text-foreground hover:bg-accent/90" onClick={() => setInquiryOpen(true)}>Plan a trip <ArrowRight size={15}/></Button>
          </div>
          <Button variant="ghost" className="size-11 p-0 text-primary-foreground md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</Button>
        </div>
        {menuOpen && <nav className="border-t border-primary-foreground/20 bg-primary p-5 text-sm text-primary-foreground md:hidden"><div className="grid gap-5"><a href="#journeys" onClick={() => setMenuOpen(false)}>Journeys</a><a href="#safari" onClick={() => setMenuOpen(false)}>Safaris</a><a href="#services" onClick={() => setMenuOpen(false)}>Field services</a><a href="#our-team" onClick={() => setMenuOpen(false)}>Our team</a><Button className="bg-accent text-foreground" onClick={() => setInquiryOpen(true)}>Plan a trip <ArrowRight size={15}/></Button></div></nav>}
      </header>

      <section className="relative isolate min-h-[720px] overflow-hidden bg-primary md:min-h-[820px]">
        <img src={lenanaPhoto} alt="High mountain path below Mount Kenya’s rugged summit range" width={1920} height={1280} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center"/>
        <div className="hero-wash absolute inset-0 -z-10"/>
        <div className="absolute bottom-6 right-6 hidden text-[10px] uppercase text-primary-foreground/70 md:block">0°09′S · 37°18′E</div>
        <div className="mx-auto flex min-h-[720px] max-w-[1440px] flex-col justify-end px-6 pb-16 pt-40 text-primary-foreground md:min-h-[820px] md:px-14 md:pb-20">
          <div className="mb-7 flex items-center gap-3 text-[11px] uppercase"><span className="size-2 bg-accent"/> Kenya · 0°09′ South · 5,199 m ASL</div>
          <h1 className="editorial-type max-w-[850px] text-5xl font-semibold leading-[1.04] sm:text-6xl md:text-7xl">From the ground up.<br/>With people who<br/><span className="text-accent">know the mountain.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/85 md:text-lg">Local guides, considered itineraries and dependable field support — for mountains, safaris and the long way between.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button size="lg" className="h-12 bg-accent text-foreground hover:bg-accent/90" onClick={() => { setActiveService("Mountain"); document.getElementById("journeys")?.scrollIntoView({ behavior: "smooth" }); }}>Explore mountain journeys <ArrowDown size={16}/></Button><Button size="lg" variant="outline" className="h-12 border-primary-foreground/55 bg-primary/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setInquiryOpen(true)}>Talk to our team <Phone size={15}/></Button></div>
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-5 border-t border-primary-foreground/35 pt-5 text-[10px] uppercase md:mt-16 md:gap-10">
            <div><span className="mb-2 flex items-center gap-2 text-accent"><ShieldCheck size={14}/> Safety led</span>Decisions made in the field</div>
            <div><span className="mb-2 flex items-center gap-2 text-accent"><HeartHandshake size={14}/> People first</span>Porter welfare, always</div>
            <div><span className="mb-2 flex items-center gap-2 text-accent"><Compass size={14}/> Locally rooted</span>East Africa, close up</div>
          </div>
        </div>
      </section>

      <div className="flex min-h-11 items-center justify-center gap-2 bg-primary px-5 py-2 text-center text-xs text-primary-foreground"><ShieldCheck size={14} className="shrink-0 text-accent"/><span>KWS-aware planning · Local certified guides · Ethical mountain crew</span></div>

      <section id="journeys" className="scroll-mt-8 textured-paper px-6 py-20 md:px-14 md:py-28">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-end justify-between gap-7">
            <div><p className="text-xs uppercase text-muted-foreground">Choose your terrain · 01 / 05</p><h2 className="editorial-type mt-4 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">A mountain is not<br/>a finish line.</h2><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">It’s a team, a route and a rhythm. Start with the climb that suits you.</p></div>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Filter journeys">{["All journeys", "Mountain", "Safari", "Other"].map((label) => <Button size="sm" key={label} variant={activeService === label ? "default" : "outline"} className={activeService === label ? "rounded-none" : "rounded-none bg-transparent"} onClick={() => setActiveService(label)}>{label}</Button>)}</div>
          </div>
          <div className="mt-12 grid gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {featuredTours.map((tour, index) => <article key={tour.slug} className="group flex flex-col border-b border-border py-7 sm:px-5 lg:px-7">
              <div className="flex items-center justify-between text-[10px] uppercase text-muted-foreground"><span>{String(index + 1).padStart(2, "0")} / {tour.destination}</span><span>{tour.service}</span></div>
              <h3 className="editorial-type mt-5 min-h-14 text-xl font-semibold leading-snug">{tour.title}</h3>
              <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{tour.summary}</p>
              <div className="mt-5 flex items-center gap-4 text-[10px] uppercase text-muted-foreground"><span>{tour.days} days</span>{tour.peak && <><span>·</span><span>{tour.peak}</span></>}</div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4"><p className="text-sm font-semibold">{tour.startingUsd > 0 ? <>{formatPrice(tour.startingUsd, currency)}<span className="ml-1 text-[10px] font-normal text-muted-foreground">/ person · from</span></> : <span className="text-muted-foreground">Tailored quote</span>}{tour.highestUsd && <span className="ml-1 text-[10px] font-normal text-muted-foreground">— {formatPrice(tour.highestUsd, currency)}</span>}</p><Button variant="ghost" size="icon" aria-label={`Ask about ${tour.title}`} title={`Ask about ${tour.title}`} className="shrink-0" onClick={() => { setInquiryOpen(true); }}><ArrowUpRight size={17}/></Button></div>
            </article>)}
          </div>
          <div className="mt-12 grid gap-10 border-t border-border pt-8 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <div><label className="text-[10px] uppercase text-muted-foreground" htmlFor="tour-currency">Display currency</label><div className="mt-2 flex items-center border-b border-foreground/30"><select id="tour-currency" aria-label="Tour currency" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} className="h-10 w-full bg-transparent text-sm">{currencies.map((value) => <option className="text-foreground" key={value}>{value}</option>)}</select></div></div>
            <div><label className="text-[10px] uppercase text-muted-foreground" htmlFor="visitor-class">Park fee category</label><div className="mt-2 flex gap-2"><Button variant={visitorClass === "non_resident" ? "default" : "outline"} className="flex-1 rounded-none text-xs" onClick={() => setVisitorClass("non_resident")}>Non-resident</Button><Button variant={visitorClass === "resident" ? "default" : "outline"} className="flex-1 rounded-none text-xs" onClick={() => setVisitorClass("resident")}>Resident / citizen</Button></div></div>
            <div><label className="text-[10px] uppercase text-muted-foreground" htmlFor="group-size">Group size · {groupSize} travellers</label><input id="group-size" aria-label="Group size" type="range" min={1} max={8} value={groupSize} onChange={(event) => setGroupSize(Number(event.target.value))} className="mt-3 h-2 w-full cursor-pointer accent-accent"/><div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>1 traveller</span><span>8 travellers</span></div></div>
            <div className="min-w-44 border-l-2 border-accent pl-5"><span className="text-[10px] uppercase text-muted-foreground">Group estimate · from</span><div className="mt-2 text-xl font-semibold">{estimate.amount}<span className="ml-1 text-xs font-normal text-muted-foreground">/ person</span></div><span className="text-[10px] text-muted-foreground">Quote confirmed before booking</span></div>
          </div>
          <p className="mt-5 text-[11px] text-muted-foreground">{estimate.label}. KWS park charges are confirmed for the traveller’s category and season; not included until quoted.</p>
        </div>
      </section>

      <section id="safari" className="scroll-mt-8 bg-secondary px-6 py-16 text-secondary-foreground md:px-14 md:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 md:grid-cols-[.95fr_1fr] md:gap-16">
          <div className="relative min-h-[340px] overflow-hidden md:min-h-[540px]"><img src={safariPhoto} alt="Elephant family crossing the Amboseli plains before Kilimanjaro" width={1600} height={1104} loading="lazy" className="absolute inset-0 h-full w-full object-cover"/><span className="absolute bottom-4 left-4 bg-background/90 px-3 py-2 text-[10px] uppercase text-foreground">Amboseli · 02°39′S · 1,220 m ASL</span></div>
          <div><p className="text-[11px] uppercase">02 / The savannah, at its own pace</p><h2 className="editorial-type mt-5 text-4xl font-semibold leading-tight md:text-5xl">Stay a little longer<br/>than the dust.</h2><p className="mt-6 max-w-lg text-base leading-7 text-secondary-foreground/75">Game drives shaped around the landscape, local knowledge and the day’s actual conditions — from migration season in the Mara to elephants moving under Kilimanjaro.</p><div className="mt-8 grid gap-0 border-t border-secondary-foreground/25">{["Maasai Mara · Great Migration", "Amboseli · Kilimanjaro’s elephants", "Ol Pejeta & Samburu · Northern Kenya", "Nakuru & Naivasha · Rift Valley"].map((name) => <div key={name} className="flex items-center justify-between border-b border-secondary-foreground/25 py-4 text-sm"><span>{name}</span><ArrowUpRight size={15} className="text-accent"/></div>)}</div><Button className="mt-7 bg-accent text-foreground hover:bg-accent/90" onClick={() => { setActiveService("Safari"); document.getElementById("journeys")?.scrollIntoView({ behavior: "smooth" }); }}>Find a safari <ArrowRight size={15}/></Button></div>
        </div>
      </section>

      <section id="services" className="scroll-mt-8 px-6 py-20 md:px-14 md:py-28">
        <div className="mx-auto max-w-[1320px]"><div className="max-w-2xl"><p className="text-[11px] uppercase text-muted-foreground">03 / Beyond the itinerary</p><h2 className="editorial-type mt-4 text-4xl font-semibold md:text-5xl">The details are the journey.</h2><p className="mt-5 text-base leading-7 text-muted-foreground">Field-ready equipment, dependable vehicles and thoughtful arrangements — brought together by a team already on the ground.</p></div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="border-t-2 border-accent pt-6"><div className="flex items-center justify-between"><div><span className="text-[10px] uppercase text-muted-foreground">04 / Mountain & camp kit</span><h3 className="editorial-type mt-2 text-2xl font-semibold">Rent what you need.</h3></div><Tent size={27} className="text-primary"/></div><div className="mt-6 grid gap-3"><label className="text-[10px] uppercase text-muted-foreground" htmlFor="gear-item">Select item</label><select id="gear-item" value={selectedGear} onChange={(event) => setSelectedGear(Number(event.target.value))} className="h-11 border-b border-border bg-transparent px-2 text-sm">{dayRates.map((item, index) => <option className="text-foreground" value={index} key={item.name}>{item.name} · {formatPrice(item.rateUsd, currency)} / day</option>)}</select><div className="grid grid-cols-3 gap-4 pt-1"><div><label htmlFor="rental-days" className="text-[10px] uppercase text-muted-foreground">Days</label><input id="rental-days" aria-label="Rental duration in days" className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm" type="number" min="1" max="30" value={rentDays} onChange={(event) => setRentDays(Math.max(1, Number(event.target.value) || 1))}/></div><div><label htmlFor="rental-quantity" className="text-[10px] uppercase text-muted-foreground">Quantity</label><input id="rental-quantity" aria-label="Rental quantity" className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm" type="number" min="1" max={gear.stock} value={rentQuantity} onChange={(event) => setRentQuantity(Math.max(1, Number(event.target.value) || 1))}/></div><div className="self-end pb-2 text-right"><span className="text-[10px] uppercase text-muted-foreground">Estimate</span><div className="mt-1 font-semibold">{formatPrice(gear.rateUsd * rentDays * rentQuantity, currency)}</div></div></div><p className="text-[10px] text-muted-foreground">Indicative daily rate · {gear.stock} listed in available stock · confirm fit and availability with our team.</p><Button className="mt-2 bg-primary text-primary-foreground" onClick={() => setInquiryOpen(true)}>Ask about equipment <ArrowRight size={14}/></Button></div></div>
            <div className="border-t-2 border-primary pt-6"><div className="flex items-center justify-between"><div><span className="text-[10px] uppercase text-muted-foreground">05 / Reliable ground transport</span><h3 className="editorial-type mt-2 text-2xl font-semibold">The next mile, covered.</h3></div><Truck size={27} className="text-primary"/></div><p className="mt-4 text-sm leading-6 text-muted-foreground">4×4 safari Land Cruisers with pop-up roof, radio and twin spares; safari vans; Nanyuki and airport transfers.</p><div className="mt-5 grid gap-3 border-y border-border py-4 text-xs sm:grid-cols-2"><div className="flex items-center gap-3"><Check size={14} className="text-primary"/><span>KATO driver-guide option</span></div><div className="flex items-center gap-3"><Check size={14} className="text-primary"/><span>Self-drive, by arrangement</span></div><div className="flex items-center gap-3"><Check size={14} className="text-primary"/><span>Safari 4×4: $160–$220 / day</span></div><div className="flex items-center gap-3"><Check size={14} className="text-primary"/><span>Safari van: $95–$140 / day</span></div></div><Button variant="outline" className="mt-5 rounded-none" onClick={() => setInquiryOpen(true)}>Plan a transfer or vehicle <ArrowRight size={14}/></Button></div>
          </div>
          <div className="mt-12 grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-background p-7"><FileText className="text-accent" size={23}/><h3 className="mt-4 font-semibold">Custom journeys</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">VIP private itineraries and film or photography field logistics.</p></div>
            <div className="bg-background p-7"><Users className="text-accent" size={23}/><h3 className="mt-4 font-semibold">Team days</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Corporate gatherings and guided conditioning hikes.</p></div>
            <div className="bg-background p-7"><Mountain className="text-accent" size={23}/><h3 className="mt-4 font-semibold">Built on the ground</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">From Elephant Hill and Longonot to your next high-altitude plan.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-20 text-primary-foreground md:px-14 md:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[.95fr_1.05fr]"><div><p className="text-[11px] uppercase text-accent">The standard behind every route</p><h2 className="editorial-type mt-5 text-4xl font-semibold leading-tight md:text-5xl">Go high.<br/>Look after each other.</h2><p className="mt-6 max-w-lg leading-7 text-primary-foreground/75">Good days on the mountain start with quiet discipline: trusted guides, clear health checks and a properly supported crew. We plan responsibly and treat the team as part of the ascent.</p><div className="mt-8 grid gap-4 border-t border-primary-foreground/25 pt-6 text-sm sm:grid-cols-2">{["Certified local alpine guides", "Wilderness first aid readiness", "Pulse oximetry on high-altitude climbs", "KWS-aware permits and route planning", "Fair wages and transparent crew payments", "Warm mountain gear and porter weight caps"].map((standard) => <div key={standard} className="flex items-start gap-3"><Check className="mt-0.5 size-4 shrink-0 text-accent"/><span>{standard}</span></div>)}</div><Button className="mt-8 bg-accent text-foreground hover:bg-accent/90" onClick={() => setInquiryOpen(true)}>Ask about safety & welfare <ArrowRight size={15}/></Button></div><div className="relative min-h-[360px] overflow-hidden md:min-h-[540px]"><img src={crewPhoto} alt="Kenyan mountain crew preparing camp and expedition equipment together" width={1600} height={1104} loading="lazy" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-x-0 bottom-0 bg-primary/90 p-5"><span className="text-[10px] uppercase text-accent">Our promise · on the mountain</span><p className="mt-2 text-sm leading-6 text-primary-foreground/90">An expedition’s strength is measured by how well the whole team is cared for.</p></div></div></div>
      </section>

      <section id="our-team" className="scroll-mt-8 border-b border-border px-6 py-16 md:px-14 md:py-20">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="text-[11px] uppercase text-muted-foreground">Local knowledge · 9+ years in the field</p><h2 className="editorial-type mt-4 text-3xl font-semibold md:text-4xl">Kevin Nderitu</h2><p className="mt-2 text-sm uppercase text-primary">Founder & Lead Guide</p><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">An alpine guide and photographer whose years on the mountain inform the way every trip is planned: with attention to the conditions, the crew and the person taking the first step.</p></div><Button variant="outline" className="w-fit rounded-none" onClick={() => setInquiryOpen(true)}>Plan with Kevin’s team <ArrowUpRight size={15}/></Button></div>
      </section>

      <section className="px-6 py-16 md:px-14 md:py-24"><div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[.75fr_1.25fr] md:items-center"><div><p className="text-[11px] uppercase text-muted-foreground">A note from the field</p><p className="editorial-type mt-5 text-3xl leading-snug">“A good trip leaves you with more than a photograph. It leaves the mountain, and the people on it, looked after.”</p><p className="mt-5 text-[11px] uppercase text-primary">— MountainIceMikes field team</p></div><div className="grid gap-px bg-border sm:grid-cols-3"><div className="bg-background p-6"><p className="editorial-type text-2xl font-semibold">9+</p><p className="mt-2 text-xs text-muted-foreground">years guiding and photographing</p></div><div className="bg-background p-6"><p className="editorial-type text-2xl font-semibold">Local</p><p className="mt-2 text-xs text-muted-foreground">mountain crew on every climb</p></div><div className="bg-background p-6"><p className="editorial-type text-2xl font-semibold">KWS</p><p className="mt-2 text-xs text-muted-foreground">route and park planning considered</p></div></div></div></section>

      <footer className="bg-foreground px-6 py-12 text-background md:px-14"><div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-3 md:items-end"><div><Link to="/" aria-label="MountainIceMikes Tours and Travel home"><img src={ridgeBadge} alt="MountainIceMikes Tours and Travel" width={1200} height={912} className="h-auto w-[148px] object-contain"/></Link><p className="mt-3 max-w-sm text-xs leading-5 text-background/65">Kenya journeys made thoughtfully, from the mountain up.</p></div><div className="text-xs text-background/75"><p className="uppercase text-background">Migradia Limited</p><p className="mt-2">Nanyuki · Kenya</p><button onClick={() => setConciergeOpen(true)} className="mt-2 flex items-center gap-2 text-background underline decoration-accent underline-offset-4"><Phone size={13}/> Talk with our team</button></div><div className="text-xs md:text-right"><a href="https://wa.me/?text=Hello%20MountainIceMikes%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20in%20Kenya." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent">WhatsApp concierge <ArrowUpRight size={14}/></a><p className="mt-4 text-background/55">© {new Date().getFullYear()} MountainIceMikes Tours and Travel</p></div></div></footer>

      <div className="fixed bottom-5 right-5 z-40"><Button aria-label={conciergeOpen ? "Close WhatsApp concierge" : "Open WhatsApp concierge"} title="WhatsApp concierge" className="size-14 rounded-full border-2 border-background bg-primary p-0 text-primary-foreground shadow-lg hover:bg-secondary" onClick={() => setConciergeOpen(!conciergeOpen)}>{conciergeOpen ? <X size={22}/> : <Phone size={20}/>}</Button></div>
      {conciergeOpen && <div className="fixed bottom-24 right-5 z-50 w-[min(360px,calc(100vw-2rem))] border border-border bg-background shadow-xl"><div className="flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground"><div><span className="text-sm font-semibold">Field desk · MountainIceMikes</span><p className="mt-1 text-[10px] text-primary-foreground/70">Nanyuki · East Africa / UTC+3</p></div><Button size="icon" variant="ghost" aria-label="Close concierge" className="text-primary-foreground" onClick={() => setConciergeOpen(false)}><X size={17}/></Button></div><div className="p-5"><p className="text-sm leading-6">Tell us where you’re headed, your dates and the size of your group.</p><a className="mt-5 flex h-11 items-center justify-center gap-2 bg-accent text-sm font-medium text-accent-foreground" href="https://wa.me/?text=Hello%20MountainIceMikes%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20in%20Kenya." target="_blank" rel="noreferrer">Open WhatsApp <ArrowUpRight size={15}/></a><Button variant="outline" className="mt-2 w-full rounded-none" onClick={() => setInquiryOpen(true)}>Send a written enquiry <ArrowRight size={14}/></Button></div></div>}

      {inquiryOpen && <div role="presentation" className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/60 p-4" onClick={(event) => { if (event.target === event.currentTarget) setInquiryOpen(false); }}><form onSubmit={submitInquiry} aria-label="Plan a trip enquiry" className="max-h-[90vh] w-full max-w-[570px] overflow-y-auto bg-background"><div className="flex items-start justify-between bg-primary p-6 text-primary-foreground"><div><p className="text-[10px] uppercase text-accent">MountainIceMikes · Field desk</p><h2 className="editorial-type mt-2 text-2xl font-semibold">Start with a place.</h2><p className="mt-2 text-sm text-primary-foreground/75">Our Nanyuki team will help shape the details.</p></div><Button type="button" aria-label="Close enquiry" variant="ghost" size="icon" className="text-primary-foreground" onClick={() => setInquiryOpen(false)}><X/></Button></div><div className="grid gap-5 p-6 sm:grid-cols-2"><label className="text-[10px] uppercase text-muted-foreground">Name<input required minLength={2} name="name" autoComplete="name" className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm text-foreground"/></label><label className="text-[10px] uppercase text-muted-foreground">Email<input required type="email" name="email" autoComplete="email" className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm text-foreground"/></label><label className="text-[10px] uppercase text-muted-foreground">Phone / WhatsApp<input name="phone" autoComplete="tel" className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm text-foreground"/></label><label className="text-[10px] uppercase text-muted-foreground">Travel dates<input name="dates" placeholder="e.g. August 2026" className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm text-foreground"/></label><label className="text-[10px] uppercase text-muted-foreground sm:col-span-2">Journey<select name="service" defaultValue="Mount Kenya — Sirimon–Chogoria" className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm text-foreground"><optgroup label="Mountain routes">{tours.filter((tour) => tour.service === "Mountain").map((tour) => <option key={tour.slug}>{tour.destination} — {tour.title}</option>)}</optgroup><optgroup label="Safaris">{tours.filter((tour) => tour.service === "Safari").map((tour) => <option key={tour.slug}>{tour.destination} — {tour.title}</option>)}</optgroup><option>Gear rental</option><option>Transport & transfers</option><option>Photography / tailored trip</option></select></label><label className="text-[10px] uppercase text-muted-foreground">Travellers<input name="partySize" type="number" min="1" max="30" defaultValue={groupSize} className="mt-2 h-10 w-full border-b border-border bg-transparent text-sm text-foreground"/></label><label className="text-[10px] uppercase text-muted-foreground">Park fee category<select aria-label="Park fee category" value={visitorClass} onChange={(event) => setVisitorClass(event.target.value as VisitorClass)} className="mt-2 h-10 w-full border-b border-border bg-background text-sm text-foreground"><option value="non_resident">Non-resident</option><option value="resident">Resident / citizen</option></select></label><label className="text-[10px] uppercase text-muted-foreground sm:col-span-2">A note for our team<textarea name="message" rows={3} className="mt-2 w-full border-b border-border bg-transparent text-sm text-foreground" placeholder="Your route, experience, special interests…"/></label><div className="sm:col-span-2"><p className="text-[10px] leading-4 text-muted-foreground">For trip planning only. Park charges and availability will be confirmed by the team.</p><Button type="submit" className="mt-4 h-11 w-full rounded-none bg-accent text-foreground hover:bg-accent/90">Send enquiry <ArrowRight size={15}/></Button></div></div></form></div>}
      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 border border-border bg-background px-5 py-3 text-sm shadow-lg"><Check size={16} className="text-primary"/>{toast}</div>}
      <a className="sr-only" href="#main-content">Skip to content</a>
    </main>
  );
}