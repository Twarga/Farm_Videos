ALTER TABLE `offer_prices` ADD `intro_months` integer;--> statement-breakpoint
ALTER TABLE `offer_prices` ADD `intro_monthly` real;--> statement-breakpoint
ALTER TABLE `offer_prices` ADD `billed_upfront_months` integer;--> statement-breakpoint
ALTER TABLE `offer_prices` ADD `setup_fee` real;--> statement-breakpoint
ALTER TABLE `offer_prices` ADD `renewal_source` text;--> statement-breakpoint
ALTER TABLE `offer_prices` ADD `terms_reviewed_at` integer;--> statement-breakpoint
ALTER TABLE `offer_prices` ADD `terms_reviewed_by` text;