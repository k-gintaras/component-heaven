import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TagMultipleItemsComponent } from '../tag-multiple-items/tag-multiple-items.component';
import { TagGroup, TagItem, Tag } from '../tag.interface';
import {
  convertToTagItem,
  convertManyToTagItems,
  createFlexibleTaggingSetup,
  autoGenerateTagGroups,
  createTagGroupsFromTags,
  prepareForDatabase,
  smartCreateTag,
  TaggableObject,
  ConversionConfig
} from '../flexible-tagging-helpers';

// Example data types that we want to tag
interface User extends TaggableObject {
  userId: string;
  username: string;
  email: string;
  department: string;
  role: string;
  isActive: boolean;
}

interface Task extends TaggableObject {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: string;
  status: string;
  dueDate: string;
}

interface Document extends TaggableObject {
  docId: string;
  filename: string;
  fileType: string;
  size: number;
  createdBy: string;
  lastModified: string;
}

@Component({
  standalone: true,
  selector: 'app-flexible-tagging-demo',
  imports: [
    NgFor,
    NgIf,
    NgClass,
    FormsModule,
    MatIcon,
    TagMultipleItemsComponent,
  ],
  template: `
    <div class="demo-container p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          <mat-icon class="text-4xl mr-2 align-middle">auto_awesome</mat-icon>
          Flexible Object Tagging Demo
        </h1>
        <p class="text-gray-600 text-lg">
          Tag any object type with automatic tag group generation and easy database saving
        </p>
      </div>

      <!-- Data Type Selector -->
      <div class="data-type-selector mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">
          Choose Data Type to Tag:
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            *ngFor="let type of dataTypes"
            [ngClass]="{
              'bg-blue-500 text-white border-blue-500': currentDataType === type.id,
              'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50': currentDataType !== type.id
            }"
            class="data-type-card border-2 rounded-lg p-4 text-left transition-all duration-200"
            (click)="selectDataType(type.id)"
          >
            <div class="flex items-center mb-2">
              <mat-icon class="mr-2">{{ type.icon }}</mat-icon>
              <span class="font-semibold">{{ type.name }}</span>
            </div>
            <p class="text-sm opacity-80 mb-2">{{ type.description }}</p>
            <p class="text-xs font-medium opacity-60">{{ type.sampleCount }} sample items</p>
          </button>
        </div>
      </div>

      <!-- Current Setup Info -->
      <div *ngIf="currentSetup" class="setup-info mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-green-800 mb-2">
          <mat-icon class="mr-2">info</mat-icon>
          Current Setup
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong class="text-green-700">Items:</strong> {{ currentItems.length }}
            <div class="text-green-600">Converted from {{ currentDataType }} objects</div>
          </div>
          <div>
            <strong class="text-green-700">Tag Groups:</strong> {{ currentTagGroups.length }}
            <div class="text-green-600">Auto-generated + predefined</div>
          </div>
          <div>
            <strong class="text-green-700">Available Tags:</strong> {{ getTotalTagCount() }}
            <div class="text-green-600">Ready for tagging</div>
          </div>
        </div>
      </div>

      <!-- Add Custom Tags Section -->
      <div class="custom-tags-section mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">
          <mat-icon class="mr-2">add_circle</mat-icon>
          Add Custom Tags
        </h3>
        <div class="flex gap-2 mb-3">
          <input
            [(ngModel)]="newTagName"
            placeholder="Tag name (e.g., 'Urgent', 'Featured')"
            class="flex-1 p-2 border border-gray-300 rounded"
            (keyup.enter)="addCustomTag()"
          />
          <input
            [(ngModel)]="newTagGroup"
            placeholder="Group (optional, default: 'custom')"
            class="w-48 p-2 border border-gray-300 rounded"
            (keyup.enter)="addCustomTag()"
          />
          <button
            (click)="addCustomTag()"
            [disabled]="!newTagName.trim()"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Tag
          </button>
        </div>
        <div *ngIf="customTags.length > 0" class="custom-tags-display">
          <p class="text-sm text-gray-600 mb-2">Custom tags added:</p>
          <div class="flex flex-wrap gap-1">
            <span 
              *ngFor="let tag of customTags" 
              class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
            >
              #{{ tag.name }} ({{ tag.group }})
              <button 
                (click)="removeCustomTag(tag.id)"
                class="ml-1 text-blue-600 hover:text-blue-800"
              >×</button>
            </span>
          </div>
        </div>
      </div>

      <!-- Tagging Interface -->
      <div *ngIf="currentItems.length > 0" class="tagging-section">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-700">
            <mat-icon class="mr-2">local_offer</mat-icon>
            Tag Your {{ currentDataType }} Items
          </h3>
          <div class="flex gap-2">
            <button
              (click)="resetTags()"
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <mat-icon class="mr-1">refresh</mat-icon>
              Reset Tags
            </button>
            <button
              (click)="saveToDatabase()"
              [disabled]="getTaggedItemsCount() === 0"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <mat-icon class="mr-1">save</mat-icon>
              Save to Database ({{ getTaggedItemsCount() }} tagged)
            </button>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <app-tag-multiple-items
            [items]="currentItems"
            [tagGroups]="currentTagGroups"
            [allowMultiplePerGroup]="true"
            [maxVisibleTabs]="6"
            (tagAdded)="onTagAdded($event)"
            (tagRemoved)="onTagRemoved($event)"
          ></app-tag-multiple-items>
        </div>
      </div>

      <!-- Stats and Results -->
      <div *ngIf="currentItems.length > 0" class="stats-section mt-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          <mat-icon class="mr-2">analytics</mat-icon>
          Tagging Statistics
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="stat-card bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-700">{{ getTaggedItemsCount() }}</div>
            <div class="text-sm text-blue-600">Items Tagged</div>
          </div>
          <div class="stat-card bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-700">{{ getTotalTagsApplied() }}</div>
            <div class="text-sm text-green-600">Total Tags Applied</div>
          </div>
          <div class="stat-card bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-700">{{ getUniqueTagsUsed() }}</div>
            <div class="text-sm text-purple-600">Unique Tags Used</div>
          </div>
          <div class="stat-card bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-orange-700">{{ getCompletionPercentage() }}%</div>
            <div class="text-sm text-orange-600">Completion Rate</div>
          </div>
        </div>
      </div>

      <!-- Database Preview -->
      <div *ngIf="databasePreview.length > 0" class="database-preview mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">
          <mat-icon class="mr-2">storage</mat-icon>
          Database Preview ({{ databasePreview.length }} items ready to save)
        </h3>
        <div class="max-h-60 overflow-y-auto">
          <pre class="text-xs bg-white p-3 rounded border text-gray-700">{{ databasePreviewJson }}</pre>
        </div>
        <div class="mt-3 text-sm text-gray-600">
          <strong>Note:</strong> This shows how your tagged items would be formatted for database storage, 
          including metadata like taggedAt, tagCount, and tagsByGroup for efficient querying.
        </div>
      </div>

      <!-- Raw Data Preview -->
      <div class="raw-data-preview mt-6">
        <details class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <summary class="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
            <mat-icon class="mr-2">code</mat-icon>
            View Raw Sample Data ({{ currentDataType }})
          </summary>
          <div class="mt-3 max-h-40 overflow-y-auto">
            <pre class="text-xs bg-white p-3 rounded border text-gray-700">{{ getRawDataPreview() }}</pre>
          </div>
        </details>
      </div>
    </div>
  `,
  styles: [`
    .data-type-card {
      min-height: 120px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .data-type-card:hover {
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
  `]
})
export class FlexibleTaggingDemoComponent implements OnInit {
  // Sample data
  sampleUsers: User[] = [
    { id: '1', userId: '1', username: 'john_doe', email: 'john@company.com', department: 'engineering', role: 'developer', isActive: true },
    { id: '2', userId: '2', username: 'jane_smith', email: 'jane@company.com', department: 'design', role: 'designer', isActive: true },
    { id: '3', userId: '3', username: 'bob_wilson', email: 'bob@company.com', department: 'marketing', role: 'manager', isActive: false },
    { id: '4', userId: '4', username: 'alice_brown', email: 'alice@company.com', department: 'engineering', role: 'senior_dev', isActive: true },
    { id: '5', userId: '5', username: 'charlie_davis', email: 'charlie@company.com', department: 'sales', role: 'rep', isActive: true },
  ];

  sampleTasks: Task[] = [
    { id: '1', taskId: '1', title: 'Fix login bug', description: 'Users cannot log in', assignedTo: 'john_doe', priority: 'high', status: 'in_progress', dueDate: '2024-12-15' },
    { id: '2', taskId: '2', title: 'Design new homepage', description: 'Create modern homepage design', assignedTo: 'jane_smith', priority: 'medium', status: 'todo', dueDate: '2024-12-20' },
    { id: '3', taskId: '3', title: 'Update documentation', description: 'Refresh API docs', assignedTo: 'alice_brown', priority: 'low', status: 'done', dueDate: '2024-12-10' },
    { id: '4', taskId: '4', title: 'Setup CI/CD pipeline', description: 'Automate deployments', assignedTo: 'john_doe', priority: 'high', status: 'todo', dueDate: '2024-12-18' },
    { id: '5', taskId: '5', title: 'Customer onboarding flow', description: 'Improve new user experience', assignedTo: 'bob_wilson', priority: 'medium', status: 'review', dueDate: '2024-12-25' },
  ];

  sampleDocuments: Document[] = [
    { id: '1', docId: '1', filename: 'quarterly_report.pdf', fileType: 'pdf', size: 2048576, createdBy: 'john_doe', lastModified: '2024-12-01' },
    { id: '2', docId: '2', filename: 'meeting_notes.docx', fileType: 'document', size: 51200, createdBy: 'jane_smith', lastModified: '2024-12-02' },
    { id: '3', docId: '3', filename: 'product_demo.mp4', fileType: 'video', size: 104857600, createdBy: 'alice_brown', lastModified: '2024-12-03' },
    { id: '4', docId: '4', filename: 'budget_2025.xlsx', fileType: 'spreadsheet', size: 1024000, createdBy: 'bob_wilson', lastModified: '2024-12-04' },
    { id: '5', docId: '5', filename: 'logo_variants.zip', fileType: 'archive', size: 15728640, createdBy: 'jane_smith', lastModified: '2024-12-05' },
  ];

  // Data type configurations
  dataTypes = [
    {
      id: 'users',
      name: 'Users',
      description: 'Employee and user management',
      icon: 'people',
      sampleCount: this.sampleUsers.length,
      data: this.sampleUsers,
      config: { idProperty: 'userId', nameProperty: 'username' } as ConversionConfig
    },
    {
      id: 'tasks',
      name: 'Tasks',
      description: 'Project tasks and assignments',
      icon: 'task',
      sampleCount: this.sampleTasks.length,
      data: this.sampleTasks,
      config: { idProperty: 'taskId', nameProperty: 'title' } as ConversionConfig
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'File and document management',
      icon: 'description',
      sampleCount: this.sampleDocuments.length,
      data: this.sampleDocuments,
      config: { idProperty: 'docId', nameProperty: 'filename' } as ConversionConfig
    }
  ];

  // Component state
  currentDataType = '';
  currentSetup: { items: TagItem[], tagGroups: TagGroup[] } | null = null;
  currentItems: TagItem[] = [];
  currentTagGroups: TagGroup[] = [];
  customTags: Tag[] = [];
  newTagName = '';
  newTagGroup = '';
  databasePreview: any[] = [];

  ngOnInit(): void {
    // Start with users by default
    this.selectDataType('users');
  }

  selectDataType(dataTypeId: string): void {
    this.currentDataType = dataTypeId;
    const dataType = this.dataTypes.find(dt => dt.id === dataTypeId);
    
    if (!dataType) return;

    // Create predefined tags based on data type
    const predefinedTags = this.createPredefinedTags(dataTypeId);
    
    // Combine custom tags with predefined ones
    const allAdditionalTags = [...predefinedTags, ...this.customTags];

    // Create flexible tagging setup
    this.currentSetup = createFlexibleTaggingSetup(
      dataType.data,
      dataType.config,
      allAdditionalTags,
      this.getGroupNameMap(dataTypeId)
    );

    this.currentItems = this.currentSetup.items;
    this.currentTagGroups = this.currentSetup.tagGroups;
    this.databasePreview = [];
  }

  createPredefinedTags(dataTypeId: string): Tag[] {
    const tagSets: Record<string, Tag[]> = {
      users: [
        smartCreateTag('Active', 'status'),
        smartCreateTag('Inactive', 'status'),
        smartCreateTag('New Employee', 'status'),
        smartCreateTag('Urgent', 'priority'),
        smartCreateTag('Normal', 'priority'),
        smartCreateTag('VIP', 'category'),
        smartCreateTag('Admin', 'role_type'),
        smartCreateTag('Regular User', 'role_type'),
      ],
      tasks: [
        smartCreateTag('Bug', 'type'),
        smartCreateTag('Feature', 'type'),
        smartCreateTag('Improvement', 'type'),
        smartCreateTag('Critical', 'severity'),
        smartCreateTag('Blocked', 'status'),
        smartCreateTag('Needs Review', 'status'),
        smartCreateTag('Sprint 1', 'sprint'),
        smartCreateTag('Sprint 2', 'sprint'),
      ],
      documents: [
        smartCreateTag('Confidential', 'security'),
        smartCreateTag('Public', 'security'),
        smartCreateTag('Internal', 'security'),
        smartCreateTag('Approved', 'approval'),
        smartCreateTag('Draft', 'approval'),
        smartCreateTag('Archived', 'lifecycle'),
        smartCreateTag('Current', 'lifecycle'),
        smartCreateTag('Large File', 'size'),
      ]
    };

    return tagSets[dataTypeId] || [];
  }

  getGroupNameMap(dataTypeId: string): Record<string, string> {
    const maps: Record<string, Record<string, string>> = {
      users: {
        status: 'User Status',
        priority: 'Priority Level',
        category: 'User Category',
        role_type: 'Role Type',
        custom: 'Custom Tags'
      },
      tasks: {
        type: 'Task Type',
        severity: 'Severity Level',
        status: 'Task Status',
        sprint: 'Sprint Assignment',
        custom: 'Custom Tags'
      },
      documents: {
        security: 'Security Level',
        approval: 'Approval Status',
        lifecycle: 'Document Lifecycle',
        size: 'File Size Category',
        custom: 'Custom Tags'
      }
    };

    return maps[dataTypeId] || { custom: 'Custom Tags' };
  }

  addCustomTag(): void {
    if (!this.newTagName.trim()) return;

    const groupId = this.newTagGroup.trim() || 'custom';
    const newTag = smartCreateTag(this.newTagName.trim(), groupId);
    
    // Check for duplicates
    const isDuplicate = this.customTags.some(tag => 
      tag.id === newTag.id || (tag.name === newTag.name && tag.group === newTag.group)
    );

    if (!isDuplicate) {
      this.customTags.push(newTag);
      this.newTagName = '';
      this.newTagGroup = '';
      
      // Refresh the current setup with new custom tags
      this.selectDataType(this.currentDataType);
    }
  }

  removeCustomTag(tagId: string): void {
    this.customTags = this.customTags.filter(tag => tag.id !== tagId);
    // Refresh the current setup
    this.selectDataType(this.currentDataType);
  }

  resetTags(): void {
    this.currentItems.forEach(item => {
      item.tags = [];
    });
    this.databasePreview = [];
  }

  saveToDatabase(): void {
    const taggedItems = this.currentItems.filter(item => item.tags.length > 0);
    this.databasePreview = prepareForDatabase(taggedItems, true);
  }

  onTagAdded(event: any): void {
    console.log('Tag added:', event);
  }

  onTagRemoved(event: any): void {
    console.log('Tag removed:', event);
  }

  // Statistics methods
  getTaggedItemsCount(): number {
    return this.currentItems.filter(item => item.tags.length > 0).length;
  }

  getTotalTagsApplied(): number {
    return this.currentItems.reduce((sum, item) => sum + item.tags.length, 0);
  }

  getUniqueTagsUsed(): number {
    const usedTagIds = new Set<string>();
    this.currentItems.forEach(item => {
      item.tags.forEach(tag => usedTagIds.add(tag.id));
    });
    return usedTagIds.size;
  }

  getCompletionPercentage(): number {
    if (this.currentItems.length === 0) return 0;
    return Math.round((this.getTaggedItemsCount() / this.currentItems.length) * 100);
  }

  getTotalTagCount(): number {
    return this.currentTagGroups.reduce((sum, group) => sum + group.tags.length, 0);
  }

  get databasePreviewJson(): string {
    return JSON.stringify(this.databasePreview, null, 2);
  }

  getRawDataPreview(): string {
    const dataType = this.dataTypes.find(dt => dt.id === this.currentDataType);
    return dataType ? JSON.stringify(dataType.data.slice(0, 3), null, 2) : '';
  }
}
