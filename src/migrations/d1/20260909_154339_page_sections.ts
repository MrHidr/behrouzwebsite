import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_sections_copy_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_copy_blocks_order_idx\` ON \`pages_sections_copy_blocks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_copy_blocks_parent_id_idx\` ON \`pages_sections_copy_blocks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections_copy_blocks_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections_copy_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_sections_copy_blocks_locales_locale_parent_id_unique\` ON \`pages_sections_copy_blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections_image_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`admin_label\` text,
  	\`replacement_id\` integer,
  	\`source_path\` text,
  	FOREIGN KEY (\`replacement_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_image_overrides_order_idx\` ON \`pages_sections_image_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_image_overrides_parent_id_idx\` ON \`pages_sections_image_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_image_overrides_replacement_idx\` ON \`pages_sections_image_overrides\` (\`replacement_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections_value_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_value_overrides_order_idx\` ON \`pages_sections_value_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_value_overrides_parent_id_idx\` ON \`pages_sections_value_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections_lists_items_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections_lists_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_details_order_idx\` ON \`pages_sections_lists_items_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_details_parent_id_idx\` ON \`pages_sections_lists_items_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections_lists_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item_key\` text,
  	\`admin_label\` text,
  	\`enabled\` integer DEFAULT true,
  	\`value\` text,
  	\`secondary_value\` text,
  	\`latitude\` numeric,
  	\`longitude\` numeric,
  	\`href\` text,
  	\`color\` text,
  	\`image_id\` integer,
  	\`legacy_image_path\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_order_idx\` ON \`pages_sections_lists_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_parent_id_idx\` ON \`pages_sections_lists_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_image_idx\` ON \`pages_sections_lists_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections_lists_items_locales\` (
  	\`title\` text,
  	\`eyebrow\` text,
  	\`subtitle\` text,
  	\`text\` text,
  	\`metric\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections_lists_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_sections_lists_items_locales_locale_parent_id_unique\` ON \`pages_sections_lists_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections_lists\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`list_key\` text,
  	\`admin_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_order_idx\` ON \`pages_sections_lists\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_parent_id_idx\` ON \`pages_sections_lists\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_key\` text,
  	\`locked\` integer DEFAULT false,
  	\`admin_label\` text,
  	\`enabled\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_sections_order_idx\` ON \`pages_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_parent_id_idx\` ON \`pages_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_copy_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_copy_blocks_order_idx\` ON \`_pages_v_version_sections_copy_blocks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_copy_blocks_parent_id_idx\` ON \`_pages_v_version_sections_copy_blocks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_copy_blocks_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections_copy_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_version_sections_copy_blocks_locales_locale_parent_\` ON \`_pages_v_version_sections_copy_blocks_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_image_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`admin_label\` text,
  	\`replacement_id\` integer,
  	\`source_path\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`replacement_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_image_overrides_order_idx\` ON \`_pages_v_version_sections_image_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_image_overrides_parent_id_idx\` ON \`_pages_v_version_sections_image_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_image_overrides_replacement_idx\` ON \`_pages_v_version_sections_image_overrides\` (\`replacement_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_value_overrides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_value_overrides_order_idx\` ON \`_pages_v_version_sections_value_overrides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_value_overrides_parent_id_idx\` ON \`_pages_v_version_sections_value_overrides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_lists_items_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections_lists_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_details_order_idx\` ON \`_pages_v_version_sections_lists_items_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_details_parent_id_idx\` ON \`_pages_v_version_sections_lists_items_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_lists_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`item_key\` text,
  	\`admin_label\` text,
  	\`enabled\` integer DEFAULT true,
  	\`value\` text,
  	\`secondary_value\` text,
  	\`latitude\` numeric,
  	\`longitude\` numeric,
  	\`href\` text,
  	\`color\` text,
  	\`image_id\` integer,
  	\`legacy_image_path\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_order_idx\` ON \`_pages_v_version_sections_lists_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_parent_id_idx\` ON \`_pages_v_version_sections_lists_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_image_idx\` ON \`_pages_v_version_sections_lists_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_lists_items_locales\` (
  	\`title\` text,
  	\`eyebrow\` text,
  	\`subtitle\` text,
  	\`text\` text,
  	\`metric\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections_lists_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_version_sections_lists_items_locales_locale_parent_\` ON \`_pages_v_version_sections_lists_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections_lists\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`list_key\` text,
  	\`admin_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_order_idx\` ON \`_pages_v_version_sections_lists\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_parent_id_idx\` ON \`_pages_v_version_sections_lists\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`section_key\` text,
  	\`locked\` integer DEFAULT false,
  	\`admin_label\` text,
  	\`enabled\` integer DEFAULT true,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_order_idx\` ON \`_pages_v_version_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_parent_id_idx\` ON \`_pages_v_version_sections\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_sections_copy_blocks\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_copy_blocks_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_image_overrides\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_value_overrides\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_lists_items_details\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_lists_items\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_lists_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_lists\`;`)
  await db.run(sql`DROP TABLE \`pages_sections\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_copy_blocks\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_copy_blocks_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_image_overrides\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_value_overrides\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_lists_items_details\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_lists_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_lists_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_lists\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections\`;`)
}
