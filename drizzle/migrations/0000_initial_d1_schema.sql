CREATE TABLE `crew_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text,
	`name` text NOT NULL,
	`role` text DEFAULT 'porter' NOT NULL,
	`days_worked` integer DEFAULT 0 NOT NULL,
	`daily_rate_usd` real DEFAULT 0 NOT NULL,
	`advance_usd` real DEFAULT 0 NOT NULL,
	`gate_balance_usd` real DEFAULT 0 NOT NULL,
	`payout_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text,
	`label` text NOT NULL,
	`document_type` text DEFAULT 'permit' NOT NULL,
	`storage_path` text NOT NULL,
	`uploaded_by` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `fleet_inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`vehicle` text NOT NULL,
	`vehicle_type` text DEFAULT 'safari_4x4' NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`available` integer DEFAULT 1 NOT NULL,
	`daily_rate_usd` real DEFAULT 0 NOT NULL,
	`service_mode` text DEFAULT 'chauffeur' NOT NULL,
	`features` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gear_inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text DEFAULT 'camp' NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`available` integer DEFAULT 0 NOT NULL,
	`daily_rate_usd` real DEFAULT 0 NOT NULL,
	`condition` text DEFAULT 'good' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`service` text NOT NULL,
	`travel_dates` text DEFAULT '' NOT NULL,
	`party_size` integer DEFAULT 1 NOT NULL,
	`nationality` text DEFAULT 'non_resident' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_code` text NOT NULL,
	`name` text NOT NULL,
	`destination` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`lead_guide` text DEFAULT '' NOT NULL,
	`capacity` integer DEFAULT 12 NOT NULL,
	`guest_count` integer DEFAULT 0 NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `trips_trip_code_unique` ON `trips` (`trip_code`);