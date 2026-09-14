import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings_footer_contacts\` DROP COLUMN \`href\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v_version_footer_contacts\` DROP COLUMN \`href\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings_footer_contacts\` ADD \`href\` text;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v_version_footer_contacts\` ADD \`href\` text;`)
}
