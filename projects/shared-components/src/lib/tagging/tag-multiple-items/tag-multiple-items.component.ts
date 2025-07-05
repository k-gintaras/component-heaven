import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { Tag, TagGroup, TagItem } from '../tag.interface';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { TagPickerComponent } from '../tag-picker/tag-picker.component';
import { TagPickerMatrixComponent } from '../tag-picker-matrix/tag-picker-matrix.component';

@Component({
  standalone: true,
  selector: 'app-tag-multiple-items',
  templateUrl: './tag-multiple-items.component.html',
  styleUrls: ['./tag-multiple-items.component.css'],
  imports: [
    TagPickerComponent,
    TagPickerMatrixComponent,
    MatIcon,
    NgClass,
    NgIf,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TagMultipleItemsComponent implements OnInit, OnChanges {
  // === BASIC INPUTS ===
  @Input() items: TagItem[] = []; // List of items to tag
  @Input() tagGroups: TagGroup[] = []; // Available tag groups

  // === TAG PICKER OPTIONS ===
  @Input() canMultiSelect: boolean = false; // Multi-select tags
  @Input() canReplace: boolean = true; // Replace existing tags
  @Input() maxVisibleTabs: number = 5; // Tabs visible in tagging component
  @Input() autoAdvanceGroups: boolean = true; // Auto-advance groups in picker

  // === WORKFLOW OPTIONS ===
  @Input() autoAdvanceItems: boolean = false; // Auto-advance to next item when current is complete
  @Input() createSingleItemMode: boolean = false; // Create a fake item if no items provided
  @Input() singleItemName: string = 'Current Item'; // Name for the fake item in single mode

  // === INDIVIDUAL TAG EVENTS ===
  @Output() tagAdded = new EventEmitter<{
    tag: Tag;
    item: TagItem;
    itemIndex: number;
  }>();
  @Output() tagRemoved = new EventEmitter<{
    tag: Tag;
    item: TagItem;
    itemIndex: number;
  }>();

  // === SELECTION EVENTS ===
  @Output() tagSelectionChanged = new EventEmitter<{
    tags: Tag[];
    item: TagItem;
    itemIndex: number;
  }>();
  @Output() itemTaggingCompleted = new EventEmitter<{
    item: TagItem;
    itemIndex: number;
    isComplete: boolean;
  }>();

  // === NAVIGATION EVENTS ===
  @Output() nextItem = new EventEmitter<TagItem>();
  @Output() previousItem = new EventEmitter<TagItem>();
  @Output() itemChanged = new EventEmitter<{ item: TagItem; index: number }>();

  // === BATCH COMPLETION EVENTS ===
  @Output() batchTaggingCompleted = new EventEmitter<{
    allItemsComplete: boolean;
    completedCount: number;
    totalCount: number;
  }>();

  // === VIEW CHILD REFERENCES ===
  @ViewChild(TagPickerComponent) tagPicker?: TagPickerComponent;

  // === INTERNAL STATE ===
  currentIndex = 0;
  private internalItems: TagItem[] = [];
  // Force tag picker to reinitialize when switching items
  tagPickerKey = 0;

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['items'] ||
      changes['createSingleItemMode'] ||
      changes['singleItemName']
    ) {
      this.currentIndex = 0;
      this.initializeComponent();
      // Force tag picker to reinitialize
      this.tagPickerKey++;
    }
  }

  private initializeComponent(): void {
    this.setupItems();
    this.checkBatchCompletion();
  }

  /**
   * Setup items - either use provided items or create a fake one for single-item mode
   */
  private setupItems(): void {
    if (this.createSingleItemMode && (!this.items || this.items.length === 0)) {
      // Create a fake item for single-item tagging
      this.internalItems = [
        {
          id: 'single-item',
          name: this.singleItemName,
          tags: [],
        },
      ];
    } else {
      this.internalItems = [...this.items];
    }
  }

  // === ITEM NAVIGATION ===

  // In your component class
  getTitleColor(): string {
    const stats = this.getBatchStats();
    if (stats.currentItemComplete) {
      return 'gray';
    }
    // find the first group that isn't tagged yet, grab its tab color
    const firstIncomplete = this.tagGroups.find(
      (g) => !this.getCurrentItemTags().some((t) => t.group === g.id),
    );
    return 'green';
  }

  hasItems(): boolean {
    return this.internalItems && this.internalItems.length > 0;
  }

  getCurrentItem(): TagItem | null {
    if (!this.hasItems()) {
      return null;
    }
    return this.internalItems[this.currentIndex];
  }

  getCurrentItemName(): string {
    const currentItem = this.getCurrentItem();
    return currentItem ? currentItem.name : 'No items to tag';
  }

  canNavigateNext(): boolean {
    return this.hasItems() && this.currentIndex < this.internalItems.length - 1;
  }

  canNavigatePrevious(): boolean {
    return this.hasItems() && this.currentIndex > 0;
  }

  getItemStatus(): string {
    if (!this.hasItems()) {
      return 'No items';
    }
    return `Item ${this.currentIndex + 1} of ${this.internalItems.length}`;
  }

  moveToNextItem(): void {
    if (!this.canNavigateNext()) {
      return;
    }
    this.currentIndex++;
    this.onItemChanged();
  }

  moveToPreviousItem(): void {
    if (!this.canNavigatePrevious()) {
      return;
    }
    this.currentIndex--;
    this.onItemChanged();
  }

  moveToItem(index: number): void {
    if (!this.hasItems() || index < 0 || index >= this.internalItems.length) {
      return;
    }
    this.currentIndex = index;
    this.onItemChanged();
  }

  /**
   * Handle item change - reset tag picker to first tab
   */
  private onItemChanged(): void {
    const newItem = this.internalItems[this.currentIndex];

    // Force tag picker to reinitialize by changing the key
    // This ensures it resets to the first tab
    this.tagPickerKey++;

    // Emit events
    this.nextItem.emit(newItem);
    this.previousItem.emit(newItem);
    this.itemChanged.emit({ item: newItem, index: this.currentIndex });

    // Alternative approach: If you want to keep the same instance
    // and just reset the current group, you can use this instead:
    // setTimeout(() => {
    //   if (this.tagPicker && this.tagGroups.length > 0) {
    //     this.tagPicker.selectGroup(this.tagPicker.groups[0]);
    //   }
    // });
  }

  // === TAG MANAGEMENT ===

  getCurrentItemTags(): Tag[] {
    const currentItem = this.getCurrentItem();
    return currentItem?.tags || [];
  }

  getCurrentItemTagCount(): number {
    return this.getCurrentItemTags().length;
  }

  currentItemHasTags(): boolean {
    return this.getCurrentItemTagCount() > 0;
  }

  // onTagAdded(tag: Tag): void {
  //   // const currentItem = this.getCurrentItem();
  //   // if (!currentItem) {
  //   //   console.warn('Cannot add tag: no current item');
  //   //   return;
  //   // }
  //   // // Check if tag already exists
  //   // const existingTag = currentItem.tags.find((t) => t.id === tag.id);
  //   // if (!existingTag) {
  //   //   currentItem.tags.push(tag);
  //   //   // Emit events
  //   //   this.tagAdded.emit({
  //   //     tag,
  //   //     item: currentItem,
  //   //     itemIndex: this.currentIndex,
  //   //   });
  //   //   this.tagSelectionChanged.emit({
  //   //     tags: [...currentItem.tags],
  //   //     item: currentItem,
  //   //     itemIndex: this.currentIndex,
  //   //   });
  //   //   this.checkItemCompletion(currentItem);
  //   //   this.checkBatchCompletion();
  //   // }
  // }

  // onTagRemoved(tag: Tag): void {
  //   // const currentItem = this.getCurrentItem();
  //   // if (!currentItem) {
  //   //   console.warn('Cannot remove tag: no current item');
  //   //   return;
  //   // }
  //   // currentItem.tags = currentItem.tags.filter((t) => t.id !== tag.id);
  //   // // Emit events
  //   // this.tagRemoved.emit({
  //   //   tag,
  //   //   item: currentItem,
  //   //   itemIndex: this.currentIndex,
  //   // });
  //   // this.tagSelectionChanged.emit({
  //   //   tags: [...currentItem.tags],
  //   //   item: currentItem,
  //   //   itemIndex: this.currentIndex,
  //   // });
  //   // this.checkItemCompletion(currentItem);
  //   // this.checkBatchCompletion();
  // }

  onTagSelectionChanged(tags: Tag[]): void {
    const currentItem = this.getCurrentItem();
    if (!currentItem) return;

    // Get previous tags for comparison
    const previousTags = [...currentItem.tags];

    // Update the item's tags to match the selection
    currentItem.tags = [...tags];

    // Emit individual tag events by comparing old vs new
    const previousTagIds = new Set(previousTags.map((t) => t.id));
    const newTagIds = new Set(tags.map((t) => t.id));

    // Find added tags
    tags.forEach((tag) => {
      if (!previousTagIds.has(tag.id)) {
        this.tagAdded.emit({
          tag,
          item: currentItem,
          itemIndex: this.currentIndex,
        });
      }
    });

    // Find removed tags
    previousTags.forEach((tag) => {
      if (!newTagIds.has(tag.id)) {
        this.tagRemoved.emit({
          tag,
          item: currentItem,
          itemIndex: this.currentIndex,
        });
      }
    });

    // Emit the bulk selection change
    this.tagSelectionChanged.emit({
      tags,
      item: currentItem,
      itemIndex: this.currentIndex,
    });

    this.checkItemCompletion(currentItem);
    this.checkBatchCompletion();
  }

  // onTagSelectionChanged(tags: Tag[]): void {
  //   const currentItem = this.getCurrentItem();
  //   if (!currentItem) return;

  //   // Update the item's tags to match the selection
  //   currentItem.tags = [...tags];

  //   this.tagSelectionChanged.emit({
  //     tags,
  //     item: currentItem,
  //     itemIndex: this.currentIndex,
  //   });

  //   this.checkItemCompletion(currentItem);
  //   this.checkBatchCompletion();
  // }

  onItemTaggingCompleted(isComplete: boolean): void {
    const currentItem = this.getCurrentItem();
    if (!currentItem) return;

    this.itemTaggingCompleted.emit({
      item: currentItem,
      itemIndex: this.currentIndex,
      isComplete,
    });

    // Auto-advance to next item if enabled and current item is complete
    if (this.autoAdvanceItems && isComplete && this.canNavigateNext()) {
      setTimeout(() => {
        this.moveToNextItem();
      }, 500); // Small delay for better UX
    }
  }

  // === COMPLETION TRACKING ===

  /**
   * Check if current item has all groups tagged
   */
  private checkItemCompletion(item: TagItem): void {
    if (this.tagGroups.length === 0) return;

    const taggedGroupIds = new Set(item.tags.map((tag) => tag.group));
    const requiredGroupIds = new Set(this.tagGroups.map((group) => group.id));

    const isComplete = this.tagGroups.every((group) =>
      taggedGroupIds.has(group.id),
    );

    this.itemTaggingCompleted.emit({
      item,
      itemIndex: this.currentIndex,
      isComplete,
    });
  }

  /**
   * Check if all items in the batch are complete
   */
  private checkBatchCompletion(): void {
    if (!this.hasItems() || this.tagGroups.length === 0) {
      this.batchTaggingCompleted.emit({
        allItemsComplete: false,
        completedCount: 0,
        totalCount: this.internalItems.length,
      });
      return;
    }

    const completedItems = this.internalItems.filter((item) => {
      const taggedGroupIds = new Set(item.tags.map((tag) => tag.group));
      return this.tagGroups.every((group) => taggedGroupIds.has(group.id));
    });

    const allComplete = completedItems.length === this.internalItems.length;

    this.batchTaggingCompleted.emit({
      allItemsComplete: allComplete,
      completedCount: completedItems.length,
      totalCount: this.internalItems.length,
    });
  }

  // === UTILITY METHODS ===

  /**
   * Get completion statistics for all items
   */
  getBatchStats(): {
    totalItems: number;
    completedItems: number;
    currentItemComplete: boolean;
    overallProgress: number;
  } {
    if (!this.hasItems() || this.tagGroups.length === 0) {
      return {
        totalItems: 0,
        completedItems: 0,
        currentItemComplete: false,
        overallProgress: 0,
      };
    }

    const completedItems = this.internalItems.filter((item) => {
      const taggedGroupIds = new Set(item.tags.map((tag) => tag.group));
      return this.tagGroups.every((group) => taggedGroupIds.has(group.id));
    });

    const currentItem = this.getCurrentItem();
    const currentItemComplete = currentItem
      ? this.tagGroups.every((group) =>
          currentItem.tags.some((tag) => tag.group === group.id),
        )
      : false;

    return {
      totalItems: this.internalItems.length,
      completedItems: completedItems.length,
      currentItemComplete,
      overallProgress: Math.round(
        (completedItems.length / this.internalItems.length) * 100,
      ),
    };
  }

  /**
   * Get the actual items (useful for parent components)
   */
  getItems(): TagItem[] {
    return [...this.internalItems];
  }

  /**
   * Get items that still need tagging
   */
  getIncompleteItems(): TagItem[] {
    if (this.tagGroups.length === 0) return [];

    return this.internalItems.filter((item) => {
      const taggedGroupIds = new Set(item.tags.map((tag) => tag.group));
      return !this.tagGroups.every((group) => taggedGroupIds.has(group.id));
    });
  }
}
