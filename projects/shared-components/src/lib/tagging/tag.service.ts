// tag.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TagItem, TagGroup, Tag } from './tag.interface';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private currentItemSubject = new BehaviorSubject<TagItem | null>(null);
  private tagGroupsSubject = new BehaviorSubject<TagGroup[]>([]);

  currentItem$ = this.currentItemSubject.asObservable();
  tagGroups$ = this.tagGroupsSubject.asObservable();

  // === BASIC OPERATIONS ===

  /**
   * Set the current item to work on.
   * @param data - The item to set as current, or null to clear
   */
  setCurrentItem(data: TagItem | null): void {
    if (data === null) {
      this.currentItemSubject.next(null);
    } else {
      this.currentItemSubject.next({ ...data });
    }
  }

  /**
   * Clear the current item.
   */
  clearCurrentItem(): void {
    this.currentItemSubject.next(null);
  }

  /**
   * Get the current item value synchronously.
   * @returns The current item or null if none is set
   */
  getCurrentItem(): TagItem | null {
    return this.currentItemSubject.value;
  }

  /**
   * Set available tag groups.
   * @param groups - Array of tag groups to make available
   */
  setTagGroups(groups: TagGroup[]): void {
    this.tagGroupsSubject.next([...groups]);
  }

  /**
   * Get current tag groups synchronously.
   * @returns Array of current tag groups
   */
  getTagGroups(): TagGroup[] {
    return this.tagGroupsSubject.value;
  }

  // === HELPER METHODS ===

  /**
   * Create tag groups from a flat array of tags.
   * Groups tags by their `group` property and creates TagGroup objects.
   *
   * @param tags - Flat array of tags with group IDs
   * @param groupNames - Optional mapping of group IDs to display names
   * @returns Array of TagGroup objects
   *
   * @example
   * ```typescript
   * const tags = [
   *   { id: '1', group: 'colors', name: 'Red' },
   *   { id: '2', group: 'colors', name: 'Blue' },
   *   { id: '3', group: 'priority', name: 'High' }
   * ];
   *
   * const groups = tagService.createTagGroupsFromTags(tags, {
   *   colors: 'Color Labels',
   *   priority: 'Priority Levels'
   * });
   * ```
   */
  createTagGroupsFromTags(
    tags: Tag[],
    groupNames?: Record<string, string>,
  ): TagGroup[] {
    const groupMap = new Map<string, Tag[]>();

    // Group tags by their group ID
    tags.forEach((tag) => {
      if (!groupMap.has(tag.group)) {
        groupMap.set(tag.group, []);
      }
      groupMap.get(tag.group)!.push(tag);
    });

    // Convert to TagGroup objects
    return Array.from(groupMap.entries()).map(([groupId, groupTags]) => ({
      id: groupId,
      name: groupNames?.[groupId] || `Group ${groupId}`,
      tags: [...groupTags],
    }));
  }

  /**
   * Create items with random tags assigned for testing/demo purposes.
   *
   * @param itemNames - Array of item names or count of items to create
   * @param tagGroups - Available tag groups to pick from
   * @param tagsPerItem - Number of tags to assign per item (default: 1-3 random)
   * @returns Array of TagItem objects with assigned tags
   *
   * @example
   * ```typescript
   * const items = tagService.createItemsWithTags(
   *   ['Document 1', 'Document 2', 'Document 3'],
   *   myTagGroups,
   *   2
   * );
   * ```
   */
  createItemsWithTags(
    itemNames: string[] | number,
    tagGroups: TagGroup[],
    tagsPerItem?: number,
  ): TagItem[] {
    const names = Array.isArray(itemNames)
      ? itemNames
      : Array.from({ length: itemNames }, (_, i) => `Item ${i + 1}`);

    const allTags = tagGroups.flatMap((group) => group.tags);

    return names.map((name, index) => {
      const numTags = tagsPerItem ?? Math.floor(Math.random() * 3) + 1;
      const shuffled = [...allTags].sort(() => 0.5 - Math.random());
      const selectedTags = shuffled.slice(0, Math.min(numTags, allTags.length));

      return {
        id: `item-${index + 1}`,
        name,
        tags: selectedTags.map((tag) => ({ ...tag })),
      };
    });
  }

  /**
   * Create simple tag groups with basic names and colors.
   * Useful for quick setup and prototyping.
   *
   * @param groupCount - Number of groups to create
   * @param tagsPerGroup - Number of tags per group
   * @param groupPrefix - Prefix for group names (default: 'Group')
   * @param tagPrefix - Prefix for tag names (default: 'Tag')
   * @returns Array of TagGroup objects
   *
   * @example
   * ```typescript
   * const groups = tagService.createSimpleTagGroups(3, 5, 'Category', 'Label');
   * // Creates: Category 1, Category 2, Category 3 with Label 1-5 each
   * ```
   */
  createSimpleTagGroups(
    groupCount: number,
    tagsPerGroup: number,
    groupPrefix: string = 'Group',
    tagPrefix: string = 'Tag',
  ): TagGroup[] {
    return Array.from({ length: groupCount }, (_, groupIndex) => {
      const groupId = `group-${groupIndex + 1}`;
      const tags = Array.from({ length: tagsPerGroup }, (_, tagIndex) => ({
        id: `tag-${groupIndex + 1}-${tagIndex + 1}`,
        group: groupId,
        name: `${tagPrefix} ${groupIndex + 1}.${tagIndex + 1}`,
      }));

      return {
        id: groupId,
        name: `${groupPrefix} ${groupIndex + 1}`,
        tags,
      };
    });
  }

  /**
   * Add a tag to the current item if one is set.
   *
   * @param tag - Tag to add
   * @returns True if tag was added, false if no current item or tag already exists
   */
  addTagToCurrentItem(tag: Tag): boolean {
    const currentItem = this.getCurrentItem();
    if (!currentItem) return false;

    const exists = currentItem.tags.some((t) => t.id === tag.id);
    if (!exists) {
      currentItem.tags.push({ ...tag });
      this.setCurrentItem(currentItem);
      return true;
    }
    return false;
  }

  /**
   * Remove a tag from the current item.
   *
   * @param tagId - ID of tag to remove
   * @returns True if tag was removed, false if not found or no current item
   */
  removeTagFromCurrentItem(tagId: string): boolean {
    const currentItem = this.getCurrentItem();
    if (!currentItem) return false;

    const initialLength = currentItem.tags.length;
    currentItem.tags = currentItem.tags.filter((t) => t.id !== tagId);

    if (currentItem.tags.length < initialLength) {
      this.setCurrentItem(currentItem);
      return true;
    }
    return false;
  }

  /**
   * Filter items by tags.
   *
   * @param items - Items to filter
   * @param tagIds - Array of tag IDs to filter by
   * @param matchAll - If true, item must have ALL tags. If false, item needs ANY tag (default: false)
   * @returns Filtered array of items
   */
  filterItemsByTags(
    items: TagItem[],
    tagIds: string[],
    matchAll: boolean = false,
  ): TagItem[] {
    return items.filter((item) => {
      const itemTagIds = item.tags.map((t) => t.id);

      if (matchAll) {
        return tagIds.every((tagId) => itemTagIds.includes(tagId));
      } else {
        return tagIds.some((tagId) => itemTagIds.includes(tagId));
      }
    });
  }

  /**
   * Get all unique tags from an array of items.
   *
   * @param items - Items to extract tags from
   * @returns Array of unique tags
   */
  getUniqueTagsFromItems(items: TagItem[]): Tag[] {
    const tagMap = new Map<string, Tag>();

    items.forEach((item) => {
      item.tags.forEach((tag) => {
        tagMap.set(tag.id, tag);
      });
    });

    return Array.from(tagMap.values());
  }

  /**
   * Count how many items have each tag.
   *
   * @param items - Items to analyze
   * @returns Record mapping tag IDs to their usage count
   */
  getTagUsageStats(items: TagItem[]): Record<string, number> {
    const stats: Record<string, number> = {};

    items.forEach((item) => {
      item.tags.forEach((tag) => {
        stats[tag.id] = (stats[tag.id] || 0) + 1;
      });
    });

    return stats;
  }

  /**
   * Create predefined tag groups for common use cases.
   *
   * @param preset - Preset name ('colors', 'priority', 'status', 'file-types')
   * @returns TagGroup array for the preset
   */
  createPresetTagGroups(
    preset: 'colors' | 'priority' | 'status' | 'file-types',
  ): TagGroup[] {
    const presets = {
      colors: {
        id: 'colors',
        name: 'Colors',
        tags: [
          { id: 'red', group: 'colors', name: 'Red' },
          { id: 'blue', group: 'colors', name: 'Blue' },
          { id: 'green', group: 'colors', name: 'Green' },
          { id: 'yellow', group: 'colors', name: 'Yellow' },
          { id: 'purple', group: 'colors', name: 'Purple' },
        ],
      },
      priority: {
        id: 'priority',
        name: 'Priority',
        tags: [
          { id: 'low', group: 'priority', name: 'Low' },
          { id: 'medium', group: 'priority', name: 'Medium' },
          { id: 'high', group: 'priority', name: 'High' },
          { id: 'urgent', group: 'priority', name: 'Urgent' },
        ],
      },
      status: {
        id: 'status',
        name: 'Status',
        tags: [
          { id: 'todo', group: 'status', name: 'To Do' },
          { id: 'in-progress', group: 'status', name: 'In Progress' },
          { id: 'review', group: 'status', name: 'Review' },
          { id: 'done', group: 'status', name: 'Done' },
        ],
      },
      'file-types': {
        id: 'file-types',
        name: 'File Types',
        tags: [
          { id: 'document', group: 'file-types', name: 'Document' },
          { id: 'image', group: 'file-types', name: 'Image' },
          { id: 'video', group: 'file-types', name: 'Video' },
          { id: 'audio', group: 'file-types', name: 'Audio' },
          { id: 'archive', group: 'file-types', name: 'Archive' },
        ],
      },
    };

    return [presets[preset]];
  }

  /** Sort items alphabetically by name (asc or desc) */
  sortItemsByName(items: TagItem[], asc: boolean = true): TagItem[] {
    return [...items].sort((a, b) =>
      asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
  }

  /** Sort items by how many tags they have (fewest→most or reverse) */
  sortItemsByTagCount(items: TagItem[], asc: boolean = true): TagItem[] {
    return [...items].sort((a, b) =>
      asc ? a.tags.length - b.tags.length : b.tags.length - a.tags.length,
    );
  }

  /** Group items by a specific tag ID */
  groupItemsByTag(
    items: TagItem[],
    tagId: string,
  ): { with: TagItem[]; without: TagItem[] } {
    return {
      with: items.filter((i) => i.tags.some((t) => t.id === tagId)),
      without: items.filter((i) => !i.tags.some((t) => t.id === tagId)),
    };
  }

  /** Cluster items by their tag-groups */
  groupItemsByGroup(items: TagItem[]): Record<string, TagItem[]> {
    return items.reduce(
      (acc, item) => {
        item.tags.forEach((tag) => {
          acc[tag.group] = acc[tag.group] || [];
          acc[tag.group].push(item);
        });
        return acc;
      },
      {} as Record<string, TagItem[]>,
    );
  }
}
