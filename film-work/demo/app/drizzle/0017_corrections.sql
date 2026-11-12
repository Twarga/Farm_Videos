CREATE TABLE `corrections` (
  `id` text PRIMARY KEY NOT NULL,
  `entity_id` text NOT NULL,
  `offer_id` text REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE set null,
  `field` text NOT NULL,
  `claimed_value` text NOT NULL,
  `source_url` text NOT NULL,
  `email` text,
  `status` text DEFAULT 'open' NOT NULL CHECK (`status` IN ('open', 'accepted', 'rejected')),
  `created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
  `resolved_at` integer,
  `resolver_id` text REFERENCES `admin_users`(`id`) ON UPDATE cascade ON DELETE restrict,
  `resolution_note` text
);
--> statement-breakpoint
CREATE INDEX `corrections_status_created_idx` ON `corrections` (`status`, `created_at`);
