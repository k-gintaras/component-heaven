import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { Tag, TagGroup, TagItem } from '../tag.interface';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { TagPickerComponent } from '../tag-picker/tag-picker.component';
import { TagPickerMatrixComponent } from '../tag-picker-matrix/tag-picker-matrix.component';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ItemTaggingService, TaggingConfig } from '../item-tagging.service';

@Component({
  standalone: true,
  selector: 'app-tag-multiple-items',
  templateUrl: './tag-multiple-items.component.html',
  styleUrls: ['./tag-multiple-items.component.css'],
  imports: [
    TagPickerComponent,
    TagPickerMatrixComponent,
    MatIcon,
    NgClass,
    NgIf,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TagMultipleItemsComponent implements OnInit {
  // === INPUTS ===
  @Input() items: TagItem[] = [];
  @Input() tagGroups: TagGroup[] = [];
  @Input() allowMultiplePerGroup: boolean = false;
  @Input() autoAdvanceGroups: boolean = true;
  @Input() autoAdvanceItems: boolean = false;
  @Input() maxVisibleTabs: number = 5;
  @Input() alwaysStartFromFirstTab: boolean = true;

  // === OUTPUTS ===
  @Output() tagAdded = new EventEmitter<{
    tag: Tag;
    item: TagItem;
    itemIndex: number;
  }>();
  @Output() tagRemoved = new EventEmitter<{
    tag: Tag;
    item: TagItem;
    itemIndex: number;
  }>();
  @Output() itemChanged = new EventEmitter<{ item: TagItem; index: number }>();
  @Output() itemCompleted = new EventEmitter<{
    item: TagItem;
    index: number;
    isComplete: boolean;
  }>();
  @Output() batchCompleted = new EventEmitter<{
    allComplete: boolean;
    completedCount: number;
    totalCount: number;
  }>();

  // === STATE ===
  currentItem: TagItem | null = null;
  currentItemTags: Tag[] = [];
  canNavigateNext = false;
  canNavigatePrevious = false;
  completionStats: any = null;


  private destroy$ = new Subject<void>();

  constructor(private taggingService: ItemTaggingService) {}

  ngOnInit(): void {
    this.initializeService();
    this.subscribeToChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeService(): void {
    const config: Partial<TaggingConfig> = {
      allowMultiplePerGroup: this.allowMultiplePerGroup,
      autoAdvanceGroups: this.autoAdvanceGroups,
      autoAdvanceItems: this.autoAdvanceItems,
    };

    this.taggingService.initialize(this.items, this.tagGroups, config);
  }

  private subscribeToChanges(): void {
    // Subscribe to current item changes
    this.taggingService.currentItemId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateCurrentItemState();
      });

    // Subscribe to items changes (for tag updates)
    this.taggingService.items$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateCurrentItemState();
      this.updateCompletionStats();
    });

    // Subscribe to navigation state
    combineLatest([
      this.taggingService.items$,
      this.taggingService.currentItemId$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.canNavigateNext = this.taggingService.canNavigateNext();
        this.canNavigatePrevious = this.taggingService.canNavigatePrevious();
      });
  }

  private updateCurrentItemState(): void {
    this.currentItem = this.taggingService.getCurrentItem();
    this.currentItemTags = this.taggingService.getCurrentItemTags();

    if (this.currentItem) {
      const index = this.taggingService.getCurrentItemIndex();
      this.itemChanged.emit({ item: this.currentItem, index });
    }
  }

  private updateCompletionStats(): void {
    this.completionStats = this.taggingService.getCompletionStats();

    this.batchCompleted.emit({
      allComplete:
        this.completionStats.completedItems === this.completionStats.totalItems,
      completedCount: this.completionStats.completedItems,
      totalCount: this.completionStats.totalItems,
    });
  }

  // === EVENT HANDLERS ===

  onTagAdded(tag: Tag): void {
    if (!this.currentItem) return;

    const success = this.taggingService.toggleTag(this.currentItem.id, tag);
    if (success) {
      const index = this.taggingService.getCurrentItemIndex();
      this.tagAdded.emit({ tag, item: this.currentItem, itemIndex: index });

     // this.checkItemCompletion();
    }
  }

  onTagRemoved(tag: Tag): void {
    if (!this.currentItem) return;

    const success = this.taggingService.removeTag(this.currentItem.id, tag.id);
    if (success) {
      const index = this.taggingService.getCurrentItemIndex();
      this.tagRemoved.emit({ tag, item: this.currentItem, itemIndex: index });

      // this.checkItemCompletion();
    }
  }

  onItemCompleted(isComplete: boolean): void {
    console.log(`Item completed: ${isComplete}`, this.currentItem);
    if (!this.currentItem) return;

    const index = this.taggingService.getCurrentItemIndex();
    this.itemCompleted.emit({
      item: this.currentItem,
      index,
      isComplete,
    });

    // Auto-advance if enabled and item is complete
    if (this.autoAdvanceItems && isComplete && this.canNavigateNext) {
      this.goToNextItem();
    }
  }

  isItemCompleted(itemId: string): boolean {
    return this.taggingService.isItemComplete(itemId);
  }

  // === NAVIGATION ===

  goToNextItem(): void {
    this.taggingService.nextItem();
  }

  goToPreviousItem(): void {
    this.taggingService.previousItem();
  }

  goToItem(itemId: string): void {
    this.taggingService.setCurrentItem(itemId);
  }

  // === UTILITY ===

  getStatusText(): string {
    const stats = this.completionStats;
    if (!stats || stats.totalItems === 0) return 'No items';

    const currentIndex = this.taggingService.getCurrentItemIndex();
    return `Item ${currentIndex + 1} of ${stats.totalItems}`;
  }

  getItems(): TagItem[] {
    return this.taggingService.getItems();
  }

  getIncompleteItems(): TagItem[] {
    return this.taggingService.getIncompleteItems();
  }
}
