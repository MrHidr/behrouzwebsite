import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "careers_retention_days" numeric DEFAULT 365;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_careers_retention_days" numeric DEFAULT 365;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "careers_retention_days";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_careers_retention_days";`)
}
