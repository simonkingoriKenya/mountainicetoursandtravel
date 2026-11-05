import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bell, CalendarDays, Check, ClipboardList, FileKey, FileText, Grid2X2, HardHat, LayoutDashboard, LogOut, Search, Shield, Truck, Users, Warehouse, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cloudOpsApi, getOpsApi, isMockMode } from "@/lib/ops-api";
import type { Database } from "@/integrations/supabase/types";
import { APP_ROLES, type AppRole } from "@/lib/roles";

export const Route = createFileRoute("/ops")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/ops", search: { login: "required", redirect: location.href } });
  },
  head: () => ({
    meta: [
      { title: "Operations Desk | MountainIceMikes Tours and Travel" },
      { name: "description", content: "Secure field operations workspace for MountainIceMikes Tours and Travel." },
      { property: "og:title", content: "MountainIceMikes Operations Desk" },
      { property: "og:description", content: "Private operations workspace for journeys, crew, leads, gear and permits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OperationsPage,
});

type PageName = "Overview" | "Enquiries" | "Trips & calendar" | "Crew ledger" | "Gear" | "Fleet" | "Document vault";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
type Trip = Database["public"]["Tables"]["trips"]["Row"];
type Crew = Database["public"]["Tables"]["crew_assignments"]["Row"];
type Gear = Database["public"]["Tables"]["gear_inventory"]["Row"];
type Fleet = Database["public"]["Tables"]["fleet_inventory"]["Row"];
const navItems: { label: PageName; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Enquiries", icon: ClipboardList },
  { label: "Trips & calendar", icon: CalendarDays },
  { label: "Crew ledger", icon: Users },
  { label: "Gear", icon: Warehouse },
  { label: "Fleet", icon: Truck },
  { label: "Document vault", icon: FileKey },
];
const stages = ["new", "qualified", "quote_sent", "booked"] as const;

function usd(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }
function readableStatus(status: string) { return status.replaceAll("_", " "); }
function day(date: string | null) { return date ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00`)) : "Date to confirm"; }
function fullDay(date: string) { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date)); }
function btnClass(name: PageName, current: PageName) { return `flex h-10 w-full items-center gap-3 px-4 text-left text-xs transition ${name === current ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"}`; }

function OperationsPage() {
  const navigate = useNavigate();
  const api = getOpsApi();
  const [userEmail, setUserEmail] = useState("");
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [page, setPage] = useState<PageName>("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [gear, setGear] = useState<Gear[]>([]);
  const [fleet, setFleet] = useState<Fleet[]>([]);
  const [query, setQuery] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [tripForFile, setTripForFile] = useState("");

  useEffect(() => {
    let live = true;
    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { if (live) { setAuthReady(true); void navigate({ to: "/ops" }); } return; }
      const [{ data: rolesData, error: rolesError }, profileResult] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", auth.user.id),
        supabase.from("profiles").select("display_name").eq("id", auth.user.id).maybeSingle(),
      ]);
      if (!live) return;
      const assigned = (rolesData ?? []).map((record) => record.role).filter((role): role is AppRole => APP_ROLES.includes(role));
      setUserEmail(profileResult.data?.display_name || auth.user.email || "Staff account");
      setRoles(assigned);
      setAuthReady(true);
      if (rolesError) { setError("Staff role details couldn’t be loaded. Refresh and try again."); return; }
      if (assigned.length === 0) return;
      try {
        const [newInquiries, newTrips, newCrew, newGear, newFleet] = await Promise.all([
          api.list("inquiries"), api.list("trips"), api.list("crew_assignments"), api.list("gear_inventory"), api.list("fleet_inventory"),
        ]);
        if (!live) return;
        setInquiries(newInquiries);
        setTrips(newTrips);
        setCrew(newCrew);
        setGear(newGear);
        setFleet(newFleet);
      } catch { if (live) setError("Operations data couldn’t be loaded. Check your access and try again."); }
    }
    void load();
    return () => { live = false; };
  }, [api, navigate]);

  const byStatus = useMemo(() => Object.fromEntries(stages.map((status) => [status, inquiries.filter((inquiry) => inquiry.status === status)])) as Record<(typeof stages)[number], Inquiry[]>, [inquiries]);
  const tripTotal = trips.length;
  const activeGroups = trips.filter((trip) => ["on_mountain", "confirmed"].includes(trip.status)).length;
  const outstanding = crew.reduce((total, person) => total + person.gate_balance_usd, 0);
  const filteredInquiries = inquiries.filter((inquiry) => `${inquiry.name} ${inquiry.email} ${inquiry.service}`.toLowerCase().includes(query.toLowerCase()));

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  }
  async function mutate(action: () => Promise<void>, message: string) {
    setBusy(true); setError("");
    try { await action(); notify(message); }
    catch { setError("That change could not be saved. Check your access and try again."); }
    finally { setBusy(false); }
  }
  async function changeInquiry(id: string, status: string) {
    if (isMockMode) {
      await api.updateInquiryStatus(id, status);
      setInquiries((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
    } else {
      await api.updateInquiryStatus(id, status);
      setInquiries((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
    }
    notify("Enquiry updated.");
  }
  async function changeTrip(trip: Trip) {
    const next = trip.status === "planned" ? "confirmed" : "planned";
    await mutate(async () => { await api.updateTripStatus(trip.id, next); setTrips((rows) => rows.map((row) => row.id === trip.id ? { ...row, status: next } : row)); }, `Trip marked ${readableStatus(next)}.`);
  }
  async function updateAvailability(type: "gear" | "fleet", row: Gear | Fleet, value: number) {
    await mutate(async () => {
      if (type === "gear") { await api.updateGearAvailable(row.id, value); setGear((items) => items.map((item) => item.id === row.id ? { ...item, available: value } : item)); }
      else { await api.updateFleetAvailable(row.id, value); setFleet((items) => items.map((item) => item.id === row.id ? { ...item, available: value } : item)); }
    }, "Availability saved.");
  }
  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newFile) { notify("Choose a document first."); return; }
    await mutate(async () => {
      await cloudOpsApi.uploadDocument(newFile, tripForFile || null, "permit");
      setNewFile(null);
      (event.currentTarget as HTMLFormElement).reset();
    }, "Document stored in the private vault.");
  }
  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/ops", replace: true });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-[74px] items-center justify-between border-b border-border px-4 sm:px-7">
        <div className="flex items-center gap-4"><Button variant="outline" size="icon" aria-label="Return to MountainIceMikes public site" title="Public site" className="size-9" onClick={() => void navigate({ to: "/" })}><ArrowLeft size={16}/></Button><div><p className="editorial-type text-[13px] font-bold uppercase">MountainIceMikes</p><p className="mt-1 text-[9px] uppercase text-muted-foreground">Migradia ops · Nanyuki</p></div></div>
        <div className="flex items-center gap-2 sm:gap-4"><span className="hidden border-r border-border pr-4 text-[11px] text-muted-foreground md:inline">{isMockMode ? "Sample workspace" : "Live operations"}</span><Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications"><Bell size={17}/></Button><div className="hidden max-w-44 truncate text-right text-[11px] sm:block">{userEmail}</div><Button variant="outline" size="icon" aria-label="Sign out" title="Sign out" onClick={() => void signOut()}><LogOut size={15}/></Button><Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle operations menu" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X size={17}/> : <Grid2X2 size={17}/>}</Button></div>
      </header>
      <div className="flex min-h-[calc(100vh-74px)]">
        <aside className={`${mobileNav ? "absolute z-30 flex w-64" : "hidden md:flex md:w-[236px]"} min-h-[calc(100vh-74px)] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground`}>
          <div className="p-4"><p className="px-3 py-3 text-[9px] uppercase text-sidebar-foreground/50">Workspace</p><nav className="grid gap-1">{navItems.map(({ label, icon: Icon }) => <button type="button" key={label} className={btnClass(label, page)} onClick={() => { setPage(label); setMobileNav(false); }}><Icon size={15}/>{label}{label === "Enquiries" && inquiries.length > 0 && <span className="ml-auto min-w-5 border border-sidebar-border px-1 text-center text-[9px]">{inquiries.length}</span>}</button>)}</nav></div>
          <div className="mt-auto border-t border-sidebar-border p-4"><p className="px-3 pb-3 text-[9px] uppercase text-sidebar-foreground/50">Access level</p>{roles.length ? roles.map((role) => <div key={role} className="mx-3 mb-2 flex items-center gap-2 text-[10px]"><Shield size={12} className="text-accent"/>{readableStatus(role)}</div>) : <div className="mx-3 text-[10px] text-sidebar-foreground/55">No assigned access role</div>}</div>
        </aside>
        <section className="min-w-0 flex-1 px-4 pb-12 pt-7 sm:px-7 lg:px-10">
          <div className="mx-auto max-w-[1420px]">
            {!authReady && <div className="border border-border p-10 text-center text-sm text-muted-foreground">Checking staff access…</div>}
            {authReady && roles.length === 0 && <div className="mx-auto mt-8 max-w-2xl border border-accent/45 bg-accent/5 p-6 sm:p-10"><Shield size={25} className="text-accent"/><p className="mt-5 text-[10px] uppercase text-muted-foreground">Signed in · access not assigned</p><h1 className="editorial-type mt-2 text-2xl font-semibold">This account has no staff role.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Ask a MountainIceMikes administrator to assign your role in Lovable Cloud. The operations data remains private until that is done.</p><Button className="mt-6" onClick={() => void signOut()}>Sign out <LogOut size={15}/></Button></div>}
            {roles.length > 0 && <>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase text-muted-foreground">Thursday · 05 November 2026 / EAT</p><h1 className="editorial-type mt-2 text-3xl font-semibold">{page}</h1><p className="mt-2 text-sm text-muted-foreground">{page === "Overview" ? "The field desk, in one place." : `MountainIceMikes field operations · ${page.toLowerCase()}.`}</p></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => void navigate({ to: "/" })}>Public site <ArrowRight size={13}/></Button><span className="hidden size-2 rounded-full bg-primary sm:block"/><span className="hidden text-[10px] text-muted-foreground sm:block">Nanyuki desk</span></div></div>
              {isMockMode && <div className="mb-5 flex items-start gap-3 border border-accent/50 bg-accent/10 px-4 py-3 text-xs"><span className="mt-0.5 size-2 shrink-0 rounded-full bg-accent"/><span><b>Sample workspace</b> — illustrative records only. Turn on the live connection when staffing and operational data are ready.</span></div>}
              {error && <div role="alert" className="mb-5 flex items-center justify-between border border-destructive/35 bg-destructive/5 p-3 text-xs text-destructive"><span>{error}</span><Button variant="ghost" size="icon" aria-label="Dismiss error" onClick={() => setError("")}><X size={14}/></Button></div>}
              {page === "Overview" && <div className="grid gap-6">
                <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4"><Metric label="New enquiries" value={String(byStatus.new.length)} change="Web & WhatsApp"/><Metric label="Active groups" value={String(activeGroups)} change="Mountain and safari"/><Metric label="Upcoming trips" value={String(tripTotal)} change="Next 30 days"/><Metric label="Crew balance" value={usd(outstanding)} change="Outstanding at gate"/></div>
                <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
                  <section className="border border-border bg-card"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5"><div><h2 className="editorial-type font-semibold">Lead pipeline</h2><p className="mt-1 text-[10px] text-muted-foreground">The next conversation to move forward.</p></div><Button variant="ghost" size="sm" className="text-xs" onClick={() => setPage("Enquiries")}>All enquiries <ArrowRight size={13}/></Button></div><div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">{stages.map((status) => <div key={status}><div className="mb-3 flex items-center justify-between"><h3 className="text-[10px] uppercase">{readableStatus(status)}</h3><span className="text-[9px] text-muted-foreground">{byStatus[status].length}</span></div><div className="grid gap-2">{byStatus[status].length === 0 && <p className="border border-dashed border-border p-3 text-[10px] text-muted-foreground">Nothing here.</p>}{byStatus[status].slice(0, 2).map((inquiry) => <article key={inquiry.id} className="border border-border p-3"><div className="text-[11px] font-medium">{inquiry.name}</div><p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{inquiry.service}</p><div className="mt-2 flex justify-between text-[9px] text-muted-foreground"><span>{day(inquiry.travel_dates)}</span><span>{inquiry.source}</span></div></article>)}</div></div>)}</div></section>
                  <section className="border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-5"><div><h2 className="editorial-type font-semibold">On the calendar</h2><p className="mt-1 text-[10px] text-muted-foreground">Next departures, at a glance.</p></div><Button variant="ghost" size="icon" aria-label="Open trip calendar" onClick={() => setPage("Trips & calendar")}><ArrowRight size={15}/></Button></div><div className="divide-y divide-border">{trips.slice(0, 4).map((trip) => <div key={trip.id} className="flex gap-4 p-4"><div className="w-12 shrink-0 border-r border-border"><p className="text-[9px] uppercase text-muted-foreground">{trip.start_date ? new Intl.DateTimeFormat("en-GB", { month: "short" }).format(new Date(`${trip.start_date}T12:00:00"`)) : "TBA"}</p><p className="mt-1 editorial-type text-lg">{trip.start_date ? new Date(`${trip.start_date}T12:00:00").getDate() : "—"}</p></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{trip.name}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{trip.destination} · {trip.lead_guide}</p><p className="mt-2 text-[9px] uppercase text-primary">{trip.guest_count}/{trip.capacity} guests · {readableStatus(trip.status)}</p></div></div>)}</div></section>
                </div>
                <div className="grid gap-6 lg:grid-cols-2"><section className="border border-border bg-card"><div className="flex justify-between border-b border-border p-5"><div><h2 className="editorial-type font-semibold">Gear ready for the field</h2><p className="mt-1 text-[10px] text-muted-foreground">Quick view of returnable items.</p></div><Button variant="ghost" size="icon" aria-label="Open gear availability" onClick={() => setPage("Gear")}><ArrowRight size={15}/></Button></div><div className="divide-y divide-border">{gear.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-3"><span className="text-[11px]">{item.name}</span><span className={`text-[10px] ${item.available <= 2 ? "text-destructive" : "text-muted-foreground"}`}>{item.available} / {item.quantity} ready</span></div>)}</div></section><section className="border border-border bg-card"><div className="flex justify-between border-b border-border p-5"><div><h2 className="editorial-type font-semibold">Crew settlement</h2><p className="mt-1 text-[10px] text-muted-foreground">Mountain and safari field teams.</p></div><Button variant="ghost" size="icon" aria-label="Open crew ledger" onClick={() => setPage("Crew ledger")}><ArrowRight size={15}/></Button></div><div className="divide-y divide-border">{crew.slice(0, 4).map((person) => <div key={person.id} className="flex items-center justify-between gap-3 px-5 py-3"><div><span className="text-[11px]">{person.name}</span><p className="mt-1 text-[9px] text-muted-foreground">{person.role} · {person.days_worked} days</p></div><span className="text-[11px]">{usd(person.gate_balance_usd)}</span></div>)}</div></section></div>
              </div>}

              {page === "Enquiries" && <div className="border border-border bg-card"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5"><div><h2 className="editorial-type font-semibold">Enquiry pipeline</h2><p className="mt-1 text-[10px] text-muted-foreground">Web, referral and direct messages together.</p></div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={15}/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or route" className="h-9 pl-9 text-xs"/></div></div><div className="grid gap-px bg-border xl:grid-cols-4">{stages.map((status) => <section key={status} className="bg-background"><div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-[10px] uppercase">{readableStatus(status)}</h3><span className="text-[9px] text-muted-foreground">{filteredInquiries.filter((item) => item.status === status).length}</span></div><div className="grid gap-2 p-3">{filteredInquiries.filter((item) => item.status === status).map((item) => <article key={item.id} className="border border-border bg-card p-3"><div className="flex justify-between gap-2"><p className="text-xs font-medium">{item.name}</p><span className="text-[9px] text-muted-foreground">{item.source}</span></div><p className="mt-2 text-[10px] text-muted-foreground">{item.service}</p><p className="mt-2 text-[10px]">{item.party_size} travellers · {item.nationality === "resident" ? "Resident" : "Non-resident"}</p><p className="mt-2 text-[10px] leading-5 text-muted-foreground">{item.message}</p><a className="mt-2 block truncate text-[10px] text-primary underline" href={`mailto:${item.email}`}>{item.email}</a><div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[9px] text-muted-foreground"><span>{day(item.travel_dates)}</span><span>{fullDay(item.created_at)}</span></div><div className="mt-2 flex flex-wrap gap-1">{stages.filter((next) => next !== status).map((next) => <Button key={next} size="sm" variant="ghost" disabled={busy} className="h-7 px-2 text-[9px]" onClick={() => void changeInquiry(item.id, next)}>→ {readableStatus(next)}</Button>)}</div></article>)}{filteredInquiries.filter((item) => item.status === status).length === 0 && <p className="p-5 text-center text-[10px] text-muted-foreground">No enquiries.</p>}</div></section>)}</div></div>}

              {page === "Trips & calendar" && <div className="grid gap-5">{trips.map((trip) => <article key={trip.id} className="border border-border bg-card"><div className="flex flex-wrap justify-between gap-5 p-5"><div className="flex gap-4"><div className="flex size-12 shrink-0 items-center justify-center border border-border bg-muted"><CalendarDays size={19}/></div><div><span className="text-[9px] uppercase text-muted-foreground">{trip.trip_code} · {trip.destination}</span><h3 className="editorial-type mt-1 font-semibold">{trip.name}</h3><p className="mt-1 text-[10px] text-muted-foreground">{trip.start_date ? fullDay(trip.start_date) : "Dates to confirm"} – {trip.end_date ? fullDay(trip.end_date) : "TBC"}</p></div></div><div className="flex items-center gap-4"><div className="text-right"><p className="text-[10px] text-muted-foreground">Group manifest</p><p className="mt-1 text-sm font-semibold">{trip.guest_count} <span className="text-muted-foreground">/ {trip.capacity}</span></p></div><Button variant="outline" size="sm" disabled={busy} onClick={() => void changeTrip(trip)}>{readableStatus(trip.status)} · toggle</Button></div></div><div className="grid gap-4 border-t border-border p-5 sm:grid-cols-[1fr_2fr]"><div><span className="text-[9px] uppercase text-muted-foreground">Lead guide</span><p className="mt-1 text-xs">{trip.lead_guide || "To be assigned"}</p></div><div><span className="text-[9px] uppercase text-muted-foreground">Field notes</span><p className="mt-1 text-xs text-muted-foreground">{trip.notes || "No notes."}</p></div></div></article>)}</div>}

              {page === "Crew ledger" && <div className="border border-border bg-card"><div className="border-b border-border p-5"><div className="flex items-center gap-3"><HardHat size={19} className="text-accent"/><div><h2 className="editorial-type font-semibold">Crew settlement ledger</h2><p className="mt-1 text-[10px] text-muted-foreground">Per-day rate · advances · outstanding at gate.</p></div></div></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left"><thead><tr className="border-b border-border text-[9px] uppercase text-muted-foreground">{["Crew member", "Assigned work", "Days", "Daily rate", "Cash advance", "Gate balance", "Payout"].map((name) => <th key={name} className="px-4 py-3 font-normal">{name}</th>)}</tr></thead><tbody>{crew.map((member) => <tr key={member.id} className="border-b border-border last:border-0"><td className="px-4 py-4 text-xs font-medium">{member.name}<p className="mt-1 text-[9px] font-normal text-muted-foreground">{member.role}</p></td><td className="px-4 py-4 text-[10px]">{trips.find((trip) => trip.id === member.trip_id)?.name ?? "Unassigned"}</td><td className="px-4 py-4 text-xs">{member.days_worked}</td><td className="px-4 py-4 text-xs">{usd(member.daily_rate_usd)}</td><td className="px-4 py-4 text-xs">{usd(member.advance_usd)}</td><td className="px-4 py-4 text-xs font-semibold">{usd(member.gate_balance_usd)}</td><td className="px-4 py-4 text-[9px] uppercase">{readableStatus(member.payout_status)}</td></tr>)}</tbody></table></div><div className="flex justify-between border-t border-border px-5 py-4 text-xs"><span className="text-muted-foreground">Outstanding balance</span><span className="font-semibold">{usd(outstanding)}</span></div></div>}

              {page === "Gear" && <InventoryPanel title="Gear availability" description="Ready stock and rental condition." rows={gear} onUpdate={(item, value) => void updateAvailability("gear", item, value)}/>}
              {page === "Fleet" && <div className="grid gap-4">{fleet.map((vehicle) => <article key={vehicle.id} className="grid gap-4 border border-border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_auto]"><div><div className="flex items-start gap-3"><Truck size={20} className="mt-1 shrink-0 text-primary"/><div><h3 className="text-sm font-semibold">{vehicle.vehicle}</h3><p className="mt-1 text-[10px] text-muted-foreground">{vehicle.vehicle_type.replaceAll("_", " ")} · {vehicle.service_mode}</p><p className="mt-3 text-xs">{vehicle.features}</p><p className="mt-2 text-[10px] text-muted-foreground">{usd(vehicle.daily_rate_usd)} / day · listed {vehicle.quantity}</p></div></div></div><div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end"><span className={vehicle.available === 0 ? "text-[10px] text-destructive" : "text-[10px] text-primary"}>{vehicle.available === 0 ? "Out in the field" : `${vehicle.available} available`}</span><Button variant="outline" size="sm" disabled={busy || vehicle.quantity === 0} onClick={() => void updateAvailability("fleet", vehicle, vehicle.available === 0 ? vehicle.quantity : 0)}>Toggle availability</Button></div></article>)}</div>}

              {page === "Document vault" && <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"><section className="border border-border bg-card"><div className="border-b border-border p-5"><div className="flex items-center gap-3"><FileKey size={19} className="text-accent"/><div><h2 className="editorial-type font-semibold">Private document vault</h2><p className="mt-1 text-[10px] text-muted-foreground">Permits and traveller documents are never public.</p></div></div></div><div className="flex flex-col items-center px-5 py-16 text-center"><div className="flex size-12 items-center justify-center border border-border"><FileText size={21}/></div><p className="mt-4 text-sm font-medium">No documents listed</p><p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">Files uploaded to the private vault are accessible only to assigned operations staff. Signed-in guides can access files for operational use.</p></div></section><form onSubmit={(event) => void handleUpload(event)} className="h-fit border border-border bg-card"><div className="border-b border-border p-4"><h2 className="text-sm font-semibold">Add a document</h2><p className="mt-1 text-[10px] text-muted-foreground">Private storage · 15 MB per file</p></div><div className="grid gap-4 p-4"><label className="text-[10px] uppercase text-muted-foreground">Trip<select value={tripForFile} onChange={(event) => setTripForFile(event.target.value)} className="mt-2 h-10 w-full border-b border-border bg-transparent text-xs"><option className="text-foreground" value="">General operations</option>{trips.map((trip) => <option className="text-foreground" key={trip.id} value={trip.id}>{trip.trip_code} · {trip.name}</option>)}</select></label><label className="text-[10px] uppercase text-muted-foreground">Passports / permits<input type="file" required onChange={(event) => setNewFile(event.target.files?.[0] ?? null)} accept="image/jpeg,image/png,application/pdf" className="mt-2 w-full text-[10px] file:mr-2 file:border-0 file:bg-muted file:px-2 file:py-2 file:text-[9px]"/></label><Button type="submit" disabled={busy || isMockMode} className="w-full">{isMockMode ? "Unavailable in sample mode" : busy ? "Uploading…" : "Store privately"}</Button>{isMockMode && <p className="text-[9px] leading-4 text-muted-foreground">Sign in to a live staff account to test private storage.</p>}</div></form></div>}
            </>}
          </div>
        </section>
      </div>
      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 border border-border bg-background px-4 py-3 text-xs shadow-lg"><Check size={14} className="text-primary"/>{toast}</div>}
    </main>
  );
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) {
  return <article className="bg-card px-5 py-5"><p className="text-[10px] uppercase text-muted-foreground">{label}</p><p className="editorial-type mt-3 text-3xl font-semibold">{value}</p><p className="mt-2 text-[9px] text-muted-foreground">{change}</p></article>;
}

function InventoryPanel({ title, description, rows, onUpdate }: { title: string; description: string; rows: Gear[]; onUpdate: (row: Gear, available: number) => void }) {
  return <section className="border border-border bg-card"><div className="border-b border-border p-5"><h2 className="editorial-type font-semibold">{title}</h2><p className="mt-1 text-[10px] text-muted-foreground">{description}</p></div><div className="divide-y divide-border">{rows.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h3 className="text-xs font-medium">{item.name}</h3><p className="mt-1 text-[9px] text-muted-foreground">{item.category} · {item.condition} · {usd(item.daily_rate_usd)} / day</p></div><div className="flex items-center gap-3"><label className="text-[10px] text-muted-foreground">{item.available} ready of {item.quantity}</label><input aria-label={`${item.name} available quantity`} className="h-9 w-[70px] border-b border-border bg-transparent text-center text-xs" type="number" min="0" max={item.quantity} defaultValue={item.available} onBlur={(event) => { const value = Math.min(item.quantity, Math.max(0, Number(event.target.value) || 0)); if (value !== item.available) onUpdate(item, value); }}/></div></div>)}</div></section>;
}