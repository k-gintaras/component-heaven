// tag-helpers.ts
import { Tag, TagGroup, TagItem } from './tag.interface';

/**
 * Standalone utility functions for working with tags (no service dependency).
 * Perfect for pure functions and one-off transformations.
 */

/**
 * Quick way to create a tag.
 * @param id - Unique identifier
 * @param name - Display name
 * @param groupId - Group this tag belongs to
 */
export function createTag(id: string, name: string, groupId: string): Tag {
  return { id, name, group: groupId };
}

/**
 * Quick way to create multiple tags in the same group.
 * @param groupId - Group ID for all tags
 * @param names - Array of tag names or name-id pairs
 *
 * @example
 * ```typescript
 * const colorTags = createTags('colors', ['Red', 'Blue', 'Green']);
 * const statusTags = createTags('status', [
 *   { name: 'To Do', id: 'todo' },
 *   { name: 'Done', id: 'done' }
 * ]);
 * ```
 */
export function createTags(
  groupId: string,
  names: (string | { name: string; id: string })[],
): Tag[] {
  return names.map((item, index) => {
    if (typeof item === 'string') {
      return createTag(`${groupId}-${index + 1}`, item, groupId);
    } else {
      return createTag(item.id, item.name, groupId);
    }
  });
}

/**
 * Create a tag group with tags.
 * @param id - Group ID
 * @param name - Group display name
 * @param tagNames - Array of tag names
 */
export function createTagGroup(
  id: string,
  name: string,
  tagNames: string[],
): TagGroup {
  return {
    id,
    name,
    tags: createTags(id, tagNames),
  };
}

/**
 * Create an item with specific tags.
 * @param id - Item ID
 * @param name - Item name
 * @param tags - Tags to assign (optional)
 */
export function createTaggedItem(
  id: string,
  name: string,
  tags: Tag[] = [],
): TagItem {
  return { id, name, tags: [...tags] };
}

/**
 * Convert simple string arrays to full tag structure.
 * Super convenient for quick setup.
 *
 * @param data - Object mapping group names to tag arrays
 * @returns Array of TagGroup objects
 *
 * @example
 * ```typescript
 * const groups = tagsFromSimpleData({
 *   'Colors': ['Red', 'Blue', 'Green'],
 *   'Priority': ['Low', 'High'],
 *   'Status': ['Todo', 'Done']
 * });
 * ```
 */
export function tagsFromSimpleData(data: Record<string, string[]>): TagGroup[] {
  return Object.entries(data).map(([groupName, tagNames]) => {
    const groupId = groupName.toLowerCase().replace(/\s+/g, '-');
    return createTagGroup(groupId, groupName, tagNames);
  });
}

/**
 * Create items from simple name array with random tag assignment.
 * @param itemNames - Array of item names
 * @param availableGroups - Groups to pick tags from
 * @param maxTagsPerItem - Maximum tags per item (default: 3)
 */
export function itemsFromNames(
  itemNames: string[],
  availableGroups: TagGroup[],
  maxTagsPerItem: number = 3,
): TagItem[] {
  const allTags = availableGroups.flatMap((g) => g.tags);

  return itemNames.map((name, index) => {
    const numTags = Math.floor(Math.random() * maxTagsPerItem) + 1;
    const shuffled = [...allTags].sort(() => 0.5 - Math.random());
    const selectedTags = shuffled.slice(0, numTags);

    return createTaggedItem(`item-${index + 1}`, name, selectedTags);
  });
}

/**
 * Quick setup for common scenarios.
 * Returns both tag groups and sample items.
 *
 * @param scenario - Predefined scenario name
 * @returns Object with tagGroups and items
 *
 * @example
 * ```typescript
 * const { tagGroups, items } = quickSetup('file-management');
 * ```
 */
export function quickSetup(
  scenario: 'file-management' | 'project-tasks' | 'blog-posts',
) {
  const scenarios = {
    'file-management': {
      tagGroups: tagsFromSimpleData({
        Type: ['Document', 'Image', 'Video', 'Audio'],
        Priority: ['Low', 'Medium', 'High'],
        Status: ['New', 'Reviewed', 'Archived'],
      }),
      itemNames: [
        'Meeting Notes.docx',
        'Vacation Photo.jpg',
        'Project Video.mp4',
        'Podcast Episode.mp3',
        'Budget Spreadsheet.xlsx',
      ],
    },
    'project-tasks': {
      tagGroups: tagsFromSimpleData({
        Status: ['Todo', 'In Progress', 'Review', 'Done'],
        Priority: ['Low', 'Medium', 'High', 'Urgent'],
        Team: ['Frontend', 'Backend', 'Design', 'QA'],
      }),
      itemNames: [
        'Update login page',
        'Fix database migration',
        'Design new icons',
        'Test payment flow',
        'Deploy to staging',
      ],
    },
    'blog-posts': {
      tagGroups: tagsFromSimpleData({
        Category: ['Tech', 'Lifestyle', 'Business', 'Travel'],
        Status: ['Draft', 'Review', 'Published'],
        Audience: ['Beginner', 'Intermediate', 'Advanced'],
      }),
      itemNames: [
        'Getting Started with Angular',
        'My Trip to Japan',
        'Startup Lessons Learned',
        'Advanced TypeScript Tips',
        'Working Remote Successfully',
      ],
    },
  };

  const scenario_data = scenarios[scenario];
  return {
    tagGroups: scenario_data.tagGroups,
    items: itemsFromNames(scenario_data.itemNames, scenario_data.tagGroups),
  };
}
