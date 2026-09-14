import * as migration_20260908_231612_initial_cms from './20260908_231612_initial_cms';
import * as migration_20260909_100445_content_permissions_activity_logs from './20260909_100445_content_permissions_activity_logs';
import * as migration_20260909_102532_site_interface_copy from './20260909_102532_site_interface_copy';
import * as migration_20260909_154331_page_sections from './20260909_154331_page_sections';
import * as migration_20260910_131057_streamline_managed_list_fields from './20260910_131057_streamline_managed_list_fields';
import * as migration_20260911_185403_streamline_footer_contact_fields from './20260911_185403_streamline_footer_contact_fields';
import * as migration_20260914_001500_correct_product_catalog_copy from './20260914_001500_correct_product_catalog_copy';
import * as migration_20260914_001725_add_product_media_display_size from './20260914_001725_add_product_media_display_size';
import * as migration_20260914_041500_add_dijonnaise_squeeze from './20260914_041500_add_dijonnaise_squeeze';
import * as migration_20260914_063228_careers_and_applications from './20260914_063228_careers_and_applications';
import * as migration_20260914_064402_career_retention from './20260914_064402_career_retention';
import * as migration_20260914_074500_complete_dijonnaise_squeeze_placeholders from './20260914_074500_complete_dijonnaise_squeeze_placeholders';

export const migrations = [
  {
    up: migration_20260908_231612_initial_cms.up,
    down: migration_20260908_231612_initial_cms.down,
    name: '20260908_231612_initial_cms',
  },
  {
    up: migration_20260909_100445_content_permissions_activity_logs.up,
    down: migration_20260909_100445_content_permissions_activity_logs.down,
    name: '20260909_100445_content_permissions_activity_logs',
  },
  {
    up: migration_20260909_102532_site_interface_copy.up,
    down: migration_20260909_102532_site_interface_copy.down,
    name: '20260909_102532_site_interface_copy',
  },
  {
    up: migration_20260909_154331_page_sections.up,
    down: migration_20260909_154331_page_sections.down,
    name: '20260909_154331_page_sections',
  },
  {
    up: migration_20260910_131057_streamline_managed_list_fields.up,
    down: migration_20260910_131057_streamline_managed_list_fields.down,
    name: '20260910_131057_streamline_managed_list_fields',
  },
  {
    up: migration_20260911_185403_streamline_footer_contact_fields.up,
    down: migration_20260911_185403_streamline_footer_contact_fields.down,
    name: '20260911_185403_streamline_footer_contact_fields',
  },
  {
    up: migration_20260914_001500_correct_product_catalog_copy.up,
    down: migration_20260914_001500_correct_product_catalog_copy.down,
    name: '20260914_001500_correct_product_catalog_copy',
  },
  {
    up: migration_20260914_001725_add_product_media_display_size.up,
    down: migration_20260914_001725_add_product_media_display_size.down,
    name: '20260914_001725_add_product_media_display_size',
  },
  {
    up: migration_20260914_041500_add_dijonnaise_squeeze.up,
    down: migration_20260914_041500_add_dijonnaise_squeeze.down,
    name: '20260914_041500_add_dijonnaise_squeeze',
  },
  {
    up: migration_20260914_063228_careers_and_applications.up,
    down: migration_20260914_063228_careers_and_applications.down,
    name: '20260914_063228_careers_and_applications',
  },
  {
    up: migration_20260914_064402_career_retention.up,
    down: migration_20260914_064402_career_retention.down,
    name: '20260914_064402_career_retention'
  },
  {
    up: migration_20260914_074500_complete_dijonnaise_squeeze_placeholders.up,
    down: migration_20260914_074500_complete_dijonnaise_squeeze_placeholders.down,
    name: '20260914_074500_complete_dijonnaise_squeeze_placeholders'
  },
];
