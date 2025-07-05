// item-sorter.stories.ts
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  getTestTagMatrix,
  getTestItems,
} from '../../../../shared-components/src/lib/tagging/test-data';
import { ItemSorterComponent } from '../../../../shared-components/src/lib/tagging/item-sorter/item-sorter.component';
import { TagService } from '../../../../shared-components/src/lib/tagging/tag.service';
import {
  PresetService,
  SortFilterPreset,
} from '../../../../shared-components/src/lib/tagging/preset.service';

const tagGroups = getTestTagMatrix(5, 5); // 5 groups × 5 tags each
const demoItems = getTestItems(8, 3, tagGroups); // 8 items, up to 3 pre-tags each

const meta: Meta<ItemSorterComponent> = {
  title: 'Components/ItemSorter',
  component: ItemSorterComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(FormsModule),
        TagService, // uses providedIn: 'root'
        PresetService, // likewise
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
**ItemSorter** lets you:
- Sort by name or tag-count
- Toggle ascending/descending
- Save “presets” of your sort+filter config
- Recall presets at the click of a button`,
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
        story: 'Default view: start with name ⇧ sort and no presets loaded.',
      },
    },
  },
};

export const WithPresets: Story = {
  args: {
    items: demoItems,
  },
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: PresetService,
          useFactory: () => {
            const svc = new PresetService();
            const basePresets: SortFilterPreset[] = [
              { name: 'Name ↑', sortBy: 'name', asc: true, filterTags: [] },
              { name: 'Name ↓', sortBy: 'name', asc: false, filterTags: [] },
              {
                name: 'Fewest Tags',
                sortBy: 'tagCount',
                asc: true,
                filterTags: [],
              },
            ];
            basePresets.forEach((p) => svc.addPreset(p));
            return svc;
          },
        },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Presets loaded: click any preset button to instantly re-sort your list.',
      },
    },
  },
};
