import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products\` ADD \`media_display_size\` text DEFAULT 'normal';`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_media_display_size\` text DEFAULT 'normal';`)
  await db.run(sql`UPDATE \`products\` SET \`media_display_size\` = 'small' WHERE \`stable_key\` = 'tomato-ketchup';`)
  await db.run(sql`UPDATE \`products\` SET \`media_display_size\` = 'large' WHERE \`stable_key\` = 'tomato-ketchup-large';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`media_display_size\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_media_display_size\`;`)
}
