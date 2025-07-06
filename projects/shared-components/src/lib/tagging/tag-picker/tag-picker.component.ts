import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagGroup, Tag, ExtendedTagGroup, ExtendedTag } from '../tag.interface';
import {
  getColorPreset,
  getContrastColor,
  getTestTagMatrix,
} from '../test-data';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  selector: 'app-tag-picker',
  templateUrl: './tag-picker.component.html',
  styleUrls: ['./tag-picker.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TagPickerComponent implements OnInit, OnChanges {
  // === INPUTS (Primary way to configure the component) ===
  @Input() customTagGroups: TagGroup[] = [];
  @Input() selectedTags: Tag[] = []; // Pre-selected tags
  @Input() palette: string[] = getColorPreset();
  @Input() key = '1';
  @Input() canMultiSelect = false;
  @Input() canReplace = true;
  @Input() maxVisibleTabs = 5;
  @Input() autoAdvanceGroups = true; // Auto-advance to next group after selection

  // === NEW: STATEFUL MODE ===
  @Input() statefulMode = false; // When true, don't reinitialize on selectedTags changes

  // === OUTPUTS ===
  @Output() tagAdded = new EventEmitter<Tag>();
  @Output() tagRemoved = new EventEmitter<Tag>();
  @Output() selectionChanged = new EventEmitter<Tag[]>(); // Emit all selected tags
  @Output() allGroupsProcessed = new EventEmitter<boolean>(); // Emit when all groups have tags

  // === INTERNAL STATE ===
  visibleGroups: ExtendedTagGroup[] = [];
  currentGroup: ExtendedTagGroup | null = null;
  groups: ExtendedTagGroup[] = [];
  internalSelectedTags: ExtendedTag[] = [];

  private currentStartIndex = 0;

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const shouldReinitialize = this.shouldReinitializeComponent(changes);

    if (shouldReinitialize) {
      this.initializeComponent();
    } else if (changes['selectedTags'] && this.statefulMode) {
      // In stateful mode, just sync the selected tags without full reinitialization
      this.syncSelectedTagsOnly();
    }
  }

  private isLastGroup(): boolean {
    if (!this.currentGroup) return false;
    const currentIndex = this.groups.indexOf(this.currentGroup);
    return currentIndex === this.groups.length - 1;
  }

  /**
   * Determine if we should reinitialize the entire component
   */
  private shouldReinitializeComponent(changes: SimpleChanges): boolean {
    // Always reinitialize on these changes
    if (changes['customTagGroups'] || changes['palette'] || changes['key']) {
      return true;
    }

    // In stateful mode, don't reinitialize for selectedTags changes
    if (changes['selectedTags'] && this.statefulMode) {
      return false;
    }

    // In non-stateful mode, reinitialize for selectedTags changes
    if (changes['selectedTags'] && !this.statefulMode) {
      return true;
    }

    return false;
  }

  /**
   * Sync only the selected tags without reinitializing groups or colors
   */
  private syncSelectedTagsOnly(): void {
    this.internalSelectedTags = this.selectedTags.map((tag) => {
      // Find the full extended tag from our groups
      const group = this.groups.find((g) => g.id === tag.group);
      const fullTag = group?.tags.find((t) => t.id === tag.id);

      if (fullTag) {
        return { ...fullTag };
      } else {
        // Fallback for tags not in our groups
        return { ...tag, color: '', backgroundColor: '' };
      }
    });

    this.checkAndEmitAllGroupsProcessed();
  }

  /**
   * Initialize the component with current inputs
   */
  private initializeComponent(): void {
    // RESET ALL STATE
    this.resetComponentState();

    // Use input data or fall back to test data
    const tagGroups =
      this.customTagGroups.length > 0
        ? this.customTagGroups
        : getTestTagMatrix(3, 5);

    this.initializeGroups(tagGroups);
    this.initializeSelectedTags();

    // Set current group AFTER groups are initialized
    this.setInitialCurrentGroup();
    this.updateVisibleGroups();
  }

  /**
   * Reset all internal state
   */
  private resetComponentState(): void {
    this.currentStartIndex = 0;
    this.currentGroup = null;
    this.groups = [];
    this.visibleGroups = [];
    this.internalSelectedTags = [];
  }

  /**
   * Set the initial current group based on selected tags or default to first
   */
  private setInitialCurrentGroup(): void {
    if (this.groups.length === 0) {
      this.currentGroup = null;
      return;
    }

    // If we have selected tags, try to set current group to the first group with selections
    if (this.internalSelectedTags.length > 0) {
      const firstSelectedGroup = this.groups.find((group) =>
        this.internalSelectedTags.some((tag) => tag.group === group.id),
      );
      if (firstSelectedGroup) {
        this.currentGroup = firstSelectedGroup;
        // Update pagination to show this group
        const groupIndex = this.groups.indexOf(firstSelectedGroup);
        this.adjustPaginationForGroup(groupIndex);
        return;
      }
    }

    // Default to first group
    this.currentGroup = this.groups[0];
  }

  /**
   * Adjust pagination to ensure a specific group is visible
   */
  private adjustPaginationForGroup(groupIndex: number): void {
    if (this.groups.length <= this.maxVisibleTabs) {
      this.currentStartIndex = 0;
      return;
    }

    // If group is not in current visible range, adjust
    if (
      groupIndex < this.currentStartIndex ||
      groupIndex >= this.currentStartIndex + this.maxVisibleTabs
    ) {
      // Center the group in the visible range
      this.currentStartIndex = Math.max(
        0,
        groupIndex - Math.floor(this.maxVisibleTabs / 2),
      );

      // Ensure we don't go past the end
      this.currentStartIndex = Math.min(
        this.currentStartIndex,
        this.groups.length - this.maxVisibleTabs,
      );
    }
  }

  /**
   * Initialize groups and assign colors
   */
  private initializeGroups(tagGroups: TagGroup[]): void {
    this.groups = tagGroups.map((group) => {
      const tags = group.tags.map((tag) => ({
        ...tag,
        color: '',
        backgroundColor: '',
      }));
      return {
        ...group,
        tags,
        color: '',
        backgroundColor: '',
      };
    });

    this.assignColors();
  }

  /**
   * Initialize selected tags from input
   */
  private initializeSelectedTags(): void {
    this.internalSelectedTags = this.selectedTags.map((tag) => ({
      ...tag,
      color: '',
      backgroundColor: '',
    }));

    // Apply colors to selected tags
    this.internalSelectedTags.forEach((selectedTag) => {
      const group = this.groups.find((g) => g.id === selectedTag.group);
      const fullTag = group?.tags.find((t) => t.id === selectedTag.id);
      if (fullTag) {
        selectedTag.color = fullTag.color;
        selectedTag.backgroundColor = fullTag.backgroundColor;
      }
    });
  }

  /**
   * Assign colors to groups and tags
   */
  private assignColors(): void {
    const allColors = this.palette;
    const contrastColors = allColors.map((c) => getContrastColor(c));

    const totalTags = this.groups.reduce(
      (sum, group) => sum + group.tags.length,
      0,
    );
    const totalGroups = this.groups.length;
    const colorStep = Math.max(1, Math.floor(allColors.length / totalTags));
    const groupStep = Math.max(1, Math.floor(allColors.length / totalGroups));

    let globalTagIndex = 0;

    this.groups.forEach((group, groupIndex) => {
      const groupColorIndex = (groupIndex * groupStep) % allColors.length;
      group.color = contrastColors[groupColorIndex];
      group.backgroundColor = allColors[groupColorIndex];

      group.tags.forEach((tag) => {
        const colorIndex = (globalTagIndex * colorStep) % allColors.length;
        tag.color = contrastColors[colorIndex];
        tag.backgroundColor = allColors[colorIndex];
        globalTagIndex++;
      });
    });
  }

  /**
   * Update visible groups for pagination
   */
  private updateVisibleGroups(): void {
    const totalGroups = this.groups.length;

    if (totalGroups <= this.maxVisibleTabs) {
      this.visibleGroups = this.groups;
      return;
    }

    this.visibleGroups = this.groups.slice(
      this.currentStartIndex,
      this.currentStartIndex + this.maxVisibleTabs,
    );

    // Handle wrap-around
    if (this.currentStartIndex + this.maxVisibleTabs > totalGroups) {
      const remaining = totalGroups - this.currentStartIndex;
      this.visibleGroups = this.groups
        .slice(this.currentStartIndex)
        .concat(this.groups.slice(0, this.maxVisibleTabs - remaining));
    }
  }

  /**
   * Select a group manually and update pagination
   */
  selectGroup(group: ExtendedTagGroup): void {
    const groupIndex = this.groups.indexOf(group);
    this.currentGroup = group;

    // Update visible groups if needed for pagination
    if (
      groupIndex < this.currentStartIndex ||
      groupIndex >= this.currentStartIndex + this.maxVisibleTabs
    ) {
      this.adjustPaginationForGroup(groupIndex);
      this.updateVisibleGroups();
    } else {
      // Handle edge cases for smooth pagination
      const totalGroups = this.groups.length;

      // If we clicked the last visible tab and there are more tabs to the right
      if (
        groupIndex === this.currentStartIndex + this.maxVisibleTabs - 1 &&
        this.currentStartIndex + this.maxVisibleTabs < totalGroups
      ) {
        this.currentStartIndex = Math.min(
          this.currentStartIndex + 1,
          totalGroups - this.maxVisibleTabs,
        );
        this.updateVisibleGroups();
      }
      // If we clicked the first visible tab and there are more tabs to the left
      else if (
        groupIndex === this.currentStartIndex &&
        this.currentStartIndex > 0
      ) {
        this.currentStartIndex = Math.max(this.currentStartIndex - 1, 0);
        this.updateVisibleGroups();
      }
    }
  }

  /**
   * Toggle tag selection
   */
  toggleTag(tag: ExtendedTag): void {
    const tagIndex = this.internalSelectedTags.findIndex(
      (t) => t.id === tag.id,
    );
    let wasAdded = false;

    if (tagIndex > -1) {
      // Tag is selected - remove it if replacement is allowed
      if (this.canReplace) {
        const removedTag = this.internalSelectedTags.splice(tagIndex, 1)[0];
        this.tagRemoved.emit(removedTag);
      }
    } else {
      wasAdded = true;

      if (!this.canMultiSelect) {
        // Remove existing tags from the SAME GROUP as the new tag
        const newTagGroupId = tag.group;
        const tagsToRemove = this.internalSelectedTags.filter(
          (t) => t.group === newTagGroupId,
        );

        tagsToRemove.forEach((t) => this.tagRemoved.emit(t));
        this.internalSelectedTags = this.internalSelectedTags.filter(
          (t) => t.group !== newTagGroupId,
        );
      }

      // Add the new tag
      this.internalSelectedTags.push(tag);
      this.tagAdded.emit(tag);
    }

    // Emit all selected tags
    this.selectionChanged.emit([...this.internalSelectedTags]);

    // Check if all groups are processed and emit
    this.checkAndEmitAllGroupsProcessed();

    // Auto-advance to next group if enabled
    if (this.autoAdvanceGroups && wasAdded) {
      this.switchToNextGroup();
    }
  }

  /**
   * Move to the next group
   */
  private switchToNextGroup(): void {
    if (!this.currentGroup) return;

    const currentIndex = this.groups.indexOf(this.currentGroup);
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.groups.length) {
      this.currentGroup = this.groups[nextIndex];

      // Simple pagination - just move forward when needed
      if (nextIndex >= this.currentStartIndex + this.maxVisibleTabs) {
        this.currentStartIndex = nextIndex - this.maxVisibleTabs + 1;
        this.updateVisibleGroups();
      }
    }
  }

  /**
   * Check if a tag is selected
   */
  isTagSelected(tag: Tag): boolean {
    return this.internalSelectedTags.some((t) => t.id === tag.id);
  }

  /**
   * Check if a group has any selected tags
   */
  isGroupProcessed(group: TagGroup): boolean {
    return this.internalSelectedTags.some((tag) => tag.group === group.id);
  }

  /**
   * Check if all groups have at least one selected tag
   */
  areAllGroupsProcessed(): boolean {
    if (this.groups.length === 0) return false;
    return this.groups.every((group) => this.isGroupProcessed(group));
  }

  /**
   * Check and emit all groups processed status
   */
  private checkAndEmitAllGroupsProcessed(): void {
    const allProcessed = this.areAllGroupsProcessed();
    this.allGroupsProcessed.emit(allProcessed);
  }

  /**
   * Get all currently selected tags (for external access)
   */
  getSelectedTags(): Tag[] {
    return [...this.internalSelectedTags];
  }

  /**
   * PUBLIC: Add a tag programmatically (useful for external control)
   */
  addTag(tag: Tag): void {
    const group = this.groups.find((g) => g.id === tag.group);
    const fullTag = group?.tags.find((t) => t.id === tag.id);

    if (fullTag && !this.isTagSelected(fullTag)) {
      this.toggleTag(fullTag);
    }
  }

  /**
   * PUBLIC: Remove a tag programmatically
   */
  removeTag(tagId: string): void {
    const tagToRemove = this.internalSelectedTags.find((t) => t.id === tagId);
    if (tagToRemove) {
      this.toggleTag(tagToRemove);
    }
  }

  /**
   * PUBLIC: Clear all selections
   */
  clearAllTags(): void {
    const tagsToRemove = [...this.internalSelectedTags];
    this.internalSelectedTags = [];

    tagsToRemove.forEach((tag) => {
      this.tagRemoved.emit(tag);
    });

    this.selectionChanged.emit([]);
    this.checkAndEmitAllGroupsProcessed();
  }
}
