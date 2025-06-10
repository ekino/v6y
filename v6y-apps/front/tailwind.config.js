const {join} = require('path');
const uiConfig = require('@v6y/ui-kit-front/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...uiConfig,
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    ...uiConfig.content,
  ],
}
