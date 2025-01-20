import { Meta, StoryObj } from '@storybook/angular';
import { TagManagerComponent } from '../../../../shared-components/src/lib/tagging/tag-manager/tag-manager.component';
import {
  getTestTagMatrix,
  getTestItems,
} from '../../../../shared-components/src/lib/tagging/test-data';

const tagGroups = getTestTagMatrix(5, 10); // 5 groups, 10 tags each
const items = getTestItems(10, 3, tagGroups); // 10 items, each with up to 3 pre-assigned tags

const meta: Meta<TagManagerComponent> = {
  title: 'Components/TagManager',
  component: TagManagerComponent,
};

export default meta;

type Story = StoryObj<TagManagerComponent>;

export const Default: Story = {
  args: {
    items,
    tagGroups,
  },
};

export const WithAutoSkip: Story = {
  args: {
    items,
    tagGroups,
  },
};

export const PreTagged: Story = {
  args: {
    items: getTestItems(5, 2, tagGroups), // 5 items, each with 2 pre-assigned tags
    tagGroups,
  },
};

export const NoTags: Story = {
  args: {
    items: getTestItems(5, 0, tagGroups), // 5 items, no tags assigned
    tagGroups: [], // No tag groups provided
  },
};

export const NoItems: Story = {
  args: {
    items: [], // No items provided
    tagGroups,
  },
};
