import { MatIconModule } from '@angular/material/icon';

import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { TagDataComponent } from '../../../../shared-components/src/lib/tagging/tag-data/tag-data.component';
import { getTestTagMatrix } from '../../../../shared-components/src/lib/tagging/test-data';

const meta: Meta<TagDataComponent> = {
  title: 'Components/TagGroupSwitcher',
  component: TagDataComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom(MatIconModule)],
    }),
  ],
};

export default meta;
type Story = StoryObj<TagDataComponent>;

export const Default: Story = {
  // args: {
  //   groups: getTestTagMatrix(3, 5), // 3 groups, 5 tags each
  // },
};

export const CustomGroups: Story = {
  args: {
    groups: [
      {
        id: '1',
        name: 'Custom Group 1',
        color: 'white',
        backgroundColor: '#3357FF',
        tags: [
          {
            id: '1',
            group: '1',
            name: 'Custom Tag 1',
            color: 'white',
            backgroundColor: '#FF5733',
          },
          {
            id: '2',
            group: '1',
            name: 'Custom Tag 2',
            color: 'white',
            backgroundColor: '#33FF57',
          },
        ],
      },
      {
        id: '2',
        name: 'Custom Group 2',
        color: 'white',
        backgroundColor: '#3357FF',
        tags: [
          {
            id: '3',
            group: '2',
            name: 'Another Tag',
            color: 'white',
            backgroundColor: '#3357FF',
          },
          {
            id: '4',
            group: '2',
            name: 'Yet Another Tag',
            color: 'white',
            backgroundColor: '#FF33A1',
          },
        ],
      },
    ],
  },
};
