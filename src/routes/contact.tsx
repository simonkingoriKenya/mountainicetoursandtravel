import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { PageIntro, PublicPage } from "@/components/PublicPage";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({ service: typeof search.service === "string" ? search.service : undefined }),
  head: () => ({ meta: [
    { title: "Plan a Trip | Contact MountainIceMikes Tours and Travel" },
    { name: "description", content: "Share your dates, group size and travel interests with the MountainIceMikes team in Nanyuki, Kenya." },
    { property: "og:title", content: "Plan a Trip with MountainIceMikes" },
    { property: "og:description", content: "Talk with our team about mountain treks, safaris and field services." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContactPage,
});

function ContactPage() {
  const { service } = Route.useSearch();
  return <PublicPage>
    <PageIntro eyebrow="Nanyuki · Field desk" title="Let’s plan your journey." summary="Tell us when you’re travelling, who’s coming and what you have in mind. Our team will help confirm the details." />
    <section className="px-5 py-10 sm:px-8 md:px-14 md:py-16">
      <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
        <div className="lg:pt-3"><p className="text-[10px] uppercase text-muted-foreground">MountainIceMikes Tours and Travel</p><h2 className="editorial-type mt-3 text-2xl font-semibold">Start with a place.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">For route ideas, availability, park charges and final inclusions, share a few details and the team will follow up.</p><p className="mt-6 flex items-center gap-2 border-t border-border pt-5 text-sm"><MapPin size={16} className="text-accent" /> Nanyuki · Kenya</p><p className="mt-3 text-xs leading-5 text-muted-foreground">Direct WhatsApp number is awaiting business configuration.</p></div>
        <InquiryForm requestedService={service} />
      </div>
    </section>
  </PublicPage>;
}