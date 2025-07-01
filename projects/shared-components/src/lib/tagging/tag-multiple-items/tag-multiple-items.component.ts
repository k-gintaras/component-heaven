import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Tag, TagGroup, TagItem } from '../tag.interface';
import { TagService } from '../tag.service';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { TagPickerComponent } from '../tag-picker/tag-picker.component';

@Component({
  standalone: true,
  selector: 'app-tag-multiple-items',
  templateUrl: './tag-multiple-items.component.html',
  styleUrls: ['./tag-multiple-items.component.css'],
  imports: [TagPickerComponent, MatIcon, NgClass, NgIf],
  encapsulation: ViewEncapsulation.None,
})
export class TagMultipleItemsComponent implements OnInit, OnChanges {
  @Input() items: TagItem[] = []; // List of items to tag
  @Input() tagGroups: TagGroup[] = []; // Available tag groups
  @Input() canMultiSelect: boolean = false; // Multi-select tags
  @Input() canReplace: boolean = true; // Replace existing tags
  @Input() maxVisibleTabs: number = 5; // Tabs visible in tagging component

  @Output() tagAdded = new EventEmitter<Tag>(); // Emit when a tag is added
  @Output() tagRemoved = new EventEmitter<Tag>(); // Emit when a tag is removed
  @Output() nextItem = new EventEmitter<TagItem>(); // Emit when moving to the next item
  @Output() previousItem = new EventEmitter<TagItem>(); // Emit when moving to the previous item

  currentIndex = 0; // Index of the current item

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if `items` input has changed
    if (changes['items'] && changes['items'].currentValue) {
      this.currentIndex = 0; // Reset to the first item when new items are passed
      this.initializeComponent();
    }

    // Check if `tagGroups` input has changed
    if (changes['tagGroups'] && changes['tagGroups'].currentValue) {
      this.tagService.setTagGroups([...this.tagGroups]);
    }
  }

  private initializeComponent(): void {
    // Set tag groups if available
    if (this.tagGroups.length > 0) {
      this.tagService.setTagGroups([...this.tagGroups]);
    }

    // Set current item if items exist
    if (this.hasItems()) {
      this.tagService.setCurrentItem(this.items[this.currentIndex]);
    } else {
      // Clear current item if no items
      this.tagService.clearCurrentItem();
    }
  }

  hasItems(): boolean {
    return this.items && this.items.length > 0;
  }

  getCurrentItem(): TagItem | null {
    if (!this.hasItems()) {
      return null;
    }
    return this.items[this.currentIndex];
  }

  getCurrentItemName(): string {
    const currentItem = this.getCurrentItem();
    return currentItem ? currentItem.name : 'No items to tag';
  }

  canNavigateNext(): boolean {
    return this.hasItems() && this.currentIndex < this.items.length - 1;
  }

  canNavigatePrevious(): boolean {
    return this.hasItems() && this.currentIndex > 0;
  }

  getItemStatus(): string {
    if (!this.hasItems()) {
      return 'No items';
    }
    return `Item ${this.currentIndex + 1} of ${this.items.length}`;
  }

  /**
   * Get the number of tags applied to the current item.
   * Safe method that handles null/undefined cases.
   */
  getCurrentItemTagCount(): number {
    const currentItem = this.getCurrentItem();
    return currentItem?.tags?.length || 0;
  }

  /**
   * Check if the current item has any tags applied.
   */
  currentItemHasTags(): boolean {
    return this.getCurrentItemTagCount() > 0;
  }

  onTagAdded(tag: Tag): void {
    const currentItem = this.getCurrentItem();
    if (!currentItem) {
      console.warn('Cannot add tag: no current item');
      return;
    }

    // Check if tag already exists
    const existingTag = currentItem.tags.find((t) => t.id === tag.id);
    if (!existingTag) {
      currentItem.tags.push(tag);
      this.tagAdded.emit(tag);
    }
  }

  onTagRemoved(tag: Tag): void {
    const currentItem = this.getCurrentItem();
    if (!currentItem) {
      console.warn('Cannot remove tag: no current item');
      return;
    }

    currentItem.tags = currentItem.tags.filter((t) => t.id !== tag.id);
    this.tagRemoved.emit(tag);
  }

  moveToNextItem(): void {
    if (!this.canNavigateNext()) {
      return;
    }

    this.currentIndex++;
    this.tagService.setCurrentItem(this.items[this.currentIndex]);
    this.nextItem.emit(this.items[this.currentIndex]);
  }

  moveToPreviousItem(): void {
    if (!this.canNavigatePrevious()) {
      return;
    }

    this.currentIndex--;
    this.tagService.setCurrentItem(this.items[this.currentIndex]);
    this.previousItem.emit(this.items[this.currentIndex]);
  }

  moveToItem(index: number): void {
    if (!this.hasItems() || index < 0 || index >= this.items.length) {
      return;
    }

    this.currentIndex = index;
    this.tagService.setCurrentItem(this.items[this.currentIndex]);
  }
}
