CREATE TABLE `affiliate_conversions` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text,
	`offer_id` text,
	`click_event_id` text,
	`external_reference` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`converted_at` integer NOT NULL,
	`amount` real,
	`currency` text,
	`commission_amount` real,
	`commission_currency` text,
	`source_name` text,
	`external_payload_json` text,
	`imported_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`click_event_id`) REFERENCES `analytics_events`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "affiliate_conversions_status_check" CHECK("affiliate_conversions"."status" in ('pending', 'confirmed', 'reversed')),
	CONSTRAINT "affiliate_conversions_amount_check" CHECK(("affiliate_conversions"."amount" is null or "affiliate_conversions"."amount" >= 0) and ("affiliate_conversions"."commission_amount" is null or "affiliate_conversions"."commission_amount" >= 0))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `affiliate_conversions_external_reference_unique` ON `affiliate_conversions` (`external_reference`);--> statement-breakpoint
CREATE INDEX `affiliate_conversions_provider_time_idx` ON `affiliate_conversions` (`provider_id`,`converted_at`);--> statement-breakpoint
CREATE INDEX `affiliate_conversions_offer_time_idx` ON `affiliate_conversions` (`offer_id`,`converted_at`);--> statement-breakpoint
CREATE TABLE `affiliate_revenue` (
	`id` text PRIMARY KEY NOT NULL,
	`conversion_id` text,
	`provider_id` text,
	`offer_id` text,
	`revenue_type` text NOT NULL,
	`status` text DEFAULT 'estimated' NOT NULL,
	`amount` real NOT NULL,
	`currency` text NOT NULL,
	`recognized_at` integer NOT NULL,
	`source_reference` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`conversion_id`) REFERENCES `affiliate_conversions`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "affiliate_revenue_status_check" CHECK("affiliate_revenue"."status" in ('estimated', 'confirmed', 'reversed')),
	CONSTRAINT "affiliate_revenue_type_check" CHECK("affiliate_revenue"."revenue_type" in ('commission', 'bonus', 'adjustment')),
	CONSTRAINT "affiliate_revenue_amount_check" CHECK("affiliate_revenue"."amount" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `affiliate_revenue_source_reference_unique` ON `affiliate_revenue` (`source_reference`);--> statement-breakpoint
CREATE INDEX `affiliate_revenue_provider_time_idx` ON `affiliate_revenue` (`provider_id`,`recognized_at`);--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`event_version` integer DEFAULT 1 NOT NULL,
	`visitor_id` text,
	`offer_id` text,
	`provider_id` text,
	`page_path` text,
	`placement` text,
	`country_code` text(2),
	`device_class` text DEFAULT 'unknown' NOT NULL,
	`event_data_json` text,
	`request_id` text,
	`occurred_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`visitor_id`) REFERENCES `analytics_visitors`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "analytics_events_event_check" CHECK(length(trim("analytics_events"."event_name")) > 0 and "analytics_events"."event_version" > 0),
	CONSTRAINT "analytics_events_country_code_check" CHECK("analytics_events"."country_code" is null or ("analytics_events"."country_code" = upper("analytics_events"."country_code") and length("analytics_events"."country_code") = 2)),
	CONSTRAINT "analytics_events_device_check" CHECK("analytics_events"."device_class" in ('mobile', 'tablet', 'desktop', 'unknown'))
);
--> statement-breakpoint
CREATE INDEX `analytics_events_name_time_idx` ON `analytics_events` (`event_name`,`occurred_at`);--> statement-breakpoint
CREATE INDEX `analytics_events_offer_time_idx` ON `analytics_events` (`offer_id`,`occurred_at`);--> statement-breakpoint
CREATE INDEX `analytics_events_provider_time_idx` ON `analytics_events` (`provider_id`,`occurred_at`);--> statement-breakpoint
CREATE INDEX `analytics_events_visitor_time_idx` ON `analytics_events` (`visitor_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE `analytics_visitors` (
	`id` text PRIMARY KEY NOT NULL,
	`session_hash` text NOT NULL,
	`first_seen_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`country_code` text(2),
	`device_class` text DEFAULT 'unknown' NOT NULL,
	`landing_path` text,
	`consent_mode` text DEFAULT 'anonymous' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT "analytics_visitors_country_code_check" CHECK("analytics_visitors"."country_code" is null or ("analytics_visitors"."country_code" = upper("analytics_visitors"."country_code") and length("analytics_visitors"."country_code") = 2)),
	CONSTRAINT "analytics_visitors_device_check" CHECK("analytics_visitors"."device_class" in ('mobile', 'tablet', 'desktop', 'unknown')),
	CONSTRAINT "analytics_visitors_consent_check" CHECK("analytics_visitors"."consent_mode" in ('anonymous', 'opted-out')),
	CONSTRAINT "analytics_visitors_seen_order_check" CHECK("analytics_visitors"."last_seen_at" >= "analytics_visitors"."first_seen_at")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `analytics_visitors_session_hash_unique` ON `analytics_visitors` (`session_hash`);--> statement-breakpoint
CREATE INDEX `analytics_visitors_country_idx` ON `analytics_visitors` (`country_code`);--> statement-breakpoint
CREATE INDEX `analytics_visitors_last_seen_idx` ON `analytics_visitors` (`last_seen_at`);