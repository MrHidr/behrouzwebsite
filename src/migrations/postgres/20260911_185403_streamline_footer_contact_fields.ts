import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_footer_contacts" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_footer_contacts_type";
  CREATE TYPE "public"."enum_site_settings_footer_contacts_type" AS ENUM('phone', 'fax', 'email');
  ALTER TABLE "site_settings_footer_contacts" ALTER COLUMN "type" SET DATA TYPE "public"."enum_site_settings_footer_contacts_type" USING "type"::"public"."enum_site_settings_footer_contacts_type";
  ALTER TABLE "_site_settings_v_version_footer_contacts" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum__site_settings_v_version_footer_contacts_type";
  CREATE TYPE "public"."enum__site_settings_v_version_footer_contacts_type" AS ENUM('phone', 'fax', 'email');
  ALTER TABLE "_site_settings_v_version_footer_contacts" ALTER COLUMN "type" SET DATA TYPE "public"."enum__site_settings_v_version_footer_contacts_type" USING "type"::"public"."enum__site_settings_v_version_footer_contacts_type";
  ALTER TABLE "site_settings_footer_contacts" DROP COLUMN "href";
  ALTER TABLE "_site_settings_v_version_footer_contacts" DROP COLUMN "href";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_site_settings_footer_contacts_type" ADD VALUE 'link';
  ALTER TYPE "public"."enum__site_settings_v_version_footer_contacts_type" ADD VALUE 'link';
  ALTER TABLE "site_settings_footer_contacts" ADD COLUMN "href" varchar;
  ALTER TABLE "_site_settings_v_version_footer_contacts" ADD COLUMN "href" varchar;`)
}
