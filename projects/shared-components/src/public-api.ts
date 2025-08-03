/*
 * Public API Surface of shared-components
 */

//colors
export * from './lib/tools/colors';
export * from './lib/tools/color-services/color-scheme-sets.service';

//tagging
export * from './lib/tagging/tag.module';
export * from './lib/tagging/tag.interface';
export * from './lib/tagging/test-data';
export * from './lib/tagging/tag.service';
export * from './lib/tagging/item-tagging.service';

export * from './lib/tagging/tag-picker/tag-picker.component';
export * from './lib/tagging/tag-multiple-items/tag-multiple-items.component';

// tools
export * from './lib/tagging/item-filter/item-filter.component';
export * from './lib/tagging/item-sorter/item-sorter.component';
export * from './lib/tagging/preset-manager/preset-manager.component';
export * from './lib/tagging/preset.service';
export * from './lib/tagging/tag-group-presets';

export {
  createPresetTagGroups as createPreset,
  getAvailablePresets as getPresets,
  createSampleItemsForPreset as createSampleItems,
} from './lib/tagging/tag-group-presets';

export {
  tagsFromSimpleData as createTagsFromData,
  quickSetup as quickTagSetup,
  createTag,
  createTags,
  createTagGroup,
  createTaggedItem,
} from './lib/tagging/tag-helpers';

export {
  convertToTagItem,
  convertManyToTagItems,
  autoGenerateTagGroups,
  createTagGroupsFromTags,
  createFlexibleTaggingSetup,
  prepareForDatabase,
  smartCreateTag,
  createQuickTag,
  deduplicateTags,
  type TaggableObject,
  type ConversionConfig,
} from './lib/tagging/flexible-tagging-helpers';

export { FlexibleTaggingDemoComponent } from './lib/tagging/flexible-tagging-demo/flexible-tagging-demo.component';
