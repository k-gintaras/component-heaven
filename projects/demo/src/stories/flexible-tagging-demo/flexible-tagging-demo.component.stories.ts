import type { Meta, StoryObj } from '@storybook/angular';
import { FlexibleTaggingDemoComponent } from '../../../../shared-components/src/lib/tagging/flexible-tagging-demo/flexible-tagging-demo.component';

const meta: Meta<FlexibleTaggingDemoComponent> = {
  title: 'Components/Flexible Tagging Demo',
  component: FlexibleTaggingDemoComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Flexible Object Tagging Demo

This component demonstrates how to tag any type of object with automatic tag group generation and database preparation.

## Key Features

- **Universal Object Support**: Tag any object with \`id\` and \`name\` (or configurable properties)
- **Automatic Tag Group Generation**: Creates tag groups from existing tags
- **Custom Tag Addition**: Add tags on-the-fly with custom groups
- **Database Ready**: Prepares tagged items for database storage with metadata
- **Deduplication**: Handles duplicate tags intelligently
- **Multiple Data Types**: Switch between Users, Tasks, and Documents

## Use Cases

- **User Management**: Tag users by role, department, status
- **Task Tracking**: Categorize tasks by priority, type, sprint
- **Document Management**: Organize files by security level, approval status
- **Any Domain**: Works with any object type that has an identifier

## How It Works

1. **Object Conversion**: Any object with \`id\` and a name-like property gets converted to TagItem
2. **Tag Group Auto-Generation**: Existing tags automatically create their groups
3. **Custom Tag Addition**: Add new tags with custom group assignments
4. **Smart Deduplication**: Prevents duplicate tags across the system
5. **Database Preparation**: Output includes metadata for efficient database storage

## Example Usage

\`\`\`typescript
// Convert any objects to TagItems
const users = [
  { userId: '1', username: 'john', department: 'eng' },
  { userId: '2', username: 'jane', department: 'design' }
];

const setup = createFlexibleTaggingSetup(
  users,
  { idProperty: 'userId', nameProperty: 'username' },
  [
    { id: 'active', group: 'status', name: 'Active' },
    { id: 'vip', group: 'priority', name: 'VIP' }
  ]
);

// Use the setup.items and setup.tagGroups with TagMultipleItems
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FlexibleTaggingDemoComponent>;

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Interactive Flexible Tagging Demo

Try tagging different types of objects:

1. **Select a Data Type**: Choose between Users, Tasks, or Documents
2. **Add Custom Tags**: Create your own tags with custom groups
3. **Tag Items**: Use the tagging interface to categorize items
4. **View Database Output**: See how tagged items are prepared for storage

### Sample Data Types

- **Users**: Employee management with departments and roles
- **Tasks**: Project tasks with priorities and statuses  
- **Documents**: File management with security and approval levels

Each data type demonstrates different tagging scenarios and shows how the system adapts to any object structure.
        `,
      },
    },
  },
};

export const UsersOnly: Story = {
  render: (args) => ({
    props: {
      ...args,
    },
    template: `<app-flexible-tagging-demo></app-flexible-tagging-demo>`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demo focused on user management and tagging employees by various criteria.',
      },
    },
  },
};
