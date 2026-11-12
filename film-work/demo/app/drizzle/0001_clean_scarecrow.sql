CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`slug` text NOT NULL,
	`plan_name` text NOT NULL,
	`sku` text,
	`product_type` text DEFAULT 'vps' NOT NULL,
	`publication_status` text DEFAULT 'draft' NOT NULL,
	`vcpus` integer,
	`cpu_kind` text,
	`cpu_source` text,
	`architecture` text,
	`ram_gb` real,
	`disk_gb` real,
	`disk_type` text,
	`bandwidth_tb` real,
	`bandwidth_source` text,
	`ipv4_status` text DEFAULT 'unknown' NOT NULL,
	`ipv4_source` text,
	`billing_notes` text,
	`official_url` text NOT NULL,
	`confidence` text DEFAULT 'medium' NOT NULL,
	`fit_notes` text,
	`catch_notes` text,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`published_at` integer,
	FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "offers_product_type_check" CHECK("offers"."product_type" in ('vps', 'cloud', 'dedicated', 'paas', 'hosting', 'other')),
	CONSTRAINT "offers_publication_status_check" CHECK("offers"."publication_status" in ('staged', 'draft', 'published', 'hidden', 'archived', 'blocked')),
	CONSTRAINT "offers_confidence_check" CHECK("offers"."confidence" in ('high', 'medium', 'low')),
	CONSTRAINT "offers_ipv4_status_check" CHECK("offers"."ipv4_status" in ('included', 'extra', 'location-dependent', 'unknown')),
	CONSTRAINT "offers_numeric_check" CHECK(("offers"."vcpus" is null or "offers"."vcpus" >= 0)
        and ("offers"."ram_gb" is null or "offers"."ram_gb" >= 0)
        and ("offers"."disk_gb" is null or "offers"."disk_gb" >= 0)
        and ("offers"."bandwidth_tb" is null or "offers"."bandwidth_tb" >= 0))
);
--> statement-breakpoint
CREATE INDEX `offers_provider_status_idx` ON `offers` (`provider_id`,`publication_status`);--> statement-breakpoint
CREATE INDEX `offers_status_idx` ON `offers` (`publication_status`);--> statement-breakpoint
CREATE INDEX `offers_product_type_idx` ON `offers` (`product_type`);--> statement-breakpoint
CREATE UNIQUE INDEX `offers_provider_slug_unique` ON `offers` (`provider_id`,`slug`);