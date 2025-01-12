import { NgFor, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-proportional-tree',
  imports: [MatIcon, NgFor, SlicePipe],
  templateUrl: './proportional-tree.component.html',
  styleUrl: './proportional-tree.component.css',
})
export class ProportionalTreeComponent {
  listItems = [
    { title: 'Item 1', description: 'Short description 1', color: '#e0f7fa' },
    { title: 'Item 2', description: 'Short description 2', color: '#ffecb3' },
    { title: 'Item 3', description: 'Short description 3', color: '#c8e6c9' },
  ];
  palette = ['#0078d7', '#ff5722', '#4caf50', '#03a9f4', '#ffc107', '#9c27b0'];
  primaryNav = [
    { label: 'Home', active: true, color: '#0078d7' },
    { label: 'Explore', active: false, color: '#ff5722' },
    { label: 'Settings', active: false, color: '#4caf50' },
  ];

  secondaryNav = [
    { label: 'Group 1', active: true, color: '#03a9f4' },
    { label: 'Group 2', active: false, color: '#ffc107' },
    { label: 'Group 3', active: false, color: '#9c27b0' },
  ];

  tags = [
    { label: 'Tag 1', selected: false, color: '#e91e63' },
    { label: 'Tag 2', selected: true, color: '#3f51b5' },
    { label: 'Tag 3', selected: false, color: '#009688' },
  ];

  actions = [
    { label: 'Edit', icon: 'edit', color: '#ff5722' },
    { label: 'Delete', icon: 'delete', color: '#f44336' },
  ];

  dataBlocks = [
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
    {
      title: 'Data Block 3',
      description: 'This is a description for block 3.',
      subDescription: 'Additional info for block 3.',
      color: '#c8e6c9',
    },
  ];

  displayBlocksCount = 2; // Configurable for testing mobile or larger screens
}
