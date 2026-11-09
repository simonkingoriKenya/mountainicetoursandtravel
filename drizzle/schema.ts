import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const currentTimestamp = () => sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  service: text("service").notNull(),
  travel_dates: text("travel_dates").notNull().default(""),
  party_size: integer("party_size").notNull().default(1),
  nationality: text("nationality").notNull().default("non_resident"),
  status: text("status").notNull().default("new"),
  source: text("source").notNull().default("website"),
  message: text("message").notNull().default(""),
  created_at: text("created_at").notNull().default(currentTimestamp()),
});

export const trips = sqliteTable("trips", {
  id: text("id").primaryKey(),
  trip_code: text("trip_code").notNull().unique(),
  name: text("name").notNull(),
  destination: text("destination").notNull(),
  start_date: text("start_date"),
  end_date: text("end_date"),
  status: text("status").notNull().default("planned"),
  lead_guide: text("lead_guide").notNull().default(""),
  capacity: integer("capacity").notNull().default(12),
  guest_count: integer("guest_count").notNull().default(0),
  notes: text("notes").notNull().default(""),
  created_at: text("created_at").notNull().default(currentTimestamp()),
});

export const crew_assignments = sqliteTable("crew_assignments", {
  id: text("id").primaryKey(),
  trip_id: text("trip_id").references(() => trips.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  role: text("role").notNull().default("porter"),
  days_worked: integer("days_worked").notNull().default(0),
  daily_rate_usd: real("daily_rate_usd").notNull().default(0),
  advance_usd: real("advance_usd").notNull().default(0),
  gate_balance_usd: real("gate_balance_usd").notNull().default(0),
  payout_status: text("payout_status").notNull().default("pending"),
  created_at: text("created_at").notNull().default(currentTimestamp()),
});

export const gear_inventory = sqliteTable("gear_inventory", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("camp"),
  quantity: integer("quantity").notNull().default(0),
  available: integer("available").notNull().default(0),
  daily_rate_usd: real("daily_rate_usd").notNull().default(0),
  condition: text("condition").notNull().default("good"),
  updated_at: text("updated_at").notNull().default(currentTimestamp()),
});

export const fleet_inventory = sqliteTable("fleet_inventory", {
  id: text("id").primaryKey(),
  vehicle: text("vehicle").notNull(),
  vehicle_type: text("vehicle_type").notNull().default("safari_4x4"),
  quantity: integer("quantity").notNull().default(1),
  available: integer("available").notNull().default(1),
  daily_rate_usd: real("daily_rate_usd").notNull().default(0),
  service_mode: text("service_mode").notNull().default("chauffeur"),
  features: text("features").notNull().default(""),
  updated_at: text("updated_at").notNull().default(currentTimestamp()),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  trip_id: text("trip_id").references(() => trips.id, { onDelete: "set null" }),
  label: text("label").notNull(),
  document_type: text("document_type").notNull().default("permit"),
  storage_path: text("storage_path").notNull(),
  uploaded_by: text("uploaded_by"),
  created_at: text("created_at").notNull().default(currentTimestamp()),
});
