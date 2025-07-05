// preset-manager.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortFilterPreset, PresetService } from '../preset.service';
import { TagItem } from '../tag.interface';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-preset-manager',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './preset-manager.component.html',
  styleUrls: ['./preset-manager.component.css'],
})
export class PresetManagerComponent implements OnInit {
  /** Optionally passed in presets; if undefined, use service */
  @Input() presets?: SortFilterPreset[];
  /** Raw items to apply presets to */
  @Input() items: TagItem[] = [];

  /** Emits items after applying a preset */
  @Output() applied = new EventEmitter<TagItem[]>();
  /** Emits when a new preset is saved */
  @Output() saved = new EventEmitter<SortFilterPreset>();
  /** Emits preset removal */
  @Output() removed = new EventEmitter<string>();

  currentPresets: SortFilterPreset[] = [];
  presetName = '';
  selectedPreset?: SortFilterPreset;
  filterTags: string[] = [];
  method: 'name' | 'tagCount' = 'name';
  asc = true;

  constructor(
    private presetService: PresetService,
    private tagService: TagService,
  ) {}

  ngOnInit() {
    if (this.presets) {
      this.currentPresets = this.presets;
    } else {
      this.presetService.presets.subscribe((ps) => (this.currentPresets = ps));
    }
  }

  /** Save new preset with current settings */
  savePreset() {
    if (!this.presetName.trim()) return;
    const p: SortFilterPreset = {
      name: this.presetName.trim(),
      sortBy: this.method,
      asc: this.asc,
      filterTags: [...this.filterTags],
    };
    this.presetService.addPreset(p);
    this.saved.emit(p);
    this.presetName = '';
  }

  /** Apply the chosen preset to items */
  applyPreset(p: SortFilterPreset) {
    this.selectedPreset = p;
    // apply sort
    let result =
      p.sortBy === 'name'
        ? this.tagService.sortItemsByName([...this.items], p.asc)
        : this.tagService.sortItemsByTagCount([...this.items], p.asc);
    // apply filter
    if (p.filterTags.length) {
      result = this.tagService.filterItemsByTags(result, p.filterTags, false);
    }
    this.applied.emit(result);
  }

  /** Remove preset */
  deletePreset(name: string) {
    this.presetService.removePreset(name);
    this.removed.emit(name);
  }
}
