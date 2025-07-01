import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagGroup, Tag, ExtendedTagGroup, ExtendedTag } from '../tag.interface';
import {
  getColorPreset,
  getContrastColor,
  getTestTagMatrix,
} from '../test-data';
import { TagService } from '../tag.service';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  selector: 'app-tag-picker',
  templateUrl: './tag-picker.component.html',
  styleUrls: ['./tag-picker.component.css'],
  encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class TagPickerComponent implements OnInit {
  @Input() customTagGroups: TagGroup[] = getTestTagMatrix(20, 10);

  @Input() palette: string[] = this.getDefaultPalette();
  @Input() contrastPalette: string[] = this.getContrastPalette(this.palette);

  @Input() canMultiSelect = false;
  @Input() canReplace = true;
  @Input() maxVisibleTabs = 5;
  @Output() tagAdded = new EventEmitter<Tag>();
  @Output() tagRemoved = new EventEmitter<Tag>();

  visibleGroups: ExtendedTagGroup[] = [];
  private currentStartIndex = 0;

  currentGroup: ExtendedTagGroup | null = null;
  groups: ExtendedTagGroup[] = [];
  selectedTags: ExtendedTag[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagService.tagGroups$.subscribe((groups) => {
      this.customTagGroups = groups;
      this.initializeGroups();
      if (this.groups.length > 0) {
        this.currentGroup = this.groups[0];
      }
      this.updateVisibleGroups();
    });

    this.tagService.currentItem$.subscribe((item) => {
      if (item) {
        // Reset to first group when switching items
        this.currentGroup = this.groups.length > 0 ? this.groups[0] : null;

        // Set selected tags from the current item
        this.selectedTags = item.tags.map((tag) => ({
          ...tag,
          color: '',
          backgroundColor: '',
        }));

        this.preSelectTags(this.selectedTags);
        this.updateVisibleGroups();
      } else {
        // No current item - clear selections
        this.selectedTags = [];
        this.currentGroup = this.groups.length > 0 ? this.groups[0] : null;
        this.updateVisibleGroups();
      }
    });
  }

  preSelectTags(preSelectedTags: Tag[]): void {
    preSelectedTags.forEach((preTag) => {
      // Locate the corresponding tag in groups
      const group = this.groups.find((g) => g.id === preTag.group);
      if (!group) return; // Skip if no matching group found

      const tag = group.tags.find((t) => t.id === preTag.id);
      if (tag && !this.isTagSelected(tag)) {
        // Toggle tag if it's not already selected
        this.toggleTagAndNextGroup(tag as ExtendedTag);
      }
    });
  }

  /**
   * Initialize groups by converting TagGroup to ExtendedTagGroup.
   * Colors are added only if needed later.
   */
  initializeGroups(): void {
    this.groups = this.customTagGroups.map((group) => {
      const tags = group.tags.map((tag) => ({
        ...tag,
        color: '', // Placeholder for future color assignment
        backgroundColor: '',
      }));
      return {
        ...group,
        tags,
        color: '', // Placeholder for group-level color
        backgroundColor: '',
      };
    });
    this.assignColors();
  }

  /**
   * Dynamically assign colors to groups and tags using the provided palette.
   */
  assignColors(): void {
    const allColors = this.palette; // Use the provided palette
    const contrastColors = this.getContrastPalette(allColors); // Get contrast colors

    const totalTags = this.groups.reduce(
      (sum, group) => sum + group.tags.length,
      0,
    ); // Total number of tags
    const totalGroups = this.groups.length; // Total number of tags
    const colorStep = Math.max(1, Math.floor(allColors.length / totalTags)); // Calculate step size for even distribution
    const groupStep = Math.max(1, Math.floor(allColors.length / totalGroups)); // Calculate step size for even distribution

    let globalTagIndex = 0; // Track the global tag index across all groups

    // Assign colors to groups and their tags
    this.groups.forEach((group, groupIndex) => {
      const groupColorIndex = (groupIndex * groupStep) % allColors.length; // Index for group color
      group.color = contrastColors[groupColorIndex];
      group.backgroundColor = allColors[groupColorIndex];

      group.tags.forEach((tag, tagIndex) => {
        const colorIndex = (globalTagIndex * colorStep) % allColors.length; // Index for tag color
        tag.color = contrastColors[colorIndex];
        tag.backgroundColor = allColors[colorIndex];
        globalTagIndex++; // Increment global tag index
      });
    });
  }

  /**
   * Update the visible groups for pagination.
   */
  private updateVisibleGroups(): void {
    const totalGroups = this.groups.length;

    if (totalGroups <= this.maxVisibleTabs) {
      this.visibleGroups = this.groups;
      return;
    }

    this.currentStartIndex =
      (this.currentStartIndex + totalGroups) % totalGroups;

    this.visibleGroups = this.groups.slice(
      this.currentStartIndex,
      this.currentStartIndex + this.maxVisibleTabs,
    );

    if (
      this.currentStartIndex + this.maxVisibleTabs > totalGroups &&
      this.currentStartIndex < totalGroups
    ) {
      const remaining = totalGroups - this.currentStartIndex;
      this.visibleGroups = this.groups
        .slice(this.currentStartIndex)
        .concat(this.groups.slice(0, this.maxVisibleTabs - remaining));
    }
  }

  /**
   * Select a group and update visible range if necessary.
   */
  selectGroup(group: ExtendedTagGroup): void {
    const groupIndex = this.groups.indexOf(group);

    if (
      groupIndex === this.currentStartIndex + this.maxVisibleTabs - 1 &&
      groupIndex < this.groups.length - 1
    ) {
      this.currentStartIndex += this.maxVisibleTabs - 1;
    } else if (
      groupIndex === this.currentStartIndex &&
      this.currentStartIndex > 0
    ) {
      this.currentStartIndex -= this.maxVisibleTabs - 1;
    }

    this.currentStartIndex = Math.min(
      Math.max(0, this.currentStartIndex),
      this.groups.length - this.maxVisibleTabs,
    );

    this.updateVisibleGroups();
    this.currentGroup = group;
  }

  /**
   * Toggle tag selection and move to the next group.
   */
  toggleTagAndNextGroup(tag: ExtendedTag): void {
    const tagIndex = this.selectedTags.findIndex((t) => t.id === tag.id);

    if (tagIndex > -1) {
      // If the tag is already selected and can be replaced, remove it
      if (this.canReplace) {
        this.selectedTags.splice(tagIndex, 1);
        this.tagRemoved.emit(tag);
        return;
      }
    } else {
      if (!this.canMultiSelect) {
        // Find tags from the same group that are no longer included
        const tagsToRemove = this.selectedTags.filter(
          (t) => t.group === this.currentGroup?.id && t.id !== tag.id,
        );

        // Emit tagRemoved for each tag that is removed
        tagsToRemove.forEach((removedTag) => {
          this.tagRemoved.emit(removedTag);
        });

        // Update the selectedTags array to include only the new tag
        this.selectedTags = this.selectedTags.filter(
          (t) => t.group !== this.currentGroup?.id,
        );
      }

      // Add the new tag to the selectedTags array
      this.selectedTags.push(tag);
      this.tagAdded.emit(tag);
    }

    // Switch to the next group after toggling the tag
    this.switchToNextGroup();
  }

  /**
   * Helper to move to the next group.
   */
  private switchToNextGroup(): void {
    const currentIndex = this.groups.indexOf(this.currentGroup!);
    const nextIndex = (currentIndex + 1) % this.groups.length;

    this.currentGroup = this.groups[nextIndex];

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

  getDefaultPalette(): string[] {
    return getColorPreset();
  }

  getContrastPalette(colors: string[]): string[] {
    return colors.map((c) => getContrastColor(c));
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
