import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_activity_logs_action" AS ENUM('create', 'update', 'delete', 'update-global');
  CREATE TABLE "activity_logs_changed_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL
  );
  
  CREATE TABLE "activity_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"actor_id" integer,
  	"actor_email" varchar NOT NULL,
  	"action" "enum_activity_logs_action" NOT NULL,
  	"entity_label" varchar NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"document_i_d" varchar,
  	"document_title" varchar NOT NULL,
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_copy_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar
  );
  
  CREATE TABLE "pages_copy_blocks_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_image_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"admin_label" varchar,
  	"replacement_id" integer,
  	"source_path" varchar
  );
  
  CREATE TABLE "pages_value_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "_pages_v_version_copy_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_copy_blocks_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_image_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"admin_label" varchar,
  	"replacement_id" integer,
  	"source_path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_value_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"admin_label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
  ALTER TABLE "users" ADD COLUMN "permissions_manage_admins" boolean;
  ALTER TABLE "users" ADD COLUMN "permissions_manage_products" boolean;
  ALTER TABLE "users" ADD COLUMN "permissions_manage_site_content" boolean;
  ALTER TABLE "users" ADD COLUMN "permissions_manage_site_settings" boolean;
  ALTER TABLE "users" ADD COLUMN "permissions_manage_media" boolean;
  ALTER TABLE "users" ADD COLUMN "permissions_publish_content" boolean;
  ALTER TABLE "users" ADD COLUMN "permissions_view_activity_log" boolean;
  UPDATE "users" SET
    "permissions_manage_admins" = CASE WHEN "role" = 'super-admin' THEN true ELSE false END,
    "permissions_manage_products" = CASE WHEN "role" IN ('super-admin', 'publisher', 'editor') THEN true ELSE false END,
    "permissions_manage_site_content" = CASE WHEN "role" IN ('super-admin', 'publisher', 'editor') THEN true ELSE false END,
    "permissions_manage_site_settings" = CASE WHEN "role" IN ('super-admin', 'publisher') THEN true ELSE false END,
    "permissions_manage_media" = true,
    "permissions_publish_content" = CASE WHEN "role" IN ('super-admin', 'publisher') THEN true ELSE false END,
    "permissions_view_activity_log" = CASE WHEN "role" IN ('super-admin', 'publisher') THEN true ELSE false END;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "activity_logs_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "audit_retention_days" numeric DEFAULT 180;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_audit_retention_days" numeric DEFAULT 180;
  ALTER TABLE "activity_logs_changed_fields" ADD CONSTRAINT "activity_logs_changed_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activity_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_copy_blocks" ADD CONSTRAINT "pages_copy_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_copy_blocks_locales" ADD CONSTRAINT "pages_copy_blocks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_copy_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_image_overrides" ADD CONSTRAINT "pages_image_overrides_replacement_id_media_id_fk" FOREIGN KEY ("replacement_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_image_overrides" ADD CONSTRAINT "pages_image_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_value_overrides" ADD CONSTRAINT "pages_value_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_copy_blocks" ADD CONSTRAINT "_pages_v_version_copy_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_copy_blocks_locales" ADD CONSTRAINT "_pages_v_version_copy_blocks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_copy_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_image_overrides" ADD CONSTRAINT "_pages_v_version_image_overrides_replacement_id_media_id_fk" FOREIGN KEY ("replacement_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_image_overrides" ADD CONSTRAINT "_pages_v_version_image_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_value_overrides" ADD CONSTRAINT "_pages_v_version_value_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "activity_logs_changed_fields_order_idx" ON "activity_logs_changed_fields" USING btree ("_order");
  CREATE INDEX "activity_logs_changed_fields_parent_id_idx" ON "activity_logs_changed_fields" USING btree ("_parent_id");
  CREATE INDEX "activity_logs_actor_idx" ON "activity_logs" USING btree ("actor_id");
  CREATE INDEX "activity_logs_actor_email_idx" ON "activity_logs" USING btree ("actor_email");
  CREATE INDEX "activity_logs_action_idx" ON "activity_logs" USING btree ("action");
  CREATE INDEX "activity_logs_entity_label_idx" ON "activity_logs" USING btree ("entity_label");
  CREATE INDEX "activity_logs_entity_slug_idx" ON "activity_logs" USING btree ("entity_slug");
  CREATE INDEX "activity_logs_updated_at_idx" ON "activity_logs" USING btree ("updated_at");
  CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs" USING btree ("created_at");
  CREATE INDEX "pages_copy_blocks_order_idx" ON "pages_copy_blocks" USING btree ("_order");
  CREATE INDEX "pages_copy_blocks_parent_id_idx" ON "pages_copy_blocks" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_copy_blocks_locales_locale_parent_id_unique" ON "pages_copy_blocks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_image_overrides_order_idx" ON "pages_image_overrides" USING btree ("_order");
  CREATE INDEX "pages_image_overrides_parent_id_idx" ON "pages_image_overrides" USING btree ("_parent_id");
  CREATE INDEX "pages_image_overrides_replacement_idx" ON "pages_image_overrides" USING btree ("replacement_id");
  CREATE INDEX "pages_value_overrides_order_idx" ON "pages_value_overrides" USING btree ("_order");
  CREATE INDEX "pages_value_overrides_parent_id_idx" ON "pages_value_overrides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_copy_blocks_order_idx" ON "_pages_v_version_copy_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_version_copy_blocks_parent_id_idx" ON "_pages_v_version_copy_blocks" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_copy_blocks_locales_locale_parent_id_unique" ON "_pages_v_version_copy_blocks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_image_overrides_order_idx" ON "_pages_v_version_image_overrides" USING btree ("_order");
  CREATE INDEX "_pages_v_version_image_overrides_parent_id_idx" ON "_pages_v_version_image_overrides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_image_overrides_replacement_idx" ON "_pages_v_version_image_overrides" USING btree ("replacement_id");
  CREATE INDEX "_pages_v_version_value_overrides_order_idx" ON "_pages_v_version_value_overrides" USING btree ("_order");
  CREATE INDEX "_pages_v_version_value_overrides_parent_id_idx" ON "_pages_v_version_value_overrides" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activity_logs_fk" FOREIGN KEY ("activity_logs_id") REFERENCES "public"."activity_logs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_activity_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("activity_logs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "activity_logs_changed_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activity_logs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_copy_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_copy_blocks_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_image_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_value_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_copy_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_copy_blocks_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_image_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_value_overrides" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "activity_logs_changed_fields" CASCADE;
  DROP TABLE "activity_logs" CASCADE;
  DROP TABLE "pages_copy_blocks" CASCADE;
  DROP TABLE "pages_copy_blocks_locales" CASCADE;
  DROP TABLE "pages_image_overrides" CASCADE;
  DROP TABLE "pages_value_overrides" CASCADE;
  DROP TABLE "_pages_v_version_copy_blocks" CASCADE;
  DROP TABLE "_pages_v_version_copy_blocks_locales" CASCADE;
  DROP TABLE "_pages_v_version_image_overrides" CASCADE;
  DROP TABLE "_pages_v_version_value_overrides" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_activity_logs_fk";
  
  DROP INDEX "payload_locked_documents_rels_activity_logs_id_idx";
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor';
  ALTER TABLE "users" DROP COLUMN "permissions_manage_admins";
  ALTER TABLE "users" DROP COLUMN "permissions_manage_products";
  ALTER TABLE "users" DROP COLUMN "permissions_manage_site_content";
  ALTER TABLE "users" DROP COLUMN "permissions_manage_site_settings";
  ALTER TABLE "users" DROP COLUMN "permissions_manage_media";
  ALTER TABLE "users" DROP COLUMN "permissions_publish_content";
  ALTER TABLE "users" DROP COLUMN "permissions_view_activity_log";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "activity_logs_id";
  ALTER TABLE "site_settings" DROP COLUMN "audit_retention_days";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_audit_retention_days";
  DROP TYPE "public"."enum_activity_logs_action";`)
}
