// preset-manager.stories.ts
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import {
  getTestTagMatrix,
  getTestItems,
} from '../../../../shared-components/src/lib/tagging/test-data';
import { PresetManagerComponent } from '../../../../shared-components/src/lib/tagging/preset-manager/preset-manager.component';
import {
  PresetService,
  SortFilterPreset,
} from '../../../../shared-components/src/lib/tagging/preset.service';
import { TagService } from '../../../../shared-components/src/lib/tagging/tag.service';
import { TagItem } from '../../../../shared-components/src/lib/tagging/tag.interface';

// demo data
const tagGroups = getTestTagMatrix(3, 4);
const demoItems: TagItem[] = getTestItems(5, 2, tagGroups);
const basePresets: SortFilterPreset[] = [
  { name: 'Name ↑', sortBy: 'name', asc: true, filterTags: [] },
  { name: 'TagCount ↓', sortBy: 'tagCount', asc: false, filterTags: [] },
];

const meta: Meta<PresetManagerComponent> = {
  title: 'Components/PresetManager',
  component: PresetManagerComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(FormsModule), TagService, PresetService],
    }),
  ],
  argTypes: {
    applied: { action: 'applied' },
    saved: { action: 'saved' },
    removed: { action: 'removed' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**PresetManager** allows:
- Saving current sort/filter settings as presets
- Listing and applying presets to a given item list
- Deleting presets
- Works offline or via shared PresetService
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<PresetManagerComponent>;

export const Default: Story = {
  args: {
    items: demoItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'No presets saved yet; use the form to create one.',
      },
    },
  },
};

export const WithPresets: Story = {
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: PresetService,
          useFactory: () => {
            const svc = new PresetService();
            basePresets.forEach((p) => svc.addPreset(p));
            return svc;
          },
        },
      ],
    }),
  ],
  args: {
    items: demoItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pre-populated presets available to apply or delete.',
      },
    },
  },
};
