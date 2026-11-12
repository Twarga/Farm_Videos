CREATE TABLE `offer_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`offer_id` text NOT NULL,
	`original_amount` real,
	`original_currency` text,
	`advertised_monthly` real,
	`effective_monthly` real,
	`cash_due_today` real,
	`renewal_monthly` real,
	`hourly_amount` real,
	`yearly_amount` real,
	`term_months` integer,
	`billing_label` text,
	`normalized_currency` text DEFAULT 'USD' NOT NULL,
	`exchange_rate` real,
	`exchange_rate_date` integer,
	`source_text` text,
	`source_url` text,
	`valid_from` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`valid_to` integer,
	`source_checked_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`) ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "offer_prices_currency_check" CHECK("offer_prices"."original_currency" is null or "offer_prices"."original_currency" in ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'other')),
	CONSTRAINT "offer_prices_normalized_currency_check" CHECK("offer_prices"."normalized_currency" = 'USD'),
	CONSTRAINT "offer_prices_numeric_check" CHECK(("offer_prices"."original_amount" is null or "offer_prices"."original_amount" >= 0)
        and ("offer_prices"."advertised_monthly" is null or "offer_prices"."advertised_monthly" >= 0)
        and ("offer_prices"."effective_monthly" is null or "offer_prices"."effective_monthly" >= 0)
        and ("offer_prices"."cash_due_today" is null or "offer_prices"."cash_due_today" >= 0)
        and ("offer_prices"."renewal_monthly" is null or "offer_prices"."renewal_monthly" >= 0)
        and ("offer_prices"."hourly_amount" is null or "offer_prices"."hourly_amount" >= 0)
        and ("offer_prices"."yearly_amount" is null or "offer_prices"."yearly_amount" >= 0)
        and ("offer_prices"."term_months" is null or "offer_prices"."term_months" > 0)),
	CONSTRAINT "offer_prices_validity_check" CHECK("offer_prices"."valid_to" is null or "offer_prices"."valid_to" >= "offer_prices"."valid_from")
);
--> statement-breakpoint
CREATE INDEX `offer_prices_offer_validity_idx` ON `offer_prices` (`offer_id`,`valid_from`,`valid_to`);--> statement-breakpoint
CREATE INDEX `offer_prices_effective_idx` ON `offer_prices` (`effective_monthly`);