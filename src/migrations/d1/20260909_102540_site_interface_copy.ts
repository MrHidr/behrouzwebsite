import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_interface_copy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_interface_copy_order_idx\` ON \`site_settings_interface_copy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_interface_copy_parent_id_idx\` ON \`site_settings_interface_copy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_interface_copy_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_interface_copy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_interface_copy_locales_locale_parent_id_unique\` ON \`site_settings_interface_copy_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_interface_copy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`source_key\` text,
  	\`admin_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_interface_copy_order_idx\` ON \`_site_settings_v_version_interface_copy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_interface_copy_parent_id_idx\` ON \`_site_settings_v_version_interface_copy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_interface_copy_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v_version_interface_copy\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_site_settings_v_version_interface_copy_locales_locale_paren\` ON \`_site_settings_v_version_interface_copy_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_interface_copy\`;`)
  await db.run(sql`DROP TABLE \`site_settings_interface_copy_locales\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_interface_copy\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_interface_copy_locales\`;`)
}
