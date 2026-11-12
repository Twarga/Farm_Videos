ALTER TABLE `corrections` ADD COLUMN `staged_row_id` text REFERENCES `staged_import_rows`(`id`) ON UPDATE cascade ON DELETE restrict;
