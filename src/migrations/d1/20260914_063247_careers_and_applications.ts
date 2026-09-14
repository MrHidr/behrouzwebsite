import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`career_applications\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`full_name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`status\` text DEFAULT 'new' NOT NULL,
  	\`locale\` text DEFAULT 'fa' NOT NULL,
  	\`internal_notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`career_applications_status_idx\` ON \`career_applications\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`career_applications_updated_at_idx\` ON \`career_applications\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`career_applications_created_at_idx\` ON \`career_applications\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`career_applications_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`resume_files_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`career_applications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`resume_files_id\`) REFERENCES \`resume_files\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`career_applications_rels_order_idx\` ON \`career_applications_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`career_applications_rels_parent_idx\` ON \`career_applications_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`career_applications_rels_path_idx\` ON \`career_applications_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`career_applications_rels_resume_files_id_idx\` ON \`career_applications_rels\` (\`resume_files_id\`);`)
  await db.run(sql`CREATE TABLE \`resume_files\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`original_name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`resume_files_updated_at_idx\` ON \`resume_files\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`resume_files_created_at_idx\` ON \`resume_files\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`resume_files_filename_idx\` ON \`resume_files\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_careers_allowed_file_types\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_careers_allowed_file_types_order_idx\` ON \`site_settings_careers_allowed_file_types\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_careers_allowed_file_types_parent_idx\` ON \`site_settings_careers_allowed_file_types\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_careers_allowed_file_types\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_careers_allowed_file_types_order_idx\` ON \`_site_settings_v_version_careers_allowed_file_types\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_careers_allowed_file_types_parent_idx\` ON \`_site_settings_v_version_careers_allowed_file_types\` (\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`permissions_manage_career_applications\` integer;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`career_applications_id\` integer REFERENCES career_applications(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`resume_files_id\` integer REFERENCES resume_files(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_career_applications_id_idx\` ON \`payload_locked_documents_rels\` (\`career_applications_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_resume_files_id_idx\` ON \`payload_locked_documents_rels\` (\`resume_files_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`careers_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`careers_max_files\` numeric DEFAULT 3;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`careers_max_file_size_m_b\` numeric DEFAULT 10;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`careers_max_total_size_m_b\` numeric DEFAULT 20;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_careers_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_careers_max_files\` numeric DEFAULT 3;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_careers_max_file_size_m_b\` numeric DEFAULT 10;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_careers_max_total_size_m_b\` numeric DEFAULT 20;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`career_applications\`;`)
  await db.run(sql`DROP TABLE \`career_applications_rels\`;`)
  await db.run(sql`DROP TABLE \`resume_files\`;`)
  await db.run(sql`DROP TABLE \`site_settings_careers_allowed_file_types\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_careers_allowed_file_types\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`activity_logs_id\` integer,
  	\`media_id\` integer,
  	\`product_categories_id\` integer,
  	\`product_subcategories_id\` integer,
  	\`products_id\` integer,
  	\`pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`activity_logs_id\`) REFERENCES \`activity_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_categories_id\`) REFERENCES \`product_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`product_subcategories_id\`) REFERENCES \`product_subcategories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "activity_logs_id", "media_id", "product_categories_id", "product_subcategories_id", "products_id", "pages_id") SELECT "id", "order", "parent_id", "path", "users_id", "activity_logs_id", "media_id", "product_categories_id", "product_subcategories_id", "products_id", "pages_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_activity_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`activity_logs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_product_subcategories_id_idx\` ON \`payload_locked_documents_rels\` (\`product_subcategories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`permissions_manage_career_applications\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`careers_enabled\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`careers_max_files\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`careers_max_file_size_m_b\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`careers_max_total_size_m_b\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_careers_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_careers_max_files\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_careers_max_file_size_m_b\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_careers_max_total_size_m_b\`;`)
}
