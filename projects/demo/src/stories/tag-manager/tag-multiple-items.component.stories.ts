import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TagMultipleItemsComponent } from '../../../../shared-components/src/lib/tagging/tag-multiple-items/tag-multiple-items.component';
import { ItemTaggingService } from '../../../../shared-components/src/lib/tagging/item-tagging.service';
import {
  getTestTagMatrix,
  getTestItems,
} from '../../../../shared-components/src/lib/tagging/test-data';
import { createPresetTagGroups } from '../../../../shared-components/src/lib/tagging/tag-group-presets';

const tagGroups = getTestTagMatrix(5, 8); // 5 groups, 8 tags each
const items = getTestItems(10, 2, tagGroups); // 10 items, each with up to 2 pre-assigned tags

const meta: Meta<TagMultipleItemsComponent> = {
  title: 'Components/TagMultipleItems',
  component: TagMultipleItemsComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(MatIconModule),
        ItemTaggingService, // Provide the service
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# TagMultipleItems Component (Service-Based)

A streamlined workflow component for tagging multiple items with service-based state management. Perfect for batch operations like file organization or content categorization.

## Features

- **Service-Based State**: Clean separation of concerns with ItemTaggingService
- **Stateful TagPicker**: No more circular updates or jumping tabs
- **Batch Navigation**: Navigate through multiple items with prev/next buttons
- **Progress Tracking**: Visual progress bar and completion statistics
- **Auto-advance**: Automatically move to next item when current is complete
- **Reactive Updates**: Observable streams for real-time state updates

## Key Improvements

- **No Circular Updates**: Service manages state, component handles UI
- **Stable Tab Navigation**: TagPicker maintains position during tag changes
- **Toggle Logic**: Smart add/remove toggle based on current state
- **Multi-select Support**: Built-in support for multiple tags per group

## Architecture

\`\`\`
ItemTaggingService ← manages state
       ↓
TagMultipleItemsComponent ← handles UI
       ↓
TagPicker (statefulMode) ← stable UI state
\`\`\`

## Usage

\`\`\`typescript
// Service handles all state management:
- taggingService.toggleTag(itemId, tag)
- taggingService.getCurrentItemTags()
- taggingService.nextItem() / previousItem()
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TagMultipleItemsComponent>;

export const Default: Story = {
  args: {
    items: getTestItems(5, 0, tagGroups), // 5 items with no pre-assigned tags
    tagGroups,
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
    maxVisibleTabs: 4,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic multi-item tagging with service-based state management. Navigate with arrow buttons and notice how tabs maintain their position when adding tags.',
      },
    },
  },
};

export const AutoAdvanceWorkflow: Story = {
  args: {
    items: getTestItems(5, 0, tagGroups), // 5 items, no pre-assigned tags
    tagGroups,
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: true, // Auto-advance to next item when current is complete
    maxVisibleTabs: 4,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Auto-advance workflow: automatically moves to the next item when the current item has all groups tagged. Great for fast batch processing with stable UI.',
      },
    },
  },
};

export const ProjectManagementScenario: Story = {
  args: {
    items: [
      { id: '1', name: 'Website Redesign', tags: [] },
      { id: '2', name: 'Mobile App Development', tags: [] },
      { id: '3', name: 'Database Migration', tags: [] },
      { id: '4', name: 'User Testing', tags: [] },
      { id: '5', name: 'Performance Optimization', tags: [] },
    ],
    tagGroups: [
      {
        id: 'priority',
        name: 'Priority',
        tags: [
          { id: 'low', group: 'priority', name: 'Low' },
          { id: 'medium', group: 'priority', name: 'Medium' },
          { id: 'high', group: 'priority', name: 'High' },
          { id: 'urgent', group: 'priority', name: 'Urgent' },
        ],
      },
      {
        id: 'status',
        name: 'Status',
        tags: [
          { id: 'planning', group: 'status', name: 'Planning' },
          { id: 'in-progress', group: 'status', name: 'In Progress' },
          { id: 'review', group: 'status', name: 'Under Review' },
          { id: 'completed', group: 'status', name: 'Completed' },
        ],
      },
      {
        id: 'team',
        name: 'Assigned Team',
        tags: [
          { id: 'frontend', group: 'team', name: 'Frontend' },
          { id: 'backend', group: 'team', name: 'Backend' },
          { id: 'design', group: 'team', name: 'Design' },
          { id: 'qa', group: 'team', name: 'QA' },
        ],
      },
    ],
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
    maxVisibleTabs: 3,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Real-world project management scenario: tag projects with priority, status, and team assignment. Service manages state seamlessly.',
      },
    },
  },
};

export const FileOrganizationScenario: Story = {
  args: {
    items: [
      { id: '1', name: 'vacation-photos.zip', tags: [] },
      { id: '2', name: 'project-proposal.docx', tags: [] },
      { id: '3', name: 'demo-video.mp4', tags: [] },
      { id: '4', name: 'budget-2024.xlsx', tags: [] },
      { id: '5', name: 'meeting-notes.pdf', tags: [] },
    ],
    tagGroups: [
      {
        id: 'type',
        name: 'File Type',
        tags: [
          { id: 'document', group: 'type', name: 'Document' },
          { id: 'media', group: 'type', name: 'Media' },
          { id: 'archive', group: 'type', name: 'Archive' },
          { id: 'spreadsheet', group: 'type', name: 'Spreadsheet' },
        ],
      },
      {
        id: 'importance',
        name: 'Importance',
        tags: [
          { id: 'low', group: 'importance', name: 'Low' },
          { id: 'medium', group: 'importance', name: 'Medium' },
          { id: 'high', group: 'importance', name: 'High' },
          { id: 'critical', group: 'importance', name: 'Critical' },
        ],
      },
    ],
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: true,
    maxVisibleTabs: 2,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'File organization workflow with auto-advance enabled. Tag files by type and importance level with stable tab navigation.',
      },
    },
  },
};

export const MultiSelectMode: Story = {
  args: {
    items: getTestItems(3, 1, tagGroups),
    tagGroups: [
      {
        id: 'skills',
        name: 'Required Skills',
        tags: [
          { id: 'js', group: 'skills', name: 'JavaScript' },
          { id: 'ts', group: 'skills', name: 'TypeScript' },
          { id: 'angular', group: 'skills', name: 'Angular' },
          { id: 'css', group: 'skills', name: 'CSS' },
        ],
      },
      {
        id: 'experience',
        name: 'Experience Level',
        tags: [
          { id: 'junior', group: 'experience', name: 'Junior' },
          { id: 'mid', group: 'experience', name: 'Mid-level' },
          { id: 'senior', group: 'experience', name: 'Senior' },
        ],
      },
    ],
    allowMultiplePerGroup: true, // Allow multiple skills per item
    autoAdvanceGroups: false, // Don't auto-advance in multi-select
    autoAdvanceItems: false,
    maxVisibleTabs: 2,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multi-select mode allows multiple tags per group. Service handles the complex logic while UI remains stable.',
      },
    },
  },
};

export const PreTaggedItems: Story = {
  args: {
    items: [
      {
        id: '1',
        name: 'Already Tagged Item',
        tags: [
          { id: '1', group: '1', name: 'Badge: 1' },
          { id: '5', group: '2', name: 'Badge: 2' },
        ],
      },
      { id: '2', name: 'Untagged Item', tags: [] },
      {
        id: '3',
        name: 'Partially Tagged',
        tags: [{ id: '2', group: '1', name: 'Badge: 2' }],
      },
    ],
    tagGroups: getTestTagMatrix(3, 4),
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
    maxVisibleTabs: 3,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Items with existing tags are displayed correctly. Service properly manages pre-existing state without UI jumps.',
      },
    },
  },
};

export const SmartTabNavigation: Story = {
  args: {
    items: getTestItems(3, 0, tagGroups),
    tagGroups,
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
    maxVisibleTabs: 3,
    alwaysStartFromFirstTab: false, // Use smart navigation to first untagged group
  },
  parameters: {
    docs: {
      description: {
        story:
          'Smart tab navigation: goes to first untagged group when switching items, instead of always first tab. Compare with Default story.',
      },
    },
  },
};

export const ToggleBehaviorDemo: Story = {
  args: {
    items: [{ id: '1', name: 'Toggle Test Item', tags: [] }],
    tagGroups: [
      {
        id: 'demo',
        name: 'Toggle Demo',
        tags: [
          { id: 'tag1', group: 'demo', name: 'Click Me' },
          { id: 'tag2', group: 'demo', name: 'Click Me Too' },
          { id: 'tag3', group: 'demo', name: 'And Me' },
        ],
      },
    ],
    allowMultiplePerGroup: false,
    autoAdvanceGroups: false, // Disable auto-advance to see toggle behavior clearly
    autoAdvanceItems: false,
    maxVisibleTabs: 1,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates toggle behavior: clicking an unselected tag adds it, clicking a selected tag removes it. Service handles the logic seamlessly.',
      },
    },
  },
};

export const NoItems: Story = {
  args: {
    items: [],
    tagGroups,
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Empty state when no items are provided. Service gracefully handles empty state.',
      },
    },
  },
};

export const NoTagGroups: Story = {
  args: {
    items: getTestItems(3, 0, []),
    tagGroups: [],
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no tag groups are provided but items exist.',
      },
    },
  },
};

export const ManyGroupsPagination: Story = {
  args: {
    items: getTestItems(3, 0, getTestTagMatrix(8, 3)), // 8 groups
    tagGroups: getTestTagMatrix(8, 3), // 8 groups, 3 tags each
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
    maxVisibleTabs: 4, // Only show 4 tabs at once
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates tab pagination with 8 groups but only 4 visible tabs. Service + stateful TagPicker maintain proper pagination state.',
      },
    },
  },
};

export const RapidTaggingWorkflow: Story = {
  args: {
    items: getTestItems(10, 0, tagGroups), // 10 untagged items
    tagGroups: getTestTagMatrix(3, 4), // 3 groups, 4 tags each
    allowMultiplePerGroup: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: true, // Auto-advance for rapid workflow
    maxVisibleTabs: 3,
    alwaysStartFromFirstTab: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Optimized for rapid tagging workflow: auto-advance groups and items, consistent tab positions, and service-managed state for maximum efficiency.',
      },
    },
  },
};
