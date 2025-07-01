// tag-preset-showcase.stories.ts
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TagService } from '../../../../shared-components/src/lib/tagging/tag.service';
import { of } from 'rxjs';
import { TagPresetShowcaseComponent } from '../../../../shared-components/src/lib/tagging/showcase.component';

const meta: Meta<TagPresetShowcaseComponent> = {
  title: 'Showcase/TagPresetShowcase',
  component: TagPresetShowcaseComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(MatIconModule, MatButtonModule),
        {
          provide: TagService,
          useValue: {
            tagGroups$: of([]),
            currentItem$: of(null),
            setTagGroups: () => {},
            setCurrentItem: () => {},
            clearCurrentItem: () => {},
          },
        },
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Tag Preset Showcase

This component demonstrates all available tag group presets with interactive examples.

## Features

- **10+ Built-in Presets**: Colors, Priority, Status, File Types, Emotions, and more
- **Interactive Demo**: Try tagging items with each preset
- **Real-time Stats**: See tagging progress and usage statistics
- **Responsive Design**: Works on all screen sizes
- **Sample Data**: Each preset comes with relevant sample items

## Usage

Perfect for:
- **Exploring tag possibilities** before implementing
- **Demonstrating tagging concepts** to stakeholders
- **Testing tag workflows** with realistic data
- **Learning the component API** with hands-on examples

## Available Presets

Each preset includes:
- Carefully curated tag groups
- Relevant sample items
- Real-world use case examples
- Consistent styling and behavior
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TagPresetShowcaseComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive showcase of all available tag group presets. Click any preset to see it in action!',
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Mobile-optimized view of the preset showcase with responsive grid layout.',
      },
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Tablet view showing the adaptive layout for medium-sized screens.',
      },
    },
  },
};
