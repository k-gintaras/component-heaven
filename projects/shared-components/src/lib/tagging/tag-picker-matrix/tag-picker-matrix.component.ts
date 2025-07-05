import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
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
  selector: 'app-tag-picker-matrix',
  templateUrl: './tag-picker-matrix.component.html',
  styleUrls: ['./tag-picker-matrix.component.css'],
  imports: [FormsModule, NgIf, NgFor],
  encapsulation: ViewEncapsulation.None,
})
export class TagPickerMatrixComponent implements OnInit, OnChanges {
  @Input() customTagGroups: TagGroup[] = [];
  @Input() selectedTags: Tag[] = [];
  @Input() palette: string[] = getColorPreset();
  @Input() canMultiSelect = false;
  @Input() canReplace = true;
  @Output() tagAdded = new EventEmitter<Tag>();
  @Output() tagRemoved = new EventEmitter<Tag>();
  @Output() selectionChanged = new EventEmitter<Tag[]>();
  @Output() allGroupsProcessed = new EventEmitter<boolean>();

  groups: ExtendedTagGroup[] = [];
  internalSelectedTags: ExtendedTag[] = [];

  ngOnInit(): void {
    this.init();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['customTagGroups'] ||
      changes['selectedTags'] ||
      changes['palette']
    ) {
      this.init();
    }
  }

  private init() {
    const source = this.customTagGroups.length
      ? this.customTagGroups
      : getTestTagMatrix(4, 3);
    this.groups = source.map((g) => ({
      ...g,
      tags: g.tags.map((t) => ({ ...t, color: '', backgroundColor: '' })),
      color: '',
      backgroundColor: '',
    }));
    this.assignColors();
    this.syncSelected();
  }

  private assignColors() {
    const colors = this.palette;
    const contrasts = colors.map((c) => getContrastColor(c));
    let tagIndex = 0;
    const totalTags = this.groups.reduce((sum, g) => sum + g.tags.length, 0);
    const step = Math.max(1, Math.floor(colors.length / totalTags));

    this.groups.forEach((g, gi) => {
      g.tags.forEach((t) => {
        const idx = (tagIndex * step) % colors.length;
        t.backgroundColor = colors[idx];
        t.color = contrasts[idx];
        tagIndex++;
      });
    });
  }

  private syncSelected() {
    this.internalSelectedTags = this.selectedTags.map((tag) => {
      const group = this.groups.find((g) => g.id === tag.group);
      const full = group?.tags.find((t) => t.id === tag.id);
      return full ? { ...full } : { ...tag, color: '', backgroundColor: '' };
    });
  }

  isSelected(tag: ExtendedTag): boolean {
    return this.internalSelectedTags.some((t) => t.id === tag.id);
  }

  toggle(tag: ExtendedTag) {
    const idx = this.internalSelectedTags.findIndex((t) => t.id === tag.id);

    if (idx > -1) {
      // Deselect
      if (this.canReplace) {
        this.internalSelectedTags.splice(idx, 1);
        this.tagRemoved.emit(tag);
      }
    } else {
      // In single-select mode remove *only* that group’s existing tags
      if (!this.canMultiSelect) {
        const groupRemovals = this.internalSelectedTags.filter(
          (t) => t.group === tag.group,
        );
        groupRemovals.forEach((r) => {
          const rmIdx = this.internalSelectedTags.findIndex(
            (x) => x.id === r.id,
          );
          this.internalSelectedTags.splice(rmIdx, 1);
          this.tagRemoved.emit(r);
        });
      }
      // Add new
      this.internalSelectedTags.push(tag);
      this.tagAdded.emit(tag);
    }

    this.selectionChanged.emit([...this.internalSelectedTags]);
    this.allGroupsProcessed.emit(
      this.groups.every((g) =>
        g.tags.some((t) =>
          this.internalSelectedTags.some((s) => s.id === t.id),
        ),
      ),
    );
  }

  clear() {
    this.internalSelectedTags.forEach((t) => this.tagRemoved.emit(t));
    this.internalSelectedTags = [];
    this.selectionChanged.emit([]);
  }
}
