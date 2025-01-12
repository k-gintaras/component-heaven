import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagGroup, Tag } from '../tag-stepper/tag.interface';
import { getTestTagMatrix } from '../tag-stepper/test-data';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  selector: 'app-tag-data',
  templateUrl: './tag-data.component.html',
  styleUrls: ['./tag-data.component.scss'],
})
export class TagDataComponent implements OnInit {
  @Input() groups: TagGroup[] = getTestTagMatrix(10, 10); // Default to 3 groups, 5 tags each
  @Input() canMultiSelect = false; // Allow multiple selections in the same group
  @Input() canReplace = true; // Allow unselecting the currently selected tag
  @Input() maxVisibleTabs = 5; // Allow unselecting the currently selected tag
  @Output() tagSelected = new EventEmitter<Tag>();
  @Output() tagRemoved = new EventEmitter<Tag>();

  // paginator basically >
  visibleGroups: TagGroup[] = []; // Groups visible on the screen
  private currentStartIndex = 0; // Start index for visible groups

  currentGroup: TagGroup | null = null; // Currently selected group
  selectedTags: Tag[] = []; // Array of selected tags

  ngOnInit(): void {
    if (this.groups.length > 0) {
      this.currentGroup = this.groups[0];
    }
    this.updateVisibleGroups();
  }

  private updateVisibleGroups(): void {
    const totalGroups = this.groups.length;

    // Ensure the `currentStartIndex` is always within bounds (wrap around)
    this.currentStartIndex =
      (this.currentStartIndex + totalGroups) % totalGroups;

    // Get visible groups
    this.visibleGroups = this.groups.slice(
      this.currentStartIndex,
      this.currentStartIndex + this.maxVisibleTabs,
    );

    // Ensure we don't wrap around if we're at the end of the list
    if (
      this.currentStartIndex + this.maxVisibleTabs > totalGroups &&
      this.currentStartIndex < totalGroups
    ) {
      const remaining = totalGroups - this.currentStartIndex;
      this.visibleGroups = this.groups
        .slice(this.currentStartIndex)
        .concat(
          this.groups.slice(
            0,
            Math.min(this.maxVisibleTabs - remaining, totalGroups),
          ),
        );
    }
  }

  selectGroup(group: TagGroup): void {
    const groupIndex = this.groups.indexOf(group);

    if (
      groupIndex === this.currentStartIndex + this.maxVisibleTabs - 1 &&
      groupIndex < this.groups.length - 1
    ) {
      // Shift right
      this.currentStartIndex += this.maxVisibleTabs - 1;
    } else if (
      groupIndex === this.currentStartIndex &&
      this.currentStartIndex > 0
    ) {
      // Shift left
      this.currentStartIndex -= this.maxVisibleTabs - 1;
    }

    // Ensure indices stay within bounds
    this.currentStartIndex = Math.min(
      Math.max(0, this.currentStartIndex),
      this.groups.length - this.maxVisibleTabs,
    );

    this.updateVisibleGroups();

    // Set the clicked group as active
    this.currentGroup = group;
  }

  private switchToNextGroup(): void {
    const currentIndex = this.groups.indexOf(this.currentGroup!);
    const nextIndex = (currentIndex + 1) % this.groups.length;

    this.currentGroup = this.groups[nextIndex];

    // Dynamically adjust the visible range if the next group is outside the current view
    if (nextIndex >= this.currentStartIndex + this.maxVisibleTabs) {
      this.currentStartIndex = Math.min(
        nextIndex,
        this.groups.length - this.maxVisibleTabs,
      );
    } else if (nextIndex < this.currentStartIndex) {
      this.currentStartIndex = nextIndex;
    }

    this.updateVisibleGroups();
  }

  // Toggle tag selection and move to the next group
  toggleTagAndNextGroup(tag: Tag): void {
    const tagIndex = this.selectedTags.findIndex((t) => t.id === tag.id);

    if (tagIndex > -1) {
      // Tag already selected
      if (this.canReplace) {
        this.selectedTags.splice(tagIndex, 1);
        this.tagRemoved.emit(tag);
        return;
      }
    } else {
      // Add new tag
      if (!this.canMultiSelect) {
        // Remove existing tags from the same group
        this.selectedTags = this.selectedTags.filter(
          (t) => t.group !== this.currentGroup?.id,
        );
      }
      this.selectedTags.push(tag);
      this.tagSelected.emit(tag);
    }

    // Automatically move to the next group
    this.switchToNextGroup();
  }

  // Check if a tag is selected
  isTagSelected(tag: Tag): boolean {
    return this.selectedTags.some((t) => t.id === tag.id);
  }

  // Check if a group has been processed (has selected tags)
  isGroupProcessed(group: TagGroup): boolean {
    return this.selectedTags.some((tag) => tag.group === group.id);
  }
}
