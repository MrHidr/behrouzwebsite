import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_sections_copy_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar
  );
  
  CREATE TABLE "pages_sections_copy_blocks_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_sections_image_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"admin_label" varchar,
  	"replacement_id" integer,
  	"source_path" varchar
  );
  
  CREATE TABLE "pages_sections_value_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_sections_lists_items_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "pages_sections_lists_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_key" varchar,
  	"admin_label" varchar,
  	"enabled" boolean DEFAULT true,
  	"value" varchar,
  	"secondary_value" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"href" varchar,
  	"color" varchar,
  	"image_id" integer,
  	"legacy_image_path" varchar
  );
  
  CREATE TABLE "pages_sections_lists_items_locales" (
  	"title" varchar,
  	"eyebrow" varchar,
  	"subtitle" varchar,
  	"text" varchar,
  	"metric" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_sections_lists" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"list_key" varchar,
  	"admin_label" varchar
  );
  
  CREATE TABLE "pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_key" varchar,
  	"locked" boolean DEFAULT false,
  	"admin_label" varchar,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "_pages_v_version_sections_copy_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections_copy_blocks_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_sections_image_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"admin_label" varchar,
  	"replacement_id" integer,
  	"source_path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections_value_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections_lists_items_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections_lists_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_key" varchar,
  	"admin_label" varchar,
  	"enabled" boolean DEFAULT true,
  	"value" varchar,
  	"secondary_value" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"href" varchar,
  	"color" varchar,
  	"image_id" integer,
  	"legacy_image_path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections_lists_items_locales" (
  	"title" varchar,
  	"eyebrow" varchar,
  	"subtitle" varchar,
  	"text" varchar,
  	"metric" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_sections_lists" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"list_key" varchar,
  	"admin_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_key" varchar,
  	"locked" boolean DEFAULT false,
  	"admin_label" varchar,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_sections_copy_blocks" ADD CONSTRAINT "pages_sections_copy_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_copy_blocks_locales" ADD CONSTRAINT "pages_sections_copy_blocks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections_copy_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_image_overrides" ADD CONSTRAINT "pages_sections_image_overrides_replacement_id_media_id_fk" FOREIGN KEY ("replacement_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_sections_image_overrides" ADD CONSTRAINT "pages_sections_image_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_value_overrides" ADD CONSTRAINT "pages_sections_value_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_lists_items_details" ADD CONSTRAINT "pages_sections_lists_items_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections_lists_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_lists_items" ADD CONSTRAINT "pages_sections_lists_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_sections_lists_items" ADD CONSTRAINT "pages_sections_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_lists_items_locales" ADD CONSTRAINT "pages_sections_lists_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections_lists_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections_lists" ADD CONSTRAINT "pages_sections_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_copy_blocks" ADD CONSTRAINT "_pages_v_version_sections_copy_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_copy_blocks_locales" ADD CONSTRAINT "_pages_v_version_sections_copy_blocks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections_copy_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_image_overrides" ADD CONSTRAINT "_pages_v_version_sections_image_overrides_replacement_id_media_id_fk" FOREIGN KEY ("replacement_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_image_overrides" ADD CONSTRAINT "_pages_v_version_sections_image_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_value_overrides" ADD CONSTRAINT "_pages_v_version_sections_value_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_lists_items_details" ADD CONSTRAINT "_pages_v_version_sections_lists_items_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections_lists_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_lists_items" ADD CONSTRAINT "_pages_v_version_sections_lists_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_lists_items" ADD CONSTRAINT "_pages_v_version_sections_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_lists_items_locales" ADD CONSTRAINT "_pages_v_version_sections_lists_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections_lists_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections_lists" ADD CONSTRAINT "_pages_v_version_sections_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_sections" ADD CONSTRAINT "_pages_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_sections_copy_blocks_order_idx" ON "pages_sections_copy_blocks" USING btree ("_order");
  CREATE INDEX "pages_sections_copy_blocks_parent_id_idx" ON "pages_sections_copy_blocks" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_sections_copy_blocks_locales_locale_parent_id_unique" ON "pages_sections_copy_blocks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_sections_image_overrides_order_idx" ON "pages_sections_image_overrides" USING btree ("_order");
  CREATE INDEX "pages_sections_image_overrides_parent_id_idx" ON "pages_sections_image_overrides" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_image_overrides_replacement_idx" ON "pages_sections_image_overrides" USING btree ("replacement_id");
  CREATE INDEX "pages_sections_value_overrides_order_idx" ON "pages_sections_value_overrides" USING btree ("_order");
  CREATE INDEX "pages_sections_value_overrides_parent_id_idx" ON "pages_sections_value_overrides" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_lists_items_details_order_idx" ON "pages_sections_lists_items_details" USING btree ("_order");
  CREATE INDEX "pages_sections_lists_items_details_parent_id_idx" ON "pages_sections_lists_items_details" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_lists_items_order_idx" ON "pages_sections_lists_items" USING btree ("_order");
  CREATE INDEX "pages_sections_lists_items_parent_id_idx" ON "pages_sections_lists_items" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_lists_items_image_idx" ON "pages_sections_lists_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_sections_lists_items_locales_locale_parent_id_unique" ON "pages_sections_lists_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_sections_lists_order_idx" ON "pages_sections_lists" USING btree ("_order");
  CREATE INDEX "pages_sections_lists_parent_id_idx" ON "pages_sections_lists" USING btree ("_parent_id");
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_copy_blocks_order_idx" ON "_pages_v_version_sections_copy_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_copy_blocks_parent_id_idx" ON "_pages_v_version_sections_copy_blocks" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_sections_copy_blocks_locales_locale_parent_" ON "_pages_v_version_sections_copy_blocks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_sections_image_overrides_order_idx" ON "_pages_v_version_sections_image_overrides" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_image_overrides_parent_id_idx" ON "_pages_v_version_sections_image_overrides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_image_overrides_replacement_idx" ON "_pages_v_version_sections_image_overrides" USING btree ("replacement_id");
  CREATE INDEX "_pages_v_version_sections_value_overrides_order_idx" ON "_pages_v_version_sections_value_overrides" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_value_overrides_parent_id_idx" ON "_pages_v_version_sections_value_overrides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_lists_items_details_order_idx" ON "_pages_v_version_sections_lists_items_details" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_lists_items_details_parent_id_idx" ON "_pages_v_version_sections_lists_items_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_lists_items_order_idx" ON "_pages_v_version_sections_lists_items" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_lists_items_parent_id_idx" ON "_pages_v_version_sections_lists_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_lists_items_image_idx" ON "_pages_v_version_sections_lists_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_version_sections_lists_items_locales_locale_parent_" ON "_pages_v_version_sections_lists_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_sections_lists_order_idx" ON "_pages_v_version_sections_lists" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_lists_parent_id_idx" ON "_pages_v_version_sections_lists" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_sections_order_idx" ON "_pages_v_version_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_version_sections_parent_id_idx" ON "_pages_v_version_sections" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_sections_copy_blocks" CASCADE;
  DROP TABLE "pages_sections_copy_blocks_locales" CASCADE;
  DROP TABLE "pages_sections_image_overrides" CASCADE;
  DROP TABLE "pages_sections_value_overrides" CASCADE;
  DROP TABLE "pages_sections_lists_items_details" CASCADE;
  DROP TABLE "pages_sections_lists_items" CASCADE;
  DROP TABLE "pages_sections_lists_items_locales" CASCADE;
  DROP TABLE "pages_sections_lists" CASCADE;
  DROP TABLE "pages_sections" CASCADE;
  DROP TABLE "_pages_v_version_sections_copy_blocks" CASCADE;
  DROP TABLE "_pages_v_version_sections_copy_blocks_locales" CASCADE;
  DROP TABLE "_pages_v_version_sections_image_overrides" CASCADE;
  DROP TABLE "_pages_v_version_sections_value_overrides" CASCADE;
  DROP TABLE "_pages_v_version_sections_lists_items_details" CASCADE;
  DROP TABLE "_pages_v_version_sections_lists_items" CASCADE;
  DROP TABLE "_pages_v_version_sections_lists_items_locales" CASCADE;
  DROP TABLE "_pages_v_version_sections_lists" CASCADE;
  DROP TABLE "_pages_v_version_sections" CASCADE;`)
}
