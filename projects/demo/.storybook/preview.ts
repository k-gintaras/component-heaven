// import type { Preview } from '@storybook/angular';

// const preview: Preview = {
//   parameters: {
//     controls: {
//       matchers: {
//         color: /(background|color)$/i,
//         date: /Date$/i,
//       },
//     },
//   },
// };

// export default preview;
import { Preview } from '@storybook/angular';

// Inject the Material Icons font into the Storybook environment
const fontLink = document.createElement('link');
fontLink.setAttribute('rel', 'stylesheet');
fontLink.setAttribute(
  'href',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
);
document.head.appendChild(fontLink);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
