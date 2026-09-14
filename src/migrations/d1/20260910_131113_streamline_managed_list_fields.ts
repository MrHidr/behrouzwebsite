import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  // Preserve localized child rows explicitly while D1 rebuilds their parent.
  await db.run(sql`CREATE TABLE \`__backup_pages_sections_lists_items_locales\` AS
    SELECT \`title\`, \`eyebrow\`, \`subtitle\`, \`text\`, \`id\`, \`_locale\`, \`_parent_id\`
    FROM \`pages_sections_lists_items_locales\`;`)
  await db.run(sql`CREATE TABLE \`__backup_pages_v_version_sections_lists_items_locales\` AS
    SELECT \`title\`, \`eyebrow\`, \`subtitle\`, \`text\`, \`id\`, \`_locale\`, \`_parent_id\`
    FROM \`_pages_v_version_sections_lists_items_locales\`;`)
  await db.run(sql`CREATE TABLE \`__backup_pages_sections_lists_items_details\` AS
    SELECT \`_order\`, \`_parent_id\`, \`id\`, \`value\`
    FROM \`pages_sections_lists_items_details\`;`)
  await db.run(sql`CREATE TABLE \`__backup_pages_v_version_sections_lists_items_details\` AS
    SELECT \`_order\`, \`_parent_id\`, \`id\`, \`value\`, \`_uuid\`
    FROM \`_pages_v_version_sections_lists_items_details\`;`)
  await db.run(sql`CREATE TABLE \`__new_pages_sections_lists_items\` (
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
  	\`color\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_sections_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_sections_lists_items\`("_order", "_parent_id", "id", "item_key", "admin_label", "enabled", "value", "secondary_value", "latitude", "longitude", "color") SELECT "_order", "_parent_id", "id", "item_key", "admin_label", "enabled", "value", "secondary_value", "latitude", "longitude", "color" FROM \`pages_sections_lists_items\`;`)
  await db.run(sql`DROP TABLE \`pages_sections_lists_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_sections_lists_items\` RENAME TO \`pages_sections_lists_items\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_order_idx\` ON \`pages_sections_lists_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_parent_id_idx\` ON \`pages_sections_lists_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_version_sections_lists_items\` (
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
  	\`color\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_sections_lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_version_sections_lists_items\`("_order", "_parent_id", "id", "item_key", "admin_label", "enabled", "value", "secondary_value", "latitude", "longitude", "color", "_uuid") SELECT "_order", "_parent_id", "id", "item_key", "admin_label", "enabled", "value", "secondary_value", "latitude", "longitude", "color", "_uuid" FROM \`_pages_v_version_sections_lists_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_sections_lists_items\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_version_sections_lists_items\` RENAME TO \`_pages_v_version_sections_lists_items\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_order_idx\` ON \`_pages_v_version_sections_lists_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_parent_id_idx\` ON \`_pages_v_version_sections_lists_items\` (\`_parent_id\`);`)
  await db.run(sql`INSERT OR REPLACE INTO \`pages_sections_lists_items_locales\`
    (\`title\`, \`eyebrow\`, \`subtitle\`, \`text\`, \`id\`, \`_locale\`, \`_parent_id\`)
    SELECT \`title\`, \`eyebrow\`, \`subtitle\`, \`text\`, \`id\`, \`_locale\`, \`_parent_id\`
    FROM \`__backup_pages_sections_lists_items_locales\`;`)
  await db.run(sql`INSERT OR REPLACE INTO \`_pages_v_version_sections_lists_items_locales\`
    (\`title\`, \`eyebrow\`, \`subtitle\`, \`text\`, \`id\`, \`_locale\`, \`_parent_id\`)
    SELECT \`title\`, \`eyebrow\`, \`subtitle\`, \`text\`, \`id\`, \`_locale\`, \`_parent_id\`
    FROM \`__backup_pages_v_version_sections_lists_items_locales\`;`)
  await db.run(sql`INSERT OR REPLACE INTO \`pages_sections_lists_items_details\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`value\`)
    SELECT \`_order\`, \`_parent_id\`, \`id\`, \`value\`
    FROM \`__backup_pages_sections_lists_items_details\`;`)
  await db.run(sql`INSERT OR REPLACE INTO \`_pages_v_version_sections_lists_items_details\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`value\`, \`_uuid\`)
    SELECT \`_order\`, \`_parent_id\`, \`id\`, \`value\`, \`_uuid\`
    FROM \`__backup_pages_v_version_sections_lists_items_details\`;`)
  await db.run(sql`DROP TABLE \`__backup_pages_sections_lists_items_locales\`;`)
  await db.run(sql`DROP TABLE \`__backup_pages_v_version_sections_lists_items_locales\`;`)
  await db.run(sql`DROP TABLE \`__backup_pages_sections_lists_items_details\`;`)
  await db.run(sql`DROP TABLE \`__backup_pages_v_version_sections_lists_items_details\`;`)
  await db.run(sql`ALTER TABLE \`pages_sections_lists_items_locales\` DROP COLUMN \`metric\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_version_sections_lists_items_locales\` DROP COLUMN \`metric\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_sections_lists_items\` ADD \`href\` text;`)
  await db.run(sql`ALTER TABLE \`pages_sections_lists_items\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_sections_lists_items\` ADD \`legacy_image_path\` text;`)
  await db.run(sql`CREATE INDEX \`pages_sections_lists_items_image_idx\` ON \`pages_sections_lists_items\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_sections_lists_items_locales\` ADD \`metric\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_version_sections_lists_items\` ADD \`href\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_version_sections_lists_items\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_version_sections_lists_items\` ADD \`legacy_image_path\` text;`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_sections_lists_items_image_idx\` ON \`_pages_v_version_sections_lists_items\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_version_sections_lists_items_locales\` ADD \`metric\` text;`)
}
