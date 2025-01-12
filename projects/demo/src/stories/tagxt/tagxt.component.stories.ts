import { Meta, StoryObj } from '@storybook/angular';
import { TagxtComponent } from '../../../../shared-components/src/public-api';

const meta: Meta<TagxtComponent> = {
  title: 'Shared/Tagxt',
  component: TagxtComponent,
};

export default meta;
type Story = StoryObj<TagxtComponent>;

export const Default: Story = {
  args: {
    text: 'Default Tag',
    removable: true,
    backgroundColor: '#f5f5f5',
  },
};

export const Selectable: Story = {
  args: {
    selectable: true,
    text: 'Default Tag',
    removable: true,
    backgroundColor: '#f5f5f5',
  },
};

export const DarkBackground: Story = {
  args: {
    text: 'Dark Background',
    removable: true,
    backgroundColor: '#777',
  },
};

export const NonRemovable: Story = {
  args: {
    text: 'Non-Removable Tag',
    removable: false,
    backgroundColor: '#007bff',
  },
};

export const LongText: Story = {
  args: {
    text: 'This is an example of a tag with a very long text.',
    removable: true,
    backgroundColor: '#8e44ad',
  },
};
