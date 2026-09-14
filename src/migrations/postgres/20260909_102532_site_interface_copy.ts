import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_interface_copy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar
  );
  
  CREATE TABLE "site_settings_interface_copy_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_site_settings_v_version_interface_copy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_interface_copy_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings_interface_copy" ADD CONSTRAINT "site_settings_interface_copy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_interface_copy_locales" ADD CONSTRAINT "site_settings_interface_copy_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_interface_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_interface_copy" ADD CONSTRAINT "_site_settings_v_version_interface_copy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_interface_copy_locales" ADD CONSTRAINT "_site_settings_v_version_interface_copy_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_interface_copy"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_interface_copy_order_idx" ON "site_settings_interface_copy" USING btree ("_order");
  CREATE INDEX "site_settings_interface_copy_parent_id_idx" ON "site_settings_interface_copy" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_interface_copy_locales_locale_parent_id_unique" ON "site_settings_interface_copy_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_interface_copy_order_idx" ON "_site_settings_v_version_interface_copy" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_interface_copy_parent_id_idx" ON "_site_settings_v_version_interface_copy" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_settings_v_version_interface_copy_locales_locale_paren" ON "_site_settings_v_version_interface_copy_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_interface_copy" CASCADE;
  DROP TABLE "site_settings_interface_copy_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_interface_copy" CASCADE;
  DROP TABLE "_site_settings_v_version_interface_copy_locales" CASCADE;`)
}
