# 🎯 Componentator

> **A collection of beautiful, functional Angular components that actually work**

[![npm version](https://badge.fury.io/js/%40ubaby%2Fcomponentator.svg)](https://badge.fury.io/js/%40ubaby%2Fcomponentator)
[![Angular](https://img.shields.io/badge/Angular-19+-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Componentator** makes building tag-based interfaces ridiculously easy. Whether you're organizing files, managing tasks, or categorizing content, we've got you covered with plug-and-play components that look great and work perfectly.

## ✨ What's Inside

### 🏷️ **Tagging Components**

- **TagPicker** - Single-item tag selector with beautiful UI
- **TagMultipleItems** - Batch tagging with navigation
- **PresetShowcase** - Interactive demo of 10+ built-in presets

### 🎨 **10+ Built-in Presets**

Ready-to-use tag groups for common scenarios:

- 🎨 Colors, 🚩 Priority, ⚡ Status, 📁 File Types
- 😊 Emotions, 🏢 Departments, ⚠️ Severity, 💻 Skills
- 📝 Content Types, 🌍 Geography

### 🛠️ **Developer Experience**

- **One-line setup** - `quickSetup('file-management')` and you're done
- **TypeScript first** - Full type safety and IntelliSense
- **Zero configuration** - Sensible defaults that just work
- **Comprehensive helpers** - Convert any data to tag structures

## 🚀 Quick Start

### Installation

```bash
# Install the library and its dependencies
npm install @ubaby/componentator @angular/material @angular/forms d3 chroma-js

# Or with yarn
yarn add @ubaby/componentator @angular/material @angular/forms d3 chroma-js
```

**Required peer dependencies:**

- `@angular/material` - For icons and UI components
- `@angular/forms` - For form controls
- `d3` - For color scheme generation
- `chroma-js` - For color manipulation

### Simplest Example (30 seconds)

```typescript
import { Component } from '@angular/core';
import { TagMultipleItems, quickSetup } from '@ubaby/componentator';

@Component({
  selector: 'app-demo',
  imports: [TagMultipleItems],
  template: `
    <tag-multiple-items
      [items]="items"
      [tagGroups]="tagGroups">
    </tag-multiple-items>
  `
})
export class DemoComponent {
  // One line setup! 🎉
  { tagGroups, items } = quickSetup('file-management');
}
```

**That's it!** You now have a fully functional tagging system with:

- 📁 File type categories (Document, Image, Video, etc.)
- 🚩 Priority levels (Low, Medium, High)
- ⚡ Status workflow (New, Reviewed, Archived)
- 🗂️ Sample files ready to tag

## 📖 Usage Examples

### 🎯 Single Item Tagging

Perfect for forms, dialogs, or focused interfaces:

```typescript
import { TagPicker, createPreset } from "@ubaby/componentator";

@Component({
  template: ` <tag-picker [customTagGroups]="colorGroups" (tagAdded)="onTagAdded($event)"> </tag-picker> `,
})
export class SingleTagComponent {
  colorGroups = createPreset("colors");

  onTagAdded(tag: any) {
    console.log("Tagged with:", tag.name);
  }
}
```

### 🏷️ Custom Tag Groups

Build your own tag structure from simple data:

```typescript
import { tagsFromSimpleData } from "@ubaby/componentator";

// From plain objects
const tagGroups = tagsFromSimpleData({
  Priority: ["Low", "Medium", "High", "Urgent"],
  Status: ["Todo", "In Progress", "Done"],
  Team: ["Frontend", "Backend", "Design"],
});

// Or manually
const customGroup = createTagGroup("mood", "Mood Tracker", ["Happy", "Excited", "Calm", "Focused"]);
```

### 🎨 Explore All Presets

Try different scenarios interactively:

```typescript
import { PresetShowcase } from "@ubaby/componentator";

@Component({
  template: `<preset-showcase></preset-showcase>`,
})
export class ExploreComponent {}
```

This gives you a **full interactive demo** with 10+ presets to try!

### 🔧 Advanced Usage

```typescript
import { TagMultipleItems, createPreset, itemsFromNames, TagService } from "@ubaby/componentator";

@Component({
  template: ` <tag-multiple-items [items]="projects" [tagGroups]="allTagGroups" [canMultiSelect]="true" [maxVisibleTabs]="6" (tagAdded)="onProjectTagged($event)" (nextItem)="trackProgress($event)"> </tag-multiple-items> `,
})
export class ProjectManagerComponent {
  // Combine multiple presets
  allTagGroups = [...createPreset("priority"), ...createPreset("status"), ...createPreset("skills")];

  // Create items from simple names
  projects = itemsFromNames(["Website Redesign", "Mobile App Launch", "Database Migration"], this.allTagGroups, 2);

  onProjectTagged(tag: any) {
    // Handle tagging logic
    this.saveToBackend(tag);
  }

  trackProgress(item: any) {
    // Analytics, progress tracking, etc.
    console.log("Now tagging:", item.name);
  }
}
```

## 🔄 Tag Items & Flexible Setup

For advanced scenarios, you can tag any object type by converting it to a `TagItem` and auto-generating your tag groups:

```typescript
import {
  convertManyToTagItems,
  autoGenerateTagGroups,
  prepareForDatabase,
  createFlexibleTaggingSetup
} from "@ubaby/componentator";

// 1) Convert your data
const products = [
  { id: '1', name: 'Widget', category: 'tools' },
  { id: '2', name: 'Gadget', category: 'electronics' }
];
const items = convertManyToTagItems(products);

// 2) Generate groups from existing tags
const tagGroups = autoGenerateTagGroups(items);

// 3) Render batch tagging:
// <app-tag-multiple-items [items]="items" [tagGroups]="tagGroups"></app-tag-multiple-items>

// 4) After tagging, prepare for DB
const dbPayload = prepareForDatabase(items.filter(i => i.tags.length));
``` 

You can also run everything in one step:

```typescript
import { createFlexibleTaggingSetup } from "@ubaby/componentator";

const data = [ /* any objects */ ];
const { items, tagGroups } = createFlexibleTaggingSetup(data, { idProperty: 'id', nameProperty: 'name' });
```

---

## 🏷️ Simple Tag Picker

When you only need to select tags for a single item, use `TagPicker`:

```typescript
import { TagPicker } from "@ubaby/componentator";

@Component({
  imports: [TagPicker],
  template: `
    <tag-picker
      [customTagGroups]="colorGroups"
      (tagAdded)="onTagAdded($event)"
    ></tag-picker>
  `
})
export class MyComponent {
  colorGroups = createPreset("colors");
  onTagAdded(tag) { console.log('Picked:', tag); }
}
```

`TagPicker` is ideal for quick, single-item workflows (forms, dialogs, filters).

---

## 🧩 Tag Picker Matrix

For a compact, matrix-style selection UI, use `TagPickerMatrix`:

```typescript
import { TagPickerMatrixComponent } from "@ubaby/componentator";

@Component({
  imports: [TagPickerMatrixComponent],
  template: `
    <app-tag-picker-matrix
      [customTagGroups]="statusGroups"
      [selectedTags]="initialTags"
      (selectionChanged)="onTagsChanged($event)"
    ></app-tag-picker-matrix>
  `
})
export class GridComponent {
  statusGroups = createPreset("status");
  initialTags = [];
  onTagsChanged(tags) { console.log('Matrix selection:', tags); }
}
```

This component displays groups in a grid and is perfect for dashboards, filters, or data-dense interfaces.

## 🔄 Passing Pre-Existing Tags

If your items already have tags saved (for example, loaded from a database), simply include them in each `TagItem.tags` array before passing to the component:

```typescript
// In your component.ts
import { TagItem, TagGroup, createPreset } from "@ubaby/componentator";

// Pre-existing tags for two tasks
const items: TagItem[] = [
  {
    id: '1',
    name: 'Fix login bug',
    tags: [ { id: 'high', group: 'priority', name: 'High' } ]
  },
  {
    id: '2',
    name: 'Write docs',
    tags: [ { id: 'medium', group: 'priority', name: 'Medium' } ]
  }
];

const tagGroups: TagGroup[] = createPreset('priority');
```

Then in your template, the component will render those tags as already selected:

```html
<tag-multiple-items
  [items]="items"
  [tagGroups]="tagGroups"
  [allowMultiplePerGroup]="true"
  [maxVisibleTabs]="3"
></tag-multiple-items>
```

For the single-item `<tag-picker>`, use the `selectedTags` input to pre-select:

```typescript
// component.ts
colorGroups = createPreset('colors');
selected = [ { id: 'red', group: 'colors', name: 'Red' } ];
```

```html
<tag-picker
  [customTagGroups]="colorGroups"
  [selectedTags]="selected"
></tag-picker>
```

## 🎛️ API Reference

### Components

| Component          | Purpose                       | Best For                         |
| ------------------ | ----------------------------- | -------------------------------- |
| `TagPicker`        | Single item tagging           | Forms, dialogs, focused UI       |
| `TagMultipleItems` | Batch tagging with navigation | File management, bulk operations |
| `PresetShowcase`   | Interactive preset browser    | Demos, exploration, onboarding   |

### Quick Setup Functions

| Function                  | Returns                | Example                                            |
| ------------------------- | ---------------------- | -------------------------------------------------- |
| `quickSetup(scenario)`    | `{ tagGroups, items }` | `quickSetup('project-tasks')`                      |
| `createPreset(name)`      | `TagGroup[]`           | `createPreset('colors')`                           |
| `tagsFromSimpleData(obj)` | `TagGroup[]`           | `tagsFromSimpleData({ Status: ['Todo', 'Done'] })` |

### Available Scenarios

- `'file-management'` - File types, priority, status
- `'project-tasks'` - Task status, priority, team assignment
- `'blog-posts'` - Content categories, status, audience

### Available Presets

- `'colors'`, `'priority'`, `'status'`, `'fileTypes'`
- `'emotions'`, `'departments'`, `'severity'`, `'skills'`
- `'content'`, `'geography'`

## 🎨 Styling

Componentator uses **Tailwind CSS** and **DaisyUI** for styling. The components look great out of the box, but you can easily customize them:

```scss
// Override component styles
.tag-picker {
  --primary-color: #your-brand-color;
}

// Or use CSS custom properties
:root {
  --tag-bg: #f0f9ff;
  --tag-text: #0c4a6e;
}
```

## 🏗️ Development

### Building the Library

```bash
# Build the library
ng build shared-components

# Build and publish
npm run lib:publish
```

### Running Storybook

```bash
# Interactive component demo
npm run storybook
```

### Running Tests

```bash
# Unit tests
ng test

# E2E tests
ng e2e
```

## 🤝 Contributing

We love contributions! Whether it's:

- 🐛 **Bug reports** - Help us squash those pesky issues
- 💡 **Feature requests** - Got ideas? We want to hear them!
- 🎨 **New presets** - Add tag groups for new use cases
- 📖 **Documentation** - Make it easier for others to get started
- 🧪 **Tests** - Help us stay reliable

## 📄 License

MIT © [Ubaby](https://github.com/ubaby)

---

## 🌟 Why Componentator?

**Before Componentator:**

```typescript
// 50+ lines of boilerplate code
// Manual color management
// Custom tag logic
// Navigation handling
// State management
// Event coordination
// CSS styling
// ... 😫
```

**After Componentator:**

```typescript
const { tagGroups, items } = quickSetup("file-management");
// Done! 🎉
```

**Built with ❤️ for developers who value:**

- ⚡ **Speed** - Get tagging interfaces running in minutes
- 🎯 **Simplicity** - One-line setup, sensible defaults
- 🎨 **Beauty** - Looks professional without designer skills
- 🔧 **Flexibility** - Customize anything when you need to
- 📱 **Responsive** - Works perfectly on all devices

---

<div align="center">

**[📖 Documentation](https://your-docs-site.com)** •
**[🎮 Live Demo](https://your-demo-site.com)** •
**[🐛 Issues](https://github.com/your-repo/issues)** •
**[💬 Discussions](https://github.com/your-repo/discussions)**

**Give us a ⭐ if Componentator made your day better!**

</div>
