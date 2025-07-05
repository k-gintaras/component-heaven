// preset.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SortFilterPreset {
  name: string;
  sortBy: 'name' | 'tagCount';
  asc: boolean;
  filterTags: string[];
}

@Injectable({ providedIn: 'root' })
export class PresetService {
  private presets$ = new BehaviorSubject<SortFilterPreset[]>([]);
  /** Observable stream of presets */
  readonly presets = this.presets$.asObservable();

  /** Get current presets synchronously */
  getPresets(): SortFilterPreset[] {
    return this.presets$.value;
  }

  /** Replace entire presets list */
  setPresets(presets: SortFilterPreset[]): void {
    this.presets$.next([...presets]);
  }

  /** Add a new preset */
  addPreset(p: SortFilterPreset): void {
    this.presets$.next([...this.presets$.value, p]);
  }

  /** Remove a preset by name */
  removePreset(name: string): void {
    this.presets$.next(this.presets$.value.filter((p) => p.name !== name));
  }

  /** Update an existing preset */
  updatePreset(oldName: string, newPreset: SortFilterPreset): void {
    this.presets$.next(
      this.presets$.value.map((p) => (p.name === oldName ? newPreset : p)),
    );
  }

  /** Clear all presets */
  clearPresets(): void {
    this.presets$.next([]);
  }
}
