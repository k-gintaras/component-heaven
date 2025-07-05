// item-filter.stories.ts
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import {
  getTestTagMatrix,
  getTestItems,
} from '../../../../shared-components/src/lib/tagging/test-data';
import { ItemFilterComponent } from '../../../../shared-components/src/lib/tagging/item-filter/item-filter.component';
import { TagService } from '../../../../shared-components/src/lib/tagging/tag.service';

const tagGroups = getTestTagMatrix(4, 5);
const demoItems = getTestItems(6, 2, tagGroups);

const meta: Meta<ItemFilterComponent> = {
  title: 'Components/ItemFilter',
  component: ItemFilterComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(FormsModule), TagService],
    }),
  ],
  argTypes: {
    filtered: { action: 'filtered' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**ItemFilter** lets you:
- Select multiple tags to filter by (any-match)
- Emits the filtered list via the \`filtered\` event
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<ItemFilterComponent>;

export const Default: Story = {
  args: {
    items: demoItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default: no tags selected shows all items.',
      },
    },
  },
};

export const WithFilter: Story = {
  args: {
    items: demoItems,
  },
  play: async ({ canvasElement }) => {
    // User selects first available tag programmatically
    /**
    const select = canvasElement.querySelector('select');
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    */
  },
  parameters: {
    docs: {
      description: {
        story: 'Selecting tags emits filtered items list.',
      },
    },
  },
};
