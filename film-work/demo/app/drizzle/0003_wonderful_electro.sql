CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`iso_country` text(2) NOT NULL,
	`country_name` text NOT NULL,
	`city` text,
	`region` text,
	`provider_location_name` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT "locations_country_code_check" CHECK("locations"."iso_country" = upper("locations"."iso_country") and length("locations"."iso_country") = 2)
);
--> statement-breakpoint
CREATE INDEX `locations_country_idx` ON `locations` (`iso_country`);--> statement-breakpoint
CREATE INDEX `locations_city_idx` ON `locations` (`city`);--> statement-breakpoint
CREATE UNIQUE INDEX `locations_identity_unique` ON `locations` (`iso_country`,`city`,`region`,`provider_location_name`);--> statement-breakpoint
CREATE TABLE `offer_locations` (
	`offer_id` text NOT NULL,
	`location_id` text NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`source_text` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`offer_id`, `location_id`),
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `offer_locations_location_offer_idx` ON `offer_locations` (`location_id`,`offer_id`);