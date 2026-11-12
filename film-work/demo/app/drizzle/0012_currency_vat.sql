CREATE TABLE `fx_rates` (
	`date` text NOT NULL,
	`currency` text NOT NULL,
	`usd_rate` real NOT NULL,
	`source_url` text NOT NULL,
	PRIMARY KEY(`date`, `currency`),
	CONSTRAINT "fx_rates_positive_rate" CHECK("fx_rates"."usd_rate" > 0)
);
--> statement-breakpoint
ALTER TABLE `offer_prices` ADD `vat_basis` text CHECK (vat_basis IN ('incl', 'excl', 'unknown'));