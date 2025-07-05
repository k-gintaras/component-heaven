// item-sorter.stories.ts
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import {
  getTestTagMatrix,
  getTestItems,
} from '../../../../shared-components/src/lib/tagging/test-data';
import { ItemSorterComponent } from '../../../../shared-components/src/lib/tagging/item-sorter/item-sorter.component';
import { TagService } from '../../../../shared-components/src/lib/tagging/tag.service';

const tagGroups = getTestTagMatrix(5, 5);
const demoItems = getTestItems(8, 3, tagGroups);

const meta: Meta<ItemSorterComponent> = {
  title: 'Components/ItemSorter',
  component: ItemSorterComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(FormsModule), TagService],
    }),
  ],
  argTypes: {
    sorted: { action: 'sorted' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**ItemSorter** lets you:
- Sort by name or tag-count
- Toggle ascending/descending

It emits the sorted list via the \`sorted\` event.`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ItemSorterComponent>;

export const Default: Story = {
  args: {
    items: demoItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Starts sorted by name ascending; selection immediately emits sorted list.',
      },
    },
  },
};

// Additional variants if desired
export const DescendingByCount: Story = {
  args: {
    items: demoItems,
    // Note: method and asc are internal; user changes via select
  },
  play: async ({ canvasElement }) => {
    // Could simulate user selecting 'Tag Count' and descending
    // but Storybook actions capture events
  },
};
