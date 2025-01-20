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
import { TagDataComponent } from '../tag-data/tag-data.component';
import { TagService } from '../tag.service';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-tag-manager',
  templateUrl: './tag-manager.component.html',
  styleUrls: ['./tag-manager.component.scss'],
  imports: [TagDataComponent, MatIcon, NgClass],
  encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class TagManagerComponent implements OnInit, OnChanges {
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
    if (this.tagGroups.length > 0) {
      this.tagService.setTagGroups([...this.tagGroups]);
    }

    if (this.items.length > 0) {
      this.tagService.setCurrentItem(this.items[this.currentIndex]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if `items` input has changed
    if (changes['items'] && changes['items'].currentValue) {
      this.currentIndex = 0; // Reset to the first item when new items are passed
      if (this.items.length > 0) {
        this.tagService.setCurrentItem(this.items[this.currentIndex]);
      }
    }

    // Check if `tagGroups` input has changed
    if (changes['tagGroups'] && changes['tagGroups'].currentValue) {
      this.tagService.setTagGroups([...this.tagGroups]);
    }
  }

  getCurrentItem(): TagItem {
    return this.items[this.currentIndex];
  }

  onTagAdded(tag: Tag): void {
    const currentItem = this.getCurrentItem();
    currentItem.tags.push(tag); // Add tag immutably
    this.tagAdded.emit(tag);
  }

  onTagRemoved(tag: Tag): void {
    const currentItem = this.getCurrentItem();
    currentItem.tags = currentItem.tags.filter((t) => t.id !== tag.id);
    this.tagRemoved.emit(tag);
  }

  moveToNextItem(): void {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.tagService.setCurrentItem(this.items[this.currentIndex]);
      this.nextItem.emit(this.items[this.currentIndex]);
    }
  }

  moveToPreviousItem(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.tagService.setCurrentItem(this.items[this.currentIndex]);
      this.previousItem.emit(this.items[this.currentIndex]);
    }
  }
}
