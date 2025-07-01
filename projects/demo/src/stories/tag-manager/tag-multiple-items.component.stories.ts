import { Meta, StoryObj } from '@storybook/angular';
import {
  getTestTagMatrix,
  getTestItems,
} from '../../../../shared-components/src/lib/tagging/test-data';
import { TagMultipleItemsComponent } from '../../../../shared-components/src/lib/tagging/tag-multiple-items/tag-multiple-items.component';

const tagGroups = getTestTagMatrix(5, 10); // 5 groups, 10 tags each
const items = getTestItems(10, 3, tagGroups); // 10 items, each with up to 3 pre-assigned tags

const meta: Meta<TagMultipleItemsComponent> = {
  title: 'Components/TagMultipleItemsComponent',
  component: TagMultipleItemsComponent,
};

export default meta;

type Story = StoryObj<TagMultipleItemsComponent>;

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
