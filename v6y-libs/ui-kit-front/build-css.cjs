// Script Node.js pour compiler le CSS du kit en pur CSS avec PostCSS
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, 'src/styles.css');
const outputPath = path.resolve(__dirname, 'dist/ui-kit-front.css');
const postcssConfig = require('./postcss.config.cjs');

async function buildCSS() {
  const css = fs.readFileSync(inputPath, 'utf8');
  const result = await postcss([
    require('tailwindcss'),
    require('autoprefixer'),
  ]).process(css, { from: inputPath, to: outputPath });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, result.css);
  console.log('✅ CSS compilé dans', outputPath);
}

buildCSS().catch((err) => {
  console.error(err);
  process.exit(1);
});
