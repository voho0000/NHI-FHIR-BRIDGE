CREATE TABLE `audit_log` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`his_user` text(64),
	`his_host` text(255),
	`page_type` text(64) NOT NULL,
	`patient_id` text(64),
	`html_size` integer DEFAULT 0 NOT NULL,
	`resources_upserted` integer DEFAULT 0 NOT NULL,
	`success` integer DEFAULT true NOT NULL,
	`error` text,
	`auth_token_hint` text(64)
);
--> statement-breakpoint
CREATE INDEX `ix_audit_log_timestamp` ON `audit_log` (`timestamp`);--> statement-breakpoint
CREATE INDEX `ix_audit_log_his_user` ON `audit_log` (`his_user`);--> statement-breakpoint
CREATE INDEX `ix_audit_log_patient_id` ON `audit_log` (`patient_id`);--> statement-breakpoint
CREATE TABLE `authorization_codes` (
	`code` text(255) PRIMARY KEY NOT NULL,
	`client_id` text(255) NOT NULL,
	`redirect_uri` text(1024) NOT NULL,
	`scopes` text DEFAULT '[]' NOT NULL,
	`patient_id` text(255),
	`code_challenge` text(255),
	`code_challenge_method` text(16),
	`expires_at` integer NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fhir_resources` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`resource_type` text(64) NOT NULL,
	`fhir_id` text(255) NOT NULL,
	`version_id` text(16) DEFAULT '1' NOT NULL,
	`resource` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ix_fhir_resources_resource_type` ON `fhir_resources` (`resource_type`);--> statement-breakpoint
CREATE INDEX `ix_fhir_resources_fhir_id` ON `fhir_resources` (`fhir_id`);--> statement-breakpoint
CREATE TABLE `oauth_clients` (
	`client_id` text(255) PRIMARY KEY NOT NULL,
	`client_secret` text(255),
	`client_name` text(255) NOT NULL,
	`redirect_uris` text DEFAULT '[]' NOT NULL,
	`allowed_scopes` text DEFAULT '[]' NOT NULL,
	`is_confidential` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `oauth_tokens` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`client_id` text(255) NOT NULL,
	`access_token` text(512) NOT NULL,
	`scopes` text DEFAULT '[]' NOT NULL,
	`patient_id` text(255),
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_tokens_access_token_unique` ON `oauth_tokens` (`access_token`);--> statement-breakpoint
CREATE TABLE `patient_sync_state` (
	`patient_id` text(255) PRIMARY KEY NOT NULL,
	`last_synced_at` integer,
	`sync_log_id` text(36)
);
--> statement-breakpoint
CREATE TABLE `sync_logs` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`status` text(32) DEFAULT 'running' NOT NULL,
	`patient_id` text(255),
	`message` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` integer
);
