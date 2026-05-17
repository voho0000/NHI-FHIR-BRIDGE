CREATE TABLE IF NOT EXISTS `app_settings` (
	`key` text(64) PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
