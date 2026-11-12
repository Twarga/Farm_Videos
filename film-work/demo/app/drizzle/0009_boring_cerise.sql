CREATE TABLE `offer_editorial` (
	`offer_id` text PRIMARY KEY NOT NULL,
	`summary` text,
	`fit_notes` text,
	`catch_notes` text,
	`review_status` text DEFAULT 'draft' NOT NULL,
	`reviewed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE cascade,
	CONSTRAINT "offer_editorial_review_status_check" CHECK("offer_editorial"."review_status" in ('draft', 'reviewed'))
);
--> statement-breakpoint
CREATE INDEX `offer_editorial_review_status_idx` ON `offer_editorial` (`review_status`);