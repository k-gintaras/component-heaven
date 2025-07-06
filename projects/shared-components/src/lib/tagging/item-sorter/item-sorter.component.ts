import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagItem } from '../tag.interface';
import { TagService } from '../tag.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-item-sorter',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './item-sorter.component.html',
  styleUrl: './item-sorter.component.css',
})
export class ItemSorterComponent implements OnInit {
  /** incoming raw items */
  @Input() items: TagItem[] = [];
  /** emits the newly sorted array */
  @Output() sorted = new EventEmitter<TagItem[]>();

  method: 'name' | 'tagCount' = 'name';
  asc = true;
  private original: TagItem[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit() {
    // keep a pristine copy
    this.original = [...this.items];
    // sort once on init
    this.apply();
  }

  apply() {
    const base = [...this.original];
    const out =
      this.method === 'name'
        ? this.tagService.sortItemsByName(base, this.asc)
        : this.tagService.sortItemsByTagCount(base, this.asc);
    this.sorted.emit(out);
  }
}
