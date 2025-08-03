// tag-preset-showcase.component.ts
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {
  createPresetTagGroups,
  createSampleItemsForPreset,
  getAvailablePresets,
  PresetInfo,
} from './tag-group-presets';
import { TagMultipleItemsComponent } from './tag-multiple-items/tag-multiple-items.component';
import { TagGroup, TagItem } from './tag.interface';

@Component({
  standalone: true,
  selector: 'app-tag-preset-showcase',
  imports: [
    NgFor,
    NgIf,
    NgClass,
    MatIcon,
    MatButton,
    TagMultipleItemsComponent,
  ],
  template: `
    <div class="showcase-container p-6 max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          <mat-icon class="text-4xl mr-2 align-middle">science</mat-icon>
          Tag Group Presets Showcase
        </h1>
        <p class="text-gray-600 text-lg">
          Explore different tag group configurations and see how they work with
          real items
        </p>
      </div>

      <!-- Preset Selection Grid -->
      <div class="preset-grid mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">
          Choose a Preset to Try:
        </h2>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <button
            *ngFor="let preset of availablePresets"
            [ngClass]="{
              'bg-blue-500 text-white border-blue-500':
                currentPresetId === preset.id,
              'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50':
                currentPresetId !== preset.id,
            }"
            class="preset-card border-2 rounded-lg p-4 text-left transition-all duration-200 flex flex-col h-full"
            (click)="selectPreset(preset.id)"
          >
            <div class="flex items-center mb-2">
              <mat-icon class="mr-2">{{ preset.icon || 'label' }}</mat-icon>
              <span class="font-semibold">{{ preset.name }}</span>
            </div>
            <p class="text-sm opacity-80 mb-2 flex-grow">
              {{ preset.description }}
            </p>
            <p class="text-xs font-medium opacity-60">{{ preset.useCase }}</p>
          </button>
        </div>
      </div>

      <!-- Current Preset Info -->
      <div
        *ngIf="currentPreset"
        class="current-preset-info mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div class="flex items-center mb-2">
          <mat-icon class="text-blue-600 mr-2">{{
            currentPreset.icon || 'label'
          }}</mat-icon>
          <h3 class="text-lg font-semibold text-blue-800">
            {{ currentPreset.name }}
          </h3>
        </div>
        <p class="text-blue-700 mb-2">{{ currentPreset.description }}</p>
        <p class="text-sm text-blue-600">
          <strong>Common use case:</strong> {{ currentPreset.useCase }}
        </p>

        <!-- Tag Groups Preview -->
        <div class="mt-4">
          <h4 class="font-medium text-blue-800 mb-2">Available Tag Groups:</h4>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let group of currentTagGroups"
              class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ group.name }} ({{ group.tags.length }} tags)
            </span>
          </div>
        </div>
      </div>

      <!-- Tag Manager Demo -->
      <div *ngIf="currentTagGroups.length > 0" class="demo-section">
        <h3 class="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          <mat-icon class="mr-2">play_arrow</mat-icon>
          Interactive Demo
        </h3>

        <div
          class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
        >
          <app-tag-multiple-items
            [items]="currentItems"
            [tagGroups]="currentTagGroups"
            [allowMultiplePerGroup]="false"
            [maxVisibleTabs]="4"
            (tagAdded)="onTagAdded($event)"
            (tagRemoved)="onTagRemoved($event)"
          ></app-tag-multiple-items>
        </div>

        <!-- Stats -->
        <div class="stats-section mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="stat-card bg-green-50 border border-green-200 rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-green-700">
              {{ getTaggedItemsCount() }}
            </div>
            <div class="text-sm text-green-600">Items Tagged</div>
          </div>
          <div
            class="stat-card bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-blue-700">
              {{ getTotalTagsApplied() }}
            </div>
            <div class="text-sm text-blue-600">Total Tags Applied</div>
          </div>
          <div
            class="stat-card bg-purple-50 border border-purple-200 rounded-lg p-4 text-center"
          >
            <div class="text-2xl font-bold text-purple-700">
              {{ getUniqueTagsUsed() }}
            </div>
            <div class="text-sm text-purple-600">Unique Tags Used</div>
          </div>
        </div>

        <!-- Reset Button -->
        <div class="text-center mt-6">
          <button
            mat-stroked-button
            (click)="resetDemo()"
            class="bg-gray-100 text-gray-700 border border-gray-300 px-6 py-2 rounded hover:bg-gray-200"
          >
            <mat-icon class="mr-2">refresh</mat-icon>
            Reset Demo
          </button>
        </div>
      </div>

      <!-- No Preset Selected -->
      <div
        *ngIf="currentTagGroups.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <mat-icon class="text-6xl mb-4">category</mat-icon>
        <h3 class="text-xl font-medium mb-2">Select a Preset Above</h3>
        <p>Choose any preset to see it in action with sample items</p>
      </div>
    </div>
  `,
  styles: [
    `
      .preset-card {
        min-height: 140px;
        cursor: pointer;
      }

      .preset-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .stat-card {
        transition: all 0.2s ease;
      }

      .stat-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .demo-section {
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class TagPresetShowcaseComponent implements OnInit {
  availablePresets: PresetInfo[] = [];
  currentPresetId: string = '';
  currentPreset: PresetInfo | null = null;
  currentTagGroups: TagGroup[] = [];
  currentItems: TagItem[] = [];

  ngOnInit(): void {
    this.availablePresets = getAvailablePresets();
    // Auto-select the first preset
    if (this.availablePresets.length > 0) {
      this.selectPreset(this.availablePresets[0].id);
    }
  }

  selectPreset(presetId: string): void {
    this.currentPresetId = presetId;
    this.currentPreset =
      this.availablePresets.find((p) => p.id === presetId) || null;
    this.currentTagGroups = createPresetTagGroups(presetId);

    // Create items with sample names
    const sampleItems = createSampleItemsForPreset(presetId);
    this.currentItems = sampleItems.map((item) => ({
      ...item,
      tags: [], // Start with no tags
    }));
  }

  resetDemo(): void {
    if (this.currentPresetId) {
      this.selectPreset(this.currentPresetId);
    }
  }

  onTagAdded(tag: any): void {
    // Just for demo feedback - the TagManager handles the actual addition
    console.log('Tag added:', tag);
  }

  onTagRemoved(tag: any): void {
    // Just for demo feedback - the TagManager handles the actual removal
    console.log('Tag removed:', tag);
  }

  getTaggedItemsCount(): number {
    return this.currentItems.filter((item) => item.tags.length > 0).length;
  }

  getTotalTagsApplied(): number {
    return this.currentItems.reduce(
      (total, item) => total + item.tags.length,
      0,
    );
  }

  getUniqueTagsUsed(): number {
    const uniqueTagIds = new Set<string>();
    this.currentItems.forEach((item) => {
      item.tags.forEach((tag) => uniqueTagIds.add(tag.id));
    });
    return uniqueTagIds.size;
  }
}
