import { MatIconModule } from '@angular/material/icon';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { TagPickerComponent } from '../../../../shared-components/src/lib/tagging/tag-picker/tag-picker.component';
import { Provider } from '@angular/core';
import { of } from 'rxjs';
import { TagService } from '../../../../shared-components/src/lib/tagging/tag.service';
import { getTestTagMatrix } from '../../../../shared-components/src/lib/tagging/test-data';

// Mock service that provides the data we want for stories
const createTagServiceMock = (
  customTagGroups: any[] = [],
  currentItem: any = null,
): Provider => ({
  provide: TagService,
  useValue: {
    tagGroups$: of(customTagGroups),
    currentItem$: of(currentItem),
    setTagGroups: () => {},
    setCurrentItem: () => {},
    clearCurrentItem: () => {},
  },
});

const meta: Meta<TagPickerComponent> = {
  title: 'Components/TagPicker',
  component: TagPickerComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom(MatIconModule)],
    }),
  ],
};

export default meta;
type Story = StoryObj<TagPickerComponent>;

export const Default: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(MatIconModule),
        createTagServiceMock(getTestTagMatrix(3, 5)),
      ],
    }),
  ],
  args: {
    customTagGroups: getTestTagMatrix(3, 5),
  },
};

export const CustomGroups: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(MatIconModule),
        createTagServiceMock([
          {
            id: '1',
            name: 'Custom Group 1',
            tags: [
              { id: '1', group: '1', name: 'Custom Tag 1' },
              { id: '2', group: '1', name: 'Custom Tag 2' },
            ],
          },
          {
            id: '2',
            name: 'Custom Group 2',
            tags: [
              { id: '3', group: '2', name: 'Another Tag' },
              { id: '4', group: '2', name: 'Yet Another Tag' },
            ],
          },
        ]),
      ],
    }),
  ],
  args: {
    customTagGroups: [
      {
        id: '1',
        name: 'Custom Group 1',
        tags: [
          { id: '1', group: '1', name: 'Custom Tag 1' },
          { id: '2', group: '1', name: 'Custom Tag 2' },
        ],
      },
      {
        id: '2',
        name: 'Custom Group 2',
        tags: [
          { id: '3', group: '2', name: 'Another Tag' },
          { id: '4', group: '2', name: 'Yet Another Tag' },
        ],
      },
    ],
  },
};

export const WithPreSelectedTags: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(MatIconModule),
        createTagServiceMock(getTestTagMatrix(3, 4), {
          id: 'test-item',
          name: 'Test Item',
          tags: [
            { id: '1', group: '1', name: 'Pre-selected Tag 1' },
            { id: '5', group: '2', name: 'Pre-selected Tag 2' },
          ],
        }),
      ],
    }),
  ],
  args: {
    customTagGroups: getTestTagMatrix(3, 4),
  },
};

export const NoTagGroups: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(MatIconModule),
        createTagServiceMock([]),
      ],
    }),
  ],
  args: {
    customTagGroups: [],
  },
};
