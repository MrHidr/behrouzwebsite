import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_media_display_size" AS ENUM('small', 'normal', 'large');
  CREATE TYPE "public"."enum__products_v_version_media_display_size" AS ENUM('small', 'normal', 'large');
  ALTER TABLE "products" ADD COLUMN "media_display_size" "enum_products_media_display_size" DEFAULT 'normal';
  ALTER TABLE "_products_v" ADD COLUMN "version_media_display_size" "enum__products_v_version_media_display_size" DEFAULT 'normal';
  UPDATE "products" SET "media_display_size" = 'small' WHERE "stable_key" = 'tomato-ketchup';
  UPDATE "products" SET "media_display_size" = 'large' WHERE "stable_key" = 'tomato-ketchup-large';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "media_display_size";
  ALTER TABLE "_products_v" DROP COLUMN "version_media_display_size";
  DROP TYPE "public"."enum_products_media_display_size";
  DROP TYPE "public"."enum__products_v_version_media_display_size";`)
}
