import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`activity_logs_changed_fields\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`activity_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`activity_logs_changed_fields_order_idx\` ON \`activity_logs_changed_fields\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`activity_logs_changed_fields_parent_id_idx\` ON \`activity_logs_changed_fields\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`activity_logs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`actor_id\` integer,
  	\`actor_email\` text NOT NULL,
  	\`action\` text NOT NULL,
  	\`entity_label\` text NOT NULL,
  	\`entity_slug\` text NOT NULL,
  	\`document_i_d\` text,
  	\`document_title\` text NOT NULL,
  	\`locale\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`actor_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`activity_logs_actor_idx\` ON \`activity_logs\` (\`actor_id\`);`)
  await db.run(sql`CREATE INDEX \`activity_logs_actor_email_idx\` ON \`activity_logs\` (\`actor_email\`);`)
  await db.run(sql`CREATE INDEX \`activity_logs_action_idx\` ON \`activity_logs\` (\`action\`);`)
  await db.run(sql`CREATE INDEX \`activity_logs_entity_label_idx\` ON \`activity_logs\` (\`entity_label\`);`)
  await db.run(sql`CREATE INDEX \`activity_logs_entity_slug_idx\` ON \`activity_logs\` (\`entity_slug\`);`)
  await db.run(sql`CREATE INDEX \`activity_logs_updated_at_idx\` ON \`activity_logs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`activity_logs_created_at_idx\` ON \`activity_logs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`pages_copy_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_copy_blocks_order_idx\` ON \`pages_copy_blocks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_copy_blocks_parent_id_idx\` ON \`pages_copy_blocks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_copy_blocks_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_copy_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_copy_blocks_locales_locale_parent_id_unique\` ON \`pages_copy_blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_image_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`admin_label\` text,
  	\`replacement_id\` integer,
  	\`source_path\` text,
  	FOREIGN KEY (\`replacement_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_image_overrides_order_idx\` ON \`pages_image_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_image_overrides_parent_id_idx\` ON \`pages_image_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_image_overrides_replacement_idx\` ON \`pages_image_overrides\` (\`replacement_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_value_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_value_overrides_order_idx\` ON \`pages_value_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_value_overrides_parent_id_idx\` ON \`pages_value_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_copy_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_copy_blocks_order_idx\` ON \`_pages_v_version_copy_blocks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_copy_blocks_parent_id_idx\` ON \`_pages_v_version_copy_blocks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_copy_blocks_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_copy_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_version_copy_blocks_locales_locale_parent_id_unique\` ON \`_pages_v_version_copy_blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_image_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`admin_label\` text,
  	\`replacement_id\` integer,
  	\`source_path\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`replacement_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_image_overrides_order_idx\` ON \`_pages_v_version_image_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_image_overrides_parent_id_idx\` ON \`_pages_v_version_image_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_image_overrides_replacement_idx\` ON \`_pages_v_version_image_overrides\` (\`replacement_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_value_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_value_overrides_order_idx\` ON \`_pages_v_version_value_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_value_overrides_parent_id_idx\` ON \`_pages_v_version_value_overrides\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`permissions_manage_admins\` integer,
  	\`permissions_manage_products\` integer,
  	\`permissions_manage_site_content\` integer,
  	\`permissions_manage_site_settings\` integer,
  	\`permissions_manage_media\` integer,
  	\`permissions_publish_content\` integer,
  	\`permissions_view_activity_log\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_users\`("id", "name", "role", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until") SELECT "id", "name", "role", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until" FROM \`users\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`ALTER TABLE \`__new_users\` RENAME TO \`users\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`UPDATE \`users\` SET
    \`permissions_manage_admins\` = CASE WHEN \`role\` = 'super-admin' THEN 1 ELSE 0 END,
    \`permissions_manage_products\` = CASE WHEN \`role\` IN ('super-admin', 'publisher', 'editor') THEN 1 ELSE 0 END,
    \`permissions_manage_site_content\` = CASE WHEN \`role\` IN ('super-admin', 'publisher', 'editor') THEN 1 ELSE 0 END,
    \`permissions_manage_site_settings\` = CASE WHEN \`role\` IN ('super-admin', 'publisher') THEN 1 ELSE 0 END,
    \`permissions_manage_media\` = 1,
    \`permissions_publish_content\` = CASE WHEN \`role\` IN ('super-admin', 'publisher') THEN 1 ELSE 0 END,
    \`permissions_view_activity_log\` = CASE WHEN \`role\` IN ('super-admin', 'publisher') THEN 1 ELSE 0 END;`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`activity_logs_id\` integer REFERENCES activity_logs(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_activity_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`activity_logs_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`audit_retention_days\` numeric DEFAULT 180;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_audit_retention_days\` numeric DEFAULT 180;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`activity_logs_changed_fields\`;`)
  await db.run(sql`DROP TABLE \`activity_logs\`;`)
  await db.run(sql`DROP TABLE \`pages_copy_blocks\`;`)
  await db.run(sql`DROP TABLE \`pages_copy_blocks_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_image_overrides\`;`)
  await db.run(sql`DROP TABLE \`pages_value_overrides\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_copy_blocks\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_copy_blocks_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_image_overrides\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_value_overrides\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`product_categories_id\` integer,
  	\`product_subcategories_id\` integer,
  	\`products_id\` integer,
  	\`pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_subcategories_id\`) REFERENCES \`product_subcategories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "product_categories_id", "product_subcategories_id", "products_id", "pages_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "product_categories_id", "product_subcategories_id", "products_id", "pages_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_subcategories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_subcategories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_users\`("id", "name", "role", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until") SELECT "id", "name", "role", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until" FROM \`users\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`ALTER TABLE \`__new_users\` RENAME TO \`users\`;`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`audit_retention_days\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_audit_retention_days\`;`)
}
