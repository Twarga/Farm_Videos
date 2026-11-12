ALTER TABLE `providers` ADD `trustpilot_score` real;--> statement-breakpoint
ALTER TABLE `providers` ADD `trustpilot_reviews` integer;--> statement-breakpoint
ALTER TABLE `providers` ADD `trustpilot_url` text;--> statement-breakpoint
ALTER TABLE `providers` ADD `trustpilot_checked_at` integer;--> statement-breakpoint
CREATE TRIGGER `providers_trustpilot_insert_check`
BEFORE INSERT ON `providers`
WHEN (NEW.`trustpilot_score` IS NOT NULL AND (NEW.`trustpilot_score` < 0 OR NEW.`trustpilot_score` > 5))
  OR (NEW.`trustpilot_reviews` IS NOT NULL AND NEW.`trustpilot_reviews` < 0)
BEGIN
  SELECT RAISE(ABORT, 'invalid provider Trustpilot snapshot');
END;--> statement-breakpoint
CREATE TRIGGER `providers_trustpilot_update_check`
BEFORE UPDATE OF `trustpilot_score`, `trustpilot_reviews` ON `providers`
WHEN (NEW.`trustpilot_score` IS NOT NULL AND (NEW.`trustpilot_score` < 0 OR NEW.`trustpilot_score` > 5))
  OR (NEW.`trustpilot_reviews` IS NOT NULL AND NEW.`trustpilot_reviews` < 0)
BEGIN
  SELECT RAISE(ABORT, 'invalid provider Trustpilot snapshot');
END;
