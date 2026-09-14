import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_sections_lists_items" DROP CONSTRAINT "pages_sections_lists_items_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_version_sections_lists_items" DROP CONSTRAINT "_pages_v_version_sections_lists_items_image_id_media_id_fk";
  
  DROP INDEX "pages_sections_lists_items_image_idx";
  DROP INDEX "_pages_v_version_sections_lists_items_image_idx";
  ALTER TABLE "pages_sections_lists_items" DROP COLUMN "href";
  ALTER TABLE "pages_sections_lists_items" DROP COLUMN "image_id";
  ALTER TABLE "pages_sections_lists_items" DROP COLUMN "legacy_image_path";
  ALTER TABLE "pages_sections_lists_items_locales" DROP COLUMN "metric";
  ALTER TABLE "_pages_v_version_sections_lists_items" DROP COLUMN "href";
  ALTER TABLE "_pages_v_version_sections_lists_items" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_version_sections_lists_items" DROP COLUMN "legacy_image_path";
  ALTER TABLE "_pages_v_version_sections_lists_items_locales" DROP COLUMN "metric";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_sections_lists_items" ADD COLUMN "href" varchar;
  ALTER TABLE "pages_sections_lists_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_sections_lists_items" ADD COLUMN "legacy_image_path" varchar;
  ALTER TABLE "pages_sections_lists_items_locales" ADD COLUMN "metric" varchar;
  ALTER TABLE "_pages_v_version_sections_lists_items" ADD COLUMN "href" varchar;
  ALTER TABLE "_pages_v_version_sections_lists_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_version_sections_lists_items" ADD COLUMN "legacy_image_path" varchar;
  ALTER TABLE "_pages_v_version_sections_lists_items_locales" ADD COLUMN "metric" varchar;
  ALTER TABLE "pages_sections_lists_items" ADD CONSTRAINT "pages_sections_lists_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_lists_items" ADD CONSTRAINT "_pages_v_version_sections_lists_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_sections_lists_items_image_idx" ON "pages_sections_lists_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_sections_lists_items_image_idx" ON "_pages_v_version_sections_lists_items" USING btree ("image_id");`)
}
