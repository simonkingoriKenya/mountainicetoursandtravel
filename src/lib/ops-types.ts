export interface InquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  travel_dates: string;
  party_size: number;
  nationality: string;
  status: string;
  source: string;
  message: string;
  created_at: string;
}

export interface TripRow {
  id: string;
  trip_code: string;
  name: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  lead_guide: string;
  capacity: number;
  guest_count: number;
  notes: string;
  created_at: string;
}

export interface CrewRow {
  id: string;
  trip_id: string | null;
  name: string;
  role: string;
  days_worked: number;
  daily_rate_usd: number;
  advance_usd: number;
  gate_balance_usd: number;
  payout_status: string;
  created_at: string;
}

export interface GearRow {
  id: string;
  name: string;
  category: string;
  quantity: number;
  available: number;
  daily_rate_usd: number;
  condition: string;
  updated_at: string;
}

export interface FleetRow {
  id: string;
  vehicle: string;
  vehicle_type: string;
  quantity: number;
  available: number;
  daily_rate_usd: number;
  service_mode: string;
  features: string;
  updated_at: string;
}

export interface DocumentRow {
  id: string;
  trip_id: string | null;
  label: string;
  document_type: string;
  storage_path: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface OpsRows {
  inquiries: InquiryRow;
  trips: TripRow;
  crew_assignments: CrewRow;
  gear_inventory: GearRow;
  fleet_inventory: FleetRow;
  documents: DocumentRow;
}

export type OpsTable = keyof OpsRows;
export type InquiryInput = Pick<
  InquiryRow,
  | "name"
  | "email"
  | "phone"
  | "service"
  | "travel_dates"
  | "party_size"
  | "nationality"
  | "source"
  | "message"
>;
