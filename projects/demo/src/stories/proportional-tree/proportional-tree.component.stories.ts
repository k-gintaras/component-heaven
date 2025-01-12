// Storybook file for ProportionalTreeComponent
import { Meta, StoryObj } from '@storybook/angular';
import { ProportionalTreeComponent } from '../../../../shared-components/src/lib/proportional-tree/proportional-tree.component';

const meta: Meta<ProportionalTreeComponent> = {
  title: 'ProportionalTree/Component',
  component: ProportionalTreeComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ProportionalTreeComponent>;

export const Default: Story = {
  args: {
    primaryNav: [
      { label: 'Home', active: true, color: '#0078d7' },
      { label: 'Explore', active: false, color: '#ff5722' },
      { label: 'Settings', active: false, color: '#4caf50' },
    ],
    secondaryNav: [
      { label: 'Group 1', active: true, color: '#03a9f4' },
      { label: 'Group 2', active: false, color: '#ffc107' },
      { label: 'Group 3', active: false, color: '#9c27b0' },
    ],
    tags: [
      { label: 'Tag 1', selected: false, color: '#e91e63' },
      { label: 'Tag 2', selected: true, color: '#3f51b5' },
      { label: 'Tag 3', selected: false, color: '#009688' },
    ],
    actions: [
      { label: 'Edit', icon: 'edit', color: '#ff5722' },
      { label: 'Delete', icon: 'delete', color: '#f44336' },
    ],
    dataBlocks: [
      {
        title: 'Data Block 1',
        description: 'This is a description for block 1.',
        subDescription: 'Additional info for block 1.',
        color: '#e0f7fa',
      },
      {
        title: 'Data Block 2',
        description: 'This is a description for block 2.',
        subDescription: 'Additional info for block 2.',
        color: '#ffecb3',
      },
    ],
    displayBlocksCount: 2,
  },
};

export const ActiveGroup2: Story = {
  args: {
    primaryNav: [
      { label: 'Home', active: false, color: '#0078d7' },
      { label: 'Explore', active: true, color: '#ff5722' },
      { label: 'Settings', active: false, color: '#4caf50' },
    ],
    secondaryNav: [
      { label: 'Group 1', active: false, color: '#03a9f4' },
      { label: 'Group 2', active: true, color: '#ffc107' },
      { label: 'Group 3', active: false, color: '#9c27b0' },
    ],
    tags: [
      { label: 'Tag A', selected: true, color: '#3f51b5' },
      { label: 'Tag B', selected: false, color: '#e91e63' },
      { label: 'Tag C', selected: false, color: '#009688' },
    ],
    actions: [
      { label: 'Edit', icon: 'edit', color: '#ff5722' },
      { label: 'Delete', icon: 'delete', color: '#f44336' },
    ],
    dataBlocks: [
      {
        title: 'Group 2 Block',
        description: 'Description for Group 2 block.',
        subDescription: 'More details about Group 2 block.',
        color: '#c8e6c9',
      },
    ],
    displayBlocksCount: 1,
  },
};

export const CustomTags: Story = {
  args: {
    primaryNav: [
      { label: 'Home', active: false, color: '#0078d7' },
      { label: 'Explore', active: true, color: '#ff5722' },
      { label: 'Settings', active: false, color: '#4caf50' },
    ],
    secondaryNav: [
      { label: 'Group A', active: false, color: '#03a9f4' },
      { label: 'Group B', active: true, color: '#ffc107' },
      { label: 'Group C', active: false, color: '#9c27b0' },
    ],
    tags: [
      { label: 'Custom Tag 1', selected: true, color: '#e91e63' },
      { label: 'Custom Tag 2', selected: false, color: '#3f51b5' },
    ],
    actions: [
      { label: 'Add', icon: 'add', color: '#4caf50' },
      { label: 'Remove', icon: 'remove', color: '#f44336' },
    ],
    dataBlocks: [
      {
        title: 'Custom Block',
        description: 'Details about custom block.',
        subDescription: 'Additional info for custom block.',
        color: '#ffecb3',
      },
    ],
    displayBlocksCount: 1,
  },
};

export const OrganizedColors: Story = {
  args: {
    palette: ['#0078d7', '#ff5722', '#4caf50', '#03a9f4', '#ffc107', '#9c27b0'], // Add color palette here
    primaryNav: [
      { label: 'Home', active: true, color: '#0078d7' },
      { label: 'Explore', active: false, color: '#ff5722' },
      { label: 'Settings', active: false, color: '#4caf50' },
    ],
    secondaryNav: [
      { label: 'Group 1', active: true, color: '#03a9f4' },
      { label: 'Group 2', active: false, color: '#ffc107' },
      { label: 'Group 3', active: false, color: '#9c27b0' },
    ],
    tags: [
      { label: 'Tag 1', selected: false, color: '#e91e63' },
      { label: 'Tag 2', selected: true, color: '#3f51b5' },
      { label: 'Tag 3', selected: false, color: '#009688' },
    ],
    actions: [
      { label: 'Edit', icon: 'edit', color: '#ff5722' },
      { label: 'Delete', icon: 'delete', color: '#f44336' },
    ],
    dataBlocks: [
      {
        title: 'Data Block 1',
        description: 'This is a description for block 1.',
        subDescription: 'Additional info for block 1.',
        color: '#e0f7fa',
      },
      {
        title: 'Data Block 2',
        description: 'This is a description for block 2.',
        subDescription: 'Additional info for block 2.',
        color: '#ffecb3',
      },
    ],
    displayBlocksCount: 3,
    listItems: [
      { title: 'Item 1', description: 'Short description 1', color: '#e0f7fa' },
      { title: 'Item 2', description: 'Short description 2', color: '#ffecb3' },
      { title: 'Item 3', description: 'Short description 3', color: '#c8e6c9' },
    ],
  },
};
