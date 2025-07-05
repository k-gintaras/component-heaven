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
  @Input() canMultiSelect = false;
  @Input() canReplace = true;
  @Input() maxVisibleTabs = 5;
  @Input() autoAdvanceGroups = true; // Auto-advance to next group after selection

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
    if (
      changes['customTagGroups'] ||
      changes['selectedTags'] ||
      changes['palette']
    ) {
      this.initializeComponent();
    }
  }

  /**
   * Initialize the component with current inputs
   */
  private initializeComponent(): void {
    // Use input data or fall back to test data
    const tagGroups =
      this.customTagGroups.length > 0
        ? this.customTagGroups
        : getTestTagMatrix(3, 5);

    this.initializeGroups(tagGroups);
    this.initializeSelectedTags();

    if (this.groups.length > 0) {
      this.currentGroup = this.groups[0];
    }

    this.updateVisibleGroups();
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
      // If clicking on a group that's not visible, center it in the view
      this.currentStartIndex = Math.max(
        0,
        groupIndex - Math.floor(this.maxVisibleTabs / 2),
      );
      this.currentStartIndex = Math.min(
        this.currentStartIndex,
        this.groups.length - this.maxVisibleTabs,
      );

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

    if (tagIndex > -1) {
      // Tag is selected - remove it if replacement is allowed
      if (this.canReplace) {
        const removedTag = this.internalSelectedTags.splice(tagIndex, 1)[0];
        this.tagRemoved.emit(removedTag);
      }
    } else {
      // Tag is not selected - add it
      if (!this.canMultiSelect) {
        // Remove other tags from the same group
        const tagsToRemove = this.internalSelectedTags.filter(
          (t) => t.group === this.currentGroup?.id,
        );

        tagsToRemove.forEach((removedTag) => {
          this.tagRemoved.emit(removedTag);
        });

        this.internalSelectedTags = this.internalSelectedTags.filter(
          (t) => t.group !== this.currentGroup?.id,
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
    if (this.autoAdvanceGroups) {
      this.switchToNextGroup();
    }
    this.selectedTags = this.internalSelectedTags.map(
      ({ id, name, group }) => ({ id, name, group }),
    );
  }

  /**
   * Move to the next group
   */
  private switchToNextGroup(): void {
    if (!this.currentGroup) return;

    const currentIndex = this.groups.indexOf(this.currentGroup);
    const nextIndex = (currentIndex + 1) % this.groups.length;
    this.currentGroup = this.groups[nextIndex];

    // Update visible groups if needed
    if (nextIndex >= this.currentStartIndex + this.maxVisibleTabs) {
      this.currentStartIndex = Math.min(
        nextIndex,
        this.groups.length - this.maxVisibleTabs,
      );
      this.updateVisibleGroups();
    } else if (nextIndex < this.currentStartIndex) {
      this.currentStartIndex = nextIndex;
      this.updateVisibleGroups();
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
   * Get processing statistics
   */
  getProcessingStats(): {
    totalGroups: number;
    processedGroups: number;
    unprocessedGroups: number;
    completionPercentage: number;
    isComplete: boolean;
  } {
    const totalGroups = this.groups.length;
    const processedGroups = this.groups.filter((group) =>
      this.isGroupProcessed(group),
    ).length;
    const unprocessedGroups = totalGroups - processedGroups;
    const completionPercentage =
      totalGroups > 0 ? Math.round((processedGroups / totalGroups) * 100) : 0;
    const isComplete = this.areAllGroupsProcessed();

    return {
      totalGroups,
      processedGroups,
      unprocessedGroups,
      completionPercentage,
      isComplete,
    };
  }

  /**
   * Get unprocessed groups (groups with no selected tags)
   */
  getUnprocessedGroups(): ExtendedTagGroup[] {
    return this.groups.filter((group) => !this.isGroupProcessed(group));
  }

  /**
   * Programmatically clear all selections
   */
  clearAllTags(): void {
    const tagsToRemove = [...this.internalSelectedTags];
    this.internalSelectedTags = [];

    tagsToRemove.forEach((tag) => {
      this.tagRemoved.emit(tag);
    });

    this.selectionChanged.emit([]);
  }

  /**
   * Programmatically add a tag
   */
  addTag(tag: Tag): void {
    const group = this.groups.find((g) => g.id === tag.group);
    const fullTag = group?.tags.find((t) => t.id === tag.id);

    if (fullTag && !this.isTagSelected(fullTag)) {
      this.toggleTag(fullTag);
    }
  }
}
