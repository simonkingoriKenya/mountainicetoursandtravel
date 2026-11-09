import {
  sampleCrew,
  sampleFleet,
  sampleGear,
  sampleInquiries,
  sampleTrips,
} from "@/lib/ops-samples";
import type { InquiryInput, OpsRows, OpsTable } from "@/lib/ops-types";

export interface OpsApi {
  list<K extends OpsTable>(table: K): Promise<OpsRows[K][]>;
  updateInquiryStatus(id: string, status: string): Promise<void>;
  updateTripStatus(id: string, status: string): Promise<void>;
  createInquiry(row: InquiryInput): Promise<void>;
  updateGearAvailable(id: string, available: number): Promise<void>;
  updateFleetAvailable(id: string, available: number): Promise<void>;
  uploadDocument(file: File, tripId: string | null, type: string): Promise<void>;
}

const storedMock = import.meta.env["VITE_USE_MOCK"];
export const isMockMode = storedMock === "true" || (storedMock !== "false" && import.meta.env.DEV);

function loadLocalInquiries() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      window.localStorage.getItem("mountainicemikes.mock.inquiries") ?? "[]",
    ) as OpsRows["inquiries"][];
  } catch {
    return [];
  }
}

function saveLocalInquiries(rows: OpsRows["inquiries"][]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("mountainicemikes.mock.inquiries", JSON.stringify(rows));
  }
}

function mockId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `mock-${Date.now()}`;
}

export const mockOpsApi: OpsApi = {
  async list(table) {
    const data: { [K in OpsTable]: OpsRows[K][] } = {
      inquiries: [...loadLocalInquiries(), ...sampleInquiries],
      trips: sampleTrips,
      crew_assignments: sampleCrew,
      gear_inventory: sampleGear,
      fleet_inventory: sampleFleet,
      documents: [],
    };
    return structuredClone(data[table]);
  },
  async updateInquiryStatus(id, status) {
    const rows = loadLocalInquiries();
    saveLocalInquiries(rows.map((row) => (row.id === id ? { ...row, status } : row)));
  },
  async updateTripStatus() {},
  async createInquiry(input) {
    const rows = loadLocalInquiries();
    rows.unshift({
      ...input,
      id: mockId(),
      status: "new",
      created_at: new Date().toISOString(),
    });
    saveLocalInquiries(rows);
  },
  async updateGearAvailable() {},
  async updateFleetAvailable() {},
  async uploadDocument() {
    throw new Error("Document storage is unavailable while staff operations are paused.");
  },
};

export const workerOpsApi: OpsApi = {
  async list(table) {
    const response = await fetch(`/api/${table}`, { credentials: "same-origin" });
    if (!response.ok) throw new Error("The Cloudflare operations service is not available yet.");
    return response.json() as Promise<OpsRows[typeof table][]>;
  },
  async updateInquiryStatus(id, status) {
    await sendWorker("inquiries", "PATCH", { id, status });
  },
  async updateTripStatus(id, status) {
    await sendWorker("trips", "PATCH", { id, status });
  },
  async createInquiry(row) {
    await sendWorker("inquiries", "POST", row);
  },
  async updateGearAvailable(id, available) {
    await sendWorker("gear_inventory", "PATCH", { id, available });
  },
  async updateFleetAvailable(id, available) {
    await sendWorker("fleet_inventory", "PATCH", { id, available });
  },
  async uploadDocument(file, tripId, type) {
    const form = new FormData();
    form.set("file", file);
    form.set("tripId", tripId ?? "");
    form.set("type", type);
    const response = await fetch("/api/documents", {
      method: "POST",
      credentials: "same-origin",
      body: form,
    });
    if (!response.ok) throw new Error("Cloudflare document storage is not available yet.");
  },
};

async function sendWorker(path: OpsTable, method: "POST" | "PATCH", data: unknown) {
  const response = await fetch(`/api/${path}`, {
    method,
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("The Cloudflare operations service is not available yet.");
}

export function getOpsApi(): OpsApi {
  return isMockMode ? mockOpsApi : workerOpsApi;
}
