PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_staged_import_rows` (
	`id` text PRIMARY KEY NOT NULL,
	`import_job_id` text NOT NULL,
	`row_number` integer NOT NULL,
	`source_key` text,
	`raw_payload` text NOT NULL,
	`normalized_payload` text,
	`provider_slug` text,
	`offer_slug` text,
	`product_type` text DEFAULT 'vps' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`reviewed_at` integer,
	FOREIGN KEY (`import_job_id`) REFERENCES `import_jobs`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "staged_import_rows_status_check" CHECK("__new_staged_import_rows"."status" in ('pending', 'approved', 'rejected', 'blocked')),
	CONSTRAINT "staged_import_rows_row_number_check" CHECK("__new_staged_import_rows"."row_number" > 0),
	CONSTRAINT "staged_import_rows_product_type_check" CHECK("__new_staged_import_rows"."product_type" in ('vps', 'cloud', 'dedicated', 'paas', 'hosting', 'other'))
);
--> statement-breakpoint
INSERT INTO `__new_staged_import_rows`("id", "import_job_id", "row_number", "source_key", "raw_payload", "normalized_payload", "provider_slug", "offer_slug", "product_type", "status", "created_at", "reviewed_at") SELECT "id", "import_job_id", "row_number", "source_key", "raw_payload", "normalized_payload", "provider_slug", "offer_slug", 'vps', "status", "created_at", "reviewed_at" FROM `staged_import_rows`;--> statement-breakpoint
DROP TABLE `staged_import_rows`;--> statement-breakpoint
ALTER TABLE `__new_staged_import_rows` RENAME TO `staged_import_rows`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `staged_import_rows_job_row_unique` ON `staged_import_rows` (`import_job_id`,`row_number`);--> statement-breakpoint
CREATE INDEX `staged_import_rows_job_status_idx` ON `staged_import_rows` (`import_job_id`,`status`);
