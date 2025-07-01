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
npm install @ubaby/componentator
```

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
// Event coordina
```
