import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Tag, TagItem } from '../tag.interface';
import { TagService } from '../tag.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'lib-item-filter',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './item-filter.component.html',
  styleUrl: './item-filter.component.css',
})
export class ItemFilterComponent {
  /** Raw items to filter */
  @Input() items: TagItem[] = [];
  /** Emits filtered items */
  @Output() filtered = new EventEmitter<TagItem[]>();

  availableTags: Tag[] = [];
  selectedTagIds: string[] = [];
  results: TagItem[] = [];
  private original: TagItem[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.setup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.setup();
    }
  }

  /** Prepare unique tags and initial results */
  private setup(): void {
    this.original = [...this.items];
    this.availableTags = this.tagService.getUniqueTagsFromItems(this.original);
    this.apply();
  }

  /** Apply tag-based filter (any-match) */
  apply(): void {
    if (this.selectedTagIds.length > 0) {
      this.results = this.tagService.filterItemsByTags(
        [...this.original],
        this.selectedTagIds,
        false,
      );
    } else {
      this.results = [...this.original];
    }
    this.filtered.emit(this.results);
  }
}
