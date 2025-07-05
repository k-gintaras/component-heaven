import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TagMultipleItemsComponent } from '../../../../shared-components/src/lib/tagging/tag-multiple-items/tag-multiple-items.component';
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
      providers: [provideAnimations(), importProvidersFrom(MatIconModule)],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# TagMultipleItems Component

A workflow component for tagging multiple items with navigation and progress tracking. Perfect for batch operations like file organization or content categorization.

## Features

- **Batch Navigation**: Navigate through multiple items with prev/next buttons
- **Progress Tracking**: Visual progress bar and completion statistics
- **Auto-advance**: Automatically move to next item when current is complete
- **Single Item Mode**: Create a fake item when no items provided
- **Rich Events**: Detailed events for tags, items, and batch completion
- **No Service Dependency**: Pure input/output component

## Key Modes

- **Multiple Items**: Process a list of items one by one
- **Single Item**: Use \`createSingleItemMode\` for one-item scenarios
- **Auto-advance**: Enable \`autoAdvanceItems\` for smooth workflows

## Event System

- Individual tag events with item context
- Item completion events
- Batch completion tracking
- Navigation events
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TagMultipleItemsComponent>;

export const Default: Story = {
  args: {
    items,
    tagGroups,
    canMultiSelect: false,
    canReplace: true,
    maxVisibleTabs: 4,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic multi-item tagging with 10 items and 5 tag groups. Navigate with the arrow buttons to tag each item.',
      },
    },
  },
};

export const AutoAdvanceWorkflow: Story = {
  args: {
    items: getTestItems(5, 0, tagGroups), // 5 items, no pre-assigned tags
    tagGroups,
    canMultiSelect: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: true, // Auto-advance to next item when current is complete
  },
  parameters: {
    docs: {
      description: {
        story:
          'Auto-advance workflow: automatically moves to the next item when the current item has all groups tagged. Great for fast batch processing.',
      },
    },
  },
};

export const SingleItemMode: Story = {
  args: {
    items: [], // No items provided
    tagGroups: createPresetTagGroups('priority').concat(
      createPresetTagGroups('status'),
    ),
    createSingleItemMode: true,
    singleItemName: 'My Document',
    canMultiSelect: false,
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single item mode: creates a fake item when no items are provided. Perfect for tagging individual documents or objects.',
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
    canMultiSelect: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Real-world project management scenario: tag projects with priority, status, and team assignment.',
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
    canMultiSelect: false,
    autoAdvanceGroups: true,
    autoAdvanceItems: true,
    maxVisibleTabs: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'File organization workflow with auto-advance enabled. Tag files by type and importance level.',
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
    canMultiSelect: true, // Allow multiple skills per item
    canReplace: true,
    autoAdvanceGroups: false, // Don't auto-advance in multi-select
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multi-select mode allows multiple tags per group. Auto-advance is disabled for better control when selecting multiple items.',
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
          { id: '1', group: '11', name: 'Badge: 1' },
          { id: '5', group: '21', name: 'Badge: 2' },
        ],
      },
      { id: '2', name: 'Untagged Item', tags: [] },
      {
        id: '3',
        name: 'Partially Tagged',
        tags: [{ id: '2', group: '11', name: 'Badge: 2' }],
      },
    ],
    tagGroups: getTestTagMatrix(3, 4),
    canMultiSelect: false,
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Items with existing tags are displayed correctly. Shows how the component handles pre-tagged items.',
      },
    },
  },
};

export const NoItems: Story = {
  args: {
    items: [],
    tagGroups,
    createSingleItemMode: false, // Don't create fake item
  },
  parameters: {
    docs: {
      description: {
        story:
          'Empty state when no items are provided and single-item mode is disabled.',
      },
    },
  },
};

export const NoTagGroups: Story = {
  args: {
    items: getTestItems(3, 0, []),
    tagGroups: [],
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
    maxVisibleTabs: 4, // Only show 4 tabs at once
    canMultiSelect: false,
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates tab pagination with 8 groups but only 4 visible tabs. Click on edge tabs to see pagination in action.',
      },
    },
  },
};
