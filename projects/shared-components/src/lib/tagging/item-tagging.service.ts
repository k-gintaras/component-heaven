// item-tagging.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tag, TagGroup, TagItem } from './tag.interface';

export interface TaggingConfig {
  allowMultiplePerGroup: boolean;
  autoAdvanceGroups: boolean;
  autoAdvanceItems: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ItemTaggingService {
  private itemsSubject = new BehaviorSubject<TagItem[]>([]);
  private tagGroupsSubject = new BehaviorSubject<TagGroup[]>([]);
  private currentItemIdSubject = new BehaviorSubject<string | null>(null);
  private configSubject = new BehaviorSubject<TaggingConfig>({
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
  });

  // Observables
  items$ = this.itemsSubject.asObservable();
  tagGroups$ = this.tagGroupsSubject.asObservable();
  currentItemId$ = this.currentItemIdSubject.asObservable();
  config$ = this.configSubject.asObservable();

  // === INITIALIZATION ===

  /**
   * Initialize the service with items and tag groups
   */
  initialize(
    items: TagItem[],
    tagGroups: TagGroup[],
    config?: Partial<TaggingConfig>,
  ): void {
    // Deep clone items to prevent external mutations
    // const clonedItems = items.map((item) => ({
    //   ...item,
    //   tags: [...item.tags.map((tag) => ({ ...tag }))],
    // }));
    //

    // this.itemsSubject.next(clonedItems);
    this.itemsSubject.next(items);
    this.tagGroupsSubject.next([...tagGroups]);

    if (config) {
      this.updateConfig(config);
    }

    // // Set first item as current if items exist
    // if (clonedItems.length > 0) {
    //   this.setCurrentItem(clonedItems[0].id);
    // }
    // Set first item as current if items exist
    if (items.length > 0) {
      this.setCurrentItem(items[0].id);
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TaggingConfig>): void {
    const currentConfig = this.configSubject.value;
    this.configSubject.next({ ...currentConfig, ...config });
  }

  // === ITEM MANAGEMENT ===

  /**
   * Set current item by ID
   */
  setCurrentItem(itemId: string): boolean {
    const items = this.itemsSubject.value;
    const item = items.find((i) => i.id === itemId);

    if (item) {
      this.currentItemIdSubject.next(itemId);
      return true;
    }
    return false;
  }

  /**
   * Get current item
   */
  getCurrentItem(): TagItem | null {
    const currentId = this.currentItemIdSubject.value;
    if (!currentId) return null;

    const items = this.itemsSubject.value;
    return items.find((i) => i.id === currentId) || null;
  }

  /**
   * Get item by ID
   */
  getItem(itemId: string): TagItem | null {
    const items = this.itemsSubject.value;
    return items.find((i) => i.id === itemId) || null;
  }

  /**
   * Get all items
   */
  getItems(): TagItem[] {
    return [...this.itemsSubject.value];
  }

  /**
   * Get current item's tags
   */
  getCurrentItemTags(): Tag[] {
    const currentItem = this.getCurrentItem();
    return currentItem ? [...currentItem.tags] : [];
  }

  /**
   * Get item's tags by ID
   */
  getItemTags(itemId: string): Tag[] {
    const item = this.getItem(itemId);
    return item ? [...item.tags] : [];
  }

  // === TAG MANAGEMENT ===

  /**
   * Toggle tag on an item (add if not present, remove if present)
   */
  toggleTag(itemId: string, tag: Tag): boolean {
    const items = [...this.itemsSubject.value];
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      console.warn(`Item with id ${itemId} not found`);
      return false;
    }

    const existingTagIndex = item.tags.findIndex((t) => t.id === tag.id);
    const config = this.configSubject.value;

    if (existingTagIndex > -1) {
      // Tag exists - remove it
      item.tags.splice(existingTagIndex, 1);
    } else {
      // Tag doesn't exist - add it
      if (!config.allowMultiplePerGroup) {
        // Remove existing tags from the same group first
        item.tags = item.tags.filter((t) => t.group !== tag.group);
      }

      // Add the new tag
      item.tags.push({ ...tag });
    }

    // Update items
    this.itemsSubject.next(items);
    return true;
  }

  /**
   * Add tag to item (only if not already present)
   */
  addTag(itemId: string, tag: Tag): boolean {
    const items = [...this.itemsSubject.value];
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      console.warn(`Item with id ${itemId} not found`);
      return false;
    }

    const existingTag = item.tags.find((t) => t.id === tag.id);
    if (existingTag) {
      // Tag already exists
      return false;
    }

    const config = this.configSubject.value;

    if (!config.allowMultiplePerGroup) {
      // Remove existing tags from the same group first
      item.tags = item.tags.filter((t) => t.group !== tag.group);
    }

    // Add the new tag
    item.tags.push({ ...tag });

    // Update items
    this.itemsSubject.next(items);
    return true;
  }

  /**
   * Remove tag from item
   */
  removeTag(itemId: string, tagId: string): boolean {
    const items = [...this.itemsSubject.value];
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      console.warn(`Item with id ${itemId} not found`);
      return false;
    }

    const initialLength = item.tags.length;
    item.tags = item.tags.filter((t) => t.id !== tagId);

    if (item.tags.length < initialLength) {
      // Update items
      this.itemsSubject.next(items);
      return true;
    }

    return false;
  }

  /**
   * Set all tags for an item (replaces existing tags)
   */
  setItemTags(itemId: string, tags: Tag[]): boolean {
    const items = [...this.itemsSubject.value];
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      console.warn(`Item with id ${itemId} not found`);
      return false;
    }

    item.tags = tags.map((tag) => ({ ...tag }));
    this.itemsSubject.next(items);
    return true;
  }

  /**
   * Clear all tags from an item
   */
  clearItemTags(itemId: string): boolean {
    return this.setItemTags(itemId, []);
  }

  // === NAVIGATION ===

  /**
   * Navigate to next item
   */
  nextItem(): boolean {
    const items = this.itemsSubject.value;
    const currentId = this.currentItemIdSubject.value;

    if (!currentId || items.length === 0) return false;

    const currentIndex = items.findIndex((i) => i.id === currentId);
    if (currentIndex === -1 || currentIndex >= items.length - 1) return false;

    const nextItem = items[currentIndex + 1];
    this.setCurrentItem(nextItem.id);
    return true;
  }

  /**
   * Navigate to previous item
   */
  previousItem(): boolean {
    const items = this.itemsSubject.value;
    const currentId = this.currentItemIdSubject.value;

    if (!currentId || items.length === 0) return false;

    const currentIndex = items.findIndex((i) => i.id === currentId);
    if (currentIndex <= 0) return false;

    const prevItem = items[currentIndex - 1];
    this.setCurrentItem(prevItem.id);
    return true;
  }

  /**
   * Check if can navigate to next item
   */
  canNavigateNext(): boolean {
    const items = this.itemsSubject.value;
    const currentId = this.currentItemIdSubject.value;

    if (!currentId || items.length === 0) return false;

    const currentIndex = items.findIndex((i) => i.id === currentId);
    return currentIndex !== -1 && currentIndex < items.length - 1;
  }

  /**
   * Check if can navigate to previous item
   */
  canNavigatePrevious(): boolean {
    const items = this.itemsSubject.value;
    const currentId = this.currentItemIdSubject.value;

    if (!currentId || items.length === 0) return false;

    const currentIndex = items.findIndex((i) => i.id === currentId);
    return currentIndex > 0;
  }

  // === COMPLETION TRACKING ===

  /**
   * Check if item is complete (has all required tags)
   */
  isItemComplete(itemId: string): boolean {
    const item = this.getItem(itemId);
    const tagGroups = this.tagGroupsSubject.value;

    if (!item || tagGroups.length === 0) return false;

    const taggedGroupIds = new Set(item.tags.map((tag) => tag.group));
    return tagGroups.every((group) => taggedGroupIds.has(group.id));
  }

  /**
   * Get completion statistics
   */
  getCompletionStats(): {
    totalItems: number;
    completedItems: number;
    currentItemComplete: boolean;
    progress: number;
  } {
    const items = this.itemsSubject.value;
    const tagGroups = this.tagGroupsSubject.value;
    const currentItem = this.getCurrentItem();

    if (items.length === 0 || tagGroups.length === 0) {
      return {
        totalItems: 0,
        completedItems: 0,
        currentItemComplete: false,
        progress: 0,
      };
    }

    const completedItems = items.filter((item) => this.isItemComplete(item.id));
    const currentItemComplete = currentItem
      ? this.isItemComplete(currentItem.id)
      : false;

    return {
      totalItems: items.length,
      completedItems: completedItems.length,
      currentItemComplete,
      progress: Math.round((completedItems.length / items.length) * 100),
    };
  }

  /**
   * Get items that still need tagging
   */
  getIncompleteItems(): TagItem[] {
    const items = this.itemsSubject.value;
    return items.filter((item) => !this.isItemComplete(item.id));
  }

  // === UTILITY ===

  /**
   * Check if tag exists on item
   */
  hasTag(itemId: string, tagId: string): boolean {
    const item = this.getItem(itemId);
    return item ? item.tags.some((t) => t.id === tagId) : false;
  }

  /**
   * Get current item index
   */
  getCurrentItemIndex(): number {
    const items = this.itemsSubject.value;
    const currentId = this.currentItemIdSubject.value;

    if (!currentId) return -1;

    return items.findIndex((i) => i.id === currentId);
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.itemsSubject.next([]);
    this.tagGroupsSubject.next([]);
    this.currentItemIdSubject.next(null);
    this.configSubject.next({
      allowMultiplePerGroup: false,
      autoAdvanceGroups: true,
      autoAdvanceItems: false,
    });
  }
}
