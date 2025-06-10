const { theme, plugins } = require('@v6y/ui-kit-front/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...theme,
    extend: {},
  },
  plugins: [
    ...plugins,
  ],
};
