import { NgFor, NgIf } from '@angular/common';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { TagPickerMatrixComponent } from '../../../../shared-components/src/lib/tagging/tag-picker-matrix/tag-picker-matrix.component';
import { getTestTagMatrix } from '../../../../shared-components/src/lib/tagging/test-data';

const meta: Meta<TagPickerMatrixComponent> = {
  title: 'Components/TagPickerMatrix',
  component: TagPickerMatrixComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom()],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# TagPickerMatrix Component

A standalone matrix-style tag picker showing each group as a row of tags.

## Features

- **Matrix Layout**: All groups displayed with tags inline
- **Input-driven**: Configured via
- **Multi-select / Single-select**: Controlled by
- **Immutable Tags**:  toggles deselect behavior
- **Events**: Emits on additions, removals, and full completion
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TagPickerMatrixComponent>;

export const Default: Story = {
  args: {
    customTagGroups: getTestTagMatrix(3, 5),
    selectedTags: [],
    canMultiSelect: false,
    canReplace: true,
  },
  parameters: {
    docs: {
      description: { story: 'Default matrix with 3 groups of 5 tags each.' },
    },
  },
};

export const WithPreSelected: Story = {
  args: {
    customTagGroups: getTestTagMatrix(3, 4),
    selectedTags: [
      { id: '1', group: '1', name: 'Badge: 1' }, // Fixed: '1' not '11'
      { id: '5', group: '2', name: 'Badge: 2' }, // Fixed: '2' not '21'
    ],
    canMultiSelect: false,
  },
  parameters: {
    docs: {
      description: { story: 'Matrix with some tags pre-selected.' },
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
        name: 'Levels',
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
  },
  parameters: {
    docs: {
      description: { story: 'Multi-select mode for matrix layout.' },
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
  },
  parameters: {
    docs: {
      description: { story: 'Matrix example for project management tags.' },
    },
  },
};

export const ManyGroupsScroll: Story = {
  args: {
    customTagGroups: getTestTagMatrix(10, 3), // 10 rows
    selectedTags: [],
    canMultiSelect: false,
  },
  parameters: {
    docs: {
      description: { story: 'Matrix with many rows scrollable by container.' },
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
      description: { story: 'Empty-state fallback to test data.' },
    },
  },
};
