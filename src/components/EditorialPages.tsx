import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import crewPhoto from "@/assets/ethical-mountain-crew.jpg";
import lenanaPhoto from "@/assets/lenana-alpine-route.jpg";
import safariPhoto from "@/assets/amboseli-elephant-camp.jpg";
import { EnquiryLink, PageIntro, PublicPage } from "@/components/PublicPage";
import { fieldNotes, type FieldNote } from "@/lib/editorial-content";

const noteImages = {
  mountain: { src: lenanaPhoto, alt: "Alpine trail beneath Mount Kenya" },
  safari: { src: safariPhoto, alt: "Elephants on the Amboseli plains" },
  crew: { src: crewPhoto, alt: "Mountain crew preparing expedition equipment" },
} as const;

export function ReviewsPage() {
  return <PublicPage>
    <PageIntro eyebrow="Real journeys · Local field team" title="Reviews, grounded in real experience." summary="We want feedback to come from travellers who have actually been on a journey with MountainIceMikes. Until then, here is what our team is committed to on every trip." />
    <section className="px-5 py-12 sm:px-8 md:px-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img src={crewPhoto} alt="Mountain crew working together to prepare for an expedition" loading="lazy" className="h-full w-full object-cover" />
          <span className="absolute bottom-4 left-4 bg-background/90 px-3 py-2 text-[10px] uppercase text-foreground">Nanyuki · Kenya</span>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">What every traveller can ask us</p>
          <h2 className="editorial-type mt-3 text-3xl font-semibold leading-tight">Clear plans. People looked after.</h2>
          <div className="mt-7 divide-y divide-border border-y border-border">
            <p className="flex gap-3 py-5 text-sm leading-6"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-primary" /><span><strong>Field readiness.</strong> Ask how guides, first aid and altitude checks fit your specific route.</span></p>
            <p className="flex gap-3 py-5 text-sm leading-6"><HeartHandshake size={17} className="mt-0.5 shrink-0 text-primary" /><span><strong>Crew welfare.</strong> We plan around fair wages, suitable mountain gear and porter weight limits.</span></p>
            <p className="flex gap-3 py-5 text-sm leading-6"><Compass size={17} className="mt-0.5 shrink-0 text-primary" /><span><strong>Confirmed details.</strong> Route access, dates, park charges and inclusions are checked before booking.</span></p>
          </div>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">We do not publish unverified ratings or another operator’s guest comments. If you have travelled with us, we welcome your feedback and permission to share it.</p>
          <EnquiryLink service="Trip feedback" label="Share trip feedback" className="mt-6" />
        </div>
      </div>
    </section>
  </PublicPage>;
}

export function BlogIndexPage() {
  return <PublicPage>
    <PageIntro eyebrow="From the field · Mountain and safari notes" title="Ideas for the journey ahead." summary="Practical guidance to help you choose a route, prepare for the mountain and plan time on safari." />
    <section className="px-5 py-12 sm:px-8 md:px-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {fieldNotes.map((note, index) => {
          const image = noteImages[note.image];
          return <article key={note.slug} className="group flex flex-col bg-background">
            <Link to="/blog/$slug" params={{ slug: note.slug }} className="block">
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase text-foreground">{note.category}</span>
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="text-[10px] uppercase text-muted-foreground">{String(index + 1).padStart(2, "0")} / Field note</p>
              <h2 className="editorial-type mt-3 text-xl font-semibold leading-snug">
                <Link to="/blog/$slug" params={{ slug: note.slug }} className="hover:text-primary">{note.title}</Link>
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{note.summary}</p>
              <Link to="/blog/$slug" params={{ slug: note.slug }} className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold uppercase text-primary hover:text-accent">Read field note <ArrowUpRight size={15} /></Link>
            </div>
          </article>;
        })}
      </div>
    </section>
  </PublicPage>;
}

export function BlogArticlePage({ article }: { article: FieldNote }) {
  const image = noteImages[article.image];
  return <PublicPage>
    <PageIntro eyebrow={article.category} title={article.title} summary={article.summary} backTo="/blog" backLabel="From the field" />
    <article className="px-5 py-12 sm:px-8 md:px-14 md:py-20">
      <div className="mx-auto max-w-[900px]">
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-6 text-base leading-8 text-muted-foreground">
          {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-5 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground"><Check size={15} className="text-primary" /> Confirm your plans with the local team</p>
          <EnquiryLink service={article.title} label="Discuss your journey" />
        </div>
        <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-7">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-primary hover:text-accent"><ArrowRight size={14} className="rotate-180" /> All field notes</Link>
        </div>
      </div>
    </article>
  </PublicPage>;
}
