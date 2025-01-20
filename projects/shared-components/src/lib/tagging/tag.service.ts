// tag.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TagItem, TagGroup, Tag } from './tag.interface';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private currentItemSubject = new BehaviorSubject<TagItem | null>(null);
  private tagGroupsSubject = new BehaviorSubject<TagGroup[]>([]);

  currentItem$ = this.currentItemSubject.asObservable();
  tagGroups$ = this.tagGroupsSubject.asObservable();

  /**
   * Set the current file to work on.
   */
  setCurrentItem(data: TagItem): void {
    this.currentItemSubject.next({ ...data });
  }

  /**
   * Set available tag groups.
   */
  setTagGroups(groups: TagGroup[]): void {
    this.tagGroupsSubject.next([...groups]);
  }
}
