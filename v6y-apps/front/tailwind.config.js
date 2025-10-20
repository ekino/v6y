const path = require('path');
const { theme, plugins } = require('@v6y/ui-kit-front/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'src', '**', '*.{js,ts,jsx,tsx}'),
    path.join(__dirname, '..', '..', 'v6y-libs', 'ui-kit-front', 'src', '**', '*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    ...theme,
    extend: {
      ...(theme && theme.extend ? theme.extend : {}),
    },
  },
  plugins: [
    ...(plugins || []),
  ],
};
