import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`UPDATE \`products_locales\` SET \`name\` = 'پوره‌ی فلفل' WHERE \`_locale\` = 'fa' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'chili-sauce');`)
  await db.run(sql`UPDATE \`products_locales\` SET \`name\` = 'Pepper Purée' WHERE \`_locale\` = 'en' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'chili-sauce');`)
  await db.run(sql`UPDATE \`products_variants_locales\` SET \`weight\` = '۲۲۵ گرم' WHERE \`_locale\` = 'fa' AND \`_parent_id\` IN (SELECT v.\`id\` FROM \`products_variants\` v INNER JOIN \`products\` p ON p.\`id\` = v.\`_parent_id\` WHERE p.\`stable_key\` = 'chili-sauce');`)
  await db.run(sql`UPDATE \`products_variants_locales\` SET \`weight\` = '225 g' WHERE \`_locale\` = 'en' AND \`_parent_id\` IN (SELECT v.\`id\` FROM \`products_variants\` v INNER JOIN \`products\` p ON p.\`id\` = v.\`_parent_id\` WHERE p.\`stable_key\` = 'chili-sauce');`)

  await db.run(sql`UPDATE \`products_locales\` SET \`name\` = 'دیجونیز', \`subtitle\` = 'سس دیجونیز (خردل ملایم، بدون کلسترول)' WHERE \`_locale\` = 'fa' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'dijonnaise');`)

  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'رب گوجه فرنگی، سویا، قارچ، فلفل دلمه‌ای، روغن گیاهی، ادویه‌جات، نمک.' WHERE \`_locale\` = 'fa' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'lasagna-sauce');`)
  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'Tomato paste, soy, mushrooms, bell pepper, vegetable oil, spices, salt.' WHERE \`_locale\` = 'en' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'lasagna-sauce');`)

  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'فلفل هالاپینو، سرکه، نمک.' WHERE \`_locale\` = 'fa' AND \`_parent_id\` IN (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` IN ('jalapeno', 'jalapeno-small'));`)
  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'Jalapeño peppers, vinegar, salt.' WHERE \`_locale\` = 'en' AND \`_parent_id\` IN (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` IN ('jalapeno', 'jalapeno-small'));`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`UPDATE \`products_locales\` SET \`name\` = 'چیلی' WHERE \`_locale\` = 'fa' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'chili-sauce');`)
  await db.run(sql`UPDATE \`products_locales\` SET \`name\` = 'Chili' WHERE \`_locale\` = 'en' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'chili-sauce');`)
  await db.run(sql`UPDATE \`products_variants_locales\` SET \`weight\` = '۲۲۰ گرم' WHERE \`_locale\` = 'fa' AND \`_parent_id\` IN (SELECT v.\`id\` FROM \`products_variants\` v INNER JOIN \`products\` p ON p.\`id\` = v.\`_parent_id\` WHERE p.\`stable_key\` = 'chili-sauce');`)
  await db.run(sql`UPDATE \`products_variants_locales\` SET \`weight\` = '220 g' WHERE \`_locale\` = 'en' AND \`_parent_id\` IN (SELECT v.\`id\` FROM \`products_variants\` v INNER JOIN \`products\` p ON p.\`id\` = v.\`_parent_id\` WHERE p.\`stable_key\` = 'chili-sauce');`)

  await db.run(sql`UPDATE \`products_locales\` SET \`name\` = 'دیژونیز', \`subtitle\` = 'سس دیژونیز (خردل ملایم، بدون کلسترول)' WHERE \`_locale\` = 'fa' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'dijonnaise');`)

  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'رب گوجه فرنگی، قارچ، فلفل دلمه‌ای، روغن گیاهی، ادویه‌جات، نمک.' WHERE \`_locale\` = 'fa' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'lasagna-sauce');`)
  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'Tomato paste, mushrooms, bell pepper, vegetable oil, spices, salt.' WHERE \`_locale\` = 'en' AND \`_parent_id\` = (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` = 'lasagna-sauce');`)

  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'فلفل هالاپینو، سرکه، ادویه‌جات، نمک.' WHERE \`_locale\` = 'fa' AND \`_parent_id\` IN (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` IN ('jalapeno', 'jalapeno-small'));`)
  await db.run(sql`UPDATE \`products_locales\` SET \`ingredients\` = 'Jalapeño peppers, vinegar, spices, salt.' WHERE \`_locale\` = 'en' AND \`_parent_id\` IN (SELECT \`id\` FROM \`products\` WHERE \`stable_key\` IN ('jalapeno', 'jalapeno-small'));`)
}
