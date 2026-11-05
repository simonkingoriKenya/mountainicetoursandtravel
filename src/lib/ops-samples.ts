import type { Database } from "@/integrations/supabase/types";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
type Trip = Database["public"]["Tables"]["trips"]["Row"];
type Crew = Database["public"]["Tables"]["crew_assignments"]["Row"];
type Gear = Database["public"]["Tables"]["gear_inventory"]["Row"];
type Fleet = Database["public"]["Tables"]["fleet_inventory"]["Row"];

export const sampleInquiries: Inquiry[] = [
  { id: "demo-1", name: "Amara L.", email: "amara@example.test", phone: "+44 20 •••• 4821", service: "Mount Kenya — Sirimon–Chogoria Traverse", travel_dates: "18–23 Aug", party_size: 2, nationality: "non_resident", status: "new", source: "website", message: "Interested in an acclimatization night in Nanyuki.", created_at: "2026-11-05T07:52:00.000Z" },
  { id: "demo-2", name: "Daniel K.", email: "daniel@example.test", phone: "+254 7•• ••• 629", service: "Maasai Mara — 3 Days", travel_dates: "22–25 Nov", party_size: 4, nationality: "resident", status: "qualified", source: "whatsapp", message: "Family safari, please advise on vehicle arrangements.", created_at: "2026-11-05T07:20:00.000Z" },
  { id: "demo-3", name: "Lucia M.", email: "lucia@example.test", phone: "+1 202 ••• 0521", service: "Mount Kilimanjaro — Lemosho Route", travel_dates: "6–14 Jan", party_size: 3, nationality: "non_resident", status: "quote_sent", source: "referral", message: "Would like two rooms after the climb.", created_at: "2026-11-04T16:10:00.000Z" },
  { id: "demo-4", name: "Noah W.", email: "noah@example.test", phone: "+49 171 •••• 412", service: "Gear rental — sleeping bags", travel_dates: "3–7 Dec", party_size: 1, nationality: "non_resident", status: "new", source: "website", message: "Sub-zero sleeping bag for the Kenya route.", created_at: "2026-11-04T13:42:00.000Z" },
  { id: "demo-5", name: "Grace N.", email: "grace@example.test", phone: "+254 7•• ••• 914", service: "Corporate conditioning hike", travel_dates: "10–11 Feb", party_size: 12, nationality: "resident", status: "booked", source: "whatsapp", message: "Team wellness day in the Rift Valley.", created_at: "2026-11-03T09:18:00.000Z" },
];
export const sampleTrips: Trip[] = [
  { id: "trip-1", trip_code: "MM-2611-04", name: "Sirimon–Chogoria Traverse", destination: "Mount Kenya", start_date: "2026-11-07", end_date: "2026-11-12", status: "on_mountain", lead_guide: "Kevin Nderitu", capacity: 8, guest_count: 5, notes: "Pulse oximeter check before Shipton’s Camp.", created_at: "2026-10-27T08:00:00Z" },
  { id: "trip-2", trip_code: "MM-2611-05", name: "Mara Migration Field Week", destination: "Maasai Mara", start_date: "2026-11-09", end_date: "2026-11-14", status: "confirmed", lead_guide: "Peter Mwangi", capacity: 7, guest_count: 6, notes: "Vehicle check and permits confirmed.", created_at: "2026-10-29T10:00:00Z" },
  { id: "trip-3", trip_code: "MM-2611-06", name: "Lemosho Route", destination: "Mount Kilimanjaro", start_date: "2026-11-16", end_date: "2026-11-24", status: "confirmed", lead_guide: "Joyce Wanjiru", capacity: 10, guest_count: 7, notes: "Final gear fit at Arusha.", created_at: "2026-10-31T12:00:00Z" },
  { id: "trip-4", trip_code: "MM-2611-07", name: "Amboseli Family Safari", destination: "Amboseli", start_date: "2026-11-21", end_date: "2026-11-24", status: "planned", lead_guide: "Martin Kiptoo", capacity: 6, guest_count: 4, notes: "Early airport transfer arranged.", created_at: "2026-11-01T12:00:00Z" },
];
export const sampleCrew: Crew[] = [
  { id: "crew-1", trip_id: "trip-1", name: "Joseph W. · sample", role: "Lead porter", days_worked: 5, daily_rate_usd: 24, advance_usd: 40, gate_balance_usd: 80, payout_status: "pending", created_at: "2026-11-01T12:00:00Z" },
  { id: "crew-2", trip_id: "trip-1", name: "Esther K. · sample", role: "Cook", days_worked: 5, daily_rate_usd: 29, advance_usd: 25, gate_balance_usd: 120, payout_status: "pending", created_at: "2026-11-01T12:00:00Z" },
  { id: "crew-3", trip_id: "trip-2", name: "Sam K. · sample", role: "Driver-guide", days_worked: 5, daily_rate_usd: 40, advance_usd: 80, gate_balance_usd: 120, payout_status: "part_paid", created_at: "2026-11-01T12:00:00Z" },
  { id: "crew-4", trip_id: "trip-3", name: "Lucy N. · sample", role: "Mountain guide", days_worked: 8, daily_rate_usd: 44, advance_usd: 150, gate_balance_usd: 202, payout_status: "pending", created_at: "2026-11-02T12:00:00Z" },
];
export const sampleGear: Gear[] = [
  { id: "gear-1", name: "4-season 2-person tent", category: "shelter", quantity: 8, available: 6, daily_rate_usd: 15, condition: "good", updated_at: "2026-11-05T07:00:00Z" },
  { id: "gear-2", name: "4-season 4-person tent", category: "shelter", quantity: 4, available: 3, daily_rate_usd: 25, condition: "good", updated_at: "2026-11-05T07:00:00Z" },
  { id: "gear-3", name: "Sub-zero down sleeping bag", category: "sleep system", quantity: 16, available: 11, daily_rate_usd: 8, condition: "good", updated_at: "2026-11-05T07:00:00Z" },
  { id: "gear-4", name: "Trekking poles · pair", category: "walking", quantity: 18, available: 14, daily_rate_usd: 3, condition: "good", updated_at: "2026-11-05T07:00:00Z" },
  { id: "gear-5", name: "Crampons · technical", category: "technical", quantity: 6, available: 4, daily_rate_usd: 7, condition: "inspect", updated_at: "2026-11-04T17:00:00Z" },
  { id: "gear-6", name: "Camp stove & mess kit", category: "kitchen", quantity: 10, available: 7, daily_rate_usd: 5, condition: "good", updated_at: "2026-11-05T07:00:00Z" },
];
export const sampleFleet: Fleet[] = [
  { id: "fleet-1", vehicle: "Land Cruiser · KBG 291T", vehicle_type: "safari_4x4", quantity: 1, available: 0, daily_rate_usd: 190, service_mode: "chauffeur", features: "Pop-up roof · UHF radio · dual spare · inverter", updated_at: "2026-11-05T07:00:00Z" },
  { id: "fleet-2", vehicle: "Land Cruiser · KCE 640R", vehicle_type: "safari_4x4", quantity: 1, available: 1, daily_rate_usd: 210, service_mode: "chauffeur", features: "Pop-up roof · UHF radio · dual spare · inverter", updated_at: "2026-11-05T07:00:00Z" },
  { id: "fleet-3", vehicle: "Safari van · KDD 515A", vehicle_type: "safari_van", quantity: 1, available: 1, daily_rate_usd: 125, service_mode: "chauffeur", features: "8 guest seats · cabin luggage", updated_at: "2026-11-05T07:00:00Z" },
];
