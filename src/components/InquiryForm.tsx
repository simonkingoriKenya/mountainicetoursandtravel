import { useState } from "react";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOpsApi, isMockMode } from "@/lib/ops-api";
import { fieldServiceMenu, mountainMenu, safariMenu } from "@/lib/site-content";
import { tours } from "@/lib/tours";

const choices = [
  ...tours.map((tour) => ({ value: `${tour.destination} — ${tour.title}`, label: `${tour.destination} — ${tour.title}` })),
  ...fieldServiceMenu.map((item) => ({ value: item.title, label: item.title })),
  ...mountainMenu.filter((item) => !tours.some((tour) => tour.title === item.title)).map((item) => ({ value: item.title, label: item.title })),
  ...safariMenu.filter((item) => !tours.some((tour) => tour.title === item.title)).map((item) => ({ value: item.title, label: item.title })),
];
const defaultService = "Mount Kenya — Sirimon–Chogoria Traverse";
const validServices = new Set(choices.map((item) => item.value));

export function InquiryForm({ requestedService }: { requestedService?: string }) {
  const initialService = requestedService && validServices.has(requestedService) ? requestedService : defaultService;
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [visitorClass, setVisitorClass] = useState<"resident" | "non_resident">("non_resident");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setResult(null);
    const form = new FormData(event.currentTarget);
    try {
      await getOpsApi().createInquiry({
        name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        service: String(form.get("service") ?? initialService),
        travel_dates: String(form.get("dates") ?? "").trim(),
        party_size: Number(form.get("partySize") ?? 1),
        nationality: visitorClass,
        message: String(form.get("message") ?? "").trim(),
        source: "website",
      });
      setResult({ kind: "success", text: isMockMode ? "Saved in local demo mode on this device. This enquiry was not transmitted to the MountainIceMikes team." : "Your enquiry has been received. The team will follow up using the details you provided." });
      event.currentTarget.reset();
    } catch (error) {
      setResult({ kind: "error", text: error instanceof Error ? error.message : "The enquiry could not be submitted. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="border border-border bg-background">
    <div className="bg-secondary px-6 py-5"><p className="text-[10px] uppercase tracking-[0.12em] text-primary">Nanyuki · Field desk</p><h2 className="editorial-type mt-2 text-2xl font-semibold">Tell us where you’re headed.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Dates and details help us give you a practical reply.</p></div>
    <div className="grid gap-5 p-6 sm:grid-cols-2">
      <label className="text-[10px] uppercase text-muted-foreground">Name<input required minLength={2} maxLength={140} name="name" autoComplete="name" className="mt-2 h-11 w-full border-b border-border bg-transparent text-sm text-foreground" /></label>
      <label className="text-[10px] uppercase text-muted-foreground">Email<input required type="email" maxLength={254} name="email" autoComplete="email" className="mt-2 h-11 w-full border-b border-border bg-transparent text-sm text-foreground" /></label>
      <label className="text-[10px] uppercase text-muted-foreground">Phone / WhatsApp<input name="phone" maxLength={80} autoComplete="tel" className="mt-2 h-11 w-full border-b border-border bg-transparent text-sm text-foreground" /></label>
      <label className="text-[10px] uppercase text-muted-foreground">Travel dates<input name="dates" maxLength={120} placeholder="e.g. August 2026" className="mt-2 h-11 w-full border-b border-border bg-transparent text-sm text-foreground" /></label>
      <label className="text-[10px] uppercase text-muted-foreground sm:col-span-2">Journey or service<select name="service" defaultValue={initialService} className="mt-2 h-11 w-full border-b border-border bg-background text-sm text-foreground">{choices.map((choice, index) => <option value={choice.value} key={`${choice.value}-${index}`}>{choice.label}</option>)}</select></label>
      <label className="text-[10px] uppercase text-muted-foreground">Travellers<input name="partySize" type="number" min="1" max="30" defaultValue="2" required className="mt-2 h-11 w-full border-b border-border bg-transparent text-sm text-foreground" /></label>
      <label className="text-[10px] uppercase text-muted-foreground">Park fee category<select value={visitorClass} onChange={(event) => setVisitorClass(event.target.value as "resident" | "non_resident")} className="mt-2 h-11 w-full border-b border-border bg-background text-sm text-foreground"><option value="non_resident">Non-resident</option><option value="resident">Resident / citizen</option></select></label>
      <label className="text-[10px] uppercase text-muted-foreground sm:col-span-2">A note for our team<textarea name="message" maxLength={3000} rows={4} className="mt-2 w-full border border-border bg-transparent p-3 text-sm text-foreground" placeholder="Route, experience, interests or practical needs…" /></label>
      <div className="sm:col-span-2">
        {result && <div role={result.kind === "error" ? "alert" : "status"} className={`mb-4 flex gap-2 border p-3 text-sm leading-6 ${result.kind === "error" ? "border-destructive/40 text-destructive" : "border-primary/25 bg-secondary text-primary"}`}>{result.kind === "error" ? <TriangleAlert size={17} className="mt-1 shrink-0" /> : <Check size={17} className="mt-1 shrink-0" />}<span>{result.text}</span></div>}
        <p className="text-[10px] leading-4 text-muted-foreground">Park charges, route details and availability are confirmed by the team before booking.</p>
        <Button disabled={pending} type="submit" className="mt-4 h-12 w-full rounded-none bg-accent text-foreground hover:bg-accent/90 disabled:opacity-60">{pending ? "Submitting…" : "Send enquiry"} <ArrowRight size={15} /></Button>
        {isMockMode && <p className="mt-3 text-center text-[10px] text-muted-foreground">Local demo mode · submissions stay in this browser and are not sent.</p>}
      </div>
    </div>
  </form>;
}
