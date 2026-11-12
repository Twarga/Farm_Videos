CREATE TABLE `provider_affiliate_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`program_slug` text NOT NULL,
	`program_name` text NOT NULL,
	`availability` text DEFAULT 'none' NOT NULL,
	`project_status` text DEFAULT 'not-started' NOT NULL,
	`difficulty_rank` integer,
	`network` text,
	`signup_url` text,
	`tracking_template` text,
	`cookie_days` integer,
	`commission_description` text,
	`notes` text,
	`source_url` text,
	`source_notes` text,
	`application_at` integer,
	`approval_at` integer,
	`last_checked_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "provider_affiliate_programs_availability_check" CHECK("provider_affiliate_programs"."availability" in ('none', 'closed', 'public', 'application', 'partner-only')),
	CONSTRAINT "provider_affiliate_programs_project_status_check" CHECK("provider_affiliate_programs"."project_status" in ('not-started', 'researching', 'applied', 'approved', 'rejected', 'paused')),
	CONSTRAINT "provider_affiliate_programs_positive_check" CHECK(("provider_affiliate_programs"."difficulty_rank" is null or "provider_affiliate_programs"."difficulty_rank" > 0)
        and ("provider_affiliate_programs"."cookie_days" is null or "provider_affiliate_programs"."cookie_days" >= 0))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_affiliate_programs_provider_slug_unique` ON `provider_affiliate_programs` (`provider_id`,`program_slug`);--> statement-breakpoint
CREATE INDEX `provider_affiliate_programs_provider_idx` ON `provider_affiliate_programs` (`provider_id`);--> statement-breakpoint
CREATE INDEX `provider_affiliate_programs_availability_idx` ON `provider_affiliate_programs` (`availability`);