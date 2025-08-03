// flexible-tagging-helpers.ts
import { Tag, TagGroup, TagItem } from './tag.interface';

/**
 * Interface for any object that can be tagged.
 * Requires at minimum an id and some identifying property (name, title, etc.)
 */
export interface TaggableObject {
  id: string;
  [key: string]: any; // Allow any additional properties
}

/**
 * Configuration for converting objects to TagItems
 */
export interface ConversionConfig {
  /** Property to use for the TagItem name (default: 'name') */
  nameProperty?: string;
  /** Property to use for the TagItem id (default: 'id') */
  idProperty?: string;
  /** Existing tags to preserve (default: []) */
  existingTagsProperty?: string;
}

/**
 * Convert any object with id and name-like properties to TagItem
 * @param obj - Object to convert
 * @param config - Configuration for conversion
 * @returns TagItem compatible object
 * 
 * @example
 * ```typescript
 * const user = { id: '1', username: 'john', email: 'john@example.com' };
 * const tagItem = convertToTagItem(user, { nameProperty: 'username' });
 * // Result: { id: '1', name: 'john', tags: [] }
 * 
 * const task = { taskId: '1', title: 'Fix bug', status: 'todo', existingTags: [someTag] };
 * const tagItem = convertToTagItem(task, { 
 *   idProperty: 'taskId', 
 *   nameProperty: 'title',
 *   existingTagsProperty: 'existingTags'
 * });
 * ```
 */
export function convertToTagItem(
  obj: TaggableObject, 
  config: ConversionConfig = {}
): TagItem {
  const {
    nameProperty = 'name',
    idProperty = 'id',
    existingTagsProperty = 'tags'
  } = config;

  const id = obj[idProperty] || obj['id'];
  const name = obj[nameProperty] || obj['name'] || obj['title'] || obj['label'] || `Item ${id}`;
  const existingTags = obj[existingTagsProperty] || [];

  if (!id) {
    throw new Error('Object must have an id property or specified idProperty');
  }

  return {
    id: String(id),
    name: String(name),
    tags: Array.isArray(existingTags) ? [...existingTags] : []
  };
}

/**
 * Convert multiple objects to TagItems
 * @param objects - Array of objects to convert
 * @param config - Configuration for conversion
 * @returns Array of TagItem objects
 */
export function convertManyToTagItems(
  objects: TaggableObject[],
  config: ConversionConfig = {}
): TagItem[] {
  return objects.map(obj => convertToTagItem(obj, config));
}

/**
 * Extract unique tags from a collection of TagItems and auto-generate tag groups
 * @param items - TagItems to analyze
 * @param groupNameMap - Optional mapping of group ids to display names
 * @returns Array of TagGroup objects
 * 
 * @example
 * ```typescript
 * const items = [
 *   { id: '1', name: 'Task 1', tags: [{ id: 'urgent', group: 'priority', name: 'Urgent' }] },
 *   { id: '2', name: 'Task 2', tags: [{ id: 'low', group: 'priority', name: 'Low' }] }
 * ];
 * const groups = autoGenerateTagGroups(items, { priority: 'Task Priority' });
 * // Result: [{ id: 'priority', name: 'Task Priority', tags: [urgent, low] }]
 * ```
 */
export function autoGenerateTagGroups(
  items: TagItem[], 
  groupNameMap: Record<string, string> = {}
): TagGroup[] {
  const tagsByGroup = new Map<string, Map<string, Tag>>();

  // Collect all unique tags grouped by their group property
  items.forEach(item => {
    item.tags.forEach(tag => {
      if (!tagsByGroup.has(tag.group)) {
        tagsByGroup.set(tag.group, new Map());
      }
      tagsByGroup.get(tag.group)!.set(tag.id, tag);
    });
  });

  // Convert to TagGroup array
  return Array.from(tagsByGroup.entries()).map(([groupId, tagsMap]) => ({
    id: groupId,
    name: groupNameMap[groupId] || toTitleCase(groupId),
    tags: Array.from(tagsMap.values())
  }));
}

/**
 * Auto-generate tag groups from plain arrays of strings, with automatic group creation
 * @param tags - Array of tag strings or existing Tag objects
 * @param defaultGroupId - Group ID to use if tags don't have groups (default: 'general')
 * @param defaultGroupName - Display name for the default group
 * @returns TagGroup array
 * 
 * @example
 * ```typescript
 * const tags = ['urgent', 'bug', 'feature'];
 * const groups = createTagGroupsFromTags(tags, 'category', 'Categories');
 * // Creates a single group with all tags
 * 
 * const mixedTags = [
 *   { id: 'red', group: 'colors', name: 'Red' },
 *   'urgent', // Will be put in default group
 *   'bug'
 * ];
 * const groups = createTagGroupsFromTags(mixedTags);
 * ```
 */
export function createTagGroupsFromTags(
  tags: (string | Tag)[],
  defaultGroupId: string = 'general',
  defaultGroupName?: string
): TagGroup[] {
  const tagsByGroup = new Map<string, Tag[]>();

  tags.forEach((tag, index) => {
    let normalizedTag: Tag;
    
    if (typeof tag === 'string') {
      // Convert string to Tag with default group
      normalizedTag = {
        id: `${defaultGroupId}-${tag.toLowerCase().replace(/\s+/g, '-')}`,
        name: tag,
        group: defaultGroupId
      };
    } else {
      normalizedTag = tag;
    }

    const groupId = normalizedTag.group;
    if (!tagsByGroup.has(groupId)) {
      tagsByGroup.set(groupId, []);
    }
    
    // Check for duplicates within the group
    const existingTags = tagsByGroup.get(groupId)!;
    const isDuplicate = existingTags.some(existingTag => 
      existingTag.id === normalizedTag.id || existingTag.name === normalizedTag.name
    );
    
    if (!isDuplicate) {
      existingTags.push(normalizedTag);
    }
  });

  // Convert to TagGroup array
  return Array.from(tagsByGroup.entries()).map(([groupId, groupTags]) => ({
    id: groupId,
    name: groupId === defaultGroupId 
      ? (defaultGroupName || toTitleCase(defaultGroupId))
      : toTitleCase(groupId),
    tags: groupTags
  }));
}

/**
 * Deduplicate tags across multiple arrays/sources
 * @param tagArrays - Multiple arrays of tags to deduplicate
 * @returns Single array of unique tags
 */
export function deduplicateTags(...tagArrays: Tag[][]): Tag[] {
  const uniqueTags = new Map<string, Tag>();
  
  tagArrays.flat().forEach(tag => {
    uniqueTags.set(tag.id, tag);
  });
  
  return Array.from(uniqueTags.values());
}

/**
 * Create a complete tagging setup from any objects
 * @param objects - Objects to convert to TagItems
 * @param conversionConfig - How to convert objects
 * @param existingTags - Additional tags to include in tag groups
 * @param groupNameMap - Custom names for tag groups
 * @returns Complete setup with items and tagGroups
 * 
 * @example
 * ```typescript
 * const users = [
 *   { userId: '1', username: 'john', role: 'admin', department: 'engineering' },
 *   { userId: '2', username: 'jane', role: 'user', department: 'design' }
 * ];
 * 
 * const additionalTags = [
 *   { id: 'active', group: 'status', name: 'Active' },
 *   { id: 'inactive', group: 'status', name: 'Inactive' }
 * ];
 * 
 * const setup = createFlexibleTaggingSetup(
 *   users,
 *   { idProperty: 'userId', nameProperty: 'username' },
 *   additionalTags,
 *   { status: 'User Status', general: 'General Tags' }
 * );
 * ```
 */
export function createFlexibleTaggingSetup(
  objects: TaggableObject[],
  conversionConfig: ConversionConfig = {},
  existingTags: Tag[] = [],
  groupNameMap: Record<string, string> = {}
): { items: TagItem[], tagGroups: TagGroup[] } {
  // Convert objects to TagItems
  const items = convertManyToTagItems(objects, conversionConfig);
  
  // Get all tags from items plus any additional tags
  const allTagsFromItems = items.flatMap(item => item.tags);
  const allTags = deduplicateTags(allTagsFromItems, existingTags);
  
  // Auto-generate tag groups, including from additional tags
  let tagGroups: TagGroup[] = [];
  
  if (allTags.length > 0) {
    tagGroups = autoGenerateTagGroups(items, groupNameMap);
    
    // Add any additional tags that weren't in items
    const additionalTagGroups = createTagGroupsFromTags(existingTags);
    
    // Merge additional tag groups with existing ones
    additionalTagGroups.forEach(additionalGroup => {
      const existingGroup = tagGroups.find(g => g.id === additionalGroup.id);
      if (existingGroup) {
        // Merge tags, avoiding duplicates
        const existingTagIds = new Set(existingGroup.tags.map(t => t.id));
        additionalGroup.tags.forEach(tag => {
          if (!existingTagIds.has(tag.id)) {
            existingGroup.tags.push(tag);
          }
        });
      } else {
        tagGroups.push(additionalGroup);
      }
    });
  } else if (existingTags.length > 0) {
    // If no tags in items but we have additional tags, use those
    tagGroups = createTagGroupsFromTags(existingTags, 'general', 'General');
  }
  
  return { items, tagGroups };
}

/**
 * Prepare tagged items for database storage
 * @param items - Tagged items
 * @param includeMetadata - Whether to include tagging metadata
 * @returns Array ready for database persistence
 * 
 * @example
 * ```typescript
 * const dbItems = prepareForDatabase(taggedItems, true);
 * // Each item will have: originalData, tags, taggedAt, tagCount, etc.
 * 
 * // Save to your database
 * await myDatabase.saveMany(dbItems);
 * ```
 */
export function prepareForDatabase<T extends TagItem = TagItem>(
  items: T[],
  includeMetadata: boolean = true
): Array<T & { taggedAt?: Date; tagCount?: number; tagsByGroup?: Record<string, Tag[]> }> {
  return items.map(item => {
    const result = { ...item };
    
    if (includeMetadata) {
      (result as any).taggedAt = new Date();
      (result as any).tagCount = item.tags.length;
      
      // Group tags by their group property for easier database queries
      (result as any).tagsByGroup = item.tags.reduce((acc, tag) => {
        if (!acc[tag.group]) {
          acc[tag.group] = [];
        }
        acc[tag.group].push(tag);
        return acc;
      }, {} as Record<string, Tag[]>);
    }
    
    return result;
  });
}

/**
 * Utility function to convert kebab-case or snake_case to Title Case
 */
function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Create a tag from a simple string with auto-generated ID
 * @param name - Tag name
 * @param groupId - Group ID (default: 'general')
 * @returns Tag object
 */
export function createQuickTag(name: string, groupId: string = 'general'): Tag {
  return {
    id: `${groupId}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    group: groupId
  };
}

/**
 * Smart tag creation that handles various input formats
 * @param input - String, Tag object, or object with name property
 * @param defaultGroupId - Default group if not specified
 * @returns Tag object
 */
export function smartCreateTag(
  input: string | Tag | { name: string; group?: string; id?: string },
  defaultGroupId: string = 'general'
): Tag {
  if (typeof input === 'string') {
    return createQuickTag(input, defaultGroupId);
  }
  
  if ('group' in input && 'id' in input && 'name' in input) {
    // Already a Tag
    return input as Tag;
  }
  
  // Object with name property
  const obj = input as { name: string; group?: string; id?: string };
  return {
    id: obj.id || `${obj.group || defaultGroupId}-${obj.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: obj.name,
    group: obj.group || defaultGroupId
  };
}
