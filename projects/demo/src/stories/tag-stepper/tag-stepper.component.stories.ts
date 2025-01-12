import { TagStepperComponent } from '../../../../shared-components/src/lib/tag-stepper/tag-stepper.component';
import { getTestTagMatrix } from '../../../../shared-components/src/lib/tag-stepper/test-data';
import { MatIconModule } from '@angular/material/icon';

import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

const meta: Meta<TagStepperComponent> = {
  title: 'Components/TagStepper',
  component: TagStepperComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(MatIconModule, MatChipsModule, MatFormFieldModule),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<TagStepperComponent>;

export const Default: Story = {
  args: {
    matrix: getTestTagMatrix(5, 5),
    resultsArray: [],
    custom: [],
  },
};
