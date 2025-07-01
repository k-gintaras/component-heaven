# File Structure:

component-heaven/
│
├── projects/
│ ├── demo/
│ │ ├── .storybook/
│ │ ├── public/
│ │ ├── src/
│ │ │ ├── app/
│ │ │ ├── stories/
│ │ │ │ ├── assets/
│ │ │ │ ├── proportional-tree/
│ │ │ │ ├── tag-fast/
│ │ │ │ ├── tag-stepper/
│ │ │ │ ├── taggxt/
│ │ │ ├── index.html
│ │ │ ├── main.ts
│ │ │ ├── styles.scss
│ │
│ ├── shared-components/
│ ├── src/
│ │ ├── lib/
│ │ │ ├── horizontal-navigation/
│ │ │ ├── proportional-tree/
│ │ │ ├── tag-data/
│ │ │ ├── tag-stepper/
│ │ │ ├── tagxt/
│ │ │
│ │ ├── styles/
│ │ │ ├── styles.scss
│ │ ├── public-api.ts
│ │
│ ├── shared-components.component.ts
│ ├── shared-components.service.ts
│
├── tailwind.config.js
├── angular.json
├── package.json
├── tsconfig.json
└── README.md

```bash
ng serve
```

```bash
ng g component ./projects/shared-components/src/lib/component-name
```

```bash
npm run storybook
```
