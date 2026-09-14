import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`careers_retention_days\` numeric DEFAULT 365;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_careers_retention_days\` numeric DEFAULT 365;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`careers_retention_days\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_careers_retention_days\`;`)
}
