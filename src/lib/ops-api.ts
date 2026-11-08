import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { sampleCrew, sampleFleet, sampleGear, sampleInquiries, sampleTrips } from "@/lib/ops-samples";

type Row<K extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][K]["Row"];
export type OpsTable = "inquiries" | "trips" | "crew_assignments" | "gear_inventory" | "fleet_inventory" | "documents";
export interface OpsApi {
  list<K extends OpsTable>(table: K): Promise<Row<K>[]>;
  updateInquiryStatus(id: string, status: string): Promise<void>;
  updateTripStatus(id: string, status: string): Promise<void>;
  createInquiry(row: Pick<Row<"inquiries">, "name" | "email" | "service" | "phone" | "travel_dates" | "party_size" | "nationality" | "source" | "message">): Promise<void>;
  updateGearAvailable(id: string, available: number): Promise<void>;
  updateFleetAvailable(id: string, available: number): Promise<void>;
  uploadDocument(file: File, tripId: string | null, type: string): Promise<void>;
}

const storedMock = typeof import.meta.env["VITE_USE_MOCK"] === "string" ? import.meta.env["VITE_USE_MOCK"] : "true";
export const isMockMode = storedMock !== "false";

function loadLocalRows(): Row<"inquiries">[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem("mountainicemikes.mock.inquiries") ?? "[]") as Row<"inquiries">[];
  } catch { return []; }
}
function saveLocalRows(rows: Row<"inquiries">[]) {
  if (typeof window !== "undefined") window.localStorage.setItem("mountainicemikes.mock.inquiries", JSON.stringify(rows));
}
function mockId() { return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `mock-${Date.now()}`; }

export const mockOpsApi: OpsApi = {
  async list(table) {
    const data = { inquiries: [...loadLocalRows(), ...sampleInquiries], trips: sampleTrips, crew_assignments: sampleCrew, gear_inventory: sampleGear, fleet_inventory: sampleFleet, documents: [] };
    return structuredClone(data[table]) as unknown as Row<typeof table>[];
  },
  async updateInquiryStatus(id, status) {
    const rows = loadLocalRows();
    const index = rows.findIndex((row) => row.id === id);
    if (index >= 0) { rows[index] = { ...rows[index], status }; saveLocalRows(rows); }
  },
  async updateTripStatus() {},
  async createInquiry(row) {
    const inquiries = loadLocalRows();
    inquiries.unshift({
      name: row.name ?? "",
      email: row.email ?? "",
      service: row.service ?? "",
      id: mockId(),
      created_at: new Date().toISOString(),
      status: "new",
      phone: row.phone ?? "",
      travel_dates: row.travel_dates ?? "",
      nationality: row.nationality ?? "non_resident",
      party_size: row.party_size ?? 1,
      source: row.source ?? "website",
      message: row.message ?? "",
    });
    saveLocalRows(inquiries);
  },
  async updateGearAvailable() {},
  async updateFleetAvailable() {},
  async uploadDocument() { throw new Error("Document storage is disabled in sample mode."); },
};

export const cloudOpsApi: OpsApi = {
  async list(table) {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(250);
    if (error) throw error;
    return (data ?? []) as unknown as Row<typeof table>[];
  },
  async updateInquiryStatus(id, status) {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) throw error;
  },
  async updateTripStatus(id, status) {
    const { error } = await supabase.from("trips").update({ status }).eq("id", id);
    if (error) throw error;
  },
  async createInquiry(row) {
    const { error } = await supabase.from("inquiries").insert({ ...row, status: "new" });
    if (error) throw error;
  },
  async updateGearAvailable(id, available) {
    const { error } = await supabase.from("gear_inventory").update({ available, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },
  async updateFleetAvailable(id, available) {
    const { error } = await supabase.from("fleet_inventory").update({ available, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },
  async uploadDocument(file, tripId, type) {
    const id = mockId();
    const path = `${tripId ?? "general"}/${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage.from("operations-vault").upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadError) throw uploadError;
    const { error } = await supabase.from("documents").insert({ trip_id: tripId, label: file.name, document_type: type, storage_path: path });
    if (error) {
      await supabase.storage.from("operations-vault").remove([path]);
      throw error;
    }
  },
};

export const workerOpsApi: OpsApi = {
  async list(table) {
    const response = await fetch(`/api/${table}`, { credentials: "same-origin" });
    if (!response.ok) throw new Error("The operations service is not available yet.");
    return response.json() as Promise<Row<typeof table>[]>;
  },
  async updateInquiryStatus(id, status) { await sendWorker("inquiries", "PATCH", { id, status }); },
  async updateTripStatus(id, status) { await sendWorker("trips", "PATCH", { id, status }); },
  async createInquiry(row) { await sendWorker("inquiries", "POST", row); },
  async updateGearAvailable(id, available) { await sendWorker("gear_inventory", "PATCH", { id, available }); },
  async updateFleetAvailable(id, available) { await sendWorker("fleet_inventory", "PATCH", { id, available }); },
  async uploadDocument(file, tripId, type) {
    const response = await fetch("/api/documents", { method: "POST", credentials: "same-origin", body: (() => { const form = new FormData(); form.set("file", file); form.set("tripId", tripId ?? ""); form.set("type", type); return form; })() });
    if (!response.ok) throw new Error("The document service is not available yet.");
  },
};
async function sendWorker(path: OpsTable, method: "POST" | "PATCH", data: unknown) {
  const response = await fetch(`/api/${path}`, { method, credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
  if (!response.ok) throw new Error("The operations service is not available yet.");
}

export function getOpsApi(): OpsApi {
  if (isMockMode) return mockOpsApi;
  const provider = import.meta.env["VITE_API_PROVIDER"];
  return provider === "worker" ? workerOpsApi : cloudOpsApi;
}
