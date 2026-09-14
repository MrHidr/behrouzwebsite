import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_career_applications_status" AS ENUM('new', 'reviewing', 'contacted', 'closed');
  CREATE TYPE "public"."enum_career_applications_locale" AS ENUM('fa', 'en');
  CREATE TYPE "public"."enum_site_settings_careers_allowed_file_types" AS ENUM('pdf', 'doc', 'docx');
  CREATE TYPE "public"."enum__site_settings_v_version_careers_allowed_file_types" AS ENUM('pdf', 'doc', 'docx');
  ALTER TYPE "public"."enum_pages_slug" ADD VALUE 'careers';
  ALTER TYPE "public"."enum__pages_v_version_slug" ADD VALUE 'careers';
  CREATE TABLE "career_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"status" "enum_career_applications_status" DEFAULT 'new' NOT NULL,
  	"locale" "enum_career_applications_locale" DEFAULT 'fa' NOT NULL,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "career_applications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"resume_files_id" integer
  );
  
  CREATE TABLE "resume_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"original_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  CREATE TABLE "site_settings_careers_allowed_file_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_careers_allowed_file_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_site_settings_v_version_careers_allowed_file_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__site_settings_v_version_careers_allowed_file_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "permissions_manage_career_applications" boolean;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "career_applications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resume_files_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "careers_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "careers_max_files" numeric DEFAULT 3;
  ALTER TABLE "site_settings" ADD COLUMN "careers_max_file_size_m_b" numeric DEFAULT 10;
  ALTER TABLE "site_settings" ADD COLUMN "careers_max_total_size_m_b" numeric DEFAULT 20;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_careers_enabled" boolean DEFAULT true;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_careers_max_files" numeric DEFAULT 3;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_careers_max_file_size_m_b" numeric DEFAULT 10;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_careers_max_total_size_m_b" numeric DEFAULT 20;
  ALTER TABLE "career_applications_rels" ADD CONSTRAINT "career_applications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."career_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_applications_rels" ADD CONSTRAINT "career_applications_rels_resume_files_fk" FOREIGN KEY ("resume_files_id") REFERENCES "public"."resume_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_careers_allowed_file_types" ADD CONSTRAINT "site_settings_careers_allowed_file_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_careers_allowed_file_types" ADD CONSTRAINT "_site_settings_v_version_careers_allowed_file_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "career_applications_status_idx" ON "career_applications" USING btree ("status");
  CREATE INDEX "career_applications_updated_at_idx" ON "career_applications" USING btree ("updated_at");
  CREATE INDEX "career_applications_created_at_idx" ON "career_applications" USING btree ("created_at");
  CREATE INDEX "career_applications_rels_order_idx" ON "career_applications_rels" USING btree ("order");
  CREATE INDEX "career_applications_rels_parent_idx" ON "career_applications_rels" USING btree ("parent_id");
  CREATE INDEX "career_applications_rels_path_idx" ON "career_applications_rels" USING btree ("path");
  CREATE INDEX "career_applications_rels_resume_files_id_idx" ON "career_applications_rels" USING btree ("resume_files_id");
  CREATE INDEX "resume_files_updated_at_idx" ON "resume_files" USING btree ("updated_at");
  CREATE INDEX "resume_files_created_at_idx" ON "resume_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "resume_files_filename_idx" ON "resume_files" USING btree ("filename");
  CREATE INDEX "site_settings_careers_allowed_file_types_order_idx" ON "site_settings_careers_allowed_file_types" USING btree ("order");
  CREATE INDEX "site_settings_careers_allowed_file_types_parent_idx" ON "site_settings_careers_allowed_file_types" USING btree ("parent_id");
  CREATE INDEX "_site_settings_v_version_careers_allowed_file_types_order_idx" ON "_site_settings_v_version_careers_allowed_file_types" USING btree ("order");
  CREATE INDEX "_site_settings_v_version_careers_allowed_file_types_parent_idx" ON "_site_settings_v_version_careers_allowed_file_types" USING btree ("parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_career_applications_fk" FOREIGN KEY ("career_applications_id") REFERENCES "public"."career_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resume_files_fk" FOREIGN KEY ("resume_files_id") REFERENCES "public"."resume_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_career_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("career_applications_id");
  CREATE INDEX "payload_locked_documents_rels_resume_files_id_idx" ON "payload_locked_documents_rels" USING btree ("resume_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "career_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_applications_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resume_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_careers_allowed_file_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_careers_allowed_file_types" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "career_applications" CASCADE;
  DROP TABLE "career_applications_rels" CASCADE;
  DROP TABLE "resume_files" CASCADE;
  DROP TABLE "site_settings_careers_allowed_file_types" CASCADE;
  DROP TABLE "_site_settings_v_version_careers_allowed_file_types" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_career_applications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resume_files_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_slug";
  CREATE TYPE "public"."enum_pages_slug" AS ENUM('home', 'about', 'innovation', 'production', 'distribution', 'contact');
  ALTER TABLE "pages" ALTER COLUMN "slug" SET DATA TYPE "public"."enum_pages_slug" USING "slug"::"public"."enum_pages_slug";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_version_slug";
  CREATE TYPE "public"."enum__pages_v_version_slug" AS ENUM('home', 'about', 'innovation', 'production', 'distribution', 'contact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug" SET DATA TYPE "public"."enum__pages_v_version_slug" USING "version_slug"::"public"."enum__pages_v_version_slug";
  DROP INDEX "payload_locked_documents_rels_career_applications_id_idx";
  DROP INDEX "payload_locked_documents_rels_resume_files_id_idx";
  ALTER TABLE "users" DROP COLUMN "permissions_manage_career_applications";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "career_applications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resume_files_id";
  ALTER TABLE "site_settings" DROP COLUMN "careers_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "careers_max_files";
  ALTER TABLE "site_settings" DROP COLUMN "careers_max_file_size_m_b";
  ALTER TABLE "site_settings" DROP COLUMN "careers_max_total_size_m_b";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_careers_enabled";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_careers_max_files";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_careers_max_file_size_m_b";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_careers_max_total_size_m_b";
  DROP TYPE "public"."enum_career_applications_status";
  DROP TYPE "public"."enum_career_applications_locale";
  DROP TYPE "public"."enum_site_settings_careers_allowed_file_types";
  DROP TYPE "public"."enum__site_settings_v_version_careers_allowed_file_types";`)
}
