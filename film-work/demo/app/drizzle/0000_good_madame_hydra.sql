CREATE TABLE `providers` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`official_url` text NOT NULL,
	`hq_country` text(2),
	`logo_path` text,
	`status` text DEFAULT 'active' NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT "providers_status_check" CHECK("providers"."status" in ('active', 'draft', 'paused', 'archived'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `providers_slug_unique` ON `providers` (`slug`);--> statement-breakpoint
CREATE INDEX `providers_status_idx` ON `providers` (`status`);--> statement-breakpoint
CREATE INDEX `providers_hq_country_idx` ON `providers` (`hq_country`);