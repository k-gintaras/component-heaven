import { MatIconModule } from '@angular/material/icon';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { TagPickerComponent } from '../../../../shared-components/src/lib/tagging/tag-picker/tag-picker.component';
import { getTestTagMatrix } from '../../../../shared-components/src/lib/tagging/test-data';

const meta: Meta<TagPickerComponent> = {
  title: 'Components/TagPicker',
  component: TagPickerComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom(MatIconModule)],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# TagPicker Component

A pure, input-driven component for selecting tags from organized groups. Perfect for single-item tagging scenarios.

## Features

- **Pure Component**: No service dependencies - works entirely with inputs
- **Pre-selection Support**: Pass existing tags via \`selectedTags\` input
- **Auto-advance Groups**: Automatically move to next group after selection
- **Multi-select**: Allow multiple tags per group or enforce single selection
- **Visual Feedback**: Shows processing state and selected tags
- **Rich Events**: Detailed events for tag changes and completion

## Key Inputs

- \`customTagGroups\`: Array of tag groups to display
- \`selectedTags\`: Pre-selected tags to highlight
- \`canMultiSelect\`: Allow multiple tags per group
- \`autoAdvanceGroups\`: Auto-advance to next group after selection

## Key Outputs

- \`tagAdded\` / \`tagRemoved\`: Individual tag changes
- \`tagSelectionChanged\`: All current selections
- \`taggingCompleted\`: When all groups have tags
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TagPickerComponent>;

export const Default: Story = {
  args: {
    customTagGroups: getTestTagMatrix(3, 5),
    selectedTags: [],
    canMultiSelect: false,
    canReplace: true,
    maxVisibleTabs: 5,
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic tag picker with 3 groups of 5 tags each. Auto-advances to next group after selection.',
      },
    },
  },
};

export const WithPreSelectedTags: Story = {
  args: {
    customTagGroups: getTestTagMatrix(3, 4),
    selectedTags: [
      { id: '1', group: '1', name: 'Badge: 1' }, // ← Fixed: '1' not '11'
      { id: '5', group: '2', name: 'Badge: 2' }, // ← Fixed: '2' not '21'
    ],
    canMultiSelect: false,
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tag picker with some tags already selected. Shows how pre-selection works.',
      },
    },
  },
};

export const MultiSelectMode: Story = {
  args: {
    customTagGroups: [
      {
        id: '1',
        name: 'Skills',
        tags: [
          { id: '1', group: '1', name: 'Angular' },
          { id: '2', group: '1', name: 'React' },
          { id: '3', group: '1', name: 'Vue' },
          { id: '4', group: '1', name: 'TypeScript' },
        ],
      },
      {
        id: '2',
        name: 'Experience Level',
        tags: [
          { id: '5', group: '2', name: 'Beginner' },
          { id: '6', group: '2', name: 'Intermediate' },
          { id: '7', group: '2', name: 'Advanced' },
          { id: '8', group: '2', name: 'Expert' },
        ],
      },
    ],
    selectedTags: [
      { id: '1', group: '1', name: 'Angular' },
      { id: '4', group: '1', name: 'TypeScript' },
    ],
    canMultiSelect: true,
    canReplace: true,
    autoAdvanceGroups: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multi-select mode allows multiple tags per group. Auto-advance is disabled for better control.',
      },
    },
  },
};

export const CustomGroups: Story = {
  args: {
    customTagGroups: [
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
          { id: 'todo', group: 'status', name: 'To Do' },
          { id: 'progress', group: 'status', name: 'In Progress' },
          { id: 'review', group: 'status', name: 'Under Review' },
          { id: 'done', group: 'status', name: 'Completed' },
        ],
      },
      {
        id: 'team',
        name: 'Team',
        tags: [
          { id: 'frontend', group: 'team', name: 'Frontend' },
          { id: 'backend', group: 'team', name: 'Backend' },
          { id: 'design', group: 'team', name: 'Design' },
          { id: 'qa', group: 'team', name: 'QA' },
        ],
      },
    ],
    selectedTags: [],
    canMultiSelect: false,
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example with meaningful tag groups for project management.',
      },
    },
  },
};

export const ManyTabsWithPagination: Story = {
  args: {
    customTagGroups: getTestTagMatrix(8, 4), // 8 groups, 4 tags each
    selectedTags: [],
    canMultiSelect: false,
    maxVisibleTabs: 4, // Only show 4 tabs at once
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates tab pagination when there are more groups than can fit. Only 4 tabs shown at once.',
      },
    },
  },
};

export const NoGroupsEmpty: Story = {
  args: {
    customTagGroups: [],
    selectedTags: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Empty state when no tag groups are provided. Falls back to test data.',
      },
    },
  },
};

export const SingleGroupOnly: Story = {
  args: {
    customTagGroups: [
      {
        id: 'colors',
        name: 'Choose a Color',
        tags: [
          { id: 'red', group: 'colors', name: 'Red' },
          { id: 'blue', group: 'colors', name: 'Blue' },
          { id: 'green', group: 'colors', name: 'Green' },
          { id: 'yellow', group: 'colors', name: 'Yellow' },
          { id: 'purple', group: 'colors', name: 'Purple' },
        ],
      },
    ],
    selectedTags: [],
    canMultiSelect: true,
    autoAdvanceGroups: false, // No other groups to advance to
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single group scenario with multi-select enabled. Good for simple categorization.',
      },
    },
  },
};

export const NoReplaceMode: Story = {
  args: {
    customTagGroups: getTestTagMatrix(2, 4),
    selectedTags: [{ id: '1', group: '11', name: 'Badge: 1' }],
    canMultiSelect: false,
    canReplace: false, // Once selected, tags cannot be removed
    autoAdvanceGroups: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'No-replace mode: once a tag is selected, it cannot be deselected. Useful for workflows where decisions are final.',
      },
    },
  },
};
