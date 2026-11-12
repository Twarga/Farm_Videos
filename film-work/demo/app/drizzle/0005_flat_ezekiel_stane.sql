CREATE TABLE `import_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`source_name` text NOT NULL,
	`source_checksum` text NOT NULL,
	`source_checked_at` integer,
	`status` text DEFAULT 'received' NOT NULL,
	`rows_total` integer DEFAULT 0 NOT NULL,
	`rows_created` integer DEFAULT 0 NOT NULL,
	`rows_updated` integer DEFAULT 0 NOT NULL,
	`rows_unchanged` integer DEFAULT 0 NOT NULL,
	`rows_hidden` integer DEFAULT 0 NOT NULL,
	`rows_rejected` integer DEFAULT 0 NOT NULL,
	`error_message` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`completed_at` integer,
	`published_at` integer,
	CONSTRAINT "import_jobs_status_check" CHECK("import_jobs"."status" in ('received', 'processing', 'needs-review', 'approved', 'published', 'failed', 'rolled-back')),
	CONSTRAINT "import_jobs_counts_check" CHECK("import_jobs"."rows_total" >= 0 and "import_jobs"."rows_created" >= 0 and "import_jobs"."rows_updated" >= 0
        and "import_jobs"."rows_unchanged" >= 0 and "import_jobs"."rows_hidden" >= 0 and "import_jobs"."rows_rejected" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `import_jobs_source_checksum_unique` ON `import_jobs` (`source_checksum`);--> statement-breakpoint
CREATE INDEX `import_jobs_status_idx` ON `import_jobs` (`status`);--> statement-breakpoint
CREATE TABLE `publication_snapshot_offers` (
	`snapshot_id` text NOT NULL,
	`offer_id` text NOT NULL,
	`offer_payload` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`snapshot_id`, `offer_id`),
	FOREIGN KEY (`snapshot_id`) REFERENCES `publication_snapshots`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `publication_snapshot_offers_offer_idx` ON `publication_snapshot_offers` (`offer_id`);--> statement-breakpoint
CREATE TABLE `publication_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`import_job_id` text,
	`snapshot_version` integer NOT NULL,
	`label` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`published_at` integer NOT NULL,
	`rolled_back_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`import_job_id`) REFERENCES `import_jobs`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "publication_snapshots_status_check" CHECK("publication_snapshots"."status" in ('published', 'superseded', 'rolled-back')),
	CONSTRAINT "publication_snapshots_version_check" CHECK("publication_snapshots"."snapshot_version" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `publication_snapshots_version_unique` ON `publication_snapshots` (`snapshot_version`);--> statement-breakpoint
CREATE INDEX `publication_snapshots_status_idx` ON `publication_snapshots` (`status`);--> statement-breakpoint
CREATE TABLE `staged_import_rows` (
	`id` text PRIMARY KEY NOT NULL,
	`import_job_id` text NOT NULL,
	`row_number` integer NOT NULL,
	`source_key` text,
	`raw_payload` text NOT NULL,
	`normalized_payload` text,
	`provider_slug` text,
	`offer_slug` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`reviewed_at` integer,
	FOREIGN KEY (`import_job_id`) REFERENCES `import_jobs`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "staged_import_rows_status_check" CHECK("staged_import_rows"."status" in ('pending', 'approved', 'rejected', 'blocked')),
	CONSTRAINT "staged_import_rows_row_number_check" CHECK("staged_import_rows"."row_number" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staged_import_rows_job_row_unique` ON `staged_import_rows` (`import_job_id`,`row_number`);--> statement-breakpoint
CREATE INDEX `staged_import_rows_job_status_idx` ON `staged_import_rows` (`import_job_id`,`status`);--> statement-breakpoint
CREATE TABLE `verification_issues` (
	`id` text PRIMARY KEY NOT NULL,
	`import_job_id` text NOT NULL,
	`staged_row_id` text,
	`severity` text NOT NULL,
	`field` text,
	`code` text NOT NULL,
	`message` text NOT NULL,
	`resolved_at` integer,
	`resolution_note` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`import_job_id`) REFERENCES `import_jobs`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`staged_row_id`) REFERENCES `staged_import_rows`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "verification_issues_severity_check" CHECK("verification_issues"."severity" in ('error', 'warning', 'info'))
);
--> statement-breakpoint
CREATE INDEX `verification_issues_job_severity_idx` ON `verification_issues` (`import_job_id`,`severity`);--> statement-breakpoint
CREATE INDEX `verification_issues_unresolved_idx` ON `verification_issues` (`resolved_at`);